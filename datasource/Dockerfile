from node:16

# INSTAL PIP & PYTHON TRANSCRIPT API
RUN apt update -y && apt install -y python3 python3-pip && pip3 install youtube_transcript_api
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn
COPY . .
CMD ["yarn", "dev"]
