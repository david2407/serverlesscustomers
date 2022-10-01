const AWS = require("aws-sdk");
const CUSTOMERS_TABLE = process.env.CUSTOMERS_TABLE;
const CREDIT_TABLE = process.env.CREDIT_TABLE;
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

const getAll = async () => {
    const params = {
        TableName: CUSTOMERS_TABLE,
    }

    return await dynamoDbClient.scan(params).promise()
}

const create = async (customer) => {

    const params = {
        TableName: CUSTOMERS_TABLE,
        Item: {
            customerId: customer.customerId,
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            country: customer.country
        }
    }

    return await dynamoDbClient.put(params).promise()
}

const update = async (customerId, customer) => {
    const params = {
        TableName: CUSTOMERS_TABLE,
        Key: {
            customerId : customerId
        },
        UpdateExpression: 'set #name = :v_name, #email = :v_email, #phone = :v_phone, #country = :v_country',
        ExpressionAttributeNames: {
            '#name': 'name',
            '#email': 'email',
            '#phone': 'phone',
            '#country': 'country'
        },
        ExpressionAttributeValues: {
            ':v_name': customer.name,
            ':v_email': customer.email,
            ':v_phone': customer.phone,
            ':v_country': customer.country,
        },
        ReturnValues: "ALL_NEW"
    }

    return await dynamoDbClient.update(params).promise();
}

const deleteOne = async (customerId) => {
    const params = {
        TableName: CUSTOMERS_TABLE,
        Key: {
            customerId: customerId,
        }
    }

    return await dynamoDbClient.delete(params).promise()
}

const getAllByCredit = async () => {
    const params = {
        TableName: CUSTOMERS_TABLE,
    }
    const items = await dynamoDbClient.scan(params).promise()
    return items.Items.sort((a, b) => (a.credit < b.credit) ? 1 : -1)
}

const updateCredit = async (customerId, credit) => {
    const params = {
        TableName: CUSTOMERS_TABLE,
        Key: {
            customerId: customerId
        },
        UpdateExpression: "set credit = :creditValue",
        ExpressionAttributeValues: { ":creditValue": credit }
    }

    return await dynamoDbClient.update(params).promise()
}

module.exports = { getAll, create, update, deleteOne, getAllByCredit, updateCredit }