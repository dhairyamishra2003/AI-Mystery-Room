# AI MYSTERY ROOM
## Software Requirements Specification (SRS) & Technical Development Blueprint

**Document Version:** 1.0  
**Project Type:** AI-Powered Full-Stack Web Application  
**Development Approach:** Specification-Driven Development  
**Status:** Ready for Implementation

---

# 1. PROJECT OVERVIEW

## 1.1 Project Description

AI Mystery Room is an AI-powered interactive mystery-solving web application where users become detectives and investigate fictional criminal cases generated using Google's Gemini AI.

Players receive a mystery story, investigate suspects, discover evidence, request hints, and identify the culprit based on available information.

The application provides three difficulty levels: Easy, Medium, and Hard. Each level changes the number of suspects, clues, and hints.

The application uses a React frontend, Node.js and Express backend, MongoDB database, and Gemini API for dynamic mystery generation.

## 1.2 Problem Statement

Traditional mystery-solving games often provide predefined stories and limited replayability. Once players discover the solution, the experience becomes repetitive.

AI Mystery Room addresses this limitation by dynamically generating new mystery cases with different stories, suspects, evidence, and solutions.

## 1.3 Project Objectives

- Generate unique mysteries using Gemini AI.
- Provide an interactive detective investigation experience.
- Allow users to investigate suspects and discover evidence.
- Implement an intelligent hint system.
- Evaluate player decisions through a backend scoring engine.
- Maintain the confidentiality of mystery solutions.
- Provide a responsive and professional user interface.
- Deploy a complete, functional application.

## 1.4 Target Users

- Mystery and detective game enthusiasts.
- Students interested in AI-powered applications.
- Casual gamers.
- Users interested in logical reasoning and problem-solving.

## 1.5 Core Technologies

| Layer | Technology |
|---|---|
| Frontend | React.js |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Routing | React Router |
| API Communication | Axios |
| Backend | Node.js |
| Backend Framework | Express.js |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| AI Integration | Google Gemini API |
| Validation | Zod |
| Deployment Frontend | Vercel |
| Deployment Backend | Render or equivalent |
| Version Control | Git and GitHub |

## 1.6 Project Scope

The project includes:
- AI-generated mystery creation.
- Three difficulty levels.
- Suspect investigation.
- Clue discovery.
- Progressive hints.
- Suspect accusation.
- Automatic scoring.
- Final verdict and explanation.
- New mystery functionality.

### Out of Scope for Initial Release

- Multiplayer gameplay.
- Real-time multiplayer chat.
- Payment integration.
- User-to-user competitions.
- Public mystery publishing.
- Advanced leaderboard and ranking systems.

These features may be introduced in future versions.

---

# 2. COMPLETE USER FLOW

The application must follow this sequence.

### Step 1: Homepage

The user opens the website and sees:
- Application branding.
- Hero section.
- Project introduction.
- How-to-play section.
- Start Investigation button.

### Step 2: Create Mystery

The user selects:
- Mystery premise.
- Difficulty level.

The premise can be optional. If the user does not enter one, Gemini generates a suitable mystery concept.

### Step 3: AI Mystery Generation

The frontend sends a request to the backend.

The backend:
1. Validates the input.
2. Sends a structured prompt to Gemini.
3. Receives the generated mystery.
4. Validates the generated JSON.
5. Checks suspect, clue, hint, and solution consistency.
6. Saves the mystery in MongoDB.
7. Returns only player-visible information.

### Step 4: Investigation Room

The player can:
- Read the mystery story.
- Examine suspects.
- Discover available clues.
- Review discovered evidence.
- Request hints.
- Track investigation progress.

### Step 5: Accusation

The player selects one suspect and submits an accusation.

The backend checks the selected suspect against the privately stored culprit ID.

### Step 6: Results

The application displays:
- Correct or incorrect verdict.
- Actual culprit.
- Complete explanation.
- Player score.
- Investigation statistics.
- Play Again button.

### Step 7: New Mystery

The player can start another investigation without refreshing the entire application.

---

# 3. DIFFICULTY AND GAME CONFIGURATION

