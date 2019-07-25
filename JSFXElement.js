"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const JSFXProperty_js_1 = require("./JSFXProperty.js");
const JSFXNode_js_1 = require("./JSFXNode.js");
const ArrayProperty_js_1 = require("@mephiztopheles/properties/properties/ArrayProperty.js");
const StringProperty_js_1 = require("@mephiztopheles/properties/properties/StringProperty.js");
const BooleanProperty_js_1 = require("@mephiztopheles/properties/properties/BooleanProperty.js");
const NumberProperty_js_1 = require("@mephiztopheles/properties/properties/NumberProperty.js");
const ObjectProperty_js_1 = require("@mephiztopheles/properties/properties/ObjectProperty.js");
const Style_js_1 = require("./helper/Style.js");
const Data_js_1 = require("./helper/Data.js");
const nodeMap = new WeakMap();
const rnothtmlwhite = (/[^\x20\t\r\n\f]+/g), rtypenamespace = /^([^.]*)(?:\.(.+)|)/;
class JSFXElement {
    constructor(element) {
        this.children = new ArrayProperty_js_1.default();
        this.classes = new ArrayProperty_js_1.default();
        this.id = new StringProperty_js_1.default();
        this.disabled = new BooleanProperty_js_1.default();
        this.text = new StringProperty_js_1.default();
        this.html = new StringProperty_js_1.default();
        this.clientHeight = new NumberProperty_js_1.default();
        this.clientWidth = new NumberProperty_js_1.default();
        this.clientLeft = new NumberProperty_js_1.default();
        this.scrollTop = new NumberProperty_js_1.default();
        this.scrollLeft = new NumberProperty_js_1.default();
        this.onClick = new ObjectProperty_js_1.default();
        this.listeners = new Map();
        this.element = element;
        if (this.element == null)
            this.element = document.createElement(this.getTagName());
        nodeMap.set(this.element, this);
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                this.mutated(mutation);
            });
            JSFXElement.forEachPrototype(this, constructor => {
                const properties = JSFXProperty_js_1.default.get(constructor.constructor.name);
                if (properties != null) {
                    properties.forEach(property => {
                        if (property.updateOnChange)
                            this[property.propertyKey].value = this.element[property.name];
                    });
                }
            });
        });
        observer.observe(this.element, { attributes: true, childList: false, characterData: false });
        this.applyListeners();
    }
    mutated(mutation) {
        if (mutation.type === "attributes") {
            if (mutation.attributeName === "id")
                this.id.value = this.element.id;
            if (mutation.attributeName === "class") {
                let classes = [];
                this.element.classList.forEach(className => {
                    classes.push(className);
                });
                this.classes.value = classes;
            }
        }
    }
    applyListeners() {
        this.classes.addListener(() => {
            this.element.className = this.classes.join(" ");
        });
        this.children.addListener(newValue => {
            newValue.forEach((child, index) => {
                if (index == newValue.length - 1)
                    this.element.lastChild.after(child.element);
                else
                    this.element.lastChild.before(child.element);
            });
        });
        const properties = JSFXProperty_js_1.default.get(this.constructor.name);
        if (properties != null) {
            properties.forEach(property => {
                if (property.updateOnChange) {
                    this[property.propertyKey].addListener(value => {
                        this.element[property.name] = value;
                    });
                }
            });
        }
    }
    get parent() {
        if (this.element.parentElement == null)
            return null;
        return JSFXElement.compile(this.element.parentElement);
    }
    get firstChild() {
        return this.children.get(0);
    }
    attr(attribute, value) {
        if (value == null)
            return this.element.getAttribute(attribute);
        this.element.setAttribute(attribute, value.toString());
        return value.toString();
    }
    removeAttr(attribute) {
        this.element.removeAttribute(attribute);
    }
    add(child) {
        this.children.push(child);
        this.element.appendChild(child.element);
    }
    contains(child) {
        return this.element.contains(child.element);
    }
    remove(oldChild) {
        if (arguments.length === 0) {
            if (this.element.parentElement != null && this.element.parentElement.contains(this.element))
                this.element.parentElement.removeChild(this.element);
        }
        else {
            if (this.element.contains(oldChild.element)) {
                this.element.removeChild(oldChild.element);
                let index = this.children.indexOf(oldChild);
                this.children.splice(index);
            }
        }
    }
    replaceChild(newChild, oldChild) {
        this.element.replaceChild(newChild.element, oldChild.element);
    }
    find(filter, deep = -1) {
        let results = [];
        if (filter(this))
            results.push(this);
        if (deep == false || deep == 0)
            return results;
        deep--;
        this.children.forEach(child => {
            results = results.concat(child.find(filter, deep));
        });
        return results;
    }
    clear() {
        let child = null;
        while (this.firstChild) {
            if (child === this.firstChild)
                throw new Error("error while removing. last removed element is same as removed before");
            child = this.firstChild;
            this.remove(child);
        }
    }
    click() {
        return this.element.click();
    }
    data(name, value) {
        if (arguments.length == 1)
            return Data_js_1.default.get(this.element, name);
        else
            Data_js_1.default.set(this.element, name, value);
    }
    hasClass(clazz) {
        return this.element.classList.contains(clazz);
    }
    css(name, value) {
        if (Object.getPrototypeOf(name) == Object.prototype) {
            for (let key in name)
                if (name.hasOwnProperty(key))
                    Style_js_1.default.style(this.element, key, name[key]);
            return;
        }
        return value !== undefined ?
            Style_js_1.default.style(this.element, name, value) :
            Style_js_1.default.css(this.element, name);
    }
    on(type, listener, options) {
        const types = (type || "").match(rnothtmlwhite) || [""];
        types.forEach(type => {
            const tmp = rtypenamespace.exec(type) || [];
            type = tmp[1];
            const namespaces = (tmp[2] || "").split(".").sort();
            let listeners = this.listeners.get(type);
            if (listeners == null)
                this.listeners.set(type, listeners = []);
            listeners.push({
                namespaces,
                type,
                listener
            });
            this.element.addEventListener(type, listener, options);
        });
    }
    off(type) {
        const types = (type || "").match(rnothtmlwhite) || [""];
        types.forEach(type => {
            const tmp = rtypenamespace.exec(type) || [];
            type = tmp[1];
            const namespaces = (tmp[2] || "").split(".").sort();
            // Unbind all events (on this namespace, if provided) for the element
            if (!type) {
                this.listeners.forEach((list, key) => {
                    list.forEach(entry => {
                        if (entry.namespaces.toString() == namespaces.toString())
                            this.element.removeEventListener(key, entry.listener);
                    });
                });
                return;
            }
            const listenersForType = this.listeners.get(type);
            if (listenersForType == null)
                return;
            listenersForType.forEach((handle, index) => {
                if (handle.namespaces.toString() == namespaces.toString()) {
                    listenersForType.splice(index, 1);
                    this.element.removeEventListener(handle.type, handle.listener);
                }
            });
        });
    }
    trigger(type) {
        this.element.dispatchEvent(new Event(type));
    }
    show() {
        this.css("display", "block");
    }
    hide() {
        this.css("display", "none");
    }
    static forEachPrototype(container, callback) {
        let constructor = container;
        let stackOverFlowPrevention = 10;
        do {
            constructor = Object.getPrototypeOf(constructor);
            callback(constructor);
            stackOverFlowPrevention--;
        } while (stackOverFlowPrevention > 0 && constructor.constructor.name !== "JSFXElement");
    }
    static compile(element) {
        let xElement = nodeMap.get(element);
        if (xElement != null)
            return xElement;
        const clazz = JSFXNode_js_1.default.get(element.localName);
        const compiled = new clazz(element);
        this.provideDefaults(compiled, element);
        for (let index = 0; index < element.children.length; index++)
            compiled.children.value.push(this.compile(element.children[index]));
        return compiled;
    }
    static provideDefaults(container, element) {
        this.forEachPrototype(container, constructor => {
            const properties = JSFXProperty_js_1.default.get(constructor.constructor.name);
            if (properties != null) {
                properties.forEach(property => {
                    property.intercept(container[property.propertyKey], element[property.name]);
                });
            }
        });
    }
}
__decorate([
    JSFXProperty_js_1.default("classList", false, JSFXProperty_js_1.default.ARRAY)
], JSFXElement.prototype, "classes", void 0);
__decorate([
    JSFXProperty_js_1.default("id")
], JSFXElement.prototype, "id", void 0);
__decorate([
    JSFXProperty_js_1.default("disabled")
], JSFXElement.prototype, "disabled", void 0);
__decorate([
    JSFXProperty_js_1.default("innerText")
], JSFXElement.prototype, "text", void 0);
__decorate([
    JSFXProperty_js_1.default("innerHTML")
], JSFXElement.prototype, "html", void 0);
__decorate([
    JSFXProperty_js_1.default("clientHeight", false)
], JSFXElement.prototype, "clientHeight", void 0);
__decorate([
    JSFXProperty_js_1.default("clientWidth", false)
], JSFXElement.prototype, "clientWidth", void 0);
__decorate([
    JSFXProperty_js_1.default("clientLeft", false)
], JSFXElement.prototype, "clientLeft", void 0);
__decorate([
    JSFXProperty_js_1.default("scrollTop", false)
], JSFXElement.prototype, "scrollTop", void 0);
__decorate([
    JSFXProperty_js_1.default("scrollLeft", false)
], JSFXElement.prototype, "scrollLeft", void 0);
__decorate([
    JSFXProperty_js_1.default("onClick")
], JSFXElement.prototype, "onClick", void 0);
exports.default = JSFXElement;
