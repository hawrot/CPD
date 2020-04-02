const inquirer = require('inquirer');
const AWS = require('aws-sdk');
const fs = require('fs');



const ID = 'Type ID Here';
const SECRET = 'Type Secret Here;
const BUCKET = 'Type Bucket here';



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
    if (answers.reptile === 'Display') {
      listFiles();
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
    if (answers.reptile === 'Download Image') {
      let question = [{
        type: 'input',
        name: 'file',
        message: 'What is the name of the file?'
      }]
      inquirer.prompt(question).then(answers => {
        download(answers['file']);
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
    Bucket: 'TYPE BUCKET NAME HERE',
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

async function listFiles() {
  const s3 = new AWS.S3({
     accessKeyId: this.ID,
    secretAccessKey: this.SECRET
  });

  let isTruncated = true;
  let marker;
  while (isTruncated) {
    let params = { Bucket: 'TYPE BUCKET NAME HERE' };
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
    } catch (error) {
      throw error;
    }
  }
};

function download(fileName){
  let fileDest = fs.createWriteStream(`/users/mateusz/downloads/${fileName}`);
  const s3 = new AWS.S3({

    accessKeyId: this.ID,
    secretAccessKey: this.SECRET
  });
  let s3Stream = s3.getObject({Bucket: 'TYPE BUCKET NAME HERE', Key: fileName}).createReadStream();
  s3Stream.on('error', function(err) {

    console.error(err);
});
s3Stream.pipe(fileDest).on('error', function(err) {

    console.error('File Stream:', err);
}).on('close', function() {
    console.log('File ' + fileName + ' downloaded');
});
}