The following values are fixed requirements.

| Configuration | Easy | Medium | Hard |
|---|---:|---:|---:|
| Suspects | 3 | 4 | 5 |
| Clues | 5 | 7 | 9 |
| Hints | 2 | 3 | 3 |
| Correct Accusation Base | 100 | 150 | 200 |
| Clue Points | +5 | +5 | +5 |
| Hint Penalty | -10 | -10 | -10 |

The backend must enforce these values. The frontend must not be trusted to determine difficulty configuration or scores.

## 3.1 Scoring Formula

For a correct accusation:

`Final Score = Base Points + (Discovered Clues × 5) - (Hints Used × 10)`

Minimum score: 0.

For an incorrect accusation:

`Final Score = 0`

The score must be calculated on the backend.

### Example

A Medium difficulty player:
- Correct accusation: 150 points.
- Discovers 5 clues: 25 points.
- Uses 2 hints: -20 points.

Final score:

`150 + 25 - 20 = 155 points`

### Additional Rules

1. Every clue can award points only once.
2. Every hint request consumes one available hint.
3. The same hint cannot be claimed repeatedly for additional information.
4. The player can submit only one final accusation.
5. An incorrect accusation ends the case.
6. The player cannot change their accusation after submission.
7. Score cannot become negative.

---

# 4. FRONTEND UI/UX SPECIFICATION

## 4.1 Design Direction

The application should use a professional detective-investigation interface.

### Visual Identity

- Theme: Dark investigative interface.
- Primary background: Deep charcoal or midnight blue.
- Accent: Amber or muted gold.
- Secondary accent: Muted red for warnings.
- Text: High-contrast white and light grey.
- Cards: Dark surfaces with subtle borders.
- Typography: Modern sans-serif.
- Icons: Lucide React.

### Design Requirements

- Consistent spacing.
- Reusable UI components.
- Professional typography.
- Subtle animations.
- Smooth transitions.
- Responsive layouts.
- Accessible color contrast.
- Clear loading and error states.

Avoid excessive gradients, unnecessary animations, and cluttered layouts.

## 4.2 Page 1: Home

**Route:** `/`

Purpose: Introduce the game and encourage users to begin.

Required components:

1. Navigation bar.
2. Logo and branding.
3. Hero section.
4. Main heading: "Every Mystery Has a Secret."
5. Short application description.
6. Start Investigation button.
7. How It Works section.
8. Difficulty overview.
9. Footer.

Primary action navigates to `/create`.

## 4.3 Page 2: Create Mystery

**Route:** `/create`

Required components:

- Page heading.
- Mystery premise textarea.
- Character limit.
- Difficulty selection cards.
- Generate Mystery button.

Difficulty cards must display the number of suspects, clues, and hints.

### Validation

- Premise must be a string.
- Maximum premise length: 2,000 words.
- Empty premise is allowed.
- Difficulty is required.
- Only Easy, Medium, and Hard are accepted.

### Loading State

During generation:
- Disable the Generate button.
- Show an investigation-themed loading animation.
- Display a clear loading message.
- Prevent duplicate submissions.

### Error State

Display a useful message if:
- Gemini is unavailable.
- Generation fails.
- Generated output is invalid.
- Database storage fails.
- Network communication fails.

## 4.4 Page 3: Investigation Room

**Route:** `/investigation/:id`

This is the primary gameplay screen.

### Required Layout

**Header**
- Case ID.
- Mystery title.
- Difficulty badge.
- Investigation status.
- Progress indicator.

**Main Story Section**
- Mystery description.
- Crime details.
- Investigation instructions.

**Suspect Section**
- Suspect cards.
- Name.
- Occupation.
- Description.
- Motive.
- Alibi.

Suspect information must not reveal the culprit.

**Evidence Section**
- Available clues.
- Discover clue button.
- Discovered clue details.
- Evidence status.

**Hint Section**
- Request Hint button.
- Remaining hint count.
- Previously revealed hints.

**Investigation Progress**
- Total clues.
- Discovered clues.
- Remaining clues.
- Hints used.

