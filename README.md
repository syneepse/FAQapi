# FAQ API

This project provides a simple API to fetch frequently asked questions (FAQs) with support for translation and caching using Redis. The API is built with Express.js and uses Docker for containerization.

---

## Table of Contents
1. [Installation](#installation)
2. [API Usage](#api-usage)
3. [Measuring Performance](#measuring-performance)
4. [Unit Tests](#unit-tests)
5. [Contribution Guidelines](#contribution-guidelines)

---

## Installation

### Prerequisites
- Ensure that **Docker** is installed on your system. You can download Docker from [here](https://www.docker.com/products/docker-desktop).

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/FAQapi.git
   cd FAQapi
   ```

2. Build the Docker containers:
   ```bash
   docker-compose build
   ```

3. Start the services:
   ```bash
   docker-compose up
   ```

4. The API will be running on `localhost:3000`.

---

## API Usage

The API provides an endpoint to fetch FAQs in different languages. Below are some examples of how to use the API:

### Fetch FAQs in English
```bash
GET http://localhost:3000/api/faqs/?lang=en
```

### Fetch FAQs in the default language (English)
```bash
GET http://localhost:3000/api/faqs/
```

### Fetch FAQs with an invalid language code
```bash
GET http://localhost:3000/api/faqs/?lang=rubbish
```

### Response Format
The API returns a JSON object with the following structure:
```json
{
  "lang": "en",
  "question1": "What is the capital of France?",
  "answer1": "Paris is the capital of France."
}
```

---

## Measuring Performance

### Caching Mechanism
The API uses Redis for caching. To check if caching is being used:
- **Console Messages**: Look for `"cache in use"` or `"cache not in use"` in the server logs.
- **Browser DevTools**: Open the browser's developer tools (`Inspect Element` -> `Network` tab) and check the response times for the API requests.

---

## Unit Tests

To run unit tests, ensure you have Node.js and npm installed, then run:
```bash
npm test
```

This will execute the test suite using Jest and provide a coverage report.

---

## Contribution Guidelines

We welcome contributions to this project! If you'd like to contribute, please follow these steps:

1. **Fork the Repository**: Fork the repository to your GitHub account.
2. **Clone the Forked Repository**:
   ```bash
   git clone https://github.com/your-username/FAQapi.git
   cd FAQapi
   ```
3. **Create a New Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make Your Changes**: Implement your changes or fixes.
5. **Run Tests**: Ensure all tests pass by running:
   ```bash
   npm test
   ```
6. **Commit and Push**:
   ```bash
   git add .
   git commit -m "Description of your changes"
   git push origin feature/your-feature-name
   ```
7. **Create a Pull Request**: Go to the original repository and create a pull request with a detailed description of your changes.

---

### Notes
- This solution is **only supported on Linux/Mac and Docker Desktop**. Redis is not natively supported on Windows.
- For any issues or questions, please open an issue on the repository.

---

Thank you for using the FAQ API! We hope it serves your needs well. 🚀
