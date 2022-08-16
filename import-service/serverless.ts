import type { AWS } from '@serverless/typescript';

import importProductsFile from '@functions/import-products-file';
import importFileParser from '@functions/import-file-parser';

const serverlessConfiguration: AWS = {
  service: 'import-service',
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
      SQS_URL: {
        'Fn::Join': [
          '',
          [
            'https://sqs.', 
            { Ref: 'AWS::Region' },
            '.amazonaws.com/',
            { Ref: 'AWS::AccountId' },
            '/catalog-items-queue'
          ],
        ],
      },
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: "s3:ListBucket",
        Resource: "arn:aws:s3:::shop-angular-cloudfront-images"
      },
      {
        Effect: 'Allow',
        Action: "s3:*",
        Resource: "arn:aws:s3:::shop-angular-cloudfront-images/*"
      },
      {
        Effect: 'Allow',
        Action: 'sqs:SendMessage',
        Resource: {
          'Fn::Join': [
            ':',
            [
              'arn:aws:sqs',
              { Ref: 'AWS::Region' },
              { Ref: 'AWS::AccountId' },
              'catalog-items-queue',
            ],
          ],
        },
      }
    ]
  },
  // import the function via paths
  functions: { 
    importProductsFile,
    importFileParser
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
