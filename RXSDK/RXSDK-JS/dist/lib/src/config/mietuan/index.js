"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductId = void 0;
/**
 * 美团价价格档位对应productId
 * @param amount 档位金额
*/
var getProductId = function (amount) {
    switch (amount) {
        case 1:
            return 1;
        case 3:
            return 2;
        case 5:
            return 3;
        case 6:
            return 4;
        case 10:
            return 5;
        case 12:
            return 6;
        case 18:
            return 7;
        case 25:
            return 8;
        case 30:
            return 9;
        case 50:
            return 10;
        case 60:
            return 11;
        case 68:
            return 12;
        case 98:
            return 13;
        case 100:
            return 14;
        case 128:
            return 15;
        case 150:
            return 16;
        case 168:
            return 17;
        case 198:
            return 18;
        case 200:
            return 19;
        case 328:
            return 20;
        case 500:
            return 21;
        case 648:
            return 22;
        case 1000:
            return 23;
        case 8:
            return 24;
        case 88:
            return 25;
        case 108:
            return 26;
        case 118:
            return 27;
        case 148:
            return 28;
        case 998:
            return 29;
        case 1998:
            return 30;
        case 20:
            return 31;
        case 28:
            return 32;
        case 58:
            return 33;
        case 288:
            return 34;
        case 388:
            return 35;
        case 488:
            return 36;
        case 688:
            return 37;
        case 888:
            return 38;
        default:
            return null;
    }
};
exports.getProductId = getProductId;
//# sourceMappingURL=index.js.map