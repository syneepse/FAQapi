import mongoose, { Schema, Document, Model } from 'mongoose';

interface IFAQ extends Document {
    question: string;
    answer: string;
    translations: {
        [key: string]: {
            question: string;
            answer: string;
        }
    }
    getTranslatedAnswer: (lang?: string) => { question: string, answer: string };
    //getTranslatedAnswer: () => { question: string, answer: string };
}

const FAQSchema: Schema<IFAQ> = new Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
    translations: { type: Map, of: new Schema({ question: String, answer: String }), default: {}, },
});

FAQSchema.methods.getTranslatedAnswer = function (lang?: string) {
    if (!lang) {
        return { question: this.question, answer: this.answer };
    }
    const translation = this.translations.get(lang);
    return translation ? translation : { question: this.question, answer: this.answer };
};


const FAQ: Model<IFAQ> = mongoose.model('FAQ', FAQSchema);

export default FAQ;

