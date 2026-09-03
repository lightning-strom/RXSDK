let Instance: GlobalContext;
export class GlobalContext {
    private _objects = new Map<string, Object>();
    getObject(p188: string): Object | undefined {
        return this._objects.get(p188);
    }
    setObject(n188: string, o188: Object): void {
        this._objects.set(n188, o188);
    }
    public static getInstance() {
        if (Instance == null) {
            Instance = new GlobalContext();
        }
        return Instance;
    }
}
