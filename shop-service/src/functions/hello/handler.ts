import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';

const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { name } = JSON.parse(event.body as any);

  return formatJSONResponse({
    message: `Hello ${name}, welcome to the exciting Serverless world!`,
    event,
  });
};

export const main = middyfy(hello);
