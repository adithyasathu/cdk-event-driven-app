import { App, Stack } from "aws-cdk-lib";
import { Match, Template } from "aws-cdk-lib/assertions";
import { OnboardingStack } from "./onboarding.stack";
import { Runtime, Tracing } from "aws-cdk-lib/aws-lambda";
import { RetentionDays } from "aws-cdk-lib/aws-logs";

describe("onboardingStack", () => {
  let app: App;
  let onboardingStack: OnboardingStack;
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
    const testStack = new Stack(app, "TestStack");
    onboardingStack = new OnboardingStack(testStack, "onboardingStack", {
      apiGw: {
        restApiId: "dummyrestApiId",
        rootResourceId: "dummyrootResourceId",
        baseUrl: "dummyurl/",
      },
      lambdaFnProps,
    });

    template = Template.fromStack(onboardingStack);
  });

  it("onboarding Lambda Function is defined`", () => {
    template.hasResource(
      "AWS::Lambda::Function",
      Match.objectLike({
        Properties: {
          FunctionName: "onboardingFn",
          Handler: "index.handler",
          MemorySize: 256,
        },
      }),
    );
  });

  it("/onboard resource is defined`", () => {
    template.hasResource(
      "AWS::ApiGateway::Resource",
      Match.objectLike({
        Properties: {
          PathPart: "onboard",
        },
      }),
    );
  });

  it("POST method for /onboard resource is defined`", () => {
    template.hasResource(
      "AWS::ApiGateway::Method",
      Match.objectLike({
        Properties: {
          HttpMethod: "POST",
          OperationName: "onboarding",
          Integration: {
            IntegrationHttpMethod: "POST",
            RequestTemplates: {
              "application/json": '{ "statusCode": "201" }',
            },
          },
          MethodResponses: [
            {
              ResponseModels: {
                "application/json": {
                  "Fn::ImportValue": Match.stringLikeRegexp(
                    "TestStack:ExportsOutputRefOnbordingResponseModel",
                  ),
                },
              },
              StatusCode: "201",
            },
          ],
        },
      }),
    );
  });

  it("onboarding API URL is outputed correctly`", () => {
    template.hasOutput("onboardingApiUrl", {
      Value: "dummyurl/onboard",
    });
  });
});
