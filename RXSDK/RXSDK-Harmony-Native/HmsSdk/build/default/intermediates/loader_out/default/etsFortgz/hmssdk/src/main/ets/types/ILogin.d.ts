export interface ILogin {
    doLogin(params: Record<string, any>): Promise<object>;
}
