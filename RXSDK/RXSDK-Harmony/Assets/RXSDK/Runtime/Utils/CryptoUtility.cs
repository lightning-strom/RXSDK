
using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using UnityEngine;

namespace RXSDK
{

    public class CryptoUtility
    {
        private const string AESKEY = "4ca7dacc9332d74e1292c83f0aa3b376";


        /// <summary>
        /// 计算任意哈希算法的哈希值 (如 SHA256, SHA512, MD5)
        /// </summary>
        public static string GetHash<T>(string input) where T : HashAlgorithm
        {
            if (string.IsNullOrEmpty(input)) return string.Empty;
            using T hashAlgorithm = (T)HashAlgorithm.Create(typeof(T).Name);
            byte[] data = hashAlgorithm.ComputeHash(Encoding.UTF8.GetBytes(input));
            return BitConverter.ToString(data).Replace("-", "").ToLower();
        }

        /// <summary>
        /// 计算 MD5 哈希值
        /// </summary>
        public static string GetMD5(string input)
        {
            return GetHash<MD5>(input).ToUpper();
        }



        public static byte[] AesCbcEncrypt(byte[] bytesData, string keyStr = null)
        {
            var (key, iv) = ProcessKeyAndIv(keyStr);
            return EncryptCore(bytesData, key, iv, CipherMode.CBC);
        }


        public static string AesCbcDecrypt(string cipherTextBase64, string keyStr = null)
        {
            if (string.IsNullOrEmpty(cipherTextBase64)) return string.Empty;
            var (key, iv) = ProcessKeyAndIv(keyStr);
            return DecryptCore(cipherTextBase64, key, iv, CipherMode.CBC);
        }


        /* ========================= 2. Base64 编解码 ========================= */

        public static string Base64Encode(string input)
        {
            if (string.IsNullOrEmpty(input)) return string.Empty;
            return Convert.ToBase64String(Encoding.UTF8.GetBytes(input));
        }

        public static string Base64Decode(string input)
        {
            if (string.IsNullOrEmpty(input)) return string.Empty;
            try
            {
                return Encoding.UTF8.GetString(Convert.FromBase64String(input));
            }
            catch (FormatException e)
            {
                Debug.Log(e.Message);
                return "";
            }
        }

        /* ========================= 3. 字符串处理 ========================= */
        // 将字符串转换为十六进制字符串
        private static string StringToHex(string input)
        {
            byte[] bytes = Encoding.UTF8.GetBytes(input);
            StringBuilder hex = new(bytes.Length * 2);
            foreach (byte b in bytes)
            {
                hex.AppendFormat("{0:x2}", b);
            }
            return hex.ToString();
        }

        // 将十六进制字符串转换为字节数组
        private static byte[] HexToBytes(string hex)
        {
            int length = hex.Length;
            byte[] bytes = new byte[length / 2];
            for (int i = 0; i < length; i += 2)
            {
                bytes[i / 2] = Convert.ToByte(hex.Substring(i, 2), 16);
            }
            return bytes;
        }
        public static bool IsNullOrEmpty(string input) => string.IsNullOrEmpty(input);

        public static bool IsNullOrWhiteSpace(string input) => string.IsNullOrWhiteSpace(input);

        public static string ReverseString(string input)
        {
            if (string.IsNullOrEmpty(input)) return input;
            char[] charArray = input.ToCharArray();
            Array.Reverse(charArray);
            return new string(charArray);
        }

        /* ========================= 4. 随机数/字符串 ========================= */

        public static string GenerateRandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            StringBuilder result = new();
            using RandomNumberGenerator rng = RandomNumberGenerator.Create();
            byte[] buffer = new byte[1];

            for (int i = 0; i < length; i++)
            {
                rng.GetBytes(buffer);
                result.Append(chars[buffer[0] % chars.Length]);
            }
            return result.ToString();
        }