**Final Action**
- Accuse Suspect button.

The player should be able to inspect all available information before making an accusation.

## 4.5 Page 4: Accusation

**Route:** `/investigation/:id/accuse`

Purpose: Allow players to make their final decision.

Required components:
- Suspect selection.
- Suspect identity and description.
- Confirmation message.
- Submit Accusation button.

Rules:
- A suspect must be selected.
- Only one accusation is permitted.
- Submission requires confirmation.
- The backend validates the suspect ID.
- The result is calculated and stored by the backend.

## 4.6 Page 5: Results

**Route:** `/results/:id`

Required components:

- Verdict status.
- Correct or incorrect result.
- Actual culprit.
- Culprit profile.
- Complete mystery explanation.
- Evidence supporting the solution.
- Score breakdown.
- Discovered clue statistics.
- Hints used.
- Play Again button.
- Return Home button.

The results page must retrieve the completed result from the backend.

It must not calculate or reconstruct the score independently.

## 4.7 Responsive Design

The application must support:

- Desktop: 1280px and above.
- Tablet: 768px–1279px.
- Mobile: 320px–767px.

Mobile requirements:
- Single-column layouts.
- Readable suspect cards.
- Touch-friendly controls.
- No horizontal overflow.
- Responsive navigation.
- Accessible buttons and forms.

---

# 5. FRONTEND ARCHITECTURE

Recommended folder structure:

```text
client/
├── public/
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Button.jsx
│   │   ├── LoadingScreen.jsx
│   │   ├── ErrorMessage.jsx
│   │   ├── SuspectCard.jsx
│   │   ├── ClueCard.jsx
│   │   ├── HintPanel.jsx
│   │   ├── ProgressBar.jsx
│   │   └── ScoreCard.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── CreateMystery.jsx
│   │   ├── InvestigationRoom.jsx
│   │   ├── Accusation.jsx
│   │   └── Results.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── hooks/
│   │   └── useCase.js
│   │
│   ├── utils/
│   │   └── formatters.js
│   │
│   ├── routes/
│   │   └── AppRoutes.jsx
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .env
├── package.json
└── vite.config.js
```

## 5.1 Frontend Responsibilities

React must handle:
- Rendering UI.
- Form validation for user experience.
- Routing.
- API requests.
- Loading states.
- Error messages.
- Displaying investigation progress.
- Displaying server-calculated results.

React must never:
- Generate the mystery solution.
- Determine the actual culprit.
- Calculate authoritative scores.
- Store Gemini API credentials.
- Override backend game-state validation.

## 5.2 Frontend Environment Variables

```env
VITE_API_URL=http://localhost:5000
```

Only public configuration should use the `VITE_` prefix.

---

# 6. BACKEND ARCHITECTURE

Recommended folder structure:

```text
server/
├── src/
│   ├── config/
│   │   └── database.js
│   │
│   ├── controllers/
│   │   └── caseController.js
│   │
│   ├── models/
│   │   └── Case.js
│   │
│   ├── routes/
│   │   └── caseRoutes.js
│   │
│   ├── services/
│   │   ├── geminiService.js
│   │   ├── scoringService.js
│   │   └── validationService.js
│   │
│   ├── middleware/
│   │   ├── errorMiddleware.js
│   │   ├── rateLimitMiddleware.js
│   │   └── caseAccessMiddleware.js
│   │
│   ├── validators/
│   │   └── caseValidators.js
│   │
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── sanitizeCase.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── .env.example
└── package.json
```

## 6.1 Backend Responsibilities

The backend is responsible for:

1. API management.
2. Gemini integration.
3. Mystery generation.
4. AI response validation.
5. Database operations.
6. Clue discovery.
7. Hint management.
8. Accusation validation.
9. Score calculation.
10. Secure solution management.
11. Error handling.

All authoritative game logic must remain on the backend.

---

# 7. DATABASE DESIGN

## 7.1 MongoDB Case Model

Collection: `cases`

The Case model should contain the following logical structure.

