import { handlerPath } from '@libs/handler-resolver';
import { createProductSchema } from './schema';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'products',
        request: {
          schemas: {
            'application/json': createProductSchema,
          },
        },
        cors: true
      },
    },
  ],
};
