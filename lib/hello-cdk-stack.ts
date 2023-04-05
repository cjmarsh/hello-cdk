import * as cdk from 'aws-cdk-lib';
import { Stack, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_s3 as s3 } from 'aws-cdk-lib';
import { aws_lambda as lambda } from 'aws-cdk-lib';
import { aws_cloudfront as cloudfront } from 'aws-cdk-lib';



export class HelloCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new s3.Bucket(this, 'MyFirstBucket', {
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true
    });

    let viewer_request_lambda = function(){
      const redirectFunction = new cloudfront.experimental.EdgeFunction(this, "wwwsunrun-static-viewer-request", {
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: "index.handler",
        code: lambda.Code.fromAsset('./src/lambda/root_handler'),
      })
      return redirectFunction.currentVersion;
    }

    let origin_request_lambda = function(){
      const redirectFunction = new cloudfront.experimental.EdgeFunction(this, "wwwsunrun-static-origin-request", {
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: "index.handler",
        code: lambda.Code.fromAsset('./src/lambda/redirect_handler'),
      })
      return redirectFunction.currentVersion;
    }

    const httpOriginRequestHandler = new cloudfront.experimental.EdgeFunction(this, 'HttpOriginRequestHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.httpOriginRequestHandler',
      code: lambda.Code.fromAsset('../src/httpOriginRequestHandler.ts'),
      description: `Generated on: ${new Date().toISOString()}`
    });

    const httpOriginResponseHandler = new cloudfront.experimental.EdgeFunction(this, 'HttpOriginResponseHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.httpOriginResponseHandler',
      code: lambda.Code.fromAsset('../src/httpOriginResponseHandler.ts'),
      description: `Generated on: ${new Date().toISOString()}`
    });

    const httpVisitorRequestHandler = new cloudfront.experimental.EdgeFunction(this, 'HttpVisitorRequestHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.httpVisitorRequestHandler',
      code: lambda.Code.fromAsset('../src/httpVisitorRequestHandler.ts'),
      description: `Generated on: ${new Date().toISOString()}`
    });

    const httpVisitorResponseHandler = new cloudfront.experimental.EdgeFunction(this, 'HttpVisitorResponseHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.httpVisitorResponseHandler',
      code: lambda.Code.fromAsset('../src/httpVisitorResponseHandler.ts'),
      description: `Generated on: ${new Date().toISOString()}`
    });

    my_func = cloudfront.experimental.EdgeFunction(self, "MyFunction",
    runtime=lambda_.Runtime.NODEJS_14_X,
    handler="index.handler",
    code=lambda_.Code.from_asset(path.join(__dirname, "lambda-handler"))
)
cloudfront.Distribution(self, "myDist",
    default_behavior=cloudfront.BehaviorOptions(
        origin=origins.S3Origin(my_bucket),
        edge_lambdas=[cloudfront.EdgeLambda(
            function_version=my_func.current_version,
            event_type=cloudfront.LambdaEdgeEventType.VIEWER_REQUEST
        )
        ]
    )
)
  }
}
