import { middyfy } from '@libs/lambda';
import { APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerEvent } from 'aws-lambda';

const basicAuthorizer = async (event: APIGatewayTokenAuthorizerEvent): Promise<APIGatewayAuthorizerResult> => {
  const { authorizationToken, methodArn } = event;
  console.log('Authorization token: ', authorizationToken);

  if (!authorizationToken) {

  }

  const token = authorizationToken.split('Basic ')[1];
  const buffer = Buffer.from(token, 'base64');
  const base64DecodedAuthorizationToken = buffer.toString('ascii');
  const [ username, password ] = base64DecodedAuthorizationToken.split(':');

  console.log('Username: ', username, ' Password: ', password);

  const response = process.env[username] && password === process.env[username]
    ? generateResponse(username, 'Allow', methodArn)
    : generateResponse(username, 'Deny', methodArn);

  console.log('Response: ', JSON.stringify(response));
  
  return response;
};

const generateResponse = (principalId: string, effect: 'Allow' | 'Deny', resource: string): APIGatewayAuthorizerResult => {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [{
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: resource
      }]
    }
  };
};

export const main = middyfy(basicAuthorizer);
