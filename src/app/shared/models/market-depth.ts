export class MarketDepth {
  marketDepthId : string;
  symbolCode: string;
  signal: string;
  lastSignal: string;
  bseBuyers: number;
  bseSellers: number;
  bseBullPercentage: number;
  bseUpperCircuit: boolean;
  bseUpperCircuitReopened: boolean;
  nseBuyers: number;
  nseSellers:number;
  nseBullPercentage: number;
  nseUpperCircuit: boolean;
  nseUpperCircuitReopened: boolean;
  date: Date;
  signalCount: number;
  upperCircuitCount: number;
  isNifty500: boolean;
  signalDays: number;
  margin: number;


  constructor()
  {
    this.marketDepthId = '';
    this.symbolCode= '';
    this.signal= '';
    this.lastSignal = '';
    this.bseBuyers= 0;
    this.bseSellers= 0;
    this.bseBullPercentage= 0;
    this.bseUpperCircuit= false;
    this.bseUpperCircuitReopened= false;
    this.nseBuyers= 0;
    this.nseSellers= 0;
    this.nseBullPercentage= 0;
    this.nseUpperCircuit= false;
    this.nseUpperCircuitReopened= false;
    this.date= new Date();
    this.signalCount= 0;
    this.upperCircuitCount= 0;
    this.isNifty500= false;
    this.signalDays= 0;
    this.margin= 0;
  }
}
