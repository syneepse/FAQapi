from typing import Union
from fastapi import FastAPI
from pydantic import BaseModel
from googletrans import Translator

class Item(BaseModel):
    question: str
    answer: str
    lang: str
    question_translated: str | None = None
    answer_translated: str | None = None
    error: str | None = None
    

async def translate_text(question: str, answer: str, lang: str) -> tuple:
    async with Translator() as translator:
        result_q = await translator.translate(question, dest=lang)
        result_a = await translator.translate(answer, dest=lang)
        return result_q.text, result_a.text

app = FastAPI()

@app.get('/')
async def read_root(item: Item) -> dict:
    try:
        item.question_translated, item.answer_translated = await translate_text(item.question, item.answer, item.lang)
    except ValueError as ve:
        # return {"error": "Failed to translate the text"}
        item.error = str(ve)
    print(item.dict)
    return item.dict()