        public static int GenerateRandomNumber(int min, int max)
        {
            using RNGCryptoServiceProvider rng = new();
            byte[] randomNumber = new byte[4];
            rng.GetBytes(randomNumber);
            int result = Math.Abs(BitConverter.ToInt32(randomNumber, 0));
            return min + (result % (max - min + 1));
        }

        /* ========================= 5. Unix 时间戳 ========================= */

        public static long GetUnixTimestamp() => DateTimeOffset.UtcNow.ToUnixTimeSeconds();

        public static DateTime FromUnixTimestamp(long timestamp)
        {
            return DateTimeOffset.FromUnixTimeSeconds(timestamp).DateTime;
        }

        #region   /* ========================= 6. Hex 编解码 ========================= */

        public static string ToHexString(byte[] bytes)
        {
            StringBuilder hex = new(bytes.Length * 2);
            foreach (byte b in bytes)
                hex.Append(b.ToString("x2"));
            return hex.ToString();
        }

        public static byte[] FromHexString(string hex)
        {
            if (string.IsNullOrEmpty(hex) || hex.Length % 2 != 0)
                throw new ArgumentException("Invalid hex string");

            byte[] bytes = new byte[hex.Length / 2];
            for (int i = 0; i < bytes.Length; i++)
                bytes[i] = Convert.ToByte(hex.Substring(i * 2, 2), 16);
            return bytes;
        }


        // 创建 Aes 实例的公用方法
        private static Aes CreateAes(byte[] key, CipherMode mode, byte[] iv = null)
        {
            Aes aes = Aes.Create();
            aes.Key = key;
            aes.Mode = mode;
            aes.Padding = PaddingMode.PKCS7;
            if (iv != null)
            {
                aes.IV = iv;
            }
            return aes;
        }

        #endregion
        #region  private function
        // 加密的核心逻辑抽象方法
        private static byte[] EncryptCore(byte[] plainText, byte[] key, byte[] iv, CipherMode mode)
        {
            try
            {
                using Aes aesAlg = CreateAes(key, mode, iv);
                using ICryptoTransform encryptor = aesAlg.CreateEncryptor();
                using MemoryStream msEncrypt = new MemoryStream();
                using CryptoStream csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write);

                csEncrypt.Write(plainText, 0, plainText.Length);
                csEncrypt.FlushFinalBlock();

                string base64String = Convert.ToBase64String(msEncrypt.ToArray());
                return Encoding.UTF8.GetBytes(base64String);
            }
            catch (Exception)
            {
                return Array.Empty<byte>();
            }
        }

        // 解密的核心逻辑抽象方法
        private static string DecryptCore(string cipherTextBase64, byte[] key, byte[] iv, CipherMode mode)
        {
            try
            {
                byte[] cipherText = Convert.FromBase64String(cipherTextBase64);
                using Aes aesAlg = CreateAes(key, mode, iv);
                using ICryptoTransform decryptor = aesAlg.CreateDecryptor();
                using MemoryStream msDecrypt = new(cipherText);
                using CryptoStream csDecrypt = new(msDecrypt, decryptor, CryptoStreamMode.Read);
                byte[] fromEncrypt = new byte[cipherText.Length];
                int decryptedByteCount = csDecrypt.Read(fromEncrypt, 0, fromEncrypt.Length);
                return Encoding.UTF8.GetString(fromEncrypt, 0, decryptedByteCount);
            }
            catch (Exception)
            {
                return string.Empty;
            }
        }
        private static string _key;
        private static (byte[] key, byte[] iv) ProcessKeyAndIv(string keyStr)
        {
            if (string.IsNullOrEmpty(keyStr))
            {
                if (string.IsNullOrEmpty(_key)) { _key = GetMD5($"{DeviceUtility.GetDeviceCode()}{AESKEY}").ToLower(); }
                keyStr = _key;
                // Log.D("default key:" + keyStr);
            }
            string hexKey = StringToHex(keyStr);
            byte[] key = HexToBytes(hexKey);
            byte[] iv = new byte[16];
            Array.Copy(key, 0, iv, 0, Math.Min(16, key.Length));
            return (key, iv);
        }
        #endregion


    }

}