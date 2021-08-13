/* Amplify Params - DO NOT EDIT
	API_AMPLIFYTODO_GRAPHQLAPIIDOUTPUT
	API_AMPLIFYTODO_TODOTABLE_ARN
	API_AMPLIFYTODO_TODOTABLE_NAME
	ENV
	REGION
Amplify Params - DO NOT EDIT */
const AWS = require("aws-sdk");

exports.handler = async (event) => {
    // TODO implement
    AWS.config.update({ region: process.env.REGION });
    const dynamo = new AWS.DynamoDB.DocumentClient();

    let response = {};

    console.log("Event: ", event);
    console.log("Event Args: ", event.arguments);
    console.log("Env: ", process.env);

    const { id, todo, priority } = event.arguments;

    try {
        const result = await dynamo
            .update({
                TableName: process.env.API_AMPLIFYTODO_TODOTABLE_NAME,
                Key: {
                    id,
                },
                UpdateExpression: "set todo = :todo, priority = :priority",
                ExpressionAttributeValues: {
                    ":todo": todo,
                    ":priority": priority,
                },
                ReturnValues: "ALL_NEW",
            })
            .promise();

        console.log(result);

        response = { ...result.Attributes };
    } catch (err) {
        console.log(err);
    }

    return response;
};
