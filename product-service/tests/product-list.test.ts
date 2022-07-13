import { getProductsList } from '../src/functions/product-list/handler';
import * as productStore from '../src/products.store';

describe('getProductsList', () => {
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

    it('should return a status code of 200', async () => {
        const result = await getProductsList();
        expect(result.statusCode).toBe(200);
    });

    it('should return a product list of 3 items', async () => {
        const result = await getProductsList();
        expect(JSON.parse(result.body).length).toBe(3);
    });
});