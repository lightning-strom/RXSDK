import { Reward } from '../types/Index';
import { RealNameComponent } from './RealNameComponent';

export class RealNameParams {
  onCommitClick?: (realName: string, idCard: string,isFastAuth: boolean) => void;
  onAlipayAuthClick?: () => void;
  onCloseClick?: (event?: ClickEvent) => void;
  props?: Reward[];
  isFastAuth?: boolean;
  realName?: string  ;
  idCard?: string  ;
  canCloseRealAuth?: boolean  ;
  useAlipayAuth?: boolean;

  constructor(onCommitClick?: (realName: string, idCard: string,isFastAuth: boolean) => void, onCloseClick?: (event?: ClickEvent) => void, props?: Reward[]) {
    this.onCloseClick = onCloseClick
    this.onCommitClick = onCommitClick
    this.props = props
  }
}

@Builder
export function realNameBuilder(params: RealNameParams) {
  RealNameComponent({
    onCommitClick: params.onCommitClick,
    onAlipayAuthClick: params.onAlipayAuthClick,
    onCloseClick: params.onCloseClick,
    props: params.props,
    realName: params.realName,
    idCard: params.idCard,
    isFastAuth: params.isFastAuth,
    useAlipayAuth: params.useAlipayAuth,
    closeVisible: params.canCloseRealAuth
  })
}