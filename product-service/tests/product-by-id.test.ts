import { APIGatewayProxyEvent } from 'aws-lambda';
import { getProductById } from '../src/functions/product-by-id/handler';
import * as productStore from '../src/products.store';

describe('getProductById', () => {
    beforeAll(() => {
        (productStore as any).PRODUCTS = [
            {
                id: '1',
                name: 'Mock product 1',
                price: 10.99
            },
            {
                id: '2',
                name: 'Mock product 2',
                price: 12.99
            },
            {
                id: '3',
                name: 'Mock product 3',
                price: 9.99
            }
        ];
    });

    it('should return a status code of 200 and the product if requesting an existing item', async () => {
        const event: Partial<APIGatewayProxyEvent> = {
            pathParameters: {
                productId: "1"
            }
        };

        const result = await getProductById(event);
        expect(result.statusCode).toBe(200);
        expect(result.body).toBe(JSON.stringify({
            id: '1',
            name: 'Mock product 1',
            price: 10.99
        }));
    });

    it('should return a status code of 404 and an error message if requested product does not exist', async () => {
        const event: Partial<APIGatewayProxyEvent> = {
            pathParameters: {
                productId: "99"
            }
        };

        const result = await getProductById(event);
        expect(result.statusCode).toBe(404);
        expect(JSON.parse(result.body).message).toBe('Product with ID 99 not found!');
    });

    it('should return a status code of 400 and an error message if the productId parameter is not provided', async () => {
        const event: Partial<APIGatewayProxyEvent> = {
            pathParameters: {}
        };

        const result = await getProductById(event);
        expect(result.statusCode).toBe(400);
        expect(JSON.parse(result.body).message).toBe('No product ID provided!');
    });
});