import { App, Stack } from "aws-cdk-lib";
import { Match, Template } from "aws-cdk-lib/assertions";
import { ApiGatewayStack } from "./apiGateway.stack";
import { ApiGatewayConstruct } from "./constructs/apiGatewayConstruct";

describe("ApiGatewayStack", () => {
  let app: App;
  let apiGatewayStack: ApiGatewayStack;
  let template: Template;

  beforeAll(() => {
    app = new App();
    const testStack = new Stack(app, "MyTestStack");
    apiGatewayStack = new ApiGatewayStack(testStack, "Platform-X-Gw");
    template = Template.fromStack(apiGatewayStack);
  });

  it("ApiGatewayConstruct is defined", () => {
    expect(apiGatewayStack.gw).toBeInstanceOf(ApiGatewayConstruct);
  });

  
  test("API Gateway Created", () => {
    template.resourceCountIs("AWS::ApiGateway::RestApi", 1);
  });

  test("API Gateway has CORS defined", () => {
    template.hasResource(
      "AWS::ApiGateway::Method",
      Match.objectLike({
        Properties: {
          HttpMethod: "OPTIONS",
          Integration: {
            IntegrationResponses: [
              {
                ResponseParameters: {
                  "method.response.header.Access-Control-Allow-Headers":
                    "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
                  "method.response.header.Access-Control-Allow-Origin": "'*'",
                  "method.response.header.Access-Control-Allow-Methods":
                    "'OPTIONS,HEAD,GET,POST,PUT,PATCH,DELETE'",
                  "method.response.header.Access-Control-Allow-Credentials":
                    "'true'",
                },
                StatusCode: "204",
              },
            ],
            RequestTemplates: {
              "application/json": "{ statusCode: 200 }",
            },
            Type: "MOCK",
          },
        },
      }),
    );
  });

  it("Rest Api root id, reource id and base url are exported correctly`", () => {
    template.hasOutput("PlatformXGwRootId", {
      Export: {
        Name: "Platform-X-Gw-Root-Id",
      },
    });

    template.hasOutput("PlatformXGwResourceId", {
      Export: {
        Name: "Platform-X-Gw-Resource-Id",
      },
    });

    template.hasOutput("PlatformXGwAPIurl", {
        Export: {
          Name: "Platform-X-Gw-API-url",
        },
      });
  });
});