import * as ts from "../../transforms.mjs";

class TestTransform extends ts.SdkTransform {
    getContractJson() {
        return "./test/u128-arithm/testContract.json";
    }
}

export default TestTransform