export default function ajax( config ): any {

    var request = new XMLHttpRequest();

    return new Promise( ( resolve, reject ) => {

        request.onreadystatechange = ev => {
            console.log( ev );
        };
        request.open( "GET", config.url );
    } );
}