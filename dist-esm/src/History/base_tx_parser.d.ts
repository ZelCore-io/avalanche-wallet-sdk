import { iHistoryBaseTx } from '@/History';
import { OrteliusAvalancheTx } from '@/Explorer';
export declare function getBaseTxSummary(tx: OrteliusAvalancheTx, ownerAddrs: string[]): Promise<iHistoryBaseTx>;
