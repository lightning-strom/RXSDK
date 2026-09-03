using System.IO;

namespace RuiXue.RuiXueBase.Editor
{
    public static class ProcessorFileUtil
    {
        public static void CopyDirectory(string sourceDirectory, string destinationDirectory)
        {
            // 获取源目录中的所有文件
            string[] files = Directory.GetFiles(
                sourceDirectory, "*", SearchOption.AllDirectories
                );

            foreach (string filePath in files)
            {
                // 排除.meta文件
                if (Path.GetExtension(filePath) != ".meta")
                {
                    // 获取文件相对于源目录的路径
                    string relativePath = filePath.Replace(sourceDirectory, "");

                    // 构建目标路径
                    string destinationPath = Path.Combine(destinationDirectory, 
                        relativePath.TrimStart(Path.DirectorySeparatorChar));

                    // 确保目标目录存在
                    Directory.CreateDirectory(Path.GetDirectoryName(destinationPath));

                    // 复制文件
                    File.Copy(filePath, destinationPath, true);
                }
            }
        }
    }
}