import 'source-map-support/register'
import { APIGatewayProxyHandler } from 'aws-lambda';

export const handler: APIGatewayProxyHandler = async (event, context) => {
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Health check passed',
        }),
    };
};