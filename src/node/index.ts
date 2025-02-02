// import mongoose from "mongoose";
//import FAQ from "./schema.ts";
import * as http from "http";
import express, { Request, Response, NextFunction } from 'express';
import { default as Redis } from "ioredis"
// import FAQ from "./schema.ts";

const redis = new Redis.default({
  host: 'redis',
  port: 6379,
})

const app = express();
const port = 3000;



interface translationBody {
  question: string;
  answer: string;
  lang: string;
  question_translated?: string;
  answer_translated?: string;
  error?: string;
}

interface IFAQ {
    lang: string;
    question1: string;
    answer1: string;
    //getTranslatedAnswer: () => { question: string, answer: string };
}


const getTranslatedFAQ = async (languageCode: string = "en", callback: Function) => {
      let faq: IFAQ = { lang: "", question1: "", answer1: "" };

      const faq_str = JSON.stringify({
        "question": "What is the capital of France?",
        "answer": "Paris is the capital of France.",
        "lang": languageCode,
      });
      const options = {
        hostname: "translation_server",
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
            callback(faq);
          }
        });
      });
      req.write(faq_str);
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
    q = "en";
  }

  const cachedData = await redis.get(q);

  if(cachedData){
    console.log("cache in use");
    res.json(cachedData);
  }
  else{
    console.log("cache not in use");
    next();
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

