import type { AWS } from '@serverless/typescript';

import getProductsList from '@functions/product-list';
import getProductById from '@functions/product-by-id';
import createProduct from '@functions/create-product';
import catalogBatchProcess from '@functions/catalog-batch-process';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  plugins: [
    'serverless-esbuild',
    'serverless-dotenv-plugin'
  ],
  useDotenv: true,
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    stage: 'dev',
    region: 'eu-central-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      REGION: 'eu-central-1',
      SNS_ARN: {
        Ref: 'createProductTopic',
      }
    },
  },
  // import the function via paths
  functions: { 
    getProductsList,
    getProductById,
    createProduct,
    catalogBatchProcess
   },
  package: { individually: true },
  resources: {
    Resources: {
      catalogItemsQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalog-items-queue'
        }
      },
      createProductTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          DisplayName: 'Create Product Topic',
          TopicName: 'create-product-topic'
        }
      },
      createProductSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'David_Horvath2@epam.com',
          Protocol: 'email',
          TopicArn: {
            Ref: 'createProductTopic',
          },
        },
      },
      iamLambdaRoleExecution: {
        Type: 'AWS::IAM::Role',
        Properties: {
          RoleName: 'catalog-batch-process-lambda-role-execution',
          AssumeRolePolicyDocument: {
            Version: '2012-10-17',
            Statement: {
              Effect: 'Allow',
              Principal: {
                Service: 'lambda.amazonaws.com'
              },
              Action: 'sts:AssumeRole'
            }
          },
          Policies: [
            {
              PolicyName: 'SQS_Create_Product_Topic_Policy',
              PolicyDocument: {
                Version: '2012-10-17',
                Statement: {
                  Effect: 'Allow',
                  Action: [
                    'sqs:ReceiveMessage',
                    'sqs:SendMessage',
                    'sqs:DeleteMessage',
                    'sqs:GetQueueAttributes'
                  ],
                  Resource: {
                    'Fn::GetAtt': ['catalogItemsQueue', 'Arn'],
                  }
                }
              }
            },
            {
              PolicyName: 'SNS_Create_Product_Topic_Policy',
              PolicyDocument: {
                Version: '2012-10-17',
                Statement: {
                  Effect: 'Allow',
                  Action: [
                    'sns:Publish'
                  ],
                  Resource: {
                    Ref: 'createProductTopic',
                  }
                }
              }
            },
          ]
        }
      }
    }
  },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: [
        'aws-sdk',
        'pg-native'
      ],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;