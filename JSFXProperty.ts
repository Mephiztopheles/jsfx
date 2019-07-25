import Property from "@mephiztopheles/properties/Property.js";
import ArrayProperty from "@mephiztopheles/properties/properties/ArrayProperty.js";
import BooleanProperty from "@mephiztopheles/properties/properties/BooleanProperty.js";


const properties = {};

export default function JSFXProperty (name: string, updateOnChange = true, intercept = JSFXProperty.DEFAULT ) {

    return function ( target, propertyKey: string ) {

        let p = properties[ target.constructor.name ];

        if ( p == null )
            p = properties[ target.constructor.name ] = [];

        p.push( { propertyKey, name, intercept, updateOnChange } );
    }
}

JSFXProperty.get = function (name: string ) {
    return properties[ name ];
};

JSFXProperty.DEFAULT = function (property: Property<any>, value: any ) {
    property.value = value;
};

JSFXProperty.ARRAY = function (property: ArrayProperty<any>, value: any[] ) {

    const newValue = [];

    for ( let i = 0; i < value.length; i++ )
        newValue.push( value[ i ] );

    property.value = newValue;
};

JSFXProperty.EXISTING = function (property: BooleanProperty, value: any ) {
    property.value = value != null;
};