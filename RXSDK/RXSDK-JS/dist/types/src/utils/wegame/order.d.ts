export declare const useSupplementOrder: () => {
    expiredVoucherCode: number[];
    isDropOrder: (errCode: number) => boolean;
    handleDynamicSupplementOrder: () => void;
    dynamicSupplementOrder: () => Promise<void>;
};
