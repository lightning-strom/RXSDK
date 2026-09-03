import { IWindowLifecycle } from "../types/Index";
export default abstract class WindowLifecycle implements IWindowLifecycle {
    constructor();
    onShown(j27?: any): void;
    onActive(i27?: any): void;
    onInactive(h27?: any): void;
    onHidden(g27?: any): void;
    onResumed(f27?: any): void;
    onPaused(e27?: any): void;
}
