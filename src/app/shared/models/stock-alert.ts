export class StockAlert {
  userName: string;
  stockAlertId: string;
  symbol: string;
  price: number;
  isCrossAbove: boolean;
  status: string;
  instrumentToken: string;
  updateTime: Date;
  lastPrice: number;

  constructor()
  {
    this.userName = '';
    this.stockAlertId = '';
    this.symbol = '';
    this.instrumentToken = '';
    this.price = 0;
    this.lastPrice = 0;
    this.status = 'New';
    this.isCrossAbove = false;
    this.updateTime = new Date();
  }
}
