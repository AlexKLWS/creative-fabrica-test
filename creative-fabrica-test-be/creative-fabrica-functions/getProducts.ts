import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { db } from './lib/db';
import { sql } from 'kysely';
import { objectToCamel, objectToSnake } from 'ts-case-convert';
import { jsonObjectFrom } from 'kysely/helpers/mysql';

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
        console.log('EVENT: \n' + JSON.stringify(event, null, 2));

        const username = event?.headers?.['username'];
        console.log('🚀 ~ file: getProducts.ts ~ line 22 ~ lambdaHandler ~ username', username);

        let query = db
            .selectFrom('products')
            .selectAll()
            .select((eb) => {
                return jsonObjectFrom(
                    eb
                        .selectFrom('users as u')
                        .select(['u.id', 'u.name', 'u.avatar_image_url'])
                        .whereRef('u.id', '=', eb.ref('products.created_by')),
                ).as('created_by_user');
            });

        if (username) {
            query = query.select([
                sql<string>`CASE WHEN EXISTS (SELECT 1 FROM bookmarks WHERE bookmarks.posting_id = products.id AND bookmarks.username = ${username}) THEN TRUE ELSE FALSE END`.as(
                    'is_bookmarked',
                ),
            ]);
        }

        const productsRaw = await query.limit(10).execute();

        let products = objectToCamel(productsRaw);

        products = products.map((p) => {
            p.createdBy = p.createdByUser;
            // @ts-expect-error TODO: add database types
            delete p.createdByUser;

            p.isBookmarked = p.isBookmarked === 1;
            return p;
        });

        return {
            statusCode: 200,
            body: JSON.stringify(products),
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
