import { middyfy } from '@libs/lambda';
import { isProductValid } from '@libs/product';
import { getDataBase } from '@src/database';
import { Product } from '@src/models/product';
import { SQSEvent, SQSHandler } from 'aws-lambda';
import { SNS } from 'aws-sdk';

const { REGION, SNS_ARN } = process.env;

export const catalogBatchProcess: SQSHandler = async (event: SQSEvent) => {
  console.log('SQS EVENT RECORDS: ', event.Records);

  const processedProducts = await Promise.all(
    event.Records.map(async (record) => {

      let product: Product;
      try {
        const parsedProduct = JSON.parse(record.body) as Product;
        product = {
          ...parsedProduct,
          price: +parsedProduct.price,
          count: +parsedProduct.count
        }
      } catch(err) {
        console.log('Error while parsing product: ', record.body, err);
        return null;
      }
      
      const { title, description, price, count } = product;

      const isValid = isProductValid(product);
      if (!isValid) {
        console.log('The provided product data is invalid!');
        return null;
      }

      const db = getDataBase();

      try {
        await db.query('BEGIN')
        const createProductQuery = await db.query('INSERT INTO product (title, description, price) VALUES ($1, $2, $3) RETURNING *', [title, description, price]);
        const createdProduct = createProductQuery.rows[0];
        await db.query('INSERT INTO stock (product_id, count) values ($1, $2)', [createdProduct.id, count]);
        await db.query('COMMIT')

        console.log('Created product: ', createdProduct);
        return {
          ...createdProduct,
          count
        };
      } catch (error) {
        await db.query('ROLLBACK');

        console.log('Something went wrong while creating product! ', error);
        return null;
      } finally {
        await db.end();
      }
    }).filter(data => !!data)
  );

  console.log('PROCESSED PRODUCTS: ', processedProducts);

  sendToSNS(processedProducts);
};

function sendToSNS(products: Product[]) {
  const sns = new SNS({
    region: REGION
  });

  sns.publish({
    Message: `Products created: ${JSON.stringify(products)}`,
    TopicArn: SNS_ARN
  })
    .promise()
    .then(data => {
      console.log('Data published to SNS: ', data);
    })
    .catch(error => {
      console.log('Error while publishing data to SNS: ', error);
    })
}

export const main = middyfy(catalogBatchProcess);
