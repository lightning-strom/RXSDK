
class PathUtil {
  //console.log(MyClass.getFileName('/path/to/file.txt'));       // 输出: file.txt
  public getFileName(filePath: string) {
    // 从路径的最后一个 '/' 或 '\\' 开始查找文件名
    const lastIndex = filePath.lastIndexOf('/') === -1 ? filePath.lastIndexOf('\\') : filePath.lastIndexOf('/');

    // 如果找不到 '/' 或 '\\'，则整个字符串就是文件名
    if (lastIndex === -1) {
      return filePath;
    }
    // // 正则表达式提取文件名（包括扩展名）
    // const match = filePath.match(/([^/]+)$/);
    // const fileName = match ? match[0] : '';
    // 返回从最后一个 '/' 或 '\\' 后面的部分开始到字符串末尾的所有字符
    return filePath.substring(lastIndex + 1);
  }

  public joinPath(dirPath: string, fileName: string): string {
    const cleanDirPath = dirPath?.replace(/\/+$/, '');
    const cleanFileName = fileName?.replace(/^\/+/, '');
    return `${cleanDirPath}/${cleanFileName}`;
  }

  public join(...paths: string[]): string {
    return paths
      .filter((path) => path.trim() !== '')
      .map((path, index) => {
        if (index === 0) {
          return path.replace(/\/+$/, '');
        } else {
          return path.replace(/^\/+/, '');
        }
      })
      .join('/');
  }
}

export default new PathUtil()