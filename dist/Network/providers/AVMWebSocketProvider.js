"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AVMWebSocketProvider = void 0;
const tslib_1 = require("tslib");
const sockette_1 = tslib_1.__importDefault(require("sockette"));
const avalanchejs_1 = require("@avalabs/avalanchejs");
const FILTER_ADDRESS_SIZE = 1000;
class AVMWebSocketProvider {
    isConnected = false;
    socket;
    wallets = [];
    boundHandler;
    constructor(wsUrl) {
        this.boundHandler = () => this.onWalletAddressChange();
        this.socket = new sockette_1.default(wsUrl, {
            onopen: () => {
                this.onOpen();
            },
            onclose: () => {
                this.onClose();
            },
            onmessage: () => {
                this.onMessage();
            },
            onerror: () => {
                this.onError();
            },
        });
    }
    /**
     * Starts watching for transactions on this wallet.
     * @param wallet The wallet instance to track
     */
    trackWallet(wallet) {
        if (this.wallets.includes(wallet)) {
            return;
        }
        this.wallets.push(wallet);
        wallet.on('addressChanged', this.boundHandler);
        this.updateFilterAddresses();
    }
    onWalletAddressChange() {
        this.updateFilterAddresses();
    }
    removeWallet(w) {
        if (!this.wallets.includes(w)) {
            return;
        }
        let index = this.wallets.indexOf(w);
        this.wallets.splice(index, 1);
        w.off('addressChanged', this.boundHandler);
    }
    setEndpoint(wsUrl) {
        this.socket.close();
        this.socket = new sockette_1.default(wsUrl, {
            onopen: () => {
                this.onOpen();
            },
            onclose: () => {
                this.onClose();
            },
            onmessage: () => {
                this.onMessage();
            },
            onerror: () => {
                this.onError();
            },
        });
    }
    // Clears the filter listening to X chain transactions
    clearFilter() {
        let pubsub = new avalanchejs_1.PubSub();
        let bloom = pubsub.newBloom(FILTER_ADDRESS_SIZE);
        this.socket.send(bloom);
    }
    /**
     * Creates a bloom filter from the addresses of the tracked wallets and subscribes to
     * transactions on the node.
     */
    updateFilterAddresses() {
        if (!this.isConnected) {
            return;
        }
        let wallets = this.wallets;
        let addrs = [];
        for (let i = 0; i < wallets.length; i++) {
            let w = wallets[i];
            let externalAddrs = w.getExternalAddressesXSync();
            let addrsLen = externalAddrs.length;
            let startIndex = Math.max(0, addrsLen - FILTER_ADDRESS_SIZE);
            let addAddrs = externalAddrs.slice(startIndex);
            addrs.push(...addAddrs);
        }
        let pubsub = new avalanchejs_1.PubSub();
        let bloom = pubsub.newBloom(FILTER_ADDRESS_SIZE);
        this.socket.send(bloom);
        // Divide addresses by 100 and send multiple messages
        // There is a max msg size ~10kb
        const GROUP_AMOUNT = 100;
        let index = 0;
        while (index < addrs.length) {
            let chunk = addrs.slice(index, index + GROUP_AMOUNT);
            let addAddrs = pubsub.addAddresses(chunk);
            this.socket.send(addAddrs);
            index += GROUP_AMOUNT;
        }
    }
    updateWalletBalanceX() {
        this.wallets.forEach((w) => {
            w.updateUtxosX();
        });
    }
    onOpen() {
        this.isConnected = true;
        this.updateFilterAddresses();
    }
    onMessage() {
        this.updateWalletBalanceX();
    }
    onClose() {
        this.isConnected = false;
    }
    onError() { }
}
exports.AVMWebSocketProvider = AVMWebSocketProvider;
//# sourceMappingURL=AVMWebSocketProvider.js.map