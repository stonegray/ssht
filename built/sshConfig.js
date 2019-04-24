"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var ssh_config_1 = require("ssh-config");
var fs = require("fs");
var path = require("path");
var os = require("os");
os;
var SSHFieldType;
(function (SSHFieldType) {
    SSHFieldType[SSHFieldType["Data"] = 1] = "Data";
    SSHFieldType[SSHFieldType["UserComment"] = 2] = "UserComment";
})(SSHFieldType || (SSHFieldType = {}));
var dshosts = [];
function getFile(callback) {
    var homedir = require("os").homedir();
    var p = path.resolve(homedir, ".ssh/config");
    fs.readFile(p, function (err, buf) {
        callback(err, buf.toString());
    });
}
function humanizeLocation(cfg) {
    return cfg.param;
}
function parseHostOptions(o) {
    var info = {};
    if (typeof o.config === typeof []) {
        o.config.forEach(function (cf) {
            if (typeof cf.param !== "string")
                return;
            cf.param = cf.param.toLowerCase();
            if (cf.param == "include") {
                console.warn("WARN: Not following Include statement.");
            }
            if (cf.param == "proxycommand") {
                console.warn("WARN: ProxyCommand is unsupported; host most may appear offline");
            }
            else if (cf.param == "proxyjump") {
                console.warn("WARN: ProxyJump is unsupported; host most may appear offline");
            }
            if (cf.param == "stricthostkeychecking")
                info.shkc = cf.value;
            if (cf.param == "hostname")
                info.host = cf.value;
            if (cf.param == "user")
                info.user = cf.value;
            if (cf.param == "port")
                info.port = cf.value;
            if (cf.param == "addressfamily")
                info.family = cf.family;
            return;
        });
    }
    else {
        console.warn("WARN: Recieved otherwise valid object without any data.");
    }
    return info;
}
function _getHosts(callback) {
    getFile(function (err, buf) {
        if (err) {
            callback(err, undefined);
            return;
        }
        var cfg;
        cfg = ssh_config_1.parse(buf);
        var hosts = [];
        cfg.forEach(function (o) {
            if (o.type == SSHFieldType.UserComment)
                return;
            if (o.param !== "Host")
                return;
            if (/[!\*?]/.test(o.value))
                return;
            var info = parseHostOptions(o);
            if (typeof info.host !== "string") {
                info.fqdn = o.value;
            }
            else {
                info.fqdn = info.host;
            }
            var sshCommand = o.value;
            if (typeof info.user !== "undefined") {
                sshCommand = info.user + "@" + sshCommand;
            }
            dshosts.push({
                name: o.value,
                fqdn: info.fqdn,
                username: info.user,
                port: info.port,
                kind: "sshconfig",
                ssh: sshCommand,
                family: info.family
            });
        });
        callback(false, dshosts);
    });
}
exports.getSshHosts = function () {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, new Promise(function (resolve, reject) {
                        _getHosts(function (err, obj) {
                            if (err)
                                reject(err);
                            resolve(obj);
                        });
                    })];
                case 1: return [2, _a.sent()];
            }
        });
    });
};
//# sourceMappingURL=sshConfig.js.map