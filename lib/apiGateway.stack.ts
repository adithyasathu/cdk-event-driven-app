/* eslint-disable no-duplicate-imports */
import type { StackProps } from "aws-cdk-lib";
import { Stack } from "aws-cdk-lib";
import { ApiGatewayConstruct } from "./constructs/apiGatewayConstruct";
import type { Construct } from "constructs";

export class ApiGatewayStack extends Stack {
  public gw: ApiGatewayConstruct;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create an instance of the ApiGatewayConstruct
    this.gw = new ApiGatewayConstruct(this, id);
  }
}
