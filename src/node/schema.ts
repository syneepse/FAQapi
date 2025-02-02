import mongoose, { Schema, Document, Model } from 'mongoose';

interface IFAQ extends Document {
    lang: string;
    question1: string;
    answer1: string;
    //getTranslatedAnswer: () => { question: string, answer: string };
}

const FAQSchema: Schema<IFAQ> = new Schema({
    question1: { type: String, required: true },
    answer1: { type: String, required: true },
    lang: { type: String, required: true },
    //translations: { type: Map, of: new Schema({ question: String, answer: String }), default: {}, },
});



const FAQ: Model<IFAQ> = mongoose.model('FAQ', FAQSchema);

export default FAQ;