```javascript
{
  title: String,

  premise: String,

  story: String,

  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"]
  },

  suspects: [
    {
      suspectId: String,
      name: String,
      occupation: String,
      description: String,
      motive: String,
      alibi: String
    }
  ],

  clues: [
    {
      clueId: String,
      title: String,
      description: String,
      category: String,
      discovered: Boolean
    }
  ],

  hints: [
    {
      hintId: String,
      text: String
    }
  ],

  solution: {
    culpritId: String,
    explanation: String,
    evidenceIds: [String]
  },

  progress: {
    discoveredClueIds: [String],
    usedHintIds: [String],
    status: String
  },

  accusation: {
    suspectId: String,
    correct: Boolean,
    submittedAt: Date
  },

  score: {
    basePoints: Number,
    cluePoints: Number,
    hintPenalty: Number,
    finalScore: Number
  },

  accessTokenHash: String,

  createdAt: Date,
  completedAt: Date
}
```

Implementation requirements:

- Use Mongoose schemas.
- Define required fields.
- Define enums.
- Validate nested documents.
- Use unique IDs for suspects, clues, and hints within each case.
- Add timestamps.
- Index frequently queried fields.
- Store the access token as a cryptographic hash, not plaintext.

The solution object must never be included in ordinary player-facing API responses.

## 7.2 Case State

Supported statuses:

- `active`
- `completed`

State transitions:

```text
ACTIVE
  |
  | Submit accusation
  v
COMPLETED
```

A completed case cannot accept additional clues, hints, or accusations.

---

# 8. API SPECIFICATION

Base URL:

```text
/api
```

All API responses should use a consistent JSON format.

## 8.1 Generate Mystery

**Endpoint**

```http
POST /api/cases
```

Request:

```json
{
  "premise": "A famous painting disappears from a locked museum.",
  "difficulty": "medium"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "caseId": "case_123",
    "accessToken": "one-time-returned-secret",
    "title": "The Missing Masterpiece",
    "story": "A painting disappears...",
    "difficulty": "medium",
    "suspects": [],
    "clues": [],
    "progress": {
      "discoveredClueIds": [],
      "usedHintIds": [],
      "status": "active"
    }
  }
}
```

The example arrays represent the actual generated public data.

Important:
- Return the access token only during case creation.
- Do not return the solution.
- Do not return the culprit ID.
- Do not expose private AI generation data.

## 8.2 Retrieve Mystery

**Endpoint**

```http
GET /api/cases/:id
```

Authorization:

```http
Authorization: Bearer ACCESS_TOKEN
```

Returns:
- Story.
- Suspects.
- Available clues.
- Discovered clues.
- Progress.
- Remaining hints.

Never return:
- Culprit ID.
- Solution explanation.
- Hidden evidence mapping.
- Private generation instructions.

## 8.3 Discover Clue

**Endpoint**

```http
POST /api/cases/:id/clues/:clueId/discover
```

Authorization required.

Response:

```json
{
  "success": true,
  "data": {
    "clueId": "clue_01",
    "title": "The Broken Watch",
    "description": "A broken watch was discovered...",
    "discoveredClues": 1,
    "pointsEarned": 5
  }
}
```

Rules:
- Validate case ownership.
- Validate clue ID.
- Reject completed cases.
- Prevent duplicate discovery.
- Update progress in MongoDB.
- Award clue points only once.

## 8.4 Request Hint

**Endpoint**

```http
POST /api/cases/:id/hints
```

Authorization required.

Response:

```json
{
  "success": true,
  "data": {
    "hint": "Pay close attention to the timeline.",
    "hintsUsed": 1,
    "remainingHints": 2,
    "pointsDeducted": 10
  }
}
```

Rules:
- Return hints in their predefined order.
- Do not allow the same hint to be consumed twice.
- Reject requests after all hints are used.
- Reject requests for completed cases.
- Deduct 10 points per hint in the final score.

## 8.5 Submit Accusation

**Endpoint**

```http
POST /api/cases/:id/accuse
```

Request:

```json
{
  "suspectId": "suspect_02"
}
```

Authorization required.

Response:

