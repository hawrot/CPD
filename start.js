const inquirer = require('inquirer');
const AWS = require('aws-sdk');
const uuid = require('uuid');

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
      if(answers.reptile === 'Exit'){
          console.log('Thanks for using the app');
          return
      }
    console.info('Answer:', answers.reptile);
  });