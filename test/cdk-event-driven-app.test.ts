import { App } from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { CdkEventDrivenAppStack } from '../lib/cdk-event-driven-app-stack';

test('SQS Queue and SNS Topic Created', () => {
  const app = new App();
  // WHEN
  const stack = new CdkEventDrivenAppStack(app, 'MyTestStack');
  // THEN

  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::SQS::Queue', {
    VisibilityTimeout: 300
  });
  template.resourceCountIs('AWS::SNS::Topic', 1);
});
