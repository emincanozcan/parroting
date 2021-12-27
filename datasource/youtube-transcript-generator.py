import json
import sys
import uuid

# TODO: create node version of this library, I think there is no alternative for now.
from youtube_transcript_api import YouTubeTranscriptApi

fileName = uuid.uuid4()
path = f"/tmp/tt-{fileName}.json"
t = YouTubeTranscriptApi.get_transcripts(sys.argv[1:], languages=['en','en-US'])
f = open(path, "w")
json.dump(t, f)
f.close()
print(path)
