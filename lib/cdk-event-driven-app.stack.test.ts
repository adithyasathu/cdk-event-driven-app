import { App } from "aws-cdk-lib";
import { Match, Template } from "aws-cdk-lib/assertions";
import { CdkEventDrivenAppStack } from "./cdk-event-driven-app.stack";

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

  it("Rest Api root id and reource id are exported correctly`", () => {
    template.hasOutput("MyTestStackRootId", {
      Export: {
        Name: "MyTestStack-Root-Id",
      },
    });

    template.hasOutput("MyTestStackResourceId", {
      Export: {
        Name: "MyTestStack-Resource-Id",
      },
    });
  });
});
