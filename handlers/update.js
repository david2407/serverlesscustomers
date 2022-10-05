const AWS = require('aws-sdk')

const dynamoDbClientParams = {};
if (process.env.IS_OFFLINE) {
  dynamoDbClientParams.region = 'localhost'
  dynamoDbClientParams.endpoint = 'http://localhost:8000'
}
const dynamoDbClient = new AWS.DynamoDB.DocumentClient(dynamoDbClientParams);

module.exports.update = (event, context, callback) => {
    const data = JSON.parse(event.body);

    if (!data.name | !data.email | !data.phone | !data.country | !event.pathParameters.id) {
        console.error('Validation Failed');
        callback(null, {
            statusCode: 400,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Couldn\'t create the todo item.',
        });
        return;
    }

    const params = {
        TableName: process.env.CUSTOMERS_TABLE,
        Key: {
            customerId : event.pathParameters.id
        },
        UpdateExpression: 'set #name = :v_name, #email = :v_email, #phone = :v_phone, #country = :v_country',
        ExpressionAttributeNames: {
            '#name': 'name',
            '#email': 'email',
            '#phone': 'phone',
            '#country': 'country'
        },
        ExpressionAttributeValues: {
            ':v_name': data.name,
            ':v_email': data.email,
            ':v_phone': data.phone,
            ':v_country': data.country,
        },
        ReturnValues: "ALL_NEW"
    }

    dynamoDbClient.update(params, (error, result) => {
        if (error) {
            console.error(error);
            callback(null, {
                statusCode: error.statusCode || 501,
                headers: { 'Content-Type': 'text/plain' },
                body: 'Couldn\'t create the todo item.',
            });
            return;
        }

        const response = {
            statusCode: 200,
            body: JSON.stringify(result.Attributes),
        };
        callback(null, response);
    });
}