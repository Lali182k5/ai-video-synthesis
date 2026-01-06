# AI Video Synthesis System (Prototype)

An automated pipeline that converts educational topics into visual explainer videos using AI.

## 🚀 Overview

This system allows you to output a topic (e.g., "How Neural Networks Learn") and automatically generates:
1.  **Narration Script**: A scene-by-scene explanation.
2.  **Animation Blueprint**: A structured visual plan (JSON) compliant with a fixed "2D Explainer" style.
3.  **Video Render**: A final `.mp4` video generated programmatically via Python and Manim.

## 🛠️ Architecture

The system is split into two parts:

### Part A: Node.js (AI Logic)
*   **Stage 1 (Topic → Script)**: Uses OpenAI (or Mock Data) to write a script.
*   **Stage 2 (Script → Blueprint)**: Converts text into a visual plan using abstract shapes, arrows, and kinetic typography.

### Part B: Python (Rendering Engine)
*   **Stage 3 (Blueprint → Video)**:
    *   Calculates audio timing (TTS simulation).
    *   Dynamically builds a Manim scene from the JSON blueprint.
    *   Renders the final MP4 video.

## 📦 Installation

### Prerequisites
*   Node.js (v14+)
*   Python (v3.10+)
*   FFmpeg (Required for Manim)

### Setup

1.  **Clone & Install Dependencies**:
    ```bash
    # Node.js dependencies
    npm install

    # Python dependencies
    pip install -r python/requirements.txt
    python -m pip install manim
    ```

2.  **Configuration**:
    *   Create a `.env` file in the root directory.
    *   Add your OpenAI API Key: `OPENAI_API_KEY=sk-...`
    *   *(Note: If no key is provided, the system runs in "Mock Mode" with pre-set examples.)*

## 🎬 Usage

### 1. Run the Full Pipeline
You can run the entire process in two steps:

**Step 1: Generate Data (Node.js)**
```bash
npm start -- "How Photosynthesis Works"
```
*Outputs: `output_script.json` and `output_blueprint.json`*

**Step 2: Render Video (Python)**
```bash
python python/pipeline.py
```
*Outputs: `media/videos/render_engine/480p15/GeneratedScene.mp4`*

## 📁 Project Structure

```
ai-video-synthesis/
├── src/
│   ├── config.ts              # Fixed Visual Style Profile
│   ├── generators/            # AI Prompts (Script & Blueprint)
│   └── index.ts               # Node.js Entry Point
├── python/
│   ├── pipeline.py            # Rendering Orchestrator
│   ├── render_engine.py       # Manim Scene Generator
│   └── requirements.txt       # Python Dependencies
├── RENDER_DOCS.md             # Detailed Rendering Documentation
├── package.json
└── tsconfig.json
```

## 🧪 Testing (Mock Mode)
If you don't have an OpenAI key, the system supports these topics out-of-the-box:
*   "How Neural Networks Learn"
*   "How Photosynthesis Works"

Just run the commands above with these exact topic strings.

## ⚠️ Known Issues / Prototype Limitations
*   **Audio**: The current prototype simulates audio duration but does not generate actual MP3 voiceovers.
*   **Visuals**: The Manim renderer uses basic shapes (rectangles, circles) as placeholders for the blueprint's visual requests.
*   **Rendering**: Project requires `manim` and `ffmpeg` to be correctly installed in your system PATH.
