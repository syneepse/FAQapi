"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var FAQSchema = new mongoose_1.Schema({
    question1: { type: String, required: true },
    answer1: { type: String, required: true },
    lang: { type: String, required: true },
    //translations: { type: Map, of: new Schema({ question: String, answer: String }), default: {}, },
});
var FAQ = mongoose_1.default.model('FAQ', FAQSchema);
exports.default = FAQ;
