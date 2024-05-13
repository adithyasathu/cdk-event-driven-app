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


![diagram](https://github.com/adithyasathu/cdk-event-driven-app/assets/22003086/4e0465d9-d759-45eb-af06-dfa7a1afb6aa)
