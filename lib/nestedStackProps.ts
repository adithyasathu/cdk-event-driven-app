import type { StackProps } from "aws-cdk-lib";
import type { lambdaFnProps } from "./lambdaFnProps";
import type { ApiGatewayProps } from "./apiGatewayProps";

export interface NestedStackProps extends StackProps {
  apiGw: ApiGatewayProps;
  lambdaFnProps: lambdaFnProps;
}
