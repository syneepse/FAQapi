import mongoose from "mongoose";
import FAQ from "./schema";
import * as http from "http";
import express, { Request, Response } from 'express';

const app = express();
const port = 8000;


mongoose.connect("mongodb://127.0.0.1:27017/faq");

interface translationBody {
  question: string;
  answer: string;
  lang: string;
  question_translated?: string;
  answer_translated?: string;
  error?: string;
}

const createFAQ = async () => {
  const newFAQ = new FAQ({
    question1: "What is Node.js?",
    answer1:
      "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine.",
    lang: "en",
  });

  await newFAQ.save();
  console.log("FAQ created successfully!");
};
const getTranslatedFAQ = async (languageCode: string = "en") => {
  let faq = await FAQ.findOne({ lang: languageCode }).then((faq) => {
    if (!faq) {
      const faq_str = JSON.stringify({
        "question": "hello mr BR",
        "answer": "my name is hello",
        "lang": languageCode,
      });
      const options = {
        hostname: "127.0.0.1",
        port: 8000,
        path: "/",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(faq_str),
        },
      };

      const req = http.request(options, (res) => {
        console.log(`statusCode: ${res.statusCode}`);
        console.log(`headers: ${JSON.stringify(res.headers)}`);
        res.setEncoding("utf8");

        let ans = "";
        res.on("data", (d) => {
          //process.stdout.write(d);
          ans += d;
        });
        res.on("end", () => {
          //console.log(JSON.parse(ans));
          faq = new FAQ();
          let responseAns: translationBody = JSON.parse(ans);
          if (
            responseAns.error || responseAns.answer_translated === undefined
          ) {
            console.log(responseAns.error);
            //return;
          }
          else{
            faq.question1 = responseAns.question_translated
              ? responseAns.question_translated
              : responseAns.question;
            faq.answer1 = responseAns.answer_translated
              ? responseAns.answer_translated
              : responseAns.answer;
            faq.lang = responseAns.lang;
            req.end();
            console.log(faq);
            FAQ.create(faq).then(() => {
              console.log("FAQ created successfully!");
            });
          }
        });
      });
      req.write(faq_str);
    } else {
      console.log(faq);
    }
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

// HTTP Server using express

app.get('/', (req, res) => {
  res.json('Hello World');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});