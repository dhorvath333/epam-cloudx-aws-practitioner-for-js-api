import { middyfy } from '@libs/lambda';
import { APIGatewayProxyResult } from 'aws-lambda';
import { PRODUCTS } from '@src/products.store';

export const getProductsList = async (): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 200,
    body: JSON.stringify(PRODUCTS),
  }
};

export const main = middyfy(getProductsList);
