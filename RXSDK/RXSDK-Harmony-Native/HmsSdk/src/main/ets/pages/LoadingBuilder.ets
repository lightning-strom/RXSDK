import { LoadingComponent } from './LoadingComponent';


export class LoadingParams {
  timeout: number = 5000
  text?: string
  bgColor: ResourceColor = Color.Transparent
  onCloseClick?: () => void;

  constructor(onClose?: () => void) {
    this.onCloseClick = onClose
  }
}

@Builder
export function loadingBuilder(params: LoadingParams) {
  LoadingComponent({
    onCloseClick: params.onCloseClick,
    timeout: params.timeout,
    text: params.text,
    bgColor: params.bgColor
  })
}