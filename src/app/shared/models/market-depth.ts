export class MarketDepth {
  marketDepthId : string;
  date: Date;
  symbolCode: string;
  upperCircuit: boolean;
  buyers: number;
  sellers: number;
  bullPercentage: number;
  margin: number;
  userName: any;

  constructor()
  {
    this.marketDepthId = '';
    this.date = new Date();
    this.symbolCode = '';
    this.upperCircuit = false;
    this.buyers = 0;
    this.sellers = 0;
    this.bullPercentage = 0;
    this.margin = 0;
  }
}
