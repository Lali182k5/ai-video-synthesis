"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const scriptGenerator_1 = require("./generators/scriptGenerator");
const blueprintGenerator_1 = require("./generators/blueprintGenerator");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
async function main() {
    const topic = process.argv[2] || "How Web Sockets Work";
    console.log(`Starting AI Video Synthesis for topic: "${topic}"\n`);
    try {
        // STAGE 1: Generate Script
        console.log("--- STAGE 1: Generating Script ---");
        const script = await (0, scriptGenerator_1.generateScript)(topic);
        console.log(`Successfully generated ${script.length} scenes.`);
        // Save Script
        const scriptPath = path.join(__dirname, '../output_script.json');
        fs.writeFileSync(scriptPath, JSON.stringify(script, null, 2));
        console.log(`Script saved to ${scriptPath}\n`);
        // STAGE 2: Generate Blueprint
        console.log("--- STAGE 2: Generating Blueprint ---");
        const blueprint = await (0, blueprintGenerator_1.generateBlueprint)(script);
        console.log(`Successfully generated blueprint.`);
        // Save Blueprint
        const blueprintPath = path.join(__dirname, '../output_blueprint.json');
        fs.writeFileSync(blueprintPath, JSON.stringify(blueprint, null, 2));
        console.log(`Blueprint saved to ${blueprintPath}\n`);
        // STAGE 3: Documentation
        console.log("--- STAGE 3: Video Rendering ---");
        console.log("Video rendering is handled externally.");
        console.log("Please refer to RENDER_DOCS.md for the Manim/FFmpeg rendering pipeline specification.");
    }
    catch (error) {
        console.error("An error occurred during the synthesis process:", error);
    }
}
main();
