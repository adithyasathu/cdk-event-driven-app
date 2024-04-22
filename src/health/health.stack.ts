import { Stack, CfnOutput } from "aws-cdk-lib";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { RestApi, LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import type { NestedStackProps } from "../../lib/nestedStackProps";
import type { Construct } from "constructs";
import { join } from "path";

export class HealthStack extends Stack {
  constructor(scope: Construct, id: string, props: NestedStackProps) {
    super(scope, id, props);

    const apiGw = RestApi.fromRestApiAttributes(this, `${id}-API-Ref`, {
      restApiId: props.apiGw.restApiId,
      rootResourceId: props.apiGw.rootResourceId,
    });

    // Define a new Lambda function
    const healthLambda = new NodejsFunction(this, "healthFn", {
      functionName: "healthFn",
      ...props.lambdaFnProps,
      entry: join(__dirname, `./index.ts`),
    });

    // Define a new GET method for the /health resource
    const getHealthIntegration = new LambdaIntegration(healthLambda, {
      requestTemplates: {
        "application/json": '{ "statusCode": "200" }',
      },
    });
    apiGw.root.addResource("health").addMethod("GET", getHealthIntegration, {
      operationName: "Health",
      methodResponses: [
        {
          statusCode: "200",
        },
      ],
    });

    new CfnOutput(this, "HealthApiUrl", {
      value: `${props.apiGw.url}health`,
      description: "The health api URL",
    });
  }
}
