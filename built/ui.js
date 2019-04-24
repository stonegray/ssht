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
var _this = this;
exports.__esModule = true;
var chalk_1 = require("chalk");
var prompts = require("prompts");
var hosts_1 = require("./hosts");
function genRow(h) {
    var w = process.stdout.columns;
    var host = h.fqdn;
    var lengthOffset = 0;
    if (typeof h.port !== "undefined") {
        host += chalk_1["default"].gray(":" + h.port);
        lengthOffset -= 10;
    }
    if (typeof h.username !== "undefined") {
        host = chalk_1["default"].gray(h.username + "@") + host;
        lengthOffset -= 10;
    }
    var endText = h.kind;
    var instertAt = function (str, sub, pos) {
        return "" + str.slice(0, pos) + sub + str.slice(pos);
    };
    return instertAt((h.name + " (" + host + ")").padEnd(w + w), endText, w - endText.length - lengthOffset).substring(0, w - lengthOffset);
}
function getChoices(arr) {
    return __awaiter(this, void 0, void 0, function () {
        var ch;
        return __generator(this, function (_a) {
            ch = [];
            arr.forEach(function (h) {
                ch.push({
                    title: genRow(h),
                    value: "" + arr.indexOf(h)
                });
            });
            return [2, ch];
        });
    });
}
var suggestByTitle = function (input, choices) {
    var searches = input.split(" ");
    return Promise.resolve(choices.filter(function (i) {
        var doesMatch = 0;
        searches.forEach(function (s) {
            if (i.title.includes(s))
                doesMatch++;
        });
        return doesMatch >= searches.length;
    }));
};
(function () { return __awaiter(_this, void 0, void 0, function () {
    var arr, availableHosts, response, index, target, cp, childProcess;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, hosts_1.hosts()];
            case 1:
                arr = _a.sent();
                return [4, getChoices(arr)];
            case 2:
                availableHosts = _a.sent();
                return [4, prompts([
                        {
                            type: "autocomplete",
                            name: "index",
                            message: "Select host",
                            suggest: suggestByTitle,
                            choices: availableHosts
                        }
                    ])];
            case 3:
                response = _a.sent();
                index = response.index;
                process.stdout.write("".padEnd(process.stdout.columns));
                process.stdout.write("\x1B[2A");
                process.stdout.write("".padEnd(process.stdout.columns));
                console.log("");
                if (index == null) {
                    console.log(chalk_1["default"].red("Unable to locate host"));
                    return [2];
                }
                target = arr[index.toString()];
                cp = require("child_process");
                childProcess = cp.spawn("ssh", [target.ssh], { stdio: "inherit" });
                return [2];
        }
    });
}); })();
//# sourceMappingURL=ui.js.map