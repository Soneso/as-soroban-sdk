import * as ts from "../../transforms.mjs";

class TestTransform extends ts.SdkTransform {
    getContractJson() {
        return "./test/value-conversion/testContract.json";
    }
}

export default TestTransform