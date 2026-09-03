// @keepTs
// @ts-nocheck
@Component
export declare struct HeaderComponent {
    @Prop
    title: ResourceStr;
    @Prop
    backVisible: boolean;
    @Prop
    closeVisible: boolean;
    @State
    isImage: boolean;
    @State
    marginTop: number;
    fontSize: number;
    onClose?: (event: ClickEvent) => void;
    onBack?: (event: ClickEvent) => void;
    build(): void;
}
