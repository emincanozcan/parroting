# Parroting 🦜: Language Shadowing Platform

Parroting is a website that helps people to improve their speaking fluency and pronunciation by using a technique called `shadowing`.

[Click here to visit the live demo for English version.](https://parroting.emincanozcan.com/)

## What Is Shadowing?

Shadowing is a technique that is based on listening and repeating. Think it like you are being a parrot 🦜.

*The technique also called `imitation` or `echoing`.*

## Running Locally

* Prerequisites: Just docker-compose.

```bash
# Clone the repository
$ git clone git@github.com:emincanozcan/parroting.git

# Cd into it
$ cd parroting

# Create your env file
$ cp .env.example .env

# Open the .env file with your favorite text editor, and update the YOUTUBE_API_KEY field.

# Up the project by Docker
$ docker-compose up
```

## TechStack

* FrontEnd:
  * Next.JS
  * Tailwind CSS
* DataSource
  * Node.js / Express application
  * MongoDB
  * Little bit Python to use an open source library that helps to fetch transcripts of a Youtube video. 

## License

[MIT](https://github.com/emincanozcan/parroting/blob/main/LICENSE)
