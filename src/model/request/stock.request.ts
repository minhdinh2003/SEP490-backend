import { IsNumber } from "class-validator";

export class AddStockRequest {
    @IsNumber()
    productId: number;
  
    @IsNumber()
    quantity: number;
  
    @IsNumber()
    price: number;
  }