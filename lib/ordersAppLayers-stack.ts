import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as cdk from 'aws-cdk-lib'
import * as ssm from 'aws-cdk-lib/aws-ssm'
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

        const ordersEventsLayer = new lambda.LayerVersion(this, 'OrdersEventsLayer', {
            code: lambda.Code.fromAsset('lambda/orders/layers/ordersEventsLayer'),
            compatibleRuntimes: [lambda.Runtime.NODEJS_14_X],
            layerVersionName:'OrdersEventsLayer',
            removalPolicy: cdk.RemovalPolicy.RETAIN
        })

        new ssm.StringParameter(this, 'OrdersEventsLayerVersionArn', {
            parameterName: 'OrdersEventsLayerVersionArn',
            stringValue: ordersEventsLayer.layerVersionArn
        })

        const ordersEventsRepositoryLayer = new lambda.LayerVersion(this, 'OrdersEventsRepositoryLayer', {
            code: lambda.Code.fromAsset('lambda/orders/layers/ordersEventsRepositoryLayer'),
            compatibleRuntimes: [lambda.Runtime.NODEJS_14_X],
            layerVersionName:'OrdersEventsRepositoryLayer',
            removalPolicy: cdk.RemovalPolicy.RETAIN
        })

        new ssm.StringParameter(this, 'OrdersEventsRepositoryLayerVersionArn', {
            parameterName: 'OrdersEventsRepositoryLayerVersionArn',
            stringValue: ordersEventsRepositoryLayer.layerVersionArn
        })

    }
}