// @keepTs
// @ts-nocheck
export declare class TransferParams {
    text: string;
    transferredData: number;
    totalData: number;
    isTransferred: boolean;
    isConnected: boolean;
    closeCallback?: () => void;
    constructor(y52: string, z52?: () => void);
}
