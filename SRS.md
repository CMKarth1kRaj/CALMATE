# Software Requirements Specification (SRS) - CalMate AI

## 1. Introduction

### 1.1 Purpose
The purpose of this document is to provide a comprehensive overview of the **CalMate AI** system. This includes the technical architecture, core functionalities, and the integration of Artificial Intelligence for nutrition tracking and meal planning.

### 1.2 Scope
CalMate is an AI-driven nutritional assistant designed to simplify calorie tracking through vision-based analysis and automated planning. It targets health-conscious individuals who want to maintain their dietary goals with minimal manual entry.

---

## 2. Technology Stack

The application follows a modern, type-safe architecture optimized for performance and rapid iteration.

### 2.1 Core Stack
- **Frontend**: **React** (Latest version) with **TypeScript** for robust state management and component architecture.
- **Styling**: **Tailwind CSS (v4)** for a premium, high-performance design system with rich aesthetics.
- **Backend-as-a-Service (BaaS)**: **Convex** for real-time database, authentication, and server-side functions.
- **Runtime & Package Management**: **Bun** for ultra-fast execution and dependency handling.
- **Web Server**: **Express** (Integration layer) for custom API endpoints and complex server-side middleware.
- **Build Tool**: **Vite** for optimized development environment and production bundling.

### 2.2 AI Integration
- **Model**: **Google Gemini API** (Gemini 1.5 Pro/Flash).
- **Usage**: Deep vision analysis for meal identification and generative planning for nutritional strategies.

---

## 3. System Architecture

### 3.1 Frontend-Backend Interaction
1. **React Client**: Handles user interaction and state management via `AppContext`.
2. **Convex Queries/Mutations**: Direct connection to the real-time database for user profiles, meal logs, and performance data.
3. **Express Middleware**: Proxy layer for specific AI operations or external integrations that require custom logic not handled by Convex.
4. **Bun Runtime**: Powers the development environment and any standalone script execution.

---

## 4. AI Features & Workflows

### 4.1 AI Meal Analysis (Camera Feature)
The core "Cal AI" experience where images are converted into nutritional data using structured vision inference.
- **AI Logic**: Uses **Gemini 2.0/1.5 Flash** with `responseSchema` forced to JSON mode.
- **Process Workflow**:
    1. **Capture**: User takes a photo via the `CameraScreen`.
    2. **Transmission**: The base64 image is passed to `analyzeMealFromImage`.
    3. **AI Inference**: Gemini identifies food items and returns a schema-validated object containing `name`, `quantity`, `calories`, `protein`, `carbs`, and `fat`.
    4. **Confirmation**: User reviews the AI-generated breakdown in the `AnalysisScreen`.
    5. **Logging**: Data is persisted in Convex.

### 4.2 AI Daily Planner (Strategy Feature)
Personalized meal strategy generation based on caloric DNA.
- **AI Logic**: Structured text generation based on biometric context.
- **Process Workflow**:
    1. **Context injection**: User profile (Age, Weight, Height, Goal) is injected into the prompt.
    2. **Targeting**: Gemini calculates meal proportions to hit the `dailyCalorieTarget`.
    3. **Schema Mapping**: Returns a 4-meal structure (Breakfast, Lunch, Dinner, Snack).
    4. **Persistence**: The plan is saved for real-time tracking during the day.

---

## 5. Functional Requirements

### 5.1 User Management
- Authentication via Convex Auth (OAuth or Email).
- Onboarding flow to capture biometric data (Age, Gender, Weight, Height, Goal).

### 5.2 Dashboard & Tracking
- Real-time visualization of calorie progress using Circular Progress indicators.
- Macro-nutrient tracking (Protein, Carbs, Fats) with daily targets.
- Streak system to incentivize daily logging.

### 5.3 Meal History
- Grouped logs by date.
- Detailed view of each meal including photo, time, and macro breakdown.

---

## 6. Non-Functional Requirements

### 6.1 Performance
- **Bun** ensures fast installation and script execution.
- **Convex** provides <10ms reactive updates for a "snappy" UI.

### 6.2 Scalability
- Serverless architecture allows the app to scale instantly as the user base grows.
- **Express** integration allows for future microservice extraction if needed.

---

## 7. Future Enhancements
- Integration with Google Fit/Apple Health.
- Voice-based meal logging.
- Community challenges and leaderboards.
