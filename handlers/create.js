const { v4 } = require('uuid')
const AWS = require('aws-sdk')

const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
    const data = JSON.parse(event.body);
    const timestamp = new Date().getTime();

    if (!data.name | !data.email | !data.phone | !data.country) {
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
        Item: {
            customerId: v4(),
            name: data.name,
            email: data.email,
            phone: data.phone,
            country: data.country,
            createdAt: timestamp,
            updatedAt: timestamp,
        },
    };

    dynamoDbClient.put(params, (error) => {
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
            body: JSON.stringify(params.Item),
        };
        callback(null, response);
    });
}