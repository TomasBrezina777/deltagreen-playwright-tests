# DeltaGreen Todo – Playwright Test Automation

Automated UI and API tests for the DeltaGreen Todo application:
https://todos.dev.deltagreen.cz

---

## Install guide

npm install
npx playwright install

!!Before you run the tests create an .env file with credentials based on the .env.example file!!

## How to run all tests

npx playwright test

## How to run e2e tests

npx playwright test tests/e2e

## How to run API tests

npx playwright test tests/api
