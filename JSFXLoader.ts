import JSFXElement from "./JSFXElement.js";
import ajax from "./helper/ajax.js";

export class JSFXLoader {

    public static async load<T extends JSFXElement> (url: string ) {

        const response = await ajax( { url } );
        return this.convert( response );
    }

    public static convert<T extends JSFXElement> (innerHTML: string ) {

        const el     = document.createElement( "div" );
        el.innerHTML = innerHTML;

        return this.compile( el );
    }

    public static compile<T extends JSFXElement> (element: Element ): T {

        // @ts-ignore same package
        return JSFXElement.compile( element );
    }
}