import * as ts from "../../transforms.mjs";

class TestTransform extends ts.SdkTransform {
    getContractJson() {
        return "./test/examples/testContract.json";
    }
}

export default TestTransform