export class UserConfiguration {
  userName:string = '';
  apiKey:string = '';
  apiSecret:string = '';
  initialProfit:number=0;
  initialStopLoss:number = 0;
  trailingStopLoss:number = 0;
  PauseMoneyManagement:boolean = false;
  IsAutoTradeEnabled:boolean = false;
  AutoTradeQuantity:number = 1;
  AutoTradeNumber:number = 5;
  IsEnabled: boolean = true;
  pin: string = '';
  password: string = '';
  isPaperTradingEnabled: boolean = false;
}
