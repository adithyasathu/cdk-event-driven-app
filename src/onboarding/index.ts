import "source-map-support/register";
import type { APIGatewayProxyHandler } from "aws-lambda";

// eslint-disable-next-line @typescript-eslint/require-await
export const handler: APIGatewayProxyHandler = async () => {
  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "Onboarding successful",
    }),
  };
};
