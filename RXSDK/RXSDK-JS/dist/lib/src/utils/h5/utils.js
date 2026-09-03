"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.showConfirm = exports.showShareGuide = exports.getLayer = exports.setStyles = exports.listenVisibilityChange = exports.getSearchQueries = void 0;
var utils_1 = require("@/utils/utils");
/**
 * @name getSearchQueries
 * @desc 解析并存储 URL 参数
 */
var getSearchQueries = function () {
    var search = window.location.search.slice(1);
    return utils_1.qs.parse(search);
};
exports.getSearchQueries = getSearchQueries;
/**
 * @name listenVisibilityChange
 * @desc 监听显示/隐藏
 */
var listenVisibilityChange = function (callbak) {
    document.addEventListener('visibilitychange', function () {
        callbak(!document.hidden);
    }, false);
};
exports.listenVisibilityChange = listenVisibilityChange;
var setStyles = function (el, styles) {
    var key;
    for (key in styles) {
        if (Object.prototype.hasOwnProperty.call(styles, key)) {
            el.style[key] = styles[key];
        }
    }
};
exports.setStyles = setStyles;
var getLayer = function () {
    var wrapper = document.createElement('div');
    (0, exports.setStyles)(wrapper, {
        display: 'flex',
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: '0',
        left: '0',
        background: 'rgba(0, 0, 0, .7)',
        color: '#fff',
        fontSize: '16px',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    });
    return wrapper;
};
exports.getLayer = getLayer;
var showShareGuide = function (cancelFn, showGuide) {
    if (showGuide === void 0) { showGuide = true; }
    var wrapper = (0, exports.getLayer)();
    function addArrow() {
        var arrowWrap = document.createElement('div');
        var arrow = document.createElement('div');
        (0, exports.setStyles)(arrowWrap, {
            position: 'absolute',
            width: '100%',
            top: '0',
        });
        (0, exports.setStyles)(arrow, {
            position: 'absolute',
            top: '30px',
            right: '34px',
            borderTop: '20px solid transparent',
            borderBottom: '20px solid transparent',
            borderLeft: '40px solid #fff',
            transform: 'rotate(-60deg)',
        });
        var line = document.createElement('div');
        (0, exports.setStyles)(line, {
            position: 'absolute',
            top: '-112px',
            left: '-120px',
            border: '0 solid transparent',
            borderBottom: '14px solid #fff',
            borderRadius: '0 0 0 100px',
            width: '90px',
            height: '120px',
        });
        var tipsEl = document.createElement('div');
        (0, exports.setStyles)(tipsEl, {
            position: 'relative',
            width: '80%',
            maxWidth: '220px',
            fontSize: '16px',
            textAlign: 'center',
            margin: 'auto',
            top: '110px',
            lineHeight: '2em',
        });
        tipsEl.innerHTML = "\n      <div>\u70B9\u51FB\u53F3\u4E0A\u89D2\u6309\u94AE</div>\n      <div>\u53D1\u9001\u7ED9\u670B\u53CB</div>\n    ";
        arrowWrap.appendChild(arrow);
        arrowWrap.appendChild(tipsEl);
        arrow.appendChild(line);
        wrapper.appendChild(arrowWrap);
    }
    if (showGuide) {
        addArrow();
    }
    ;
    (function addCancel() {
        var cancelEl = document.createElement('div');
        (0, exports.setStyles)(cancelEl, {
            width: '80%',
            maxWidth: '200px',
            height: '46px',
            border: '1px solid #fff',
            borderRadius: '4px',
            margin: 'auto',
            position: 'absolute',
            bottom: '15%',
            left: '0',
            right: '0',
            lineHeight: '46px',
        });
        cancelEl.innerText = '取消';
        cancelEl.addEventListener('click', function (e) {
            typeof cancelFn === 'function' && cancelFn();
            document.body.removeChild(wrapper);
            e.stopPropagation();
        }, false);
        wrapper.appendChild(cancelEl);
    })();
    document.body.appendChild(wrapper);
    return function () {
        document.body.removeChild(wrapper);
    };
};
exports.showShareGuide = showShareGuide;
var showConfirm = function (params) {
    var layer = (0, exports.getLayer)();
    var container = document.createElement('div');
    var autoClose = params.autoClose !== false;
    (function () {
        (0, exports.setStyles)(container, {
            width: '90%',
            height: '80%',
            background: '#fff',
            color: '#333',
            padding: '50px 20px 110px',
            position: 'relative',
        });
    })();
    (function () {
        var title = document.createElement('div');
        (0, exports.setStyles)(title, {
            width: '100%',
            fontSize: '20px',
            padding: '10px 0',
            position: 'absolute',
            top: '0',
            left: '0',
        });
        title.innerText = params.title;
        container.appendChild(title);
    })();
    (function () {
        var message = document.createElement('div');
        (0, exports.setStyles)(message, {
            height: '100%',
            background: '#ececec',
            padding: '4px 6px',
            textAlign: 'left',
            overflowY: 'auto',
            wordBreak: 'break-all',
            '-webkit-overflow-scrolling': 'touch',
        });
        if (params.dangerouslyUseHTMLString) {
            message.innerHTML = params.message;
        }
        else {
            message.innerText = params.message;
        }
        container.appendChild(message);
    })();
    (function () {
        var footer = document.createElement('div');
        (0, exports.setStyles)(footer, {
            width: '100%',
            padding: '10px 20px',
            position: 'absolute',
            bottom: '10px',
            left: '0',
        });
        var cancel = document.createElement('div');
        var confirm = document.createElement('div');
        cancel.innerText = params.cancelText || '取消';
        confirm.innerText = params.confirmText || '确定';
        cancel.addEventListener('click', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = params.cancel;
                        if (!_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, params.cancel()];
                    case 1:
                        _a = (_b.sent());
                        _b.label = 2;
                    case 2:
                        _a;
                        autoClose && document.body.removeChild(layer);
                        return [2 /*return*/];
                }
            });
        }); });
        confirm.addEventListener('click', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = params.confirm;
                        if (!_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, params.confirm()];
                    case 1:
                        _a = (_b.sent());
                        _b.label = 2;
                    case 2:
                        _a;
                        autoClose && document.body.removeChild(layer);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, exports.setStyles)(cancel, {
            color: '#2196F3',
            padding: '4px 0',
            marginTop: '10px',
        });
        (0, exports.setStyles)(confirm, {
            background: '#2196F3',
            padding: '6px 0',
            color: '#fff',
        });
        footer.appendChild(confirm);
        footer.appendChild(cancel);
        container.appendChild(footer);
    })();
    layer.appendChild(container);
    document.body.appendChild(layer);
};
exports.showConfirm = showConfirm;
//# sourceMappingURL=utils.js.map