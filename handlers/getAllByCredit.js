const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDbClient = new AWS.DynamoDB.DocumentClient()

module.exports.getAllByCredit = (event, context, callback) => {
  const params = {
    TableName: process.env.CUSTOMERS_TABLE,
  };

  // fetch todo from the database
  dynamoDbClient.scan(params, (error, result) => {
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
    result.Items.sort((a, b) => (Number(a.credit) < Number(b.credit)) ? 1 : -1)
    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
    callback(null, response);
  });
};