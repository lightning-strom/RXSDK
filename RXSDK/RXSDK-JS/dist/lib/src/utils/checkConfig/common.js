"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.update_infoCheck = exports.deregisterParamsCheck = exports.unbindemailParamsCheck = exports.bindEmailParamsCheck = exports.unBindPhoneParamsCheck = exports.verifyCodeParamsCheck = exports.changePhoneParamsCheck = exports.bindPhoneParamsCheck = exports.sendCaptchaParamsCheck = void 0;
exports.sendCaptchaParamsCheck = {
    email: {
        type: 'email',
    },
    phone: {
        asyncValidator: function (rule, value) {
            return new Promise(function (resolve, reject) {
                if (/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(value + '')) {
                    resolve();
                }
                else {
                    reject('phone params is not invalid');
                }
            });
        },
    },
    purpose: {
        type: 'enum',
        enum: [
            'register',
            'bindphone',
            'unbindphone',
            'resetpwd',
            'bindemail',
            'unbindemail',
            'login',
            'setpwd',
        ],
    },
};
exports.bindPhoneParamsCheck = {
    phone: {
        type: 'string',
        required: true,
    },
    captcha_code: {
        type: 'string',
        required: true,
    },
    // password: {
    //   type: 'string',
    //   required: true,
    // },
};
exports.changePhoneParamsCheck = {
    oldphone_captcha: {
        type: 'string',
        required: true,
    },
    newphone: {
        asyncValidator: function (rule, value) {
            return new Promise(function (resolve, reject) {
                if (/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(value + '')) {
                    resolve();
                }
                else {
                    reject('phone params is not invalid');
                }
            });
        },
    },
    newphone_captcha: {
        type: 'string',
        required: true,
    },
};
exports.verifyCodeParamsCheck = {
    captcha_code: {
        type: 'string',
        required: true,
    }
};
exports.unBindPhoneParamsCheck = {
    phone: {
        type: 'string',
        required: true,
    },
    captcha_code: {
        type: 'string',
        required: true,
    },
};
exports.bindEmailParamsCheck = {
    email: {
        type: 'string',
        required: true,
    },
    captcha_code: {
        type: 'string',
        required: true,
    },
    password: {
        type: 'string',
        required: true,
    },
};
exports.unbindemailParamsCheck = {
    email: {
        type: 'string',
        required: true,
    },
    captcha_code: {
        type: 'string',
        required: true,
    },
};
exports.deregisterParamsCheck = {
    idcard: {
        type: 'string',
        required: true,
    },
    realname: {
        type: 'string',
        required: true,
    },
    cpdata: {
        type: 'string',
        required: true,
    },
};
exports.update_infoCheck = {
    nickname: {
        type: 'string',
        required: true,
    },
    avatarurl: {
        type: 'string',
        required: true,
    },
    region: {
        type: 'string',
        required: true,
    },
    sex: {
        type: 'enum',
        enum: [1, 0],
        required: true,
    },
};
//# sourceMappingURL=common.js.map