import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      sqs: {
        arn: "arn:aws:sqs:eu-central-1:XXXXXX:catalogItemsQueue",
        batchSize: 5
      }
    },
  ],
};
