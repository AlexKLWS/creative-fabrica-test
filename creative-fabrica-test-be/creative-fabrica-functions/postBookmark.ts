import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { db } from './lib/db';

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const username = event?.headers?.['username'];

        if (!username || !event?.body) {
            throw new Error('Username or body missing!');
        }

        const body = JSON.parse(event.body);

        await db
            .insertInto('bookmarks')
            .values({
                username,
                posting_id: body.postingId,
            })
            .executeTakeFirst();

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'OK',
            }),
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }
};
