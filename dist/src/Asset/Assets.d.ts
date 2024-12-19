import { iAssetDescriptionClean } from '@/Asset/types';
export declare function getAssetDescriptionSync(assetId: string): iAssetDescriptionClean;
/**
 * Uses the node api to get meta data given an asset ID. Saves the result to cache.
 * @param assetId
 */
export declare function getAssetDescription(assetId: string): Promise<iAssetDescriptionClean>;
//# sourceMappingURL=Assets.d.ts.map