```json
{
  "success": true,
  "data": {
    "verdict": "correct",
    "score": {
      "basePoints": 150,
      "cluePoints": 25,
      "hintPenalty": 20,
      "finalScore": 155
    }
  }
}
```

Rules:
- Validate suspect ID.
- Check the actual culprit on the backend.
- Calculate the score on the backend.
- Store the accusation.
- Mark the case completed.
- Prevent subsequent accusations.
- Do not trust any score submitted by the frontend.

The actual culprit and full explanation should be retrieved through the results endpoint after completion.

## 8.6 Retrieve Result

**Endpoint**

```http
GET /api/cases/:id/result
```

Authorization required.

Only completed cases can return their final results.

Response:

```json
{
  "success": true,
  "data": {
    "verdict": "correct",
    "culprit": {
      "suspectId": "suspect_02",
      "name": "Daniel"
    },
    "explanation": "The evidence establishes...",
    "supportingEvidence": [],
    "score": {
      "basePoints": 150,
      "cluePoints": 25,
      "hintPenalty": 20,
      "finalScore": 155
    }
  }
}
```

## 8.7 Standard Error Response

```json
{
  "success": false,
  "message": "The requested clue was not found.",
  "errorCode": "CLUE_NOT_FOUND"
}
```

Suggested HTTP status codes:

| Status | Meaning |
|---|---|
| 200 | Successful request |
| 201 | Resource created |
| 400 | Invalid request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Resource not found |
| 409 | Invalid game state or duplicate action |
| 429 | Rate limit exceeded |
| 500 | Internal server error |
| 503 | AI service unavailable |

---

# 9. GEMINI AI INTEGRATION

## 9.1 AI Responsibilities

Gemini must generate:
- Mystery title.
- Mystery story.
- Suspect profiles.
- Clues.
- Progressive hints.
- Correct culprit.
- Solution explanation.
- Supporting evidence references.

Gemini generates the mystery content, but it does not control the authoritative game state or score.

## 9.2 Gemini Output Structure

The backend should request structured JSON in the following format.

```json
{
  "title": "The Silent Museum",
  "story": "A valuable painting disappears...",
  "suspects": [
    {
      "suspectId": "suspect_01",
      "name": "Daniel",
      "occupation": "Museum Guard",
      "description": "A senior museum employee.",
      "motive": "Financial pressure.",
      "alibi": "Claims he was monitoring the east wing."
    }
  ],
  "clues": [
    {
      "clueId": "clue_01",
      "title": "Broken Watch",
      "description": "A damaged watch was found.",
      "category": "physical"
    }
  ],
  "hints": [
    {
      "hintId": "hint_01",
      "text": "Examine the timeline carefully."
    }
  ],
  "solution": {
    "culpritId": "suspect_01",
    "explanation": "The evidence reveals...",
    "evidenceIds": ["clue_01"]
  }
}
```

This is an illustrative schema. The actual response must contain the exact number of suspects, clues, and hints required by the selected difficulty.

## 9.3 AI Generation Rules

Gemini must follow these constraints:

1. Generate a coherent mystery with a definite culprit.
2. Generate unique suspect IDs.
3. Generate unique clue IDs.
4. Generate unique hint IDs.
5. Ensure all IDs are referenced correctly.
6. Ensure the culprit exists in the suspect list.
7. Ensure all supporting evidence IDs exist.
8. Make clues relevant to the mystery.
9. Ensure the final culprit is identifiable through evidence.
10. Avoid contradictory timelines.
11. Avoid multiple equally valid culprits.
12. Avoid revealing the solution in public story or suspect descriptions.
13. Avoid hints that directly disclose the culprit.
14. Follow the selected difficulty configuration exactly.

## 9.4 AI Prompt Design

The backend must use a structured system instruction similar to:

