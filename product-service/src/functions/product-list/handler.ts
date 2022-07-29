import { middyfy } from '@libs/lambda';
import { APIGatewayProxyResult } from 'aws-lambda';
import { getDataBase } from '@src/database';

export const getProductsList = async (): Promise<APIGatewayProxyResult> => {
  console.log('GET /products');

  try {
    const db = getDataBase();

    const query = await db.query('SELECT p.*, count FROM product p LEFT JOIN stock on product_id = p.id');
    const products = query?.rows;
    await db.end();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,GET"
      },
      body: JSON.stringify(products),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Something went wrong while getting product list!',
        error
      })
    }
  }
};

export const main = middyfy(getProductsList);
