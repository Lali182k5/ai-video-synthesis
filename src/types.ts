// STAGE 1 OUTPUT FORMAT
export interface ScriptScene {
  scene_number: number;
  narration: string;
  explanation: string;
}

// STAGE 2 OUTPUT FORMAT
export interface VisualizationActions {
  visual_elements: string[];
  text_overlays: string[];
  animation_actions: string[];
  duration_seconds: number;
  transition: string;
  asset_prompt: string;
}

export interface BlueprintScene extends VisualizationActions {
  scene_number: number;
}

// STYLE PROFILE
export interface StyleProfile {
  animation_type: string;
  visual_language: string;
  explanation_method: string;
  text_style: string;
  motion_style: string;
  narrative_style: string;
  constraints: string[];
}
