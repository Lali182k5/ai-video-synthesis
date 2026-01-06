# Stage 3: Video Rendering Pipeline Implementation Guide

This document outlines the architecture for converting the generated **Animation Blueprint** (Stage 2) into a final MP4 video. This process is decoupled from the web application and runs continuously or on-demand via worker nodes.

## Pipeline Overview

1.  **Input**: `output_blueprint.json` (Structured Animation Data)
2.  **Audio Synthesis**: AI TTS (Text-to-Speech)
3.  **Visual Rendering**: Python / Manim
4.  **Compositing**: FFmpeg

---

## 1. Audio Mapping (TTS)

For each scene in the blueprint, the `narration` field from the script (linked via `scene_number`) is sent to a TTS service (e.g., OpenAI Audio API, ElevenLabs).

*   **Input**: `scene.narration` string
*   **Output**: `scene_X_audio.mp3`
*   **Constraint**: The duration of the generated audio must be measured to adjust the `duration_seconds` in the blueprint if the visual duration is too short.

## 2. Visual Rendering Strategy (Manim)

We use **Manim (Community Edition)** for programmatic animation generation. The abstract `visual_elements` and `animation_actions` must be mapped to Manim classes.

### Mapping Table

| Blueprint Element | Manim Class | Details |
| :--- | :--- | :--- |
| `rectangle` | `Rectangle()` | `WHITE` stroke, transparency or solid fill |
| `circle` | `Circle()` | `WHITE` stroke |
| `arrow` | `Arrow()` | Connecting two `Mobject` centers |
| `text` | `Text()` | Sans-serif font, geometric |

### Mapping Animations

| Blueprint Action | Manim Animation | Details |
| :--- | :--- | :--- |
| `slide-in` | `FadeIn(mob, shift=LEFT)` | Smooth entry |
| `fade-in` | `FadeIn(mob)` | Simple opacity change |
| `draw-line` | `Create(mob)` | Drawing stroke animation |
| `transform` | `Transform(mobA, mobB)` | Morphing shapes |

### Dynamic Script Generation
A Python script (`render_engine.py`) imports the JSON blueprint and dynamically constructs the Manim `Scene` class.

```python
# Pseudo-code for render_engine.py
import json
from manim import *

class GeneratedScene(Scene):
    def construct(self):
        blueprint = json.load(open("output_blueprint.json"))
        
        for step in blueprint:
            # 1. Create Visuals
            visuals = Group()
            for element in step['visual_elements']:
                if element == 'rectangle':
                    visuals.add(Rectangle())
                # ... other mappings
            
            # 2. Animate
            if 'slide-in' in step['animation_actions']:
                self.play(FadeIn(visuals, shift=RIGHT), run_time=1.0)
            
            # 3. Wait (sync with audio)
            self.wait(step['duration_seconds'])
            
            # 4. Cleanup
            self.play(FadeOut(visuals))
```

## 3. Compositing (FFmpeg)

Once Manim renders the video stream (`video.mp4`) and TTS generates audio segments, FFmpeg combines them.

**Command:**
```bash
ffmpeg -i video.mp4 -i audio_track.mp3 -c:v copy -c:a aac -strict experimental output.mp4
```

## 4. Execution Flow

1.  Node.js app saves `output_blueprint.json`.
2.  Node.js app triggers Python worker.
3.  Python worker generates audio assets.
4.  Python worker updates blueprint durations based on audio length.
5.  Python worker runs Manim render command.
6.  System executes FFmpeg merge.
7.  Final `MP4` is uploaded to cloud storage.

## 5. Setup & Installation

### Windows Prerequisites
1.  **Install FFmpeg**:
    *   Download from [ffmpeg.org](https://ffmpeg.org/download.html)
    *   Add to system PATH.
2.  **Install Manim**:
    *   If `pip` fails with "Access Denied", use:
        ```bash
        python -m pip install manim
        ```
    *   Requires a LaTeX distribution (like MiKTeX) for text rendering.

### Troubleshooting
*   **"Access is denied" on pip**: Use `python -m pip install ...` instead of `pip install ...`.
*   **Manim missing**: Ensure `manim` is in your PATH or run via `python -m manim`.
