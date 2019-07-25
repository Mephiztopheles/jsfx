"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const JSFXElement_js_1 = require("./JSFXElement.js");
const ajax_js_1 = require("./helper/ajax.js");
class JSFXLoader {
    static load(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield ajax_js_1.default({ url });
            return this.convert(response);
        });
    }
    static convert(innerHTML) {
        const el = document.createElement("div");
        el.innerHTML = innerHTML;
        return this.compile(el);
    }
    static compile(element) {
        // @ts-ignore same package
        return JSFXElement_js_1.default.compile(element);
    }
}
exports.JSFXLoader = JSFXLoader;
