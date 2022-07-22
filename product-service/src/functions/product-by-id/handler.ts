import { middyfy } from '@libs/lambda';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getDataBase } from '@src/database';

export const getProductById = async (event: Partial<APIGatewayProxyEvent>): Promise<APIGatewayProxyResult> => {
  const { productId } = event.pathParameters;

  console.log(`GET /products/${productId}`);

  if (!productId) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'No product ID provided!'
      }),
    }
  }

  try {
    const db = getDataBase();

    const query = await db.query('SELECT p.*, count FROM product p LEFT JOIN stock on product_id = p.id WHERE p.id = $1', [productId]);
    const product = query?.rows?.[0];
    await db.end();

    if (!product) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: `Product with ID ${productId} not found!`
        }),
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify(product),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Something went wrong while getting product by ID!',
        error
      })
    }
  }
};

export const main = middyfy(getProductById);
