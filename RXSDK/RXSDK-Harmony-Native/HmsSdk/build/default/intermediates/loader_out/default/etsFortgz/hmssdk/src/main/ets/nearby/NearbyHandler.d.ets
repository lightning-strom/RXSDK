// @keepTs
// @ts-nocheck
export declare class NearbyHandler {
    Create(p53?: string): Promise<Array<ESObject>>;
    RegisterCallback(): Promise<Array<ESObject>>;
    UnregisterCallback(): void;
    PublishNearbyGame(): Promise<Array<ESObject>>;
    Discovery(): Promise<Array<ESObject>>;
    AutoBindNearbyGame(): Promise<Array<ESObject>>;
    BindNearbyGame(n53: string): Promise<Array<ESObject>>;
    static AcceptCollaboration(m53: Record<string, object>): void;
    SendPackageInfo(k53: string): Promise<Array<ESObject>>;
    ReplyPackageInfoResult(i53: string): Promise<Array<ESObject>>;
    TransferPackageData(g53: string): Promise<Array<ESObject>>;
    Destroy(): Promise<Array<ESObject>>;
    static Instance: NearbyHandler;
    static getInstance(): NearbyHandler;
}
