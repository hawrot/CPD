
let AWS = require("aws-sdk");
let s3 = new AWS.S3({ apiVersion: "2006-03-01", region: 'es-west-2' });
let rekognition = new AWS.Rekognition();
let docClient = new AWS.DynamoDB.DocumentClient();

let lambdaCallback, bucket, key;

let tableName = "image-collection-coursework";

exports.handler = function (event, context, callback) {
    lambdaCallback = callback;
    console.log(event);
    let body = JSON.parse(event.Records[0].body);
    bucket = body.Records[0].s3.bucket.name;
    key = body.Records[0].s3.object.key;
    rekognizeLabels(bucket, key)
        .then(function (data) {
            let labelData = data["Labels"];
            return rekognizeLabels(bucket, key)
        })
        .then(function(data){
            return addToTable(key, data);
        })
        .then(function(data){
            lambdaCallback(null, data)
        })
        .catch(function(err){
            lambdaCallback(err, null)
        });
}

function rekognizeLabels(bucket, key){
    let params = {
        Image: {
            S3Object: {
                Bucket: bucket,
                Name: key
            }
        },
        MaxLabels: 5,
        MinConfidence: 80
    };
    return rekognition.detectLabels(params).promise()
}

function addToTable(ObjectId, labels){
   
    let params = {
        TabelName: tableName,
        Item: {
            RekognitionId: ObjectId,
            labels: labels
        }
    }
    return docClient.put(params).promise();
}