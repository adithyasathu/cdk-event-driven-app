import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { CdkEventDrivenAppStack } from "./cdk-event-driven-app-stack";

describe("API Gateway Created", () => {
  let app: App;
  let stack: CdkEventDrivenAppStack;
  let template: Template;
  beforeAll(() => {
    app = new App();
    // WHEN
    stack = new CdkEventDrivenAppStack(app, "MyTestStack");
    // THEN

    template = Template.fromStack(stack);
  });

  test("API Gateway Created", () => {
    template.resourceCountIs("AWS::ApiGateway::RestApi", 1);
  });

  test("API Gateway has health endpoint", () => {
    template.hasResourceProperties("AWS::ApiGateway::Resource", {
      PathPart: "health",
    });
  });

  test("matches the snapshot", () => {
    expect(template.toJSON()).toMatchSnapshot();
  });
});
