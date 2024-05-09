import { App, Stack } from "aws-cdk-lib";
import { Match, Template } from "aws-cdk-lib/assertions";
import { HealthStack } from "./health.stack";
import { Runtime, Tracing } from "aws-cdk-lib/aws-lambda";
import { RetentionDays } from "aws-cdk-lib/aws-logs";

describe("HealthStack", () => {
  let app: App;
  let healthStack: HealthStack;
  let template: Template;

  beforeAll(() => {
    app = new App();
    const lambdaFnProps = {
      handler: "handler",
      runtime: Runtime.NODEJS_20_X,
      memorySize: 256,
      environment: {},
      logRetention: RetentionDays.ONE_WEEK,
      tracing: Tracing.ACTIVE,
      bundling: {
        sourceMap: true,
        minify: true,
      },
    };
    const testStack = new Stack(app, "MyTestStack");
    healthStack = new HealthStack(testStack, "HealthStack", {
      apiGw: {
        restApiId: "dummyrestApiId",
        rootResourceId: "dummyrootResourceId",
        baseUrl: "dummyurl/",
      },
      lambdaFnProps,
    });

    template = Template.fromStack(healthStack);
  });

  it("Health Lambda Function is defined`", () => {
    template.hasResource(
      "AWS::Lambda::Function",
      Match.objectLike({
        Properties: {
          FunctionName: "healthFn",
        },
      }),
    );
  });

  it("/health resource is defined`", () => {
    template.hasResource(
      "AWS::ApiGateway::Resource",
      Match.objectLike({
        Properties: {
          PathPart: "health",
        },
      }),
    );
  });

  it("GET method for /health resource is defined`", () => {
    template.hasResource(
      "AWS::ApiGateway::Method",
      Match.objectLike({
        Properties: {
          HttpMethod: "GET",
          OperationName: "Health",
          MethodResponses: [
            {
              StatusCode: "200",
            },
          ],
        },
      }),
    );
  });

  it("Health API URL is outputed correctly`", () => {
    template.hasOutput("HealthApiUrl", {
      Value: "dummyurl/health",
    });
  });
});
