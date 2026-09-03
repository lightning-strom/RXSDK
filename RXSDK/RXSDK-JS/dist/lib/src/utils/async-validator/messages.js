"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messages = exports.newMessages = void 0;
function newMessages() {
    return {
        required: '%s is required',
        enum: '%s must be one of %s',
        types: {
            string: '%s is not a %s',
            method: '%s is not a %s (function)',
            array: '%s is not an %s',
            object: '%s is not an %s',
            number: '%s is not a %s',
            date: '%s is not a %s',
            boolean: '%s is not a %s',
            integer: '%s is not an %s',
            float: '%s is not a %s',
            regexp: '%s is not a valid %s',
            email: '%s is not a valid %s',
            url: '%s is not a valid %s',
            hex: '%s is not a valid %s',
        },
        string: {
            len: '%s must be exactly %s characters',
            min: '%s must be at least %s characters',
            max: '%s cannot be longer than %s characters',
            range: '%s must be between %s and %s characters',
        },
    };
}
exports.newMessages = newMessages;
exports.messages = newMessages();
//# sourceMappingURL=messages.js.map