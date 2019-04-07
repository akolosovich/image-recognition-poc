# image-recognition-poc

Playing around with image recognition libs ...

## Setup

Install dependencies

```bash
npm i
```

Create file _aws.config.json_ and put to {projectFolder}/config folder

```json
{
  "accessKeyId": "...", 
  "secretAccessKey": "...", 
  "region": "...",
  "apiVersions": {
    "rekognition": "2016-06-27"
  }
}
```

## Run aws-rekognition script

```bash
node src/aws-rekognition.js --file=$(pwd)/input/1.jpeg && open output.jpeg
```

## PS

Tested on Nodejs v8.15.1
