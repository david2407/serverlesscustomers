const AWS = require('aws-sdk')

const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

module.exports.getAllByCredits = (event, context, callback) => {
    const params = {
        TableName: process.env.CUSTOMERS_TABLE,
    };

    // fetch todo from the database
    dynamoDbClient.get(params, (error, result) => {
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
            body: JSON.stringify(result.Item.Items.sort((a, b) => (a.credit < b.credit) ? 1 : -1)),
        };
        callback(null, response);
    });
}