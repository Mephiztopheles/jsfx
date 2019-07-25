var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import JSFXProperty from "./JSFXProperty.js";
import JSFXNode from "./JSFXNode.js";
import ArrayProperty from "@mephiztopheles/properties/properties/ArrayProperty.js";
import StringProperty from "@mephiztopheles/properties/properties/StringProperty.js";
import BooleanProperty from "@mephiztopheles/properties/properties/BooleanProperty.js";
import NumberProperty from "@mephiztopheles/properties/properties/NumberProperty.js";
import ObjectProperty from "@mephiztopheles/properties/properties/ObjectProperty.js";
import Style from "./helper/Style.js";
import Data from "./helper/Data.js";
const nodeMap = new WeakMap();
const rnothtmlwhite = (/[^\x20\t\r\n\f]+/g), rtypenamespace = /^([^.]*)(?:\.(.+)|)/;
export default class JSFXElement {
    constructor(element) {
        this.children = new ArrayProperty();
        this.classes = new ArrayProperty();
        this.id = new StringProperty();
        this.disabled = new BooleanProperty();
        this.text = new StringProperty();
        this.html = new StringProperty();
        this.clientHeight = new NumberProperty();
        this.clientWidth = new NumberProperty();
        this.clientLeft = new NumberProperty();
        this.scrollTop = new NumberProperty();
        this.scrollLeft = new NumberProperty();
        this.onClick = new ObjectProperty();
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
                const properties = JSFXProperty.get(constructor.constructor.name);
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
        const properties = JSFXProperty.get(this.constructor.name);
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
            return Data.get(this.element, name);
        else
            Data.set(this.element, name, value);
    }
    hasClass(clazz) {
        return this.element.classList.contains(clazz);
    }
    css(name, value) {
        if (Object.getPrototypeOf(name) == Object.prototype) {
            for (let key in name)
                if (name.hasOwnProperty(key))
                    Style.style(this.element, key, name[key]);
            return;
        }
        return value !== undefined ?
            Style.style(this.element, name, value) :
            Style.css(this.element, name);
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
        const clazz = JSFXNode.get(element.localName);
        const compiled = new clazz(element);
        this.provideDefaults(compiled, element);
        for (let index = 0; index < element.children.length; index++)
            compiled.children.value.push(this.compile(element.children[index]));
        return compiled;
    }
    static provideDefaults(container, element) {
        this.forEachPrototype(container, constructor => {
            const properties = JSFXProperty.get(constructor.constructor.name);
            if (properties != null) {
                properties.forEach(property => {
                    property.intercept(container[property.propertyKey], element[property.name]);
                });
            }
        });
    }
}
__decorate([
    JSFXProperty("classList", false, JSFXProperty.ARRAY)
], JSFXElement.prototype, "classes", void 0);
__decorate([
    JSFXProperty("id")
], JSFXElement.prototype, "id", void 0);
__decorate([
    JSFXProperty("disabled")
], JSFXElement.prototype, "disabled", void 0);
__decorate([
    JSFXProperty("innerText")
], JSFXElement.prototype, "text", void 0);
__decorate([
    JSFXProperty("innerHTML")
], JSFXElement.prototype, "html", void 0);
__decorate([
    JSFXProperty("clientHeight", false)
], JSFXElement.prototype, "clientHeight", void 0);
__decorate([
    JSFXProperty("clientWidth", false)
], JSFXElement.prototype, "clientWidth", void 0);
__decorate([
    JSFXProperty("clientLeft", false)
], JSFXElement.prototype, "clientLeft", void 0);
__decorate([
    JSFXProperty("scrollTop", false)
], JSFXElement.prototype, "scrollTop", void 0);
__decorate([
    JSFXProperty("scrollLeft", false)
], JSFXElement.prototype, "scrollLeft", void 0);
__decorate([
    JSFXProperty("onClick")
], JSFXElement.prototype, "onClick", void 0);
