import OpenAI from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key',
  dangerouslyAllowBrowser: true 
});

export async function generateJSON(systemPrompt: string, userPrompt: string): Promise<any> {
    if (!process.env.OPENAI_API_KEY) {
        console.warn("No OPENAI_API_KEY found. Returning mock data would happen here in a real separate mock service, but calling API will fail.");
    }

    try {
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            model: "gpt-4-turbo-preview", // Use a smart model for better structured output
            response_format: { type: "json_object" },
        });

        const content = completion.choices[0].message.content;
        if (!content) {
            throw new Error("No content received from OpenAI");
        }

        return JSON.parse(content);
    } catch (error: any) {
        if (error?.status === 401) {
            console.warn("\n[Warning] Authentication failed (Invalid API Key). Switching to MOCK DATA mode for demonstration.\n");
            return getMockData(systemPrompt, userPrompt);
        }
        console.error("Error calling OpenAI:", error);
        throw error;
    }
}

function getMockData(systemContext: string, userContext: string = ""): any {
    const context = systemContext.toLowerCase();
    const userPrompt = userContext.toLowerCase();
    
    // --- TOPIC: PHOTOSYNTHESIS (New Mock Case) ---
    if (userPrompt.includes("photosynthesis")) {
        // Blueprint for Photosynthesis
        if (context.includes("blueprint") || context.includes("visual style")) {
            return {
                "blueprint": [
                    {
                        "scene_number": 1,
                        "visual_elements": ["sun_icon", "leaf_shape"],
                        "text_overlays": ["Sunlight", "Energy"],
                        "animation_actions": ["fade-in", "pulse"],
                        "duration_seconds": 6,
                        "transition": "fade",
                        "asset_prompt": "Vector icon of sun shining on a leaf"
                    },
                    {
                        "scene_number": 2,
                        "visual_elements": ["water_drop", "co2_cloud", "arrow_into_leaf"],
                        "text_overlays": ["H2O + CO2", "Inputs"],
                        "animation_actions": ["slide-down", "draw-arrow"],
                        "duration_seconds": 8,
                        "transition": "slide",
                        "asset_prompt": "Diagram showing water and air entering a leaf"
                    },
                    {
                        "scene_number": 3,
                        "visual_elements": ["sugar_cube", "oxygen_bubble", "arrow_out"],
                        "text_overlays": ["Glucose", "Oxygen"],
                        "animation_actions": ["transform", "float-up"],
                        "duration_seconds": 7,
                        "transition": "fade",
                        "asset_prompt": "Sugar and oxygen output visualization"
                    }
                ]
            };
        }
        // Script for Photosynthesis
        if (context.includes("narration script")) {
            return {
                "scenes": [
                    {
                        "scene_number": 1,
                        "narration": "Photosynthesis is the process by which plants use sunlight, water, and carbon dioxide to create oxygen and energy in the form of sugar.",
                        "explanation": "Definition of Photosynthesis"
                    },
                    {
                        "scene_number": 2,
                        "narration": "Roots absorb water from the ground, while leaves take in carbon dioxide from the air and capture energy from the sun.",
                        "explanation": "Inputs explanation"
                    },
                    {
                        "scene_number": 3,
                        "narration": "The plant creates glucose for growth and releases oxygen back into the air as a byproduct.",
                        "explanation": "Outputs explanation"
                    }
                ]
            };
        }
    }

    // --- TOPIC: DEFAULT (Neural Networks) ---
    // Return Mock Blueprint
    // NOTE: Check this FIRST because the blueprint prompt *also* contains the words "narration script".
    if (context.includes("blueprint") || context.includes("visual style")) {
        return {
            "blueprint": [
                {
                    "scene_number": 1,
                    "visual_elements": ["brain_icon", "network_nodes"],
                    "text_overlays": ["Neural Network"],
                    "animation_actions": ["fade-in", "pulse"],
                    "duration_seconds": 6,
                    "transition": "fade",
                    "asset_prompt": "Abstract line art of a brain using network nodes"
                },
                {
                    "scene_number": 2,
                    "visual_elements": ["layers", "circles", "arrows"],
                    "text_overlays": ["Input Layer", "Hidden Layer"],
                    "animation_actions": ["slide-in-left", "highlight"],
                    "duration_seconds": 8,
                    "transition": "slide",
                    "asset_prompt": "Vector diagram of neural network layers"
                },
                {
                    "scene_number": 3,
                    "visual_elements": ["data_stream", "arrow_flow"],
                    "text_overlays": ["Data Flow", "Output"],
                    "animation_actions": ["draw-line", "move-right"],
                    "duration_seconds": 7,
                    "transition": "fade",
                    "asset_prompt": "Flowchart arrow moving through nodes"
                }
            ]
        };
    }

    // Return Mock Script
    if (context.includes("narration script")) {
        return {
            "scenes": [
                {
                    "scene_number": 1,
                    "narration": "Neural networks are computing systems inspired by the biological neural networks that constitute animal brains.",
                    "explanation": "Definition of Neural Networks"
                },
                {
                    "scene_number": 2,
                    "narration": "They consist of layers of nodes, called neurons, which process specific features of the input data.",
                    "explanation": "Explaining layers and neurons"
                },
                {
                    "scene_number": 3,
                    "narration": "Information flows through these layers, getting transformed at each step to produce a final output.",
                    "explanation": "Data flow description"
                }
            ]
        };
    }

    console.warn("Mock Data Generator: Could not match system prompt to a known mock data type. Prompt start:", systemContext.substring(0, 50));
    return {};
}
