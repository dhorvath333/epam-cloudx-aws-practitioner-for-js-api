import { middyfy } from '@libs/lambda';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { S3, SQS } from 'aws-sdk';
import csv from 'csv-parser';
import internal from 'stream';
import { CORS_HEADERS } from '../../../cors-headers';

const { BUCKET, REGION, SQS_URL } = process.env;

const importFileParser = async (event: Partial<APIGatewayProxyEvent>): Promise<APIGatewayProxyResult> => {
  try {

    const s3 = new S3({
      region: REGION
    });

    for (const record of (event as any).Records) {
      const fileKey = record.s3.object.key;
      console.log('File Key: ', fileKey);

      const s3Params: S3.GetObjectRequest = {
        Bucket: BUCKET,
        Key: fileKey
      };

      const s3Stream = s3.getObject(s3Params).createReadStream();

      const parsedCSV = await parseCSV(s3Stream);

      await copyCSVToParsedFolder(s3, fileKey);

      console.log('Parsed CSV: ', parsedCSV);

      return {
        statusCode: 200,
        headers: {
          ...CORS_HEADERS
        },
        body: JSON.stringify({
          parsedCSV
        })
      }
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        ...CORS_HEADERS
      },
      body: JSON.stringify({
        message: 'Something went wrong while parsing the CSV!',
        error
      })
    }
  }
};

function parseCSV(stream: internal.Readable): Promise<any> {
  return new Promise((resolve, reject) => {
    const result = [];

    stream
      .pipe(csv())
      .on('data', data => {
        console.log('CSV data: ', data);
        sendToSQS(data);
        result.push(data);
      })
      .on('error', error => reject(error))
      .on('end', () => resolve(result));
  });
}

async function copyCSVToParsedFolder(s3: S3, fileKey: string): Promise<void> {
  await s3.copyObject({
    Bucket: BUCKET,
    CopySource: `${BUCKET}/${fileKey}`,
    Key: fileKey.replace('uploaded', 'parsed')
  }).promise();

  await s3.deleteObject({
    Bucket: BUCKET,
    Key: fileKey
  }).promise();

  console.log(`${fileKey} copied to parsed folder`);
}

 function sendToSQS(data) {
  const sqs = new SQS({
    region: REGION
  });

  sqs.sendMessage({
    QueueUrl: SQS_URL,
    MessageBody: JSON.stringify(data)
  }, (error, sqsData) => {
    if (error) {
      console.log('Error while sending data to SQS: ', error);
      return;
    }
    console.log('Data sent to SQS: ', sqsData);
    
  });
};

export const main = middyfy(importFileParser);
