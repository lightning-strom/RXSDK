#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
瑞雪 SDK 数据解密工具

解密规则参考：RXSDK-iOS/RXSDKCode/RXSDK/Category/NSData+Encrypt.m
加密方式：AES-256-CBC，PKCS7 填充

密钥生成流程：
1. keyStr = deviceCode + "4ca7dacc9332d74e1292c83f0aa3b376"
2. keyMD5 = md5(keyStr)  → 32 字符 hex 字符串
3. 将 keyMD5 每个字符转为 hex ASCII 码 → 64 字符 hex 字符串 → 32 字节密钥
4. IV = 密钥前 16 字节

使用方式：
  # 交互模式（粘贴 curl 命令自动解析）
  python3 rx_decrypt.py

  # 参数模式
  python3 rx_decrypt.py --device-code <deviceCode> --data <base64密文>

依赖：
  pip3 install pycryptodome
"""

import hashlib
import base64
import sys
import re
import argparse

try:
    from Crypto.Cipher import AES
    from Crypto.Util.Padding import unpad
except ImportError:
    print("错误：缺少 pycryptodome 依赖")
    print("请执行：pip3 install pycryptodome")
    sys.exit(1)

CBC_KEY_CONST = "4ca7dacc9332d74e1292c83f0aa3b376"


def generate_key(device_code: str) -> bytes:
    """
    生成 AES-256-CBC 密钥（参考 getCBCKey 方法）
    """
    key_str = device_code + CBC_KEY_CONST
    key_md5 = hashlib.md5(key_str.encode("utf-8")).hexdigest()
    # hexStringWithString: 将每个字符转为 hex ASCII
    key_hex = "".join(format(ord(c), "02x") for c in key_md5)
    return bytes.fromhex(key_hex)


def decrypt(device_code: str, encrypted_base64: str, verbose: bool = False) -> str:
    """
    AES-256-CBC 解密（参考 AES256CBCDecryptWithString 方法）
    """
    key_bytes = generate_key(device_code)
    iv_bytes = key_bytes[:16]

    if verbose:
        key_str = device_code + CBC_KEY_CONST
        key_md5 = hashlib.md5(key_str.encode("utf-8")).hexdigest()
        print(f"  deviceCode: {device_code}")
        print(f"  MD5({device_code} + cbcKey): {key_md5}")
        print(f"  Key (hex): {key_bytes.hex()}")
        print(f"  IV  (hex): {iv_bytes.hex()}")
        print()

    cipher_data = base64.b64decode(encrypted_base64)
    cipher = AES.new(key_bytes, AES.MODE_CBC, iv_bytes)
    decrypted = unpad(cipher.decrypt(cipher_data), AES.block_size)
    return decrypted.decode("utf-8")


def encrypt(device_code: str, plaintext: str, verbose: bool = False) -> str:
    """
    AES-256-CBC 加密（参考 AES256CBCEncrypt 方法）
    """
    key_bytes = generate_key(device_code)
    iv_bytes = key_bytes[:16]

    if verbose:
        key_str = device_code + CBC_KEY_CONST
        key_md5 = hashlib.md5(key_str.encode("utf-8")).hexdigest()
        print(f"  deviceCode: {device_code}")
        print(f"  MD5({device_code} + cbcKey): {key_md5}")
        print(f"  Key (hex): {key_bytes.hex()}")
        print(f"  IV  (hex): {iv_bytes.hex()}")
        print()

    data = plaintext.encode("utf-8")
    # PKCS7 padding
    pad_len = 16 - (len(data) % 16)
    data += bytes([pad_len] * pad_len)

    cipher = AES.new(key_bytes, AES.MODE_CBC, iv_bytes)
    encrypted = cipher.encrypt(data)
    return base64.b64encode(encrypted).decode("utf-8")


def parse_curl(curl_text: str) -> tuple:
    """
    从 curl 命令中提取 deviceCode 和加密数据
    返回 (device_code, encrypted_data, url, headers_info)
    """
    device_code = None
    encrypted_data = None
    url = None
    product_id = None
    channel_id = None
    cp_id = None
    access_token = None

    # 提取 URL
    url_match = re.search(r"curl\s+'([^']+)'", curl_text)
    if url_match:
        url = url_match.group(1)

    # 提取 headers
    for match in re.finditer(r"-H\s+'([^:]+):\s*([^']+)'", curl_text):
        key = match.group(1).strip().lower()
        value = match.group(2).strip()
        if key == "ruixue-devicecode":
            device_code = value
        elif key == "ruixue-productid":
            product_id = value
        elif key == "ruixue-channelid":
            channel_id = value
        elif key == "ruixue-cpid":
            cp_id = value
        elif key == "ruixue-accesstoken":
            access_token = value

    # 提取 --data
    data_match = re.search(r"--data\s+'([^']+)'", curl_text)
    if data_match:
        encrypted_data = data_match.group(1)

    headers_info = {
        "url": url,
        "productId": product_id,
        "channelId": channel_id,
        "cpId": cp_id,
        "accessToken": access_token[:50] + "..." if access_token and len(access_token) > 50 else access_token,
    }

    return device_code, encrypted_data, headers_info


def interactive_mode(verbose: bool = False):
    """交互模式：粘贴 curl 命令或手动输入"""
    print("=" * 60)
    print("  瑞雪 SDK 数据解密工具")
    print("=" * 60)
    print()
    print("请选择操作：")
    print("  1. 粘贴 curl 命令（自动解析 deviceCode 和密文）")
    print("  2. 手动输入 deviceCode 和密文")
    print("  3. 加密数据")
    print("  q. 退出")
    print()

    while True:
        choice = input("请选择 [1/2/3/q]: ").strip()

        if choice == "q":
            break

        elif choice == "1":
            print("\n请粘贴 curl 命令（粘贴完成后按两次回车）：")
            lines = []
            empty_count = 0
            while True:
                try:
                    line = input()
                    if line.strip() == "":
                        empty_count += 1
                        if empty_count >= 2:
                            break
                    else:
                        empty_count = 0
                        lines.append(line)
                except EOFError:
                    break

            curl_text = "\n".join(lines)
            device_code, encrypted_data, headers_info = parse_curl(curl_text)

            if not device_code:
                print("\n❌ 未找到 ruixue-devicecode header")
                continue
            if not encrypted_data:
                print("\n❌ 未找到 --data 数据")
                continue

            print(f"\n{'─' * 50}")
            print(f"📌 请求信息：")
            if headers_info.get("url"):
                print(f"  URL: {headers_info['url']}")
            if headers_info.get("cpId"):
                print(f"  CP ID: {headers_info['cpId']}")
            if headers_info.get("productId"):
                print(f"  Product ID: {headers_info['productId']}")
            if headers_info.get("channelId"):
                print(f"  Channel ID: {headers_info['channelId']}")
            print(f"  Device Code: {device_code}")
            print(f"  密文: {encrypted_data[:50]}{'...' if len(encrypted_data) > 50 else ''}")
            print(f"{'─' * 50}")

            if verbose:
                print(f"\n🔑 密钥信息：")

            try:
                result = decrypt(device_code, encrypted_data, verbose)
                print(f"\n✅ 解密结果：")
                print(result)
            except Exception as e:
                print(f"\n❌ 解密失败：{e}")

        elif choice == "2":
            device_code = input("\n请输入 deviceCode: ").strip()
            encrypted_data = input("请输入 Base64 密文: ").strip()

            if not device_code or not encrypted_data:
                print("❌ deviceCode 和密文不能为空")
                continue

            if verbose:
                print(f"\n🔑 密钥信息：")

            try:
                result = decrypt(device_code, encrypted_data, verbose)
                print(f"\n✅ 解密结果：")
                print(result)
            except Exception as e:
                print(f"\n❌ 解密失败：{e}")

        elif choice == "3":
            device_code = input("\n请输入 deviceCode: ").strip()
            plaintext = input("请输入明文: ").strip()

            if not device_code or not plaintext:
                print("❌ deviceCode 和明文不能为空")
                continue

            if verbose:
                print(f"\n🔑 密钥信息：")

            try:
                result = encrypt(device_code, plaintext, verbose)
                print(f"\n✅ 加密结果：")
                print(result)
            except Exception as e:
                print(f"\n❌ 加密失败：{e}")

        else:
            print("无效选项，请重新选择")
            continue

        print()


def main():
    parser = argparse.ArgumentParser(
        description="瑞雪 SDK 数据解密工具",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用示例:
  # 交互模式（推荐，可直接粘贴 curl 命令）
  python3 rx_decrypt.py

  # 参数模式解密
  python3 rx_decrypt.py -d <deviceCode> -D <base64密文>

  # 参数模式加密
  python3 rx_decrypt.py -d <deviceCode> -E <明文>

  # 显示详细密钥信息
  python3 rx_decrypt.py -v
        """,
    )
    parser.add_argument("-d", "--device-code", help="ruixue-devicecode 值")
    parser.add_argument("-D", "--data", help="Base64 编码的密文（解密）")
    parser.add_argument("-E", "--encrypt-data", help="需要加密的明文")
    parser.add_argument("-v", "--verbose", action="store_true", help="显示详细密钥信息")

    args = parser.parse_args()

    # 参数模式
    if args.device_code and (args.data or args.encrypt_data):
        if args.data:
            # 解密
            try:
                if args.verbose:
                    print("🔑 密钥信息：")
                result = decrypt(args.device_code, args.data, args.verbose)
                print(result)
            except Exception as e:
                print(f"❌ 解密失败：{e}", file=sys.stderr)
                sys.exit(1)
        elif args.encrypt_data:
            # 加密
            try:
                if args.verbose:
                    print("🔑 密钥信息：")
                result = encrypt(args.device_code, args.encrypt_data, args.verbose)
                print(result)
            except Exception as e:
                print(f"❌ 加密失败：{e}", file=sys.stderr)
                sys.exit(1)
    else:
        # 交互模式
        interactive_mode(args.verbose)


if __name__ == "__main__":
    main()
