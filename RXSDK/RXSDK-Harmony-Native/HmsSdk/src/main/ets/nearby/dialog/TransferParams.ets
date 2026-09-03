export class TransferParams {
  text: string = '';
  transferredData: number = 0;
  totalData: number = 1;
  isTransferred: boolean = false;
  isConnected: boolean = false;
  closeCallback?: () => void;

  constructor(text: string,c?:()=>void) {
    this.text = text;
    this.closeCallback=c;
  }
}
