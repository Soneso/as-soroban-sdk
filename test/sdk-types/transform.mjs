import * as ts from "../../transforms.mjs";

class TestTransform extends ts.SdkTransform {
    getContractJson() {
        return "./test/sdk-types/testContract.json";
    }
}

export default TestTransform