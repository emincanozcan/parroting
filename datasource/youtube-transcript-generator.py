import json
import sys
import uuid

# TODO: create node version of this library, I think there is no alternative for now.
from youtube_transcript_api import YouTubeTranscriptApi

fileName = uuid.uuid4()
path = f"/tmp/tt-{fileName}.json"
finalData = {}
for videoId in sys.argv[1:]:
    transcript_list = YouTubeTranscriptApi.list_transcripts(videoId)
    t = transcript_list.find_manually_created_transcript(['en','en-US'])
    t = t.fetch()
    finalData[videoId] = t
# t = YouTubeTranscriptApi.get_transcripts(sys.argv[1:], languages=['en','en-US'])
f = open(path, "w")
json.dump(finalData, f)
f.close()
print(path)
