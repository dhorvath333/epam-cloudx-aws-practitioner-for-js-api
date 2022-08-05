import { middyfy } from '@libs/lambda';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getDataBase } from '@src/database';

export const getProductById = async (event: Partial<APIGatewayProxyEvent>): Promise<APIGatewayProxyResult> => {
  const { productId } = event.pathParameters;

  console.log(`GET /products/${productId} `, event);

  if (!productId) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,GET"
      },
      body: JSON.stringify({
        message: 'No product ID provided!'
      }),
    }
  }

  const db = getDataBase();
  
  try {

    const query = await db.query('SELECT p.*, count FROM product p LEFT JOIN stock on product_id = p.id WHERE p.id::text = $1', [productId]);
    const product = query?.rows?.[0];

    if (!product) {
      return {
        statusCode: 404,
        headers: {
          "Access-Control-Allow-Headers" : "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS,GET"
        },
        body: JSON.stringify({
          message: `Product with ID ${productId} not found!`
        }),
      }
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,GET"
      },
      body: JSON.stringify(product),
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,GET"
      },
      body: JSON.stringify({
        message: 'Something went wrong while getting product by ID!',
        error
      })
    }
  } finally {
    await db.end();
  }
};

export const main = middyfy(getProductById);
