import StringProperty from "../../properties/properties/StringProperty.js";
import FormElement    from "./FormElement.js";
import JSFXProperty    from "../../JSFXProperty.js";

export default abstract class Input<V> extends FormElement {

    protected element: HTMLInputElement;

    @JSFXProperty( "value" )
    protected value: StringProperty = new StringProperty();

    constructor ( element?: HTMLInputElement ) {

        super( element );

        this.element.addEventListener( "input", e => {
            this.value.value = this.element.value;
        } );

        this.applyListeners();
    }

    public getTagName (): string {
        return "input";
    }
}