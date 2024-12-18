import { iHistoryImportExport } from '@/History/types';
import { OrteliusAvalancheTx } from '@/Explorer';
export declare function getImportSummary(tx: OrteliusAvalancheTx, addresses: string[], evmAddr: string): iHistoryImportExport;
export declare function getExportSummary(tx: OrteliusAvalancheTx, addresses: string[]): iHistoryImportExport;
