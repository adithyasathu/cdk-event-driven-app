# CDK TypeScript project

This project is work-in-progress to demonstrate a CDK app built with AWS CDK + Typescript which contains an Amazon gateway => Lambda => Dynamodb => Event bridge => SQS => Lambda => Dynamodb

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template

Built so far

![diagram](https://github.com/adithyasathu/cdk-event-driven-app/assets/22003086/4b51e29f-b5e8-44f8-ae0a-0c18d24834f4)
