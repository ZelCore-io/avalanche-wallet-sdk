"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const constants_1 = require("@/Network/constants");
const setNetwork_1 = require("@/Network/setNetwork");
tslib_1.__exportStar(require("./helpers"), exports);
tslib_1.__exportStar(require("./providers"), exports);
tslib_1.__exportStar(require("./constants"), exports);
tslib_1.__exportStar(require("./network"), exports);
tslib_1.__exportStar(require("./setNetwork"), exports);
tslib_1.__exportStar(require("./types"), exports);
tslib_1.__exportStar(require("./utils"), exports);
tslib_1.__exportStar(require("./getEthersProvider"), exports);
// Default connection is Mainnet
(0, setNetwork_1.setNetwork)(constants_1.MainnetConfig);
//# sourceMappingURL=index.js.map