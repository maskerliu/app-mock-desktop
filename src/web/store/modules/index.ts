import { ModuleTree } from "vuex";

import ProxyRecords from "../../../common/store/ProxyRecords"
import MockRules from "../../../common/store/MockRules"

const files = require["context"](".", false, /\.ts$/);
const modules: ModuleTree<any> = {};

files.keys().forEach((key: string) => {
  if (key === "./index.ts") return;
  modules[key.replace(/(\.\/|\.ts)/g, "")] = files(key).default;
});

modules["ProxyRecords"] = ProxyRecords;
modules["MockRules"] = MockRules;

export default modules;
