class Path {
    separator: string = "/";
    join(...i61: string[]) {
        return this.joinWith(this.separator, ...i61);
    }
    joinWith(d61: string, ...e61: string[]) {
        e61 = e61.map((f61, g61, h61) => {
            if (f61) {
                return f61.replace(new RegExp(`^${d61}+|${d61}+$`, 'g'), '');
            }
            else {
                return f61;
            }
        });
        return e61.join(d61);
    }
}
export default new Path();
