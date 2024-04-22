import type { StackProps } from "aws-cdk-lib";
import type { RestApiAttributes } from "aws-cdk-lib/aws-apigateway";
import type { lambdaFnProps } from "./lambdaFnProps";

export interface NestedStackProps extends StackProps {
  apiGw: RestApiAttributes & { url: string };
  lambdaFnProps: lambdaFnProps;
}
