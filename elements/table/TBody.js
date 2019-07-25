"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const JSFXElement_js_1 = require("../../JSFXElement.js");
const JSFXNode_js_1 = require("../../JSFXNode.js");
let TBody = class TBody extends JSFXElement_js_1.default {
    getTagName() {
        return "tbody";
    }
};
TBody = __decorate([
    JSFXNode_js_1.default
], TBody);
exports.default = TBody;
