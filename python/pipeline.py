import json
import os
import sys
import subprocess
import platform

# Configuration
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCRIPT_PATH = os.path.join(ROOT_DIR, 'output_script.json')
BLUEPRINT_PATH = os.path.join(ROOT_DIR, 'output_blueprint.json')
RENDER_BLUEPRINT_PATH = os.path.join(os.path.dirname(__file__), 'render_blueprint.json')

def load_json(path):
    if not os.path.exists(path):
        print(f"Error: File not found: {path}")
        return None
    with open(path, 'r') as f:
        return json.load(f)

def generate_audio(script_scenes):
    """
    Mock or real TTS generation. 
    In a real scenario, this would call OpenAI API to generate MP3s 
    and return exact durations.
    """
    print("--- 3.1 Audio Synthesis (TTS) ---")
    audio_map = {}
    for scene in script_scenes:
        sid = scene['scene_number']
        narr = scene['narration']
        print(f"Generating audio for Scene {sid}: \"{narr[:30]}...\"")
        
        # MOCK: Calculate duration based on word count (approx 2 words per sec)
        word_count = len(narr.split())
        approx_duration = max(2, word_count / 2.5) 
        
        audio_map[sid] = {
            "file": f"scene_{sid}.mp3",
            "duration": approx_duration
        }
        # In real impl: save scene_{sid}.mp3 here
        
    return audio_map

def update_blueprint(blueprint, audio_map):
    """
    Updates blueprint durations to match audio.
    """
    print("--- 3.2 Updating Blueprint Timings ---")
    
    # Handle structure variance (array vs object)
    scenes = blueprint if isinstance(blueprint, list) else blueprint.get('blueprint', [])
    
    for scene in scenes:
        sid = scene['scene_number']
        if sid in audio_map:
            original_dur = scene.get('duration_seconds', 0)
            audio_dur = audio_map[sid]['duration']
            
            # Pad slightly for transitions
            new_dur = max(original_dur, audio_dur + 1.0)
            scene['duration_seconds'] = new_dur
            print(f"Scene {sid}: Adjusted duration {original_dur}s -> {new_dur:.2f}s")
            
    return scenes

def run_manim():
    """
    Executes Manim render command.
    """
    print("--- 3.3 Visual Rendering (Manim) ---")
    
    # Check if manim is installed
    try:
        subprocess.run(["manim", "--version"], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    except (FileNotFoundError, subprocess.CalledProcessError):
        print("\n[WARNING] Manim is not installed or not in PATH.")
        print("Skipping actual video rendering.")
        print("To render: pip install manim && manim -pql python/render_engine.py GeneratedScene")
        return

    render_script = os.path.join(os.path.dirname(__file__), 'render_engine.py')
    
    # Command: manim -qm -o output.mp4 render_engine.py GeneratedScene
    # -qm = medium quality, -o = output file
    cmd = ["manim", "-ql", "--media_dir", os.path.join(ROOT_DIR, "media"), render_script, "GeneratedScene"]
    
    print(f"Executing: {' '.join(cmd)}")
    subprocess.run(cmd)

def main():
    print("Starting Python Rendering Pipeline...")
    
    # 1. Load Data
    script_data = load_json(SCRIPT_PATH)
    blueprint_data = load_json(BLUEPRINT_PATH)
    
    if not script_data or not blueprint_data:
        print("Missing input files. Please run 'npm start' first.")
        return

    # Extract lists if wrapped in objects
    if isinstance(script_data, dict):
        script_scenes = script_data.get('scenes', [])
    else:
        script_scenes = script_data
    
    # 2. Process Audio
    audio_map = generate_audio(script_scenes)
    
    # 3. Update Visuals
    final_scenes = update_blueprint(blueprint_data, audio_map)
    
    # 4. Save Final Render Blueprint
    with open(RENDER_BLUEPRINT_PATH, 'w') as f:
        json.dump(final_scenes, f, indent=2)
    print(f"Saved optimized blueprint to {RENDER_BLUEPRINT_PATH}")
    
    # 5. Render
    run_manim()
    
    print("\nPipeline Complete.")

if __name__ == "__main__":
    main()
