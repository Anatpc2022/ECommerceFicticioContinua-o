import { Order } from "/opt/nodejs/ordersLayer"
import { Product } from "/opt/nodejs/productsLayer"

export enum PaymentType {
    CASH = "CASH",
    DEBIT_CARD = "DEBIT_CARD",
    CREDIT_CARD = "CREDIT_CARD"
}

export enum ShippingType {
    ECONOMIC = "ECONOMIC",

}

export enum CarrierType {
    CORREIOS = "CORREIOS",
    FEDEX = "FEDEX"
}

export interface OrderRequest {
    email: string,
    productIds: string[],
    payment: PaymentType,
    shipping: {
        type: ShippingType,
        carrier: CarrierType
    }
}

export interface OrderProductResponse {
    code: string,
    price: number
}

export interface OrderResponse {
    email: string,
    id: string,
    createdAt: number,
    billing: {
        payment: PaymentType,
        totalPrice: number
    },
    shipping: {
        type: ShippingType,
        carrier: CarrierType
    }, 
    products: OrderProductResponse[]
}



    