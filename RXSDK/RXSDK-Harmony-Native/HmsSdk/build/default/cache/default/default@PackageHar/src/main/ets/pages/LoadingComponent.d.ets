// @keepTs
// @ts-nocheck
@Component
export declare struct LoadingComponent {
    @State
    isLoading: boolean;
    @State
    timeout: number;
    @State
    text: string;
    @State
    bgColor?: ResourceColor;
    onCloseClick?: () => void;
    aboutToAppear(): void;
    close(): void;
    build(): void;
}
