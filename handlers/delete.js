const AWS = require('aws-sdk');
const dynamoDbClientParams = {};
if (process.env.IS_OFFLINE) {
  dynamoDbClientParams.region = 'localhost'
  dynamoDbClientParams.endpoint = 'http://localhost:8000'
}
const dynamoDbClient = new AWS.DynamoDB.DocumentClient(dynamoDbClientParams);

module.exports.delete = (event, context, callback) => {
    const params = {
        TableName: process.env.CUSTOMERS_TABLE,
        Key: {
            customerId: event.pathParameters.id,
        },
    };

    dynamoDbClient.delete(params, (error) => {
        // handle potential errors
        if (error) {
            console.error(error);
            callback(null, {
                statusCode: error.statusCode || 501,
                headers: { 'Content-Type': 'text/plain' },
                body: 'Couldn\'t remove the todo item.',
            });
            return;
        }

        // create a response
        const response = {
            statusCode: 200,
            body: JSON.stringify('deleted'),
        };
        callback(null, response);
    });
};
