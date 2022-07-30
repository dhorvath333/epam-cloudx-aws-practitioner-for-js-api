import { middyfy } from '@libs/lambda';
import { getDataBase } from '@src/database';
import { Product } from '@src/models/product';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { createProductSchema } from './schema';

export const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof createProductSchema> = async (event) => {
  const { title, description, price, count } = (event.body as any) as Product;

  console.log('POST /products ', { title, description, price, count }, event);

  const isTitleValid = validateTitle(title);
  const isDescriptionValid = validateDescription(description);
  const isPriceValid = validatePrice(price);
  const isCountValid = validateCount(count);

  if (!isTitleValid || !isDescriptionValid || !isPriceValid || !isCountValid) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST"
      },
      body: JSON.stringify({
        message: 'The provided product data is invalid!'
      }),
    }
  }

  const db = getDataBase();

  try {
    await db.query('BEGIN')
    const createProductQuery = await db.query('INSERT INTO product (title, description, price) VALUES ($1, $2, $3) RETURNING *', [title, description, price]);
    const product = createProductQuery.rows[0];
    await db.query('INSERT INTO stock (product_id, count) values ($1, $2)', [product.id, count]);
    await db.query('COMMIT')

    return {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST"
      },
      body: JSON.stringify(product),
    }
  } catch (error) {
    await db.query('ROLLBACK');

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST"
      },
      body: JSON.stringify({
        message: 'Something went wrong while creating product!',
        error
      })
    }
  } finally {
    await db.end();
  }
};

export const main = middyfy(createProduct);


function validateTitle(title: string): boolean {
  return !!title;
}

function validateDescription(description: string): boolean {
  return !!description;
}

function validatePrice(price: number): boolean {
  return !!price && price > 0;
}

function validateCount(count: number): boolean {
  return !!count && count >=0;
}