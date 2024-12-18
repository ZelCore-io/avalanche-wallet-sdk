"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpClient = void 0;
class HttpClient {
    baseURL;
    TIMEOUT = 10000;
    constructor(baseURL) {
        this.baseURL = baseURL;
    }
    get(path, params) {
        const query = params && new URLSearchParams(params);
        path = query ? `${path}?${query.toString()}` : path;
        const url = `${this.baseURL}/${path}`;
        const options = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        };
        return this.handleResponse(this.fetchWithTimeout(url, options));
    }
    post(path, data) {
        const url = `${this.baseURL}/${path}`;
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        };
        return this.handleResponse(this.fetchWithTimeout(url, options));
    }
    async handleResponse(responsePromise) {
        const response = await responsePromise;
        if (response.ok) {
            return await response.json();
        }
        else {
            const errorMessage = await response.text();
            return Promise.reject(new Error(errorMessage));
        }
    }
    async fetchWithTimeout(input, options = {}) {
        const { timeout = this.TIMEOUT } = options;
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        const response = await fetch(input, {
            ...options,
            signal: controller.signal,
        });
        clearTimeout(id);
        return response;
    }
}
exports.HttpClient = HttpClient;
//# sourceMappingURL=http_client.js.map