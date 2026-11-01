# AI Mystery Room

An AI-powered detective game built with React, Express, MongoDB, Gemini, and Zod.

## Run locally

1. Copy `server/.env.example` to `server/.env` and provide `MONGODB_URI`, `GEMINI_API_KEY`, and `CLIENT_URL`.
2. Copy `client/.env.example` to `client/.env` if the API is not at `http://localhost:5000`.
3. Run `npm install`, then `npm run dev`.

The frontend runs on `http://localhost:5173`; the API runs on `http://localhost:5000`.

## API

All case-specific requests require `Authorization: Bearer <access token>`. The token is returned only by `POST /api/cases`, and the browser keeps it in session storage. See `spec.md` for the full contract.

## Deployment

Deploy `server` as a Node service with `npm start` and set its environment variables from `server/.env.example`. Deploy `client` as a Vite static site with `VITE_API_URL` set to the deployed API URL. Configure an SPA rewrite to `index.html`.
