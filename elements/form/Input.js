var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import StringProperty from "@mephiztopheles/properties/properties/StringProperty.js";
import FormElement from "./FormElement.js";
import JSFXProperty from "../../JSFXProperty.js";
export default class Input extends FormElement {
    constructor(element) {
        super(element);
        this.value = new StringProperty();
        this.element.addEventListener("input", e => {
            this.value.value = this.element.value;
        });
        this.applyListeners();
    }
    getTagName() {
        return "input";
    }
}
__decorate([
    JSFXProperty("value")
], Input.prototype, "value", void 0);
