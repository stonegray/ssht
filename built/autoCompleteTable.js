"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var enquirer_1 = require("enquirer");
var highlight = function (input, color) {
    var val = input.toLowerCase();
    return function (str) {
        var s = str.toLowerCase();
        var i = s.indexOf(val);
        var colored = color(str.slice(i, i + val.length));
        return str.slice(0, i) + colored + str.slice(i + val.length);
    };
};
var AutoCompleteTable = (function (_super) {
    __extends(AutoCompleteTable, _super);
    function AutoCompleteTable(options) {
        var _this = _super.call(this, options) || this;
        _this.cursorShow();
        return _this;
    }
    AutoCompleteTable.prototype.moveCursor = function (n) {
        this.state.cursor += n;
    };
    AutoCompleteTable.prototype.dispatch = function (ch) {
        return this.append(ch);
    };
    AutoCompleteTable.prototype.altSpace = function (ch) {
        return this.options.multiple ? _super.prototype.space.call(this, ch) : this.alert();
    };
    AutoCompleteTable.prototype.space = function (ch) {
        return this.options.multiple ? _super.prototype.space.call(this, ch) : this.append(ch);
    };
    AutoCompleteTable.prototype.append = function (ch) {
        var _a = this.state, cursor = _a.cursor, input = _a.input;
        this.input = input.slice(0, cursor) + ch + input.slice(cursor);
        this.moveCursor(1);
        return this.complete();
    };
    AutoCompleteTable.prototype["delete"] = function () {
        var _a = this.state, cursor = _a.cursor, input = _a.input;
        if (!input)
            return this.alert();
        this.input = input.slice(0, cursor - 1) + input.slice(cursor);
        this.moveCursor(-1);
        return this.complete();
    };
    AutoCompleteTable.prototype.deleteForward = function () {
        var _a = this.state, cursor = _a.cursor, input = _a.input;
        if (input[cursor] === void 0)
            return this.alert();
        this.input = ("" + input).slice(0, cursor) + ("" + input).slice(cursor + 1);
        return this.complete();
    };
    AutoCompleteTable.prototype.complete = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.completing = true;
                        _a = this;
                        return [4, this.suggest(this.input, this.state._choices)];
                    case 1:
                        _a.choices = _b.sent();
                        this.state.limit = void 0;
                        this.index = Math.min(Math.max(this.visible.length - 1, 0), this.index);
                        return [4, this.render()];
                    case 2:
                        _b.sent();
                        this.completing = false;
                        return [2];
                }
            });
        });
    };
    AutoCompleteTable.prototype.suggest = function (input, choices) {
        if (input === void 0) { input = this.input; }
        if (choices === void 0) { choices = this.state._choices; }
        if (typeof this.options.suggest === "function") {
            return this.options.suggest.call(this, input, choices);
        }
        var str = input.toLowerCase();
        return choices.filter(function (ch) { return ch.message.toLowerCase().includes(str); });
    };
    AutoCompleteTable.prototype.pointer = function () {
        return "";
    };
    AutoCompleteTable.prototype.format = function () {
        var _this = this;
        if (!this.focused)
            return this.input;
        if (this.options.multiple && this.state.submitted) {
            return this.selected
                .map(function (ch) { return _this.styles.primary(ch.message); })
                .join(", ");
        }
        if (this.state.submitted) {
            var value = (this.value = this.input = this.focused.value);
            return this.styles.primary(value);
        }
        return this.input;
    };
    AutoCompleteTable.prototype.render = function () {
        return __awaiter(this, void 0, void 0, function () {
            var style, choices, color;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.state.status !== "pending")
                            return [2, _super.prototype.render.call(this)];
                        style = this.options.highlight
                            ? this.options.highlight.bind(this)
                            : this.styles.placeholder;
                        choices = this.choices;
                        color = highlight(this.input, style);
                        this.choices = choices.map(function (choice) {
                            if (_this.isDisabled(choice))
                                return choice;
                            return __assign({}, choice, { message: color(choice.message) });
                        });
                        return [4, _super.prototype.render.call(this)];
                    case 1:
                        _a.sent();
                        this.choices = choices;
                        return [2];
                }
            });
        });
    };
    AutoCompleteTable.prototype.submit = function () {
        if (this.options.multiple) {
            this.value = this.selected.map(function (ch) { return ch.name; });
        }
        return _super.prototype.submit.call(this);
    };
    return AutoCompleteTable;
}(enquirer_1.Select));
exports.AutoCompleteTable = AutoCompleteTable;
//# sourceMappingURL=autoCompleteTable.js.map