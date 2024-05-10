/* eslint-disable no-duplicate-imports */
import { Stack, CfnOutput } from "aws-cdk-lib";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import type { JsonSchema } from "aws-cdk-lib/aws-apigateway";
import { RestApi, LambdaIntegration, Model } from "aws-cdk-lib/aws-apigateway";
import type { NestedStackProps } from "../../lib/nestedStackProps";
import type { Construct } from "constructs";
import { join } from "path";

export class OnboardingStack extends Stack {
  constructor(scope: Construct, id: string, props: NestedStackProps) {
    super(scope, id, props);

    const apiGw = RestApi.fromRestApiAttributes(this, `${id}-API-Ref`, {
      restApiId: props.apiGw.restApiId,
      rootResourceId: props.apiGw.rootResourceId,
    });

    // Define a new Lambda function
    const onboardingLambda = new NodejsFunction(this, "onboardingFn", {
      functionName: "onboardingFn",
      ...props.lambdaFnProps,
      entry: join(__dirname, `./index.ts`),
    });

    // Define a new POST method for the /onboard resource
    const getonboardingIntegration = new LambdaIntegration(onboardingLambda, {
      requestTemplates: {
        "application/json": '{ "statusCode": "201" }',
      },
    });

    const OnbordingResponse = new Model(scope, "OnbordingResponseModel", {
      restApi: apiGw,
      modelName: "OnbordingResponse",
      schema: {
        type: "object",
        required: ["message"],
        properties: { message: { type: "string" } },
      } as JsonSchema,
    });

    apiGw.root
      .addResource("onboard")
      .addMethod("POST", getonboardingIntegration, {
        operationName: "onboarding",
        methodResponses: [
          {
            statusCode: "201",
            /*
              { message: 'Onboarding successful' }
            */
            responseModels: {
              "application/json": OnbordingResponse,
            },
          },
        ],
      });

    new CfnOutput(this, "onboardingApiUrl", {
      value: `${props.apiGw.baseUrl}onboard`,
      description: "The onboarding api URL",
    });
  }
}
