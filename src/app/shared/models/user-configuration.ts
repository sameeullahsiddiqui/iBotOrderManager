export class UserConfiguration {
  userName:string = '';
  apiKey:string = '';
  apiSecret:string = '';
  apiRequestToken:string = '';
  apiAccessToken:string = '';
  initialProfit:number=0;
  initialStopLoss:number = 0;
  trailingStopLoss:number = 0;
  pauseMoneyManagement:boolean = false;
  isAutoTradeEnabled:boolean = false;
  autoTradeQuantity:number = 1;
  autoTradeNumber:number = 5;
  isEnabled: boolean = true;
  pin: string = '';
  password: string = '';
}
