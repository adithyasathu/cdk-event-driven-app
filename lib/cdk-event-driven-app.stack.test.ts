import { App } from "aws-cdk-lib";
import { Match, Template } from "aws-cdk-lib/assertions";
import { CdkEventDrivenAppStack } from "./cdk-event-driven-app.stack";

describe("API Gateway Models", () => {
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

  test("OnbordingResponse Model with schema created", () => {
    template.hasResource("AWS::ApiGateway::Model", Match.objectLike({
      Properties: {
        ContentType: "application/json",
        Name: "OnbordingResponse",
        Schema: {
          type: "object",
          required: [
            "message",
            
          ],
          properties: {
            message: {
              type: "string",
              
            },
            
          },
          $schema: "http://json-schema.org/draft-04/schema#",
          
        },
        }
    }));
  });
  
});