```text
You are an expert detective mystery game designer.

Generate an original, logically consistent detective mystery.

The mystery must include:
- A compelling title and story.
- The exact required number of suspects.
- The exact required number of clues.
- The exact required number of hints.
- One definite culprit.
- A complete solution explanation.
- Evidence references that support the culprit.

The mystery must have exactly one defensible solution.

Every clue must be relevant to the investigation.
The clues collectively must establish the culprit.
The solution must not contradict the suspect alibis or timeline.

Hints must progressively guide the player without directly revealing
the culprit.

Never return markdown.
Return valid structured JSON matching the required schema.

Difficulty: {{difficulty}}
Premise: {{premise}}
Required suspects: {{suspectCount}}
Required clues: {{clueCount}}
Required hints: {{hintCount}}
```

The actual implementation must use the selected model's supported structured-output functionality where available.

## 9.5 AI Response Validation

Use Zod to validate the response before saving.

Validation must check:

- JSON structure.
- Required properties.
- Correct data types.
- Difficulty-specific counts.
- Unique IDs.
- Valid culprit reference.
- Valid evidence references.
- Non-empty descriptions.
- Hint count.
- Suspect count.
- Clue count.

If validation fails:
1. Do not save the invalid mystery.
2. Attempt a limited regeneration.
3. Validate the new response.
4. Return a controlled error if validation continues to fail.

Never silently save incomplete or invalid mysteries.

## 9.6 Logical Consistency Validation

Structural validation alone cannot prove that a mystery is logically solvable.

Implement an additional solution-quality check that evaluates:
- Whether the evidence supports the designated culprit.
- Whether the evidence contradicts competing suspects.
- Whether the timeline is consistent.
- Whether the explanation references actual clues.
- Whether any other suspect remains equally plausible.

If the generated mystery fails the quality check, regenerate it within a limited retry budget.

---

# 10. SECURITY REQUIREMENTS

Security is a critical requirement.

## 10.1 Protect the Solution

The culprit and solution explanation must remain on the backend until the player submits an accusation.

The frontend must never receive:
- `culpritId`.
- `solution.explanation`.
- Private evidence mappings.
- Raw Gemini responses.
- Internal scoring instructions.

## 10.2 Case Access Control

For the initial release, use an anonymous case-access token.

Implementation:
1. Generate a cryptographically secure random token.
2. Return it once when creating a case.
3. Store only its SHA-256 hash in MongoDB.
4. Require it for all case-specific requests.
5. Compare the hash securely.
6. Never expose it in URLs or application logs.

Store the token in session storage on the client. It must not be placed in query parameters.

## 10.3 Additional Security

- Keep Gemini API keys in backend environment variables.
- Use Helmet.
- Configure CORS with the production frontend origin.
- Apply rate limiting.
- Validate all incoming requests.
- Sanitize user-provided text.
- Use parameterized and schema-based database operations.
- Avoid exposing stack traces.
- Do not log access tokens or secrets.
- Apply request size limits.
- Prevent duplicate game actions.
- Protect against unauthorized case access.

---

# 11. GAME STATE AND DATA INTEGRITY

The backend is the authoritative source of truth.

Every action must be validated against the current case state.

| Action | Active Case | Completed Case |
|---|---|---|
| Retrieve case | Allowed | Allowed, sanitized |
| Discover clue | Allowed | Rejected |
| Request hint | Allowed | Rejected |
| Submit accusation | Allowed | Rejected |
| Retrieve result | Not allowed | Allowed |

Use atomic MongoDB updates or transactions where appropriate to prevent duplicate scoring and race conditions.

Clue discovery and hint consumption must be idempotent where practical.

The final accusation must be processed exactly once.

---

# 12. ERROR HANDLING

The application must gracefully handle the following situations:

| Scenario | Expected Behavior |
|---|---|
| Gemini API unavailable | Show AI service error |
| Invalid Gemini JSON | Validate and retry |
| MongoDB unavailable | Show database error |
| Invalid difficulty | Reject request |
| Invalid suspect ID | Reject accusation |
| Invalid clue ID | Show clue error |
| Duplicate clue discovery | No additional points |
| Hints exhausted | Show no hints remaining |
| Unauthorized request | Return 401 |
| Completed case modification | Return 409 |
| Missing case | Return 404 |
| Network failure | Display retry option |

