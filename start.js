const inquirer = require('inquirer');
const AWS = require('aws-sdk');
const uuid = require('uuid');
const fs = require('fs');

const ID = 'AKIAXOX5QUJFMS6W43O3';
const SECRET = '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';
const BUCKET = 'cpd-coursework-rekognition';



inquirer
  .prompt([
    {
      type: 'list',
      name: 'reptile',
      message: 'What do you want to do',
      choices: ['Upload', 'Display', 'Download Image', 'Exit'],
    },
  ])
  .then(answers => {
    if (answers.reptile === 'Exit') {
      console.log('Thanks for using the app');
      return
    }
    if(answers.reptile === 'Display'){
      downloadFile();
    }

    if (answers.reptile === 'Upload') {
      let question = [{
        type: 'input',
        name: 'file',
        message: 'What is the name of the file?'
      }]
      inquirer.prompt(question).then(answers => {
        uploadImage(answers['file']);
      })
    }
    console.info('Answer:', answers.reptile);
  });
    



function uploadImage(filename) {

  const s3 = new AWS.S3({
    accessKeyId: this.ID,
    secretAccessKey: this.SECRET
  });

  let fileContent = fs.readFileSync(filename);

  const params = {
    Bucket: 'cpd-coursework-rekognition',
    Key: filename,
    Body: fileContent
  };

  s3.upload(params, function (err, data) {
    if (err) {
      throw err;
    }
    console.log(`File uploaded to:  ${data.Location}`);
  });

};

async function downloadFile() {
  const s3 = new AWS.S3({
    
    accessKeyId: this.ID,
    secretAccessKey: this.SECRET
  });

  let isTruncated = true;
  let marker;
  while(isTruncated) {
    let params = { Bucket: 'cpd-coursework-rekognition'};
    if (marker) params.Marker = marker;
    try {
      const response = await s3.listObjects(params).promise();
      response.Contents.forEach(item => {
        console.log(item.Key);
      });
      isTruncated = response.IsTruncated;
      if (isTruncated) {
        marker = response.Contents.slice(-1)[0].Key;
      }
  } catch(error) {
      throw error;
    }
  }

};
