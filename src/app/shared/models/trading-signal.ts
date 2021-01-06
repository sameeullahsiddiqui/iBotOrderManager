export class TradingSignal {
  tradingSignalId: string='';
  stock: string='';
  buyPrice: number=0;
  date:Date = new Date();
  comment: string='';
  deleted: boolean = false;
  stoploss: number=0;
  validTill: string='';
  trade: string='';
  watchReason: string='';
  addedBy: string='';
  instrumentToken: string='';

  constructor()
  {
  }
}
