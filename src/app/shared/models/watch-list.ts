export class WatchList {
  userName: string;
  watchListId: string;
  symbol: string;
  description: string;
  reasonToWatch: string;
  price: number;
  status: string;
  instrumentToken: string;
  updateTime: Date;

  constructor()
  {
    this.userName = '';
    this.watchListId = '';
    this.symbol = '';
    this.description = '';
    this.reasonToWatch = '';
    this.instrumentToken = '';
    this.price = 0;
    this.status = 'New';
    this.updateTime = new Date();
  }
}
