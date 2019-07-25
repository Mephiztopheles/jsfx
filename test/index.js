"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const TestCase_js_1 = require("@mephiztopheles/test/TestCase.js");
const Div_js_1 = require("../elements/Div.js");
class Test extends TestCase_js_1.default {
    test() {
        console.log("run");
        const div = new Div_js_1.default(document.createElement("div"));
        div.onClick.value = event => console.log(event);
        console.log(div.onClick.value);
        console.log(div.click());
    }
}
__decorate([
    TestCase_js_1.test
], Test.prototype, "test", null);
new Test().run();
