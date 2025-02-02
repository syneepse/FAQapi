import request from 'supertest';
import express from 'express';
import * as http from 'http';
import Redis from 'ioredis-mock';
import { getTranslatedFAQ, checkCache, app } from './index.ts';
import { describe, expect, it, jest } from '@jest/globals';

describe('getTranslatedFAQ', () => {
  it('should return translated FAQ for a valid language code', async () => {
    const mockResponse = {
      question: "What is the capital of France?",
      answer: "Paris is the capital of France.",
      lang: "fr",
      question_translated: "Quelle est la capitale de la France?",
      answer_translated: "Paris est la capitale de la France.",
    };

    const mockRequest = http.request({}, (res) => {
      res.on('data', () => {});
      res.on('end', () => {
        expect(res.statusCode).toBe(200);
      });
    });

    jest.spyOn(http, 'request').mockImplementation(() => mockRequest);

    const callback = jest.fn();
    await getTranslatedFAQ('fr', callback);

    expect(callback).toHaveBeenCalledWith({
      lang: "fr",
      question1: "Quelle est la capitale de la France?",
      answer1: "Paris est la capitale de la France.",
    });
  });

  it('should return default FAQ for an invalid language code', async () => {
    const mockResponse = {
      question: "What is the capital of France?",
      answer: "Paris is the capital of France.",
      lang: "invalid",
      error: "Language not supported",
    };

    const mockRequest = http.request({}, (res) => {
      res.on('data', () => {});
      res.on('end', () => {
        expect(res.statusCode).toBe(200);
      });
    });

    jest.spyOn(http, 'request').mockImplementation(() => mockRequest);

    const callback = jest.fn();
    await getTranslatedFAQ('invalid', callback);

    expect(callback).toHaveBeenCalledWith({
      lang: "",
      question1: "What is the capital of France?",
      answer1: "Paris is the capital of France.",
    });
  });
});



describe('GET /api/faqs/', () => {
  it('should return translated FAQ and cache it', async () => {
    const mockResponse = {
      question: "What is the capital of France?",
      answer: "Paris is the capital of France.",
      lang: "fr",
      question_translated: "Quelle est la capitale de la France?",
      answer_translated: "Paris est la capitale de la France.",
    };

    // jest.spyOn(http, 'request').mockImplementation((options, callback) => {
    //   const res = new http.IncomingMessage(new http.Server());
    //   res.statusCode = 200;
    //   callback(res);
    //   res.emit('data', JSON.stringify(mockResponse));
    //   res.emit('end');
    //   return {} as http.ClientRequest;
    // });

    let response = await request(app).get('/api/faqs/?lang=fr');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      lang: "fr",
      question1: "Quelle est la capitale de la France?",
      answer1: "Paris est la capitale de la France.",
    });

    response = await request(app).get('/api/faqs/?lang=en');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      lang: "fr",
      question1: "What is the capital of France?",
      answer1: "Paris is the capital of France.",
    });

    response = await request(app).get('/api/faqs/?lang=fr');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      lang: "fr",
      question1: "Quelle est la capitale de la France?",
      answer1: "Paris est la capitale de la France.",
    });
    

    // const cachedData = await new Redis().get('fr');
    // expect(cachedData).toBe(JSON.stringify({
    //   lang: "fr",
    //   question1: "Quelle est la capitale de la France?",
    //   answer1: "Paris est la capitale de la France.",
    // }));
  });
});