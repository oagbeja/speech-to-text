import sys
from resemblyzer import VoiceEncoder, preprocess_wav
from pathlib import Path
import numpy as np

file1 = sys.argv[1]
file2 = sys.argv[2]

wav1 = preprocess_wav(Path(file1))
wav2 = preprocess_wav(Path(file2))

encoder = VoiceEncoder()
embed1 = encoder.embed_utterance(wav1)
embed2 = encoder.embed_utterance(wav2)

similarity = np.dot(embed1, embed2) / (np.linalg.norm(embed1) * np.linalg.norm(embed2))

print(f"{similarity:.3f}")