All errors must be logged on the server without exposing sensitive information to the frontend.

---

# 13. TESTING STRATEGY

## 13.1 Frontend Testing

Verify:
- Homepage rendering.
- Form validation.
- Difficulty selection.
- Navigation.
- Loading states.
- Suspect cards.
- Clue discovery UI.
- Hint interface.
- Accusation confirmation.
- Results page.
- Responsive layouts.

## 13.2 Backend Testing

Test:
- Case creation.
- Gemini response validation.
- MongoDB storage.
- Case retrieval.
- Access-token validation.
- Clue discovery.
- Duplicate clue protection.
- Hint consumption.
- Scoring.
- Accusation.
- Result retrieval.
- Invalid state transitions.

## 13.3 Scoring Test Cases

| Test | Expected Result |
|---|---|
| Easy, correct, 5 clues, 0 hints | 125 |
| Medium, correct, 7 clues, 3 hints | 155 |
| Hard, correct, 9 clues, 3 hints | 215 |
| Easy, correct, 0 clues, 2 hints | 80 |
| Medium, incorrect accusation | 0 |
| Hard, correct, 0 clues, 3 hints | 170 |

## 13.4 Security Testing

Verify:
- Culprit is not returned before accusation.
- Solution explanation is not returned prematurely.
- Invalid tokens cannot access cases.
- One player cannot access another player's case.
- Scores cannot be manipulated from frontend requests.
- Repeated requests cannot award duplicate clue points.
- Completed cases cannot be modified.

## 13.5 End-to-End Testing

Test the entire workflow:

```text
Open Website
     |
Create Mystery
     |
Select Difficulty
     |
Generate Using Gemini
     |
View Investigation
     |
Discover Clues
     |
Request Hints
     |
Select Suspect
     |
Submit Accusation
     |
Calculate Backend Score
     |
Display Final Result
     |
Start New Mystery
```

The complete workflow must work on the deployed website.

---

# 14. DEPLOYMENT SPECIFICATION

## 14.1 MongoDB Atlas

1. Create a MongoDB Atlas account.
2. Create a database cluster.
3. Configure database access.
4. Configure network access.
5. Obtain the MongoDB connection string.
6. Add the connection string to backend environment variables.

Database name:

`ai_mystery_room`

Collection:

`cases`

## 14.2 Backend Deployment

Deploy the Express application using Render or another suitable Node.js hosting service.

Backend environment variables:

```env
PORT=5000
NODE_ENV=production

MONGODB_URI=your_mongodb_uri

GEMINI_API_KEY=your_gemini_api_key

CLIENT_URL=https://your-frontend.vercel.app
```

Configure:
- Build command.
- Start command.
- Environment variables.
- CORS.
- Health-check endpoint.

Suggested health endpoint:

```http
GET /api/health
```

Expected response:

```json
{
  "success": true,
  "message": "AI Mystery Room API is running."
}
```

## 14.3 Frontend Deployment

Deploy the React application using Vercel.

Frontend environment variable:

```env
VITE_API_URL=https://your-backend-url
```

Configure SPA routing rewrites so direct navigation to investigation and results routes works correctly.

## 14.4 Production Verification

After deployment:
- Verify frontend availability.
- Verify backend health.
- Verify MongoDB connection.
- Verify Gemini integration.
- Verify CORS.
- Generate a new mystery.
- Complete a full investigation.
- Verify the final score.
- Verify that the solution remains protected.

---

# 15. DEVELOPMENT PHASES

Development must be incremental.

| Phase | Task | Deliverable |
|---|---|---|
| 1 | Finalize specification | SPEC.md |
| 2 | Project initialization | Client and server |
| 3 | Backend configuration | Express and MongoDB |
| 4 | Database implementation | Case model |
| 5 | Gemini integration | Mystery generation |
| 6 | API implementation | Functional endpoints |
| 7 | Security implementation | Protected solution |
| 8 | Frontend implementation | Five functional pages |
| 9 | Game mechanics | Clues, hints, scoring |
| 10 | Testing | Verified functionality |
| 11 | Deployment | Live application |
| 12 | Final QA | Production-ready project |

