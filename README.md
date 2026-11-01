# AI Mystery Room

An AI-powered detective game where players investigate an original case, inspect evidence, use limited hints, and submit one final accusation. Each case is generated with Google Gemini and securely managed by the backend.

## Highlights

- AI-generated, replayable mystery cases
- English and Hindi (Devanagari) case generation
- Easy, Medium, and Hard investigations
- Secure anonymous case access tokens
- Progressive clues, limited hints, and server-side scoring
- Protected culprit and solution data until the case is complete
- Responsive React interface for desktop and mobile

## Tech Stack

| Area | Technology |
| --- | --- |
| Frontend | React, Vite, React Router, Axios, Lucide |
| Backend | Node.js, Express, Zod, Helmet, rate limiting |
| Data | MongoDB Atlas, Mongoose |
| AI | Google Gemini API |

## Game Rules

| Difficulty | Suspects | Clues | Hints | Correct-answer base score |
| --- | ---: | ---: | ---: | ---: |
| Easy | 3 | 5 | 2 | 100 |
| Medium | 4 | 7 | 3 | 150 |
| Hard | 5 | 9 | 3 | 200 |

For a correct accusation:

```text
final score = base points + (discovered clues × 5) − (hints used × 10)
```

An incorrect accusation always scores `0`.

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `server/.env.example` to `server/.env` and supply valid credentials:

```env
PORT=5001
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3.5-flash-lite
CLIENT_URL=http://localhost:5174
```

The frontend uses `client/.env`:

```env
VITE_API_URL=http://localhost:5001
```

### 3. Start the application

Use two terminals:

```bash
# Terminal 1
cd server
npm run dev
```

```bash
# Terminal 2
cd client
npm run dev
```

Open `http://localhost:5174`.

## API Overview

All case-specific endpoints require an access token returned only when the case is created.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/cases` | Generate a new mystery |
| `GET` | `/api/cases/:id` | Retrieve player-safe case data |
| `POST` | `/api/cases/:id/clues/:clueId/discover` | Discover a clue |
| `POST` | `/api/cases/:id/hints` | Consume the next hint |
| `POST` | `/api/cases/:id/accuse` | Submit the final accusation |
| `GET` | `/api/cases/:id/result` | Retrieve the completed case result |
| `GET` | `/api/health` | API health check |

Example case creation request:

```json
{
  "premise": "A priceless violin vanishes before a concert.",
  "difficulty": "medium",
  "language": "en"
}
```

Use `"hi"` for Hindi case content.

## Security

- Gemini credentials remain server-side only.
- Each case receives a cryptographically random access token; MongoDB stores only its SHA-256 hash.
- The culprit, solution explanation, and supporting-evidence mapping are never exposed before the accusation.
- The backend owns all state transitions and score calculations.
- Helmet, CORS configuration, body-size limits, request validation, and rate limiting are enabled.

## Verification

```bash
npm test
npm run build
```

The scoring tests cover every score example specified for the project.

## Deployment

- Deploy `client` to Vercel or another static host. Set `VITE_API_URL` to the deployed API URL and configure SPA rewrites.
- Deploy `server` to Render, Railway, or another Node.js host. Set `MONGODB_URI`, `GEMINI_API_KEY`, `GEMINI_MODEL`, and `CLIENT_URL` in the host’s environment settings.
- Use MongoDB Atlas for the production database and restrict its network/database access appropriately.

## Project Structure

```text
client/                 React + Vite application
server/                 Express API and game engine
  src/models/           Mongoose case model
  src/services/         Gemini, validation, and scoring logic
  src/controllers/      API request handlers
  src/routes/           Case endpoints
spec.md                 Full project specification
```

