import { iHistoryEVMTx } from '@/History/types';
import { OrteliusEvmTx } from '@/Explorer';
export declare function getTransactionSummaryEVM(tx: OrteliusEvmTx, walletAddress: string): iHistoryEVMTx;
