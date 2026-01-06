from manim import *
import json
import os

class GeneratedScene(Scene):
    def construct(self):
        # Path to the blueprint file - expected to be in the parent dir or same dir
        # We will assume pipeline.py generates 'render_blueprint.json' in the same dir
        blueprint_path = os.path.join(os.path.dirname(__file__), 'render_blueprint.json')
        
        if not os.path.exists(blueprint_path):
            # Fallback for testing without pipeline
            blueprint_path = os.path.join(os.path.dirname(__file__), '../output_blueprint.json')

        with open(blueprint_path, 'r') as f:
            data = json.load(f)
            # Handle both raw blueprint list or object with 'blueprint' key
            if isinstance(data, dict):
                blueprint = data.get('blueprint', [])
            else:
                blueprint = data

        # iterate through scenes
        for scene_data in blueprint:
            self.animate_scene(scene_data)

    def animate_scene(self, scene_data):
        visual_elements = scene_data.get('visual_elements', [])
        animation_actions = scene_data.get('animation_actions', [])
        text_overlays = scene_data.get('text_overlays', [])
        duration = scene_data.get('duration_seconds', 4)
        
        # 1. Create Visual Group
        scene_group = VGroup()
        
        # Map visual elements to Manim objects
        # This is a basic mapping implementation
        for element in visual_elements:
            element = element.lower()
            if 'rect' in element:
                obj = Rectangle(color=BLUE, fill_opacity=0.5)
            elif 'circle' in element or 'node' in element:
                obj = Circle(color=WHITE, fill_opacity=0.2)
            elif 'arrow' in element:
                obj = Arrow(LEFT, RIGHT, color=YELLOW)
            elif 'brain' in element:
                # Placeholder for complex svg
                obj = Ellipse(width=2, height=1.5, color=PINK)
            else:
                # Default shape
                obj = Square(color=GREEN)
            
            # Scatter them slightly so they don't pile up exactly
            # In a real engine, we'd have positions in blueprint
            obj.shift(RIGHT * (len(scene_group) * 0.5))
            scene_group.add(obj)

        # Add text
        if text_overlays:
            text_mob = Text(text_overlays[0], font_size=36).to_edge(UP)
            scene_group.add(text_mob)
        
        scene_group.move_to(ORIGIN)

        # 2. Animate Entry
        run_time = 1.5
        if 'slide-in' in str(animation_actions):
            self.play(FadeIn(scene_group, shift=RIGHT), run_time=run_time)
        elif 'draw-line' in str(animation_actions):
             self.play(Create(scene_group), run_time=run_time)
        else:
            self.play(FadeIn(scene_group), run_time=run_time)

        # 3. Wait (Voiceover sync would happen here)
        # In a full impl, we would play audio: self.add_sound("scene_x.mp3")
        wait_time = max(0, duration - run_time - 1.0) # -1.0 for exit animation
        self.wait(wait_time)

        # 4. Cleanup/Exit
        self.play(FadeOut(scene_group))
