export declare let isAndroid: boolean;
export declare let isIos: boolean;
export declare let isiPad: boolean | RegExpMatchArray;
export declare const isHarmony: boolean;
declare global {
    var JsBridgeH5: any;
    var JSBridgeHandle: any;
    var webkit: any;
}
export declare function useNativeMode(): {
    handleCallback: ({ eventName, eventParams }: any) => Promise<unknown>;
    handleInteractive: ({ eventName, eventParams }: any) => void;
};
