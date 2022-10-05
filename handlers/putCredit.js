const AWS = require('aws-sdk');

const dynamoDbClientParams = {};
if (process.env.IS_OFFLINE) {
  dynamoDbClientParams.region = 'localhost'
  dynamoDbClientParams.endpoint = 'http://localhost:8000'
}
const dynamoDbClient = new AWS.DynamoDB.DocumentClient(dynamoDbClientParams);

module.exports.putCredit = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  // validation
  if (!data.credit) {
    console.error('Validation Failed');
    callback(null, {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'No credit valid data.',
    });
    return;
  }

  const params = {
    TableName: process.env.CUSTOMERS_TABLE,
    Key: {
      customerId: event.pathParameters.id,
    },
    ExpressionAttributeNames: {
      '#credit': 'credit',
    },
    ExpressionAttributeValues: {
      ':credit': data.credit,
      ':updatedAt': timestamp,
    },
    UpdateExpression: 'SET #credit = :credit, updatedAt = :updatedAt',
    ReturnValues: 'ALL_NEW',
  };

  // update the todo in the database
  dynamoDbClient.update(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the todo item.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };
    callback(null, response);
  });
};