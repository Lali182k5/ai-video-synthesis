import { generateScript } from './generators/scriptGenerator';
import { generateBlueprint } from './generators/blueprintGenerator';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const topic = process.argv[2] || "How Web Sockets Work";
  console.log(`Starting AI Video Synthesis for topic: "${topic}"\n`);

  try {
    // STAGE 1: Generate Script
    console.log("--- STAGE 1: Generating Script ---");
    const script = await generateScript(topic);
    console.log(`Successfully generated ${script.length} scenes.`);
    
    // Save Script
    const scriptPath = path.join(__dirname, '../output_script.json');
    fs.writeFileSync(scriptPath, JSON.stringify(script, null, 2));
    console.log(`Script saved to ${scriptPath}\n`);

    // STAGE 2: Generate Blueprint
    console.log("--- STAGE 2: Generating Blueprint ---");
    const blueprint = await generateBlueprint(script);
    console.log(`Successfully generated blueprint.`);

    // Save Blueprint
    const blueprintPath = path.join(__dirname, '../output_blueprint.json');
    fs.writeFileSync(blueprintPath, JSON.stringify(blueprint, null, 2));
    console.log(`Blueprint saved to ${blueprintPath}\n`);

    // STAGE 3: Documentation
    console.log("--- STAGE 3: Video Rendering ---");
    console.log("Video rendering is handled externally.");
    console.log("Please refer to RENDER_DOCS.md for the Manim/FFmpeg rendering pipeline specification.");
    
  } catch (error) {
    console.error("An error occurred during the synthesis process:", error);
  }
}

main();
