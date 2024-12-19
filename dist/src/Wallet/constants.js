"use strict";
// HD WALLET
// m / purpose' / coin_type' / account' / change / address_index
Object.defineProperty(exports, "__esModule", { value: true });
exports.DERIVATION_SLEEP_INTERVAL = exports.MIN_EVM_SUPPORT_V = exports.LEDGER_EXCHANGE_TIMEOUT = exports.SCAN_RANGE = exports.HD_SCAN_LOOK_UP_WINDOW = exports.SCAN_SIZE = exports.HD_SCAN_GAP_SIZE = exports.LEDGER_ETH_ACCOUNT_PATH = exports.ETH_ACCOUNT_PATH = exports.AVAX_ACCOUNT_PATH = exports.AVAX_TOKEN_PATH = exports.AVAX_TOKEN_INDEX = void 0;
exports.AVAX_TOKEN_INDEX = '9000';
exports.AVAX_TOKEN_PATH = `m/44'/${exports.AVAX_TOKEN_INDEX}'`;
exports.AVAX_ACCOUNT_PATH = `m/44'/${exports.AVAX_TOKEN_INDEX}'/0'`; // Change and index left out
exports.ETH_ACCOUNT_PATH = `m/44'/60'/0'`;
exports.LEDGER_ETH_ACCOUNT_PATH = exports.ETH_ACCOUNT_PATH + '/0/0';
exports.HD_SCAN_GAP_SIZE = 20; // a gap of at least 20 indexes is needed to claim an index unused
exports.SCAN_SIZE = 70; // the total number of utxos to look at initially to calculate last index
exports.HD_SCAN_LOOK_UP_WINDOW = 64; // Number of addresses to check with the explorer at a single call
exports.SCAN_RANGE = exports.SCAN_SIZE - exports.HD_SCAN_GAP_SIZE; // How many items are actually scanned
exports.LEDGER_EXCHANGE_TIMEOUT = 90_000;
exports.MIN_EVM_SUPPORT_V = '0.5.3';
/**
 * In order to free the thread when deriving addresses, the execution will sleep every N address derived
 */
exports.DERIVATION_SLEEP_INTERVAL = 200;
//# sourceMappingURL=constants.js.map