Do not begin the next phase until the current phase passes its verification checks.

---

# 16. CODE QUALITY AND DEVELOPMENT RULES

These rules are mandatory for AI coding assistants.

1. Read the complete SPEC.md before implementation.
2. Follow the specified architecture.
3. Do not skip development phases.
4. Do not generate the entire application in one uncontrolled operation.
5. Use reusable React components.
6. Keep API logic separate from UI components.
7. Keep Gemini logic separate from controllers.
8. Keep scoring logic in a dedicated backend service.
9. Use Zod for request and AI-response validation.
10. Use Mongoose for database models.
11. Never expose backend secrets.
12. Never expose the solution prematurely.
13. Never calculate authoritative scores on the frontend.
14. Do not introduce unnecessary dependencies.
15. Do not duplicate existing functionality.
16. Do not create unnecessary files.
17. Do not change the project architecture without justification.
18. Do not remove working functionality while implementing new features.
19. Do not use mock data in the final production workflow.
20. Test every important change.
21. Fix existing errors before adding additional features.
22. Maintain consistent UI design across all pages.
23. Update documentation when architecture or APIs change.
24. Do not claim a feature is complete without verifying it.

### Change Control Rule

Before modifying any existing file:
- Inspect its current implementation.
- Understand its dependencies.
- Identify the exact required change.
- Avoid unrelated modifications.
- Run relevant tests after modification.

---

# 17. ACCEPTANCE CRITERIA

The project is considered complete only when all the following conditions are satisfied.

### Functional Requirements

- [ ] Homepage works.
- [ ] Users can create mysteries.
- [ ] Easy difficulty generates 3 suspects, 5 clues, and 2 hints.
- [ ] Medium difficulty generates 4 suspects, 7 clues, and 3 hints.
- [ ] Hard difficulty generates 5 suspects, 9 clues, and 3 hints.
- [ ] Gemini generates valid mystery content.
- [ ] Suspects display correctly.
- [ ] Clues can be discovered.
- [ ] Duplicate clues do not award extra points.
- [ ] Hints can be requested.
- [ ] Hint limits are enforced.
- [ ] Players can submit accusations.
- [ ] Correct and incorrect verdicts work.
- [ ] Backend calculates scores correctly.
- [ ] Results display the culprit and explanation.
- [ ] Users can start another mystery.

### Security Requirements

- [ ] Gemini API key remains private.
- [ ] Culprit is not exposed before accusation.
- [ ] Solution explanation is protected.
- [ ] Case access is authorized.
- [ ] Score manipulation is prevented.
- [ ] Completed cases cannot be modified.

### Deployment Requirements

- [ ] MongoDB Atlas is connected.
- [ ] Backend is deployed.
- [ ] Frontend is deployed.
- [ ] Production environment variables are configured.
- [ ] API communication works.
- [ ] Complete game works on the live website.
- [ ] No critical production errors remain.

---

# 18. FINAL PROJECT DELIVERABLES

The final project must contain:

1. Complete `SPEC.md`.
2. React frontend source code.
3. Express backend source code.
4. MongoDB database integration.
5. Gemini AI integration.
6. Secure case-management system.
7. Scoring engine.
8. Responsive UI.
9. Error-handling system.
10. Testing documentation.
11. `.env.example` files.
12. GitHub repository.
13. Live frontend URL.
14. Live backend URL.
15. Project README with setup and deployment instructions.

---

# 19. FINAL IMPLEMENTATION PRINCIPLE

**SPECIFICATION FIRST → ARCHITECTURE → BACKEND → AI INTEGRATION → FRONTEND → TESTING → DEPLOYMENT**

The SPEC.md file is the project's primary development reference.

Every implementation decision must remain consistent with this specification.

If a requirement is unclear, identify the ambiguity before making architectural decisions.

Do not silently change requirements, remove features, or introduce unnecessary functionality.

The final objective is to deliver a fully functional, secure, responsive, AI-powered mystery-solving application that users can access and play on a live website.

**END OF SPECIFICATION**