/**
 * 从基础库2.7.1开始，微信小程序端即可使用实时日志，微信小游戏端则从基础库2.14.4开始支持。
 */
declare const _default: {
    info(identifier: string, ...args: any[]): void;
    warn(identifier: string, ...args: any[]): void;
};
export default _default;
