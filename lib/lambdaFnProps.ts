import type { Runtime, Tracing } from "aws-cdk-lib/aws-lambda";
import type { RetentionDays } from "aws-cdk-lib/aws-logs";

export interface lambdaFnProps {
  handler: string;
  runtime: Runtime;
  memorySize: number;
  environment: Record<string, string>;
  logRetention: RetentionDays;
  tracing: Tracing;
  bundling: Record<string, boolean>;
}
