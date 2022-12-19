"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Clients = /** @class */ (function () {
    function Clients() {
        this._clients = [];
        this._clients = [];
    }
    Clients.prototype._debug = function () {
        return;
        console.log("\nclients:", this._clients, "\n");
    };
    Clients.prototype._exists = function (username) {
        var client = this._clients.find(function (c) { return c.username === username; });
        if (client) {
            return client;
        }
        return false;
    };
    Clients.prototype.add = function (client) {
        if (this._exists(client.username)) {
            console.log("❌ client already in queue:", "[@".concat(client.username, "]"));
            return;
        }
        this._clients.push(client);
        console.log("✅ New client added:", "[@".concat(client.username, "]"));
        this._debug();
    };
    Clients.prototype.attachMedia = function (username, media) {
        var client = this._exists(username);
        if (client) {
            client.media = media;
            console.log("✅ media attached to client:", "[@".concat(username, "]"));
            this._debug();
            return;
        }
        console.log("❌ client not in queue:", "[@".concat(username, "]"));
    };
    Clients.prototype.attachOptions = function (username, options) {
        var client = this._exists(username);
        if (client) {
            client.options = options;
            console.log("✅ options attached to client:", "[@".concat(username, "]:"), client.options);
            this._debug();
            return;
        }
        console.log("❌ client not in queue:", "[@".concat(username, "]"));
    };
    Clients.prototype.attachOutputLocation = function (username, outputLocation) {
        var client = this._exists(username);
        if (client) {
            if (client.media) {
                client.media.outputLocation = outputLocation;
                console.log("✅ outputLocation attached to client:", "[@".concat(username, "]"));
                this._debug();
                return;
            }
            console.log("❌ client has no media:", "[@".concat(username, "]"));
            return;
        }
        console.log("❌ client not in queue:", "[@".concat(username, "]"));
    };
    Clients.prototype.get = function (username) {
        var client = this._exists(username);
        if (client) {
            return client;
        }
        console.log("❌ client not in queue:", "[@".concat(username, "]"));
        return null;
    };
    Clients.prototype.remove = function (username) {
        var client = this._exists(username);
        if (client) {
            this._clients = this._clients.filter(function (c) { return c.username !== username; });
            console.log("🫧 client removed from queue", "@[".concat(username, "]"));
            this._debug();
            return client;
        }
        console.log("❌ client not in queue:", "[@".concat(username, "]"));
        return null;
    };
    return Clients;
}());
var clients = new Clients();
exports.default = clients;
