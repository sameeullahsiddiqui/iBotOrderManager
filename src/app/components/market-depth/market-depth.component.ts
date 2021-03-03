import { Component, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { MarketDepth } from 'src/app/shared/models/market-depth';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Component({
  selector: 'app-market-depth',
  templateUrl: './market-depth.component.html',
  styleUrls: ['./market-depth.component.css'],
  styles: [
    `
      :host ::ng-deep .p-dialog .marketDepth-image {
        width: 150px;
        margin: 0 auto 2rem auto;
        display: block;
      }
    `,
  ],
  providers: [MessageService, ConfirmationService],
})
export class MarketDepthComponent implements OnInit {
  marketDepthDialog: boolean = false;
  marketDepth: MarketDepth = new MarketDepth();
  selectedMarketDepths: MarketDepth[] = [];
  submitted: boolean = false;
  statuses: any[] = [];
  marketDepthTypes: any[] = [];

  private marketDepthsCollection!: AngularFirestoreCollection<MarketDepth>;
  marketDepths: MarketDepth[] = [];
  userName: string = '';

  formUserInput: FormGroup = new FormGroup({});
  formInput: FormGroup = new FormGroup({});
  properties = {
    date: 'date',
    symbolCode: 'symbolCode',
    upperCircuit: 'upperCircuit',
    buyers: 'buyers',
    sellers: 'sellers',
    bullPercentage: 'bullPercentage',
    margin: 'margin',
    userName: 'userName'
  };

  private readonly USERIDKEY = 'iBotUserId';
  isAlertSound: any;

  constructor(
    private localStorageService: LocalStorageService,
    private fireStore: AngularFirestore,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.userName = this.localStorageService.getItem(this.USERIDKEY);
    this.setFormData();
  }

  private setFormData() {
    this.formInput = new FormGroup({
      date: new FormControl(this.marketDepth.date),
      userName: new FormControl(this.marketDepth.userName),
      symbolCode: new FormControl(this.marketDepth.symbolCode),
      buyers: new FormControl(this.marketDepth.buyers),
      sellers: new FormControl(this.marketDepth.sellers),
      bullPercentage: new FormControl(this.marketDepth.bullPercentage),
      margin: new FormControl(this.marketDepth.margin),
      upperCircuit: new FormControl(this.marketDepth.upperCircuit)
    });
  }

  ngOnInit() {
    this.getMarketDepths();
  }

  getMarketDepths() {
    if(this.userName) {
    this.marketDepthsCollection = this.fireStore.collection('MarketDepth', ref=>ref.orderBy('date','desc'));
    this.marketDepthsCollection.valueChanges().subscribe((res) => {
      if(this.marketDepths.length>0)
          this.playAudio();

        this.marketDepths = res;
      });
    }
  }

  openNew() {
    this.marketDepth = new MarketDepth();
    this.submitted = false;
    this.marketDepthDialog = true;
  }

  deleteSelectedMarketDepths() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected alert?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.selectedMarketDepths.forEach((item) => {
          this.marketDepthsCollection.doc(item.marketDepthId).delete();
        });
        this.selectedMarketDepths = [];
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Market Depth Deleted',
          life: 3000,
        });
      },
    });
  }

  editMarketDepth(marketDepth: MarketDepth) {
    this.marketDepth = { ...marketDepth };
    this.marketDepthDialog = true;
    this.formInput.reset();
    this.setFormData();
  }

  deleteMarketDepth(marketDepth: MarketDepth) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + marketDepth.symbolCode + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.marketDepthsCollection.doc(marketDepth.marketDepthId).delete();
        this.marketDepth = new MarketDepth();
        this.setFormData();
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Market Depth Deleted',
          life: 3000,
        });
      },
    });
  }

  hideDialog() {
    this.marketDepthDialog = false;
    this.submitted = false;
  }

  playAudio(){
    if(this.isAlertSound) {
      let audio = new Audio();
      audio.src = "../../../assets/audit/alert.mp3";
      audio.load();
      audio.play();
    }
  }

  handleChange(event:any) {
    this.isAlertSound = event.checked;
}

openChart(alert:MarketDepth) {
  window.open("https://in.tradingview.com/chart/?symbol=NSE:" + alert.symbolCode, '_blank');
}

getFormattedDate(timestamp:any){
  return timestamp.toDate();
}

getPercentageClass(percentage: number){

  return 'order-badge.status-new';
}

}
