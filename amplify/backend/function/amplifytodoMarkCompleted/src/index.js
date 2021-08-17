/* Amplify Params - DO NOT EDIT
	API_AMPLIFYTODO_GRAPHQLAPIIDOUTPUT
	API_AMPLIFYTODO_TODOTABLE_ARN
	API_AMPLIFYTODO_TODOTABLE_NAME
	ENV
	REGION
Amplify Params - DO NOT EDIT */
const AWS = require("aws-sdk");

const STATUS = {
    PENDING: "PENDING",
    COMPLETED: "COMPLETED",
};

exports.handler = async (event) => {
    // TODO implement
    AWS.config.update({ region: process.env.REGION });
    const dynamo = new AWS.DynamoDB.DocumentClient();

    let response = {};

    console.log("Event: ", event);
    console.log("Event Args: ", event.arguments);
    console.log("Env: ", process.env);

    const { id } = event.arguments;

    try {
        const result = await dynamo
            .update({
                TableName: process.env.API_AMPLIFYTODO_TODOTABLE_NAME,
                Key: {
                    id,
                },
                UpdateExpression: "set #todoStatus = :status",
                ExpressionAttributeNames: {
                    "#todoStatus": "status",
                },
                ExpressionAttributeValues: {
                    ":status": STATUS.COMPLETED,
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
