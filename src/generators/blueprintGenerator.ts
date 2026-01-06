import { generateJSON } from '../services/aiService';
import { ScriptScene, BlueprintScene } from '../types';
import { FIXED_STYLE_PROFILE } from '../config';

const SYSTEM_PROMPT = `
You are an expert animation director for 2D technical explainer videos.
Your task is to convert a narration script into a visual animation blueprint.

CRITICAL: You MUST strictly adhere to the following Visual Style Profile.
${JSON.stringify(FIXED_STYLE_PROFILE, null, 2)}

BLUEPRINT REQUIREMENTS:
For each scene, define:
- Visual elements: Use only shapes, lines, arrows, icons (No characters!)
- On-screen text: Keywords only (No full sentences)
- Animation actions: slide-in, fade-in, draw-line, zoom, etc.
- Timing: Estimate duration in seconds based on narration length.
- Scene transition: fade, slide, cut, etc.
- Asset generation prompt: A description for generating the vector assets.

OUTPUT FORMAT (JSON):
{
  "blueprint": [
    {
      "scene_number": 1,
      "visual_elements": ["rectangle", "arrow"],
      "text_overlays": ["Keyword"],
      "animation_actions": ["slide-in", "draw-line"],
      "duration_seconds": 6,
      "transition": "fade",
      "asset_prompt": "Minimal 2D vector icon of a database"
    }
  ]
}
`;

export async function generateBlueprint(script: ScriptScene[]): Promise<BlueprintScene[]> {
  console.log(`Generating animation blueprint for ${script.length} scenes...`);
  
  const userPrompt = `Script: ${JSON.stringify(script, null, 2)}`;
  
  try {
    const response = await generateJSON(SYSTEM_PROMPT, userPrompt);
    console.log("DEBUG: Mock Response inside blueprintGenerator:", JSON.stringify(response, null, 2));

    if (!response.blueprint || !Array.isArray(response.blueprint)) {
        throw new Error("Invalid format received from AI");
    }
    return response.blueprint;
  } catch (error) {
    console.error("Failed to generate blueprint:", error);
    throw error;
  }
}
