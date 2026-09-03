import { Logger } from '@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0';
export class RXEvent {
    constructor() {
        this.listeners = {};
    }
    on(j194, k194) {
        if (!(j194 in this.listeners)) {
            this.listeners[j194] = [];
        }
        this.listeners[j194].push(k194);
    }
    emit(a194, b194) {
        const c194 = this.listeners[a194];
        if (c194) {
            const d194 = [];
            c194.forEach((f194, g194) => {
                try {
                    let i194 = f194(b194);
                    if (i194) {
                        d194.push(g194);
                    }
                }
                catch (h194) {
                    h194.msg ??= h194.message;
                    Logger.e(h194);
                    d194.push(g194);
                }
            });
            d194.reverse().forEach(e194 => {
                c194.splice(e194, 1);
            });
        }
    }
    off(x193, y193) {
        Logger.d("off:" + String(x193) + "," + y193);
        if (!y193) {
            delete this.listeners[x193];
            return true;
        }
        else if (this.listeners[x193]) {
            this.listeners[x193] = this.listeners[x193].filter(z193 => z193 !== y193);
            return true;
        }
        else {
            return false;
        }
    }
}
