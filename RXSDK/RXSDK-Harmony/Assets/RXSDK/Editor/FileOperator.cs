using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.IO;
// using NUnit.Framework;


public partial class FileOperator : System.IDisposable
{
    private string _filePath;

    public FileOperator(string fPath) //通过文件路径初始化对象
    {
        if (!File.Exists(fPath))
        {
            Debug.LogError(fPath + "该文件不存在,请检查路径!");
            return;
        }
        _filePath = fPath;
    }


    // 替换某些字符串
    public void ReplaceString(string oldStr, string newStr, string method = "")
    {
        if (!File.Exists(_filePath))
        {
            return;
        }
        bool getMethod = false;
        string[] codes = File.ReadAllLines(_filePath);
        for (int i = 0; i < codes.Length; i++)
        {
            string str = codes[i].ToString();
            if (string.IsNullOrEmpty(method))
            {
                if (str.Contains(oldStr)) codes.SetValue(newStr, i);
            }
            else
            {
                if (!getMethod)
                {
                    getMethod = str.Contains(method);
                }
                if (!getMethod) continue;
                if (str.Contains(oldStr))
                {
                    codes.SetValue(newStr, i);
                    break;
                }
            }
        }
        File.WriteAllLines(_filePath, codes);
    }

    /**
     * TuanjieMainWorkerHandler.cs 新增import和消息监听代码
     */
    // 代码中添加import行内容
    public void InsertImports(string[] importLines)
    {
        if (!File.Exists(_filePath) || importLines.Length == 0)
        {
            return;
        }
        int lastImportLine = -1;
        string[] codes = File.ReadAllLines(_filePath);
        for (int i = 0; i < codes.Length; i++)
        {
            string str = codes[i].Trim();
            if (str.StartsWith("import ") || string.IsNullOrEmpty(str))
            {
                lastImportLine = i;
                continue;
            }
            break;
        }
        InsertAfterIndex(codes, lastImportLine, importLines);
    }

    /**
     * TuanjieMainWorkerHandler.cs 新增import和消息监听代码
     */
    // 代码中在指定行内容后面插入内容
    public void InsertAfterLineContent(string lineContent, string[] addLines)
    {
        if (!File.Exists(_filePath) || string.IsNullOrEmpty(lineContent))
        {
            return;
        }
        int insertAfterIndex = 0;
        string[] codes = File.ReadAllLines(_filePath);
        for (int i = 0; i < codes.Length; i++)
        {
            string str = codes[i];
            if (str.Contains(lineContent))
            {
                insertAfterIndex = i;
                break;
            }
        }
        InsertAfterIndex(codes, insertAfterIndex, addLines);
    }

    /**
     * TuanjieMainWorkerHandler.cs 新增import和消息监听代码
     */
    // 代码中在指定行号后面插入内容（行号从0开始）
    public void InsertAfterIndex(int insertAfterIndex, string[] contentLines)
    {
        if (!File.Exists(_filePath) || contentLines.Length == 0)
        {
            return;
        }
        string[] codes = File.ReadAllLines(_filePath);
        InsertAfterIndex(codes, insertAfterIndex, contentLines);
    }

    /**
     * TuanjieMainWorkerHandler.cs 新增import和消息监听代码
     */
    // 代码中在指定行号后面插入内容（行号从0开始）
    private void InsertAfterIndex(string[] codes, int insertAfterIndex, string[] contentLines)
    {
        int newCodesLineCount = codes.Length + contentLines.Length;
        string[] newCodes = new string[newCodesLineCount];
        for (int i = newCodesLineCount - 1; i >= 0; i--)
        {
            if (i > insertAfterIndex + contentLines.Length)
            {
                newCodes[i] = codes[i - contentLines.Length];
                continue;
            }
            if (i > insertAfterIndex)
            {
                newCodes[i] = contentLines[i - insertAfterIndex - 1];
                continue;
            }
            newCodes[i] = codes[i];
        }
        File.WriteAllLines(_filePath, newCodes);
    }

    /**
     * TuanjieMainWorkerHandler.cs 新增import和消息监听代码
     */
    // 代码中在指定行内容后面插入内容
    public void InsertBeforeLineContent(string lineContent, string[] addLines)
    {
        if (!File.Exists(_filePath) || string.IsNullOrEmpty(lineContent))
        {
            return;
        }
        int insertBeforeIndex = 0;
        string[] codes = File.ReadAllLines(_filePath);
        for (int i = 0; i < codes.Length; i++)
        {
            string str = codes[i];
            if (str.Contains(lineContent))
            {
                insertBeforeIndex = i;
                break;
            }
        }
        InsertBeforeIndex(codes, insertBeforeIndex, addLines);
    }

    /**
     * TuanjieMainWorkerHandler.cs 新增import和消息监听代码
     */
    // 代码中在指定行号前面插入内容（行号从0开始）
    private void InsertBeforeIndex(string[] codes, int insertBeforeIndex, string[] contentLines)
    {
        int newCodesLineCount = codes.Length + contentLines.Length;
        string[] newCodes = new string[newCodesLineCount];
        for (int i = newCodesLineCount - 1; i >= 0; i--)
        {
            if (i >= insertBeforeIndex + contentLines.Length)
            {
                newCodes[i] = codes[i - contentLines.Length];
                continue;
            }
            if (i > insertBeforeIndex - 1)
            {
                newCodes[i] = contentLines[i - insertBeforeIndex];
                continue;
            }
            newCodes[i] = codes[i];
        }
        File.WriteAllLines(_filePath, newCodes);
    }

    /**
     * TuanjieMainWorkerHandler.cs 新增import和消息监听代码
     */
    // 在某一行内容后面插入代码
    public void WriteBelowCode(string below, string text)
    {
        StreamReader streamReader = new StreamReader(_filePath);
        string text_all = streamReader.ReadToEnd();
        streamReader.Close();

        int beginIndex = text_all.IndexOf(below);
        if (beginIndex == -1)
        {
            return;
        }
        int endIndex = text_all.LastIndexOf("\n", beginIndex + below.Length);

        text_all = text_all.Substring(0, endIndex) + "\n" + text + "\n" + text_all.Substring(endIndex);

        StreamWriter streamWriter = new StreamWriter(_filePath);
        streamWriter.Write(text_all);
        streamWriter.Close();
    }

    public void Dispose()
    {
    }

    public static void MoveDirectory(string oldPath, string newPath)
    {
        if (Directory.Exists(oldPath) && !Directory.Exists(newPath))
        {
            DirectoryInfo diInfo = new DirectoryInfo(oldPath);
            diInfo.MoveTo(newPath);
        }
    }
}
