"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var schema_1 = __importDefault(require("./schema"));
var http = __importStar(require("http"));
var express_1 = __importDefault(require("express"));
var app = (0, express_1.default)();
var port = 8000;
mongoose_1.default.connect("mongodb://127.0.0.1:27017/faq");
var getTranslatedFAQ = function () {
    var args_1 = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args_1[_i] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (languageCode, callback) {
        var faq;
        if (languageCode === void 0) { languageCode = "en"; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, schema_1.default.findOne({ lang: languageCode }).then(function (faq) {
                        if (!faq) {
                            var faq_str = JSON.stringify({
                                "question": "hello mr BR",
                                "answer": "my name is hello",
                                "lang": languageCode,
                            });
                            var options = {
                                hostname: "127.0.0.1",
                                port: 8000,
                                path: "/",
                                method: "GET",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Content-Length": Buffer.byteLength(faq_str),
                                },
                            };
                            var req_1 = http.request(options, function (res) {
                                console.log("statusCode: ".concat(res.statusCode));
                                console.log("headers: ".concat(JSON.stringify(res.headers)));
                                res.setEncoding("utf8");
                                var ans = "";
                                res.on("data", function (d) {
                                    //process.stdout.write(d);
                                    ans += d;
                                });
                                res.on("end", function () {
                                    //console.log(JSON.parse(ans));
                                    faq = new schema_1.default();
                                    var responseAns = JSON.parse(ans);
                                    if (responseAns.error || responseAns.answer_translated === undefined) {
                                        console.log(responseAns.error);
                                        //return;
                                    }
                                    else {
                                        faq.question1 = responseAns.question_translated
                                            ? responseAns.question_translated
                                            : responseAns.question;
                                        faq.answer1 = responseAns.answer_translated
                                            ? responseAns.answer_translated
                                            : responseAns.answer;
                                        faq.lang = responseAns.lang;
                                        req_1.end();
                                        console.log(faq);
                                        schema_1.default.create(faq).then(function () {
                                            console.log("FAQ created successfully!");
                                        });
                                        callback(faq);
                                    }
                                });
                            });
                            req_1.write(faq_str);
                        }
                        else {
                            console.log(faq);
                            callback(faq);
                        }
                    })];
                case 1:
                    faq = _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};
// Run the functions
// (async () => {
//   //await createFAQ();
//   await getTranslatedFAQ("fr").then(async () => {
//     await getTranslatedFAQ("jhgsljkfhgjfdk").then(async () => {
//       await getTranslatedFAQ("fsjskldfjsdlka").then(async () => {
//         await getTranslatedFAQ("hi");
//       }); 
//     });
//   });
//   await getTranslatedFAQ(); // Fallback to default text (no French translation)
// })();
//Middleware to check for caching with Redis
// HTTP Server using express
app.get('/', function (req, res) {
    res.json('Hello World');
});
app.get('/api/faqs/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(req.query.lang);
                return [4 /*yield*/, getTranslatedFAQ(req.query.lang, function (faq) {
                        console.log("response to client : " + faq);
                        res.json(faq);
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
app.listen(port, function () {
    console.log("Server running on port ".concat(port));
});
