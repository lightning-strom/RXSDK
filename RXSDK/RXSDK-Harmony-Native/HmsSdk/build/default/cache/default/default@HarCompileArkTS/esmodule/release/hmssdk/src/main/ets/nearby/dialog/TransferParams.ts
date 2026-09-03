// @keepTs
// @ts-nocheck
export class TransferParams {
    text: string = '';
    transferredData: number = 0;
    totalData: number = 1;
    isTransferred: boolean = false;
    isConnected: boolean = false;
    closeCallback?: () => void;
    constructor(y52: string, z52?: () => void) {
        this.text = y52;
        this.closeCallback = z52;
    }
}
