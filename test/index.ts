import TestCase, {test} from "@mephiztopheles/test/TestCase.js";
import Div from "../elements/Div.js";

class Test extends TestCase {

    @test
    test() {
        console.log("run");

        const div = new Div(document.createElement("div"));

        div.onClick.value = event => console.log(event);
        console.log(div.onClick.value);

        console.log(div.click());
    }
}


new Test().run();