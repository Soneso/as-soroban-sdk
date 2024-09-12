import * as ts from "../../transforms.mjs";

class TestTransform extends ts.SdkTransform {
    getContractJson() {
        return "./test/i128-arithm/testContract.json";
    }
}

export default TestTransform