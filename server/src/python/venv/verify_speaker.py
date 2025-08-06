import sys
from resemblyzer import VoiceEncoder, preprocess_wav
from pathlib import Path
import numpy as np
import os
import json

def add_to_json(data,embed,json_path,name):  
        
    if hasattr(embed, "tolist"):
        embed = embed.tolist()

    data[name]= {"embed": embed, "name":name}
    with open(json_path, "w") as f:
        json.dump(data, f, indent=4)
        
def fetch_json_recs(json_path):
    if os.path.exists(json_path):
        with open(json_path, "r") as f:
            data = json.load(f)
    else:
        data = {}
    return data

def is_similar(embed,embed_in_json):
    similarity = np.dot(embed, embed_in_json) / (np.linalg.norm(embed) * np.linalg.norm(embed_in_json))
    print(f"similarity: {similarity}")
    return similarity >= 0.5

filename = sys.argv[1]
json_path  = sys.argv[2]
id = sys.argv[3]

data = fetch_json_recs(json_path)

wav = preprocess_wav(Path(filename))
encoder = VoiceEncoder()
embed = encoder.embed_utterance(wav)

count = len(data)
print(f'count {count}')
if count > 0:
    check_true = False
    for key, value in data.items():
        embed_data = value["embed"]
        if is_similar(embed,embed_data):
            known_name =value["name"]
            print (f"Known name : {known_name}")
            check_true = True
            break
    if not check_true:
        add_to_json(data = data,embed= embed,json_path = json_path,name=id)
        print(f"{filename} ")
        print(f"Embed : {embed} ")
else:
    add_to_json(data = data,embed= embed,json_path = json_path,name=id)
    print(f"{filename} ")
    print(f"Embed : {embed} ")






# embed2 = encoder.embed_utterance(wav2)

# similarity = np.dot(embed1, embed2) / (np.linalg.norm(embed1) * np.linalg.norm(embed2))

# print(f"{similarity:.3f}")

