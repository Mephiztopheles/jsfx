var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import TestCase, { test } from "@mephiztopheles/test/TestCase.js";
import Div from "../elements/Div.js";
class Test extends TestCase {
    test() {
        console.log("run");
        const div = new Div(document.createElement("div"));
        div.onClick.value = event => console.log(event);
        console.log(div.onClick.value);
        console.log(div.click());
    }
}
__decorate([
    test
], Test.prototype, "test", null);
new Test().run();
