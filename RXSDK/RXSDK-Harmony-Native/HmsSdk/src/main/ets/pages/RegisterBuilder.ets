import { RegisterComponent } from "./RegisterComponent";


export class RegisterParams {
  onCommitClick?: (username: string, password?: string) => void;
  onCloseClick?: (event?: ClickEvent) => void;

  constructor(onCommitClick?: (username: string, password?: string) => void, onCloseClick?: (event?: ClickEvent) => void) {
    this.onCommitClick = onCommitClick
    this.onCloseClick = onCloseClick
  }
}

@Builder
export function registerBuilder(params: RegisterParams) {
  RegisterComponent({ onCommitClick: params.onCommitClick, onCloseClick: params.onCloseClick })
}