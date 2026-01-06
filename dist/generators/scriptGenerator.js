"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateScript = generateScript;
const aiService_1 = require("../services/aiService");
const SYSTEM_PROMPT = `
You are an expert scriptwriter for technical explainer videos.
Your task is to convert a given topic into a scene-by-scene narration script.

REQUIREMENTS:
- Break the topic into multiple scenes
- One concept per scene
- Simple, instructional language
- Short sentences
- Narration suitable for AI voice-over
- No storytelling or conversational tone
- STRICTLY follow the JSON format

OUTPUT FORMAT (JSON):
{
  "scenes": [
    {
      "scene_number": 1,
      "narration": "Short voice-over sentence",
      "explanation": "Brief explanation of the concept"
    }
  ]
}
`;
async function generateScript(topic) {
    console.log(`Generating script for topic: "${topic}"...`);
    const userPrompt = `Topic: ${topic}`;
    try {
        const response = await (0, aiService_1.generateJSON)(SYSTEM_PROMPT, userPrompt);
        // Validate response structure briefly
        if (!response.scenes || !Array.isArray(response.scenes)) {
            throw new Error("Invalid format received from AI");
        }
        return response.scenes;
    }
    catch (error) {
        console.error("Failed to generate script:", error);
        // Fallback or rethrow
        throw error;
    }
}
