"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { currentUser } from "@clerk/nextjs/server";

const CATEGORY_PROMPTS = {
  FRONTEND: "React, JavaScript, CSS, performance, accessibility, browser APIs",
  BACKEND:
    "Node.js, REST APIs, databases, authentication, caching, scalability",
  FULLSTACK:
    "full-stack architecture, API design, state management, deployment",
  DSA: "data structures, algorithms, time complexity, problem solving",
  SYSTEM_DESIGN:
    "distributed systems, scalability, databases, microservices, caching",
  BEHAVIORAL:
    "leadership, teamwork, conflict resolution, career growth, STAR method",
  DEVOPS: "CI/CD, Docker, Kubernetes, cloud infrastructure, monitoring",
  MOBILE:
    "React Native, iOS/Android, performance, offline support, app lifecycle",
};

// Models to try in order — falls back if quota is exceeded
const MODELS = [
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash",
  "gemini-2.5-flash-lite",
];

async function tryGenerate(genAI, prompt) {
  let lastError;

  for (const modelName of MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      return result;
    } catch (err) {
      lastError = err;
      // If it's a quota error (429), try the next model
      if (err?.status === 429 || err?.message?.includes("429")) {
        console.warn(`[AI Questions] ${modelName} quota exceeded, trying next model...`);
        continue;
      }
      // For other errors, don't retry
      throw err;
    }
  }

  // All models exhausted
  throw lastError;
}

export const generateInterviewQuestions = async ({ category }) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  if (!category || !CATEGORY_PROMPTS[category])
    throw new Error("Invalid category");

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const prompt = `You are an expert technical interviewer. Generate 6 interview questions for a ${category} role covering: ${CATEGORY_PROMPTS[category]}.

For each question, provide a concise but complete answer (2-4 sentences) that an interviewer can use to evaluate responses.

Respond ONLY with a valid JSON array. No markdown, no backticks, no explanation. Example format:
[{"question": "...", "answer": "..."}, {"question": "...", "answer": "..."}]`;

  try {
    const result = await tryGenerate(genAI, prompt);
    const text = result.response.text().trim();
    const clean = text.replace(/^```json|^```|```$/gm, "").trim();
    const questions = JSON.parse(clean);

    return { questions };
  } catch (err) {
    if (err?.status === 429 || err?.message?.includes("429")) {
      throw new Error(
        "AI quota exceeded. Please wait a minute and try again, or generate a new API key from Google AI Studio."
      );
    }
    throw err;
  }
};