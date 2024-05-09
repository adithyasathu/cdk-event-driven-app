import { CfnOutput } from "aws-cdk-lib";
import { EndpointType, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";

export class ApiGatewayConstruct extends Construct {
  public restApi: RestApi;
  public restApiId: string;
  public rootResourceId: string;
  public baseUrl: string;

  constructor(
    scope: Construct,
    private readonly id: string,
  ) {
    super(scope, id);

    // Define a new API Gateway REST API resource
    this.restApi = new RestApi(scope, `${id}-API`, {
      restApiName: "API Gateway for the Platform X",
      description: "This service provides backend APIs for Platform X",
      deploy: true,
      defaultCorsPreflightOptions: {
        allowMethods: [
          "OPTIONS",
          "HEAD",
          "GET",
          "POST",
          "PUT",
          "PATCH",
          "DELETE",
        ],
        allowCredentials: true,
        allowOrigins: ["*"],
      },
      endpointConfiguration: { types: [EndpointType.REGIONAL] },
    });

    this.restApi.root.addMethod("ANY");

    // Exported to allow use internally, and output for use in other stacks

    this.restApiId = new CfnOutput(scope, `${id}-Root-Id`, {
      value: this.restApi.restApiId,
      description: `The API Gateway Root id of the ${id}`,
      exportName: `${id}-Root-Id`,
    }).importValue;

    this.rootResourceId = new CfnOutput(scope, `${id}-Resource-Id`, {
      value: this.restApi.root.resourceId,
      description: `The API Gateway Root resource id of the ${id}`,
      exportName: `${id}-Resource-Id`,
    }).importValue;

    this.baseUrl = new CfnOutput(scope, `${id}-API-url`, {
      value: this.restApi.url,
      description: `The API Gateway API url of the ${id}`,
      exportName: `${id}-API-url`,
    }).importValue;
  }
}
