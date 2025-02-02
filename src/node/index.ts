import mongoose from "mongoose";
import FAQ from "./schema.ts";
import * as http from "http";
import express, { Request, Response, NextFunction } from 'express';
import { default as Redis } from "ioredis"

const redis = new Redis.default({
  host: '127.0.0.1',
  port: 6379,
})

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

interface IFAQ extends Document {
    lang: string;
    question1: string;
    answer1: string;
    //getTranslatedAnswer: () => { question: string, answer: string };
}


const getTranslatedFAQ = async (languageCode: string = "en", callback: Function) => {
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
            faq.question1 = responseAns.question;
            faq.answer1 = responseAns.answer;
            console.log(responseAns.error);
            callback(faq);
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
            callback(faq);
          }
        });
      });
      req.write(faq_str);
    } else {
      console.log(faq);
      callback(faq);
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

//Middleware to check for caching with Redis
const checkCache = async (req: Request, res: Response, next: NextFunction) => {
  let q = req.query.lang as string;
  if(q === undefined){
    next();
  }
  else{
    const cachedData = await redis.get(q);

    if(cachedData){
      res.json(cachedData);
    }
    else{
      next();
    }
  }

}


// HTTP Server using express

app.get('/', (req, res) => {
  res.json('Hello World');
});

app.get('/api/faqs/',checkCache, async (req: Request, res : Response) => {
  console.log(req.query.lang);
  await getTranslatedFAQ(req.query.lang as string, async (faq: IFAQ) => {
    console.log("response to client : " + faq);
    const dataToCache = faq;
    await redis.set(faq.lang as string, JSON.stringify(dataToCache), 'EX', 3600);
    res.json(faq);
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

