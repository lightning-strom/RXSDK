import type { RCallback } from '../types/Index';
import Passport from "@normalized:N&&&hmssdk/src/main/ets/base/Passport&4.0.0";
type TimeoutCallback = (methodName: string, duration: number) => void | Promise<void>;
type ErrorHandler = (error: any, methodName: string, args: any[]) => void | Promise<void>;
export const LoginState = (j15: Object, k15: string) => {
    const l15 = j15['prototype'] as Object;
    let m15 = j15[k15];
};
export const LoginDecorator = (f15: object, g15: string, h15: PropertyDescriptor) => {
    const i15 = h15.value;
    h15.value = async function () {
        await Passport.checkAccessToken();
        return i15.apply(this, arguments);
    };
};
function isRCallback<d15>(e15: any): e15 is RCallback<d15> {
    return typeof e15 === 'function';
}
export const CatchError = (w14?: ErrorHandler) => {
    return function (x14: any, y14: string, z14: PropertyDescriptor) {
        const a15 = z14.value;
        z14.value = async function (...b15: any[]) {
            try {
                return await a15.apply(this, b15);
            }
            catch (c15) {
                console.error(`Error in ${y14}:`, c15);
                if (w14) {
                    await Promise.resolve(w14(c15, y14, b15));
                }
                throw c15;
            }
        };
        return z14;
    };
};
export const Timeout = (m14: number = 5000, n14?: TimeoutCallback) => {
    return function (o14: any, p14: string, q14: PropertyDescriptor) {
        const r14 = q14.value;
        q14.value = async function (...s14: any[]) {
            const t14 = new Promise((u14, v14) => {
                setTimeout(async () => {
                    if (n14) {
                        await Promise.resolve(n14(p14, m14));
                    }
                    v14(new Error(`${p14} timeout after ${m14}ms`));
                }, m14);
            });
            return Promise.race([
                r14.apply(this, s14),
                t14
            ]);
        };
        return q14;
    };
};
