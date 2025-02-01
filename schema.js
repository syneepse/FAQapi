"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var FAQSchema = new mongoose_1.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
    translations: { type: Map, of: new mongoose_1.Schema({ question: String, answer: String }), default: {}, },
});
FAQSchema.methods.getTranslatedAnswer = function (lang) {
    if (!lang) {
        return { question: this.question, answer: this.answer };
    }
    var translation = this.translations.get(lang);
    return translation ? translation : { question: this.question, answer: this.answer };
};
var FAQ = mongoose_1.default.model('FAQ', FAQSchema);
exports.default = FAQ;
