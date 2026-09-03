// @keepTs
// @ts-nocheck
@CustomDialog
@Component
export declare struct CustomIdCardInput {
    controller: CustomDialogController;
    private textInputCont;
    @State
    showFlag: Visibility;
    cancel(): void;
    build(): void;
}
