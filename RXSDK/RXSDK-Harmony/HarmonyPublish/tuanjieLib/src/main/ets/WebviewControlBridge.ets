import {WebviewControl} from './webview/WebviewControl';



export class WebviewControlBridge {
  private webviewControl : WebviewControl;
  private messageCallback?: (...str : string[]) => void;

  private constructor() {
    this.webviewControl = new WebviewControl();
    globalThis.workerPort.addEventListener("message", async (e:object) => {
      let msg:ESObject = JSON.parse(JSON.stringify(e));
      if (msg.data.type == "WebControllerAttached") {
        console.info(">>>> receive WebControllerAttached message.")
        if (this.messageCallback != null) {
          this.messageCallback('ok');
        }
      }
    });
  }

  public CreateWebview(ml: number, mt: number, mr: number, mb: number, visible: boolean, callback: (...str : string[]) => void) {
    this.webviewControl.CreateWebview(ml, mt, mr, mb, visible);
    this.messageCallback = callback;
  }

  public RemoveWebview() {
    this.webviewControl.RemoveWebview();
  }

  public LoadURL(url: string): void {
    this.webviewControl.LoadURL(url);
  }

  public LoadHTMLString(contents: string, baseUrl: string): void {
    this.webviewControl.LoadHTMLString(contents, baseUrl);
  }

  public LoadData(contents: string, baseUrl: string): void {
    this.webviewControl.LoadData(contents, baseUrl);
  }

  public EvaluateJS(jsContents: string): void {
    this.webviewControl.EvaluateJS(jsContents);
  }

  public Reload(): void {
    this.webviewControl.Reload();
  }

  public StopLoading(): void {
    this.webviewControl.StopLoading();
  }

  public GoForward(): void {
    this.webviewControl.GoForward();
  }

  public GoBack(): void {
    this.webviewControl.GoBack();
  }

  public SetVisibility(visible: boolean): void {
    this.webviewControl.SetVisibility(visible);
  }

  public SetMargins(ml: number, mt: number, mr: number, mb: number): void {
    this.webviewControl.SetMargins(ml, mt, mr, mb);
  }

  public static getInstance() {
    return new WebviewControlBridge();
  }
}

export function RegisterWebviewControlBridge() {
  let register: Record<string, Object> = {};
  register["WebviewControlBridge"] = WebviewControlBridge;
  return register;
}