var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from "mongoose";
import FAQ from "./schema.ts";
import * as http from "http";
import express from 'express';
const app = express();
const port = 8000;
mongoose.connect("mongodb://127.0.0.1:27017/faq");
const getTranslatedFAQ = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (languageCode = "en", callback) {
    let faq = yield FAQ.findOne({ lang: languageCode }).then((faq) => {
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
                    let responseAns = JSON.parse(ans);
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
        }
        else {
            console.log(faq);
            callback(faq);
        }
    });
});
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
app.get('/', (req, res) => {
    res.json('Hello World');
});
app.get('/api/faqs/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.query.lang);
    let reqlangCode = new String(req.query.lang);
    yield getTranslatedFAQ(reqlangCode.toString(), (faq) => {
        console.log("response to client : " + faq);
        res.json(faq);
    });
}));
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
