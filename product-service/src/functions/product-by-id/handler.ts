import { middyfy } from '@libs/lambda';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { PRODUCTS } from '@src/products.store';

export const getProductById = async (event: Partial<APIGatewayProxyEvent>): Promise<APIGatewayProxyResult> => {
  const { productId } = event.pathParameters;
  if (!productId) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'No product ID provided!'
      }),
    }
  }

  const product = PRODUCTS.find(product => product.id === productId);
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
};

export const main = middyfy(getProductById);
