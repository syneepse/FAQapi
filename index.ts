import mongoose from 'mongoose';
import FAQ from "./schema";

mongoose.connect("mongodb://127.0.0.1:27017/faq");

const createFAQ = async () => {
    const newFAQ = new FAQ({
      question: 'What is Node.js?',
      answer: 'Node.js is a JavaScript runtime built on Chrome\'s V8 JavaScript engine.',
      translations: {
        hi: { // Hindi translation
          question: 'Node.js क्या है?',
          answer: 'Node.js Chrome के V8 JavaScript इंजन पर बना एक JavaScript रनटाइम है।',
        },
        bn: { // Bengali translation
          question: 'Node.js কি?',
          answer: 'Node.js হল Chrome-এর V8 JavaScript ইঞ্জিনে তৈরি একটি JavaScript রানটাইম।',
        },
        // Add more languages dynamically
      },
    });
  
    await newFAQ.save();
    console.log('FAQ created successfully!');
  };
  const getTranslatedFAQ = async (languageCode?: string) => {
    const faq = await FAQ.findOne({ question: 'What is Node.js?' });
    if (faq) {
      const translatedText = faq.getTranslatedAnswer(languageCode);
      console.log('Translated FAQ:', translatedText);
    } else {
      console.log('FAQ not found.');
    }
  };
  
  // Run the functions
  (async () => {
    await createFAQ();
    await getTranslatedFAQ('hi'); // Get Hindi translation
    await getTranslatedFAQ('bn'); // Get Bengali translation
    await getTranslatedFAQ('fr');
    await getTranslatedFAQ(); // Fallback to default text (no French translation)
  })();

