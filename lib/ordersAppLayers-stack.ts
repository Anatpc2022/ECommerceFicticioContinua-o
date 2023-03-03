import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as lambdaNodeJS from 'aws-cdk-lib/aws-lambda-nodejs'
import * as cdk from 'aws-cdk-lib'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import * as ssm from 'aws-cdk-lib/aws-ssm'
import * as sns from 'aws-cdk-lib/aws-sns'
import * as subs from 'aws-cdk-lib/aws-sns-subscriptions'
import { Construct } from 'constructs'

export class OrdersAppLayersStack extends cdk.Stack {
    constructor( scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props)

        const ordersLayer = new lambda.LayerVersion(this, 'OrdersLayer', {
            code: lambda.Code.fromAsset('lambda/orders/layers/ordersLayer'),
            compatibleRuntimes: [lambda.Runtime.NODEJS_14_X],
            layerVersionName:'OrdersLayer',
            removalPolicy: cdk.RemovalPolicy.RETAIN
        })

        new ssm.StringParameter(this, 'OrdersLayersVersionArn', {
            parameterName: 'OrdersLayersVersionArn',
            stringValue: ordersLayer.layerVersionArn
        })

        const ordersTopic = new sns.Topic(this, "OrderEventsTopic", {
            displayName: "Order events topic",
            topicName: "order-events"
        })

        const ordersApiLayer = new lambda.LayerVersion(this, 'OrdersApiLayer', {
            code: lambda.Code.fromAsset('lambda/orders/layers/ordersApiLayer'),
            compatibleRuntimes: [lambda.Runtime.NODEJS_14_X],
            layerVersionName:'OrdersApiLayer',
            removalPolicy: cdk.RemovalPolicy.RETAIN
        })

        new ssm.StringParameter(this, 'OrdersApiLayerVersionArn', {
            parameterName: 'OrdersApiLayerVersionArn',
            stringValue: ordersApiLayer.layerVersionArn
        })

    }
}