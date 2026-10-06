"""Optional Piper adapter. Engine and voice weights are not distributed."""
import json
import sys
import wave
from piper import PiperVoice
from piper.config import SynthesisConfig

with open(sys.argv[1], encoding="utf-8") as request_file:
    request = json.load(request_file)
voice = PiperVoice.load(request["model"])
config = SynthesisConfig(length_scale=1 / (1 + request["rate"] * 0.07), volume=request["volume"] / 100)
for segment in request["segments"]:
    with wave.open(segment["output"], "wb") as output:
        voice.synthesize_wav(segment["text"], output, syn_config=config)
