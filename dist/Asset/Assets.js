"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAssetDescription = exports.getAssetDescriptionSync = void 0;
const tslib_1 = require("tslib");
const network_1 = require("../Network/network");
const xss_1 = tslib_1.__importDefault(require("xss"));
let assetCache = {};
function getAssetDescriptionSync(assetId) {
    if (typeof assetCache[assetId] === 'undefined')
        throw new Error(`Asset ID ${assetId} is not known.`);
    return assetCache[assetId];
}
exports.getAssetDescriptionSync = getAssetDescriptionSync;
/**
 * Uses the node api to get meta data given an asset ID. Saves the result to cache.
 * @param assetId
 */
async function getAssetDescription(assetId) {
    let cache = assetCache[assetId];
    if (cache) {
        return cache;
    }
    try {
        let res = await network_1.xChain.getAssetDescription(assetId);
        let clean = {
            ...res,
            assetID: assetId,
            name: (0, xss_1.default)(res.name),
            symbol: (0, xss_1.default)(res.symbol),
        };
        assetCache[assetId] = clean;
        return clean;
    }
    catch (e) {
        throw new Error(`Asset ${assetId} does not exist.`);
    }
}
exports.getAssetDescription = getAssetDescription;
//# sourceMappingURL=Assets.js.map