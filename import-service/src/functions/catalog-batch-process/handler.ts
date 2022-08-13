import { middyfy } from '@libs/lambda';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { S3 } from 'aws-sdk';
import { BUCKET, REGION } from '../../../config';
import { CORS_HEADERS } from '../../../cors-headers';

export const catalogBatchProcess = async (event: Partial<APIGatewayProxyEvent>): Promise<APIGatewayProxyResult> => {
  
};

export const main = middyfy(catalogBatchProcess);
