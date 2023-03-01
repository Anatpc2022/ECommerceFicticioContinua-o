import * as cdk from "aws-cdk-lib"
import * as lambdaNodeJS from "aws-cdk-lib/aws-lambda-nodejs"
import * as apigateway from "aws-cdk-lib/aws-apigateway"
import * as cwlogs from "aws-cdk-lib/aws-logs"
import { Construct } from "constructs"

interface ECommerceApiStackProps extends cdk.StackProps {
    productsFetchHandler: lambdaNodeJS.NodejsFunction;
    productsAdminHandler: lambdaNodeJS.NodejsFunction ;
    ordersHandler: lambdaNodeJS.NodejsFunction;   
}

export class ECommerceApiStack extends cdk.Stack {

    constructor(scope: Construct, id: string, props: ECommerceApiStackProps) {
        super(scope, id, props)

        const logGroup = new cwlogs.LogGroup(this, "ECommerceApiLogs")
        const api = new apigateway.RestApi(this, "ECommerceApi", {
            restApiName: "ECommerceApi",
            cloudWatchRole: true,
            deployOptions: {
                accessLogDestination: new apigateway.LogGroupLogDestination(logGroup),
                accessLogFormat: apigateway.AccessLogFormat.jsonWithStandardFields({
                    httpMethod: true,
                    ip: true,
                    protocol: true,
                    requestTime: true,
                    resourcePath: true,
                    responseLength: true,
                    status: true,
                    caller: true,
                    user: true
                })
            }
        })

        this.createProductsService(props, api)
        this.createOrdersService(props, api)
    }

    private createOrdersService(props: ECommerceApiStackProps, api: cdk.aws_apigateway.RestApi){
        const ordersIntegration = new apigateway.LambdaIntegration(props.ordersHandler)

        //resource - /orders
        const orderResource = api.root.addResource('orders')

        //GET / orders
        //GET / orders?email=matilde@siecola.com.br
        //GET / orders?email=matilde@siecola.com.br&orderId=123
        orderResource.addMethod("GET", ordersIntegration)

        const orderDeletionValidator = new apigateway.RequestValidator(this, "OrderDeletionValidator", {
            restApi: api,
            requestValidatorName: "OrderDeletionValidator",
            validateRequestParameters: true,
        }) 
        

        //DELETE / orders?email=matilde@siecola.com.br&orderId=123
        orderResource.addMethod("DELETE", ordersIntegration, {
            requestParameters: {
                'method.request.querystring.email': true,
                'method.request.querystring.orderId': true
            },
            requestValidator: orderDeletionValidator
        })

        //POST / orders
        orderResource.addMethod("POST", ordersIntegration)
    }

    private createProductsService(props: ECommerceApiStackProps, api: cdk.aws_apigateway.RestApi) {
        const productsFetchIntegration = new apigateway.LambdaIntegration(props.productsFetchHandler)

        // "/products"
        const productsResource = api.root.addResource("products")
        productsResource.addMethod("GET", productsFetchIntegration)

        // GET /products/{id}
        const productsIdResourse = productsResource.addResource("{id}")
        productsIdResourse.addMethod("GET", productsFetchIntegration)

        const productsAdminIntegration = new apigateway.LambdaIntegration(props.productsAdminHandler)

        // POST /products
        productsResource.addMethod("POST", productsAdminIntegration)

        // PUT /products/{id}
        productsIdResourse.addMethod("PUT", productsAdminIntegration)

        // DELETE /products/{id}
        productsIdResourse.addMethod("DELETE", productsAdminIntegration)
    }
}