import FormElement from "./FormElement.js";
import JSFXNode     from "../../JSFXNode.js";

@JSFXNode
export default class Button extends FormElement {

    protected element: HTMLButtonElement;

    constructor ( element?: HTMLButtonElement ) {
        super( element );
    }

    public getTagName (): string {
        return "button";
    }
}