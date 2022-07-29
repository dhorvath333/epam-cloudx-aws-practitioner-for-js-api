import { middyfy } from '@libs/lambda';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { S3 } from 'aws-sdk';
import { BUCKET, REGION } from '../../../config';
import { CORS_HEADERS } from '../../../cors-headers';

export const importProductsFile = async (event: Partial<APIGatewayProxyEvent>): Promise<APIGatewayProxyResult> => {
  const { name } = event.queryStringParameters;

  console.log(`GET /import?name=${name}`);

  if (!name) {
    return {
      statusCode: 400,
      headers: {
        ...CORS_HEADERS
      },
      body: JSON.stringify({
        message: 'Please provide a ?name query string value!'
      })
    }
  }

  try {

    const s3 = new S3({
      region: REGION
    });

    const s3Params = {
      Bucket: BUCKET,
      Key: `uploaded/${name}`,
      Expires: 60,
      ContentType: 'text/csv'
    };

    const url = await s3.getSignedUrlPromise('putObject', s3Params);

    return {
      statusCode: 200,
      headers: {
        ...CORS_HEADERS
      },
      body: JSON.stringify(url)
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        ...CORS_HEADERS
      },
      body: JSON.stringify({
        message: 'Something went wrong getting signed URL!',
        error
      })
    }
  }

};

export const main = middyfy(importProductsFile);
