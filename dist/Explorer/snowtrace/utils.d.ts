import { SnowtraceErc20Tx, SnowtraceNormalTx } from '../../Explorer';
/**
 * Filter duplicate Snowtrace transactions
 * @param txs
 */
export declare function filterDuplicateTransactions<Tx extends SnowtraceErc20Tx | SnowtraceNormalTx>(txs: Tx[]): Tx[];
//# sourceMappingURL=utils.d.ts.map