// @keepTs
// @ts-nocheck
import { CaptchaType, Purpose } from '../types/Index';
declare class RXTextTimerModifier implements ContentModifier<TextTimerConfiguration> {
    constructor();
    applyContent(): WrappedBuilder<[
        TextTimerConfiguration
    ]>;
}
/**
 * Login page component.
 */
@Component
export declare struct CountDownComponent {
    @State
    count: number;
    @Prop
    target: string;
    type: CaptchaType;
    purpose: Purpose;
    @State
    clickEnableLink: boolean;
    @State
    myTimerModifier: RXTextTimerModifier;
    countUpTextTimerController: TextTimerController;
    aboutToAppear(): void;
    build(): void;
}
export {};
