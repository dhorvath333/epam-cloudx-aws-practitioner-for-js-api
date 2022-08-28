import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
        request: {
          parameters: {
            querystrings: {
              name: true
            }
          }
        },
        cors: true,
        authorizer: {
          arn: 'arn:aws:lambda:${self:provider.region}:${aws:accountId}:function:authorization-service-dev-basicAuthorizer',
          type: 'token',
          resultTtlInSeconds: 0, // Default 300 seconds
          identitySource: 'method.request.header.Authorization',
          identityValidationExpression: '^Basic [-0-9a-zA-Z._=]*$',
        },
      },
    },
  ],
};
