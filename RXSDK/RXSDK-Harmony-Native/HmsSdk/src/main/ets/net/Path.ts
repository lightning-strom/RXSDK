class Path {
  separator: string = "/"

  join(...paths: string[]) {
    return this.joinWith(this.separator, ...paths)
  }

  joinWith(separator: string, ...paths: string[]) {
    paths = paths.map((v, i, a) => {
      if (v) {
        return v.replace(new RegExp(`^${separator}+|${separator}+$`, 'g'), '');
        // return v.substring(v.startsWith(separator) ? 1 : 0, v.endsWith(separator) ? v.length - 1 : v.length)
      } else {
        return v
      }
    })
    return paths.join(separator)
  }
}

export default new Path()