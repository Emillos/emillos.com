const aws = require('aws-sdk')

exports.handler = async (event) => {
  let response = {
      statusCode: 200,
      body: JSON.stringify({'message': 'ok'})
  }
  return response;
};