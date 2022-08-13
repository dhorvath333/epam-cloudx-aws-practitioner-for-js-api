import AWSMock from 'aws-sdk-mock';
import AWS from 'aws-sdk';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { importProductsFile } from '../src/functions/import-products-file/handler';

describe('importProductsFile', () => {
    beforeEach(() => {
        AWSMock.setSDKInstance(AWS);
        AWSMock.mock('S3', 'getSignedUrl', Promise.resolve('mock-signed-url'));
    });

    it('should return the signed url if name query param is provided', async () => {
        const event: Partial<APIGatewayProxyEvent> = {
            queryStringParameters: {
                name: "mock-file.csv"
            }
        };

        const result = await importProductsFile(event);

        expect(result.statusCode).toBe(200);
        expect(result.body).toBe(JSON.stringify('mock-signed-url'));
    })

    it('should return 400 if the name query param is missing', async () => {
        const event: Partial<APIGatewayProxyEvent> = {
            queryStringParameters: {}
        };

        const result = await importProductsFile(event);

        expect(result.statusCode).toBe(400);
        expect(result.body).toBe(JSON.stringify({
            message: 'Please provide a ?name query string value!'
        }));
    })

    it('should return 500 if getting the signed url fails', async () => {
        AWSMock.restore('S3');
        AWSMock.mock('S3', 'getSignedUrl', Promise.reject('mock-error'));

        const event: Partial<APIGatewayProxyEvent> = {
            queryStringParameters: {
                name: "mock-file.csv"
            }
        };

        const result = await importProductsFile(event);

        expect(result.statusCode).toBe(500);
        expect(result.body).toBe(JSON.stringify({
            message: 'Something went wrong getting signed URL!',
            error: 'mock-error'
        }));
    })
})