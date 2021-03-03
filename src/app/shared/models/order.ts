export class Order {
  userName: string;
  orderId: string;
  symbol: string;
  quantity: number;
  orderPrice: number;
  buyPrice: number;
  sellPrice: number;
  currentPrice: number;
  orderType: string;
  transactionType: string;
  targetPrice: number;
  targetPercentage: number;
  stoplossPrice: number;
  stoplossPercentage: number;
  executionDateTime: Date;
  status: string;
  profit: number;
  exchange: string;
  brokerOrderId: string;
  onHold: boolean;
  instrumentToken: number;
  triggerPrice: number;
  isRsiConditionMeet: boolean;
  isDoubleTopBottomConditionMeet: boolean;
  tradeReason: string;
  isHighVolumeCandleMeet: boolean;

  constructor()
  {
    this.userName = '';
    this.orderId = '';
    this.orderType = 'long';
    this.transactionType = 'MIS';
    this.symbol = '';
    this.instrumentToken = 0;
    this.quantity = 1;
    this.orderPrice = 0;
    this.buyPrice = 0;
    this.sellPrice = 0;
    this.currentPrice = 0;
    this.targetPrice = 0;
    this.targetPercentage = 1;
    this.stoplossPrice = 0;
    this.stoplossPercentage = -.50;
    this.profit = 0;
    this.status = 'New';
    this.onHold = false;
    this.executionDateTime = new Date();
    this.exchange = 'NSE';
    this.brokerOrderId = '';
    this.triggerPrice = 0;
    this.isRsiConditionMeet = false;
    this.isDoubleTopBottomConditionMeet = false;
    this.isHighVolumeCandleMeet = false;
    this.tradeReason = '';
  }
}
