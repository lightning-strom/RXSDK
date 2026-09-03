class PathUtil {
    public getFileName(p193: string) {
        const q193 = p193.lastIndexOf('/') === -1 ? p193.lastIndexOf('\\') : p193.lastIndexOf('/');
        if (q193 === -1) {
            return p193;
        }
        return p193.substring(q193 + 1);
    }
    public joinPath(l193: string, m193: string): string {
        const n193 = l193?.replace(/\/+$/, '');
        const o193 = m193?.replace(/^\/+/, '');
        return `${n193}/${o193}`;
    }
    public join(...h193: string[]): string {
        return h193.filter((k193) => k193.trim() !== '')
            .map((i193, j193) => {
            if (j193 === 0) {
                return i193.replace(/\/+$/, '');
            }
            else {
                return i193.replace(/^\/+/, '');
            }
        })
            .join('/');
    }
}
export default new PathUtil();
