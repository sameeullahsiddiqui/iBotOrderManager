import { Component, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { ConfirmationService, FilterMatchMode } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { MarketDepth } from 'src/app/shared/models/market-depth';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import * as moment from 'moment-timezone';
import { PrimeNGConfig } from 'primeng/api';

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
  cols: any[] = [];
  exportColumns: any[] = [];

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
    margin: 'margin',
    userName: 'userName',
    isNifty500: 'isNifty500',
    signalCount: 'signalCount',
    upperCircuitCount: 'upperCircuitCount',
    signalDays: 'signalDays',
    signal: 'signal',
    lastSignal: 'lastSignal',

    bseUpperCircuit: 'bseUpperCircuit',
    bseUpperCircuitReopened: 'bseUpperCircuitReopened',
    bseBuyers: 'bseBuyers',
    bseSellers: 'bseSellers',
    bseBullPercentage: 'bseBullPercentage',

    nseUpperCircuit: 'nseUpperCircuit',
    nseUpperCircuitReopened: 'nseUpperCircuitReopened',
    nseBuyers: 'nseBuyers',
    nseSellers: 'nseSellers',
    nseBullPercentage: 'nseBullPercentage'
  };

  private readonly USERIDKEY = 'iBotUserId';
  isAlertSound: any;
  multiSortMeta: any = [];

  constructor(
    private localStorageService: LocalStorageService,
    private fireStore: AngularFirestore,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private config: PrimeNGConfig
  ) {

    this.multiSortMeta = [];
    this.multiSortMeta.push({field: 'year', order: 1});
    this.multiSortMeta.push({field: 'brand', order: -1});

    this.userName = this.localStorageService.getItem(this.USERIDKEY);
  }


  ngOnInit() {
    this.cols = [
      { field: this.properties.symbolCode, header: 'Symbol' },
      { field: this.properties.signal, header: 'Signal' },
      { field: this.properties.bseBullPercentage, header: '%(BSE)' },
      { field: this.properties.nseBullPercentage, header: '%(NSE)' },
      { field: this.properties.bseBuyers, header: 'Buyers(BSE)' },
      { field: this.properties.bseSellers, header: 'Sellers(BSE)' },
      { field: this.properties.bseUpperCircuit, header: 'UC(BSE)' },
      { field: this.properties.bseUpperCircuitReopened, header: 'UC Open(BSE)' },

      { field: this.properties.nseBuyers, header: 'Buyers(NSE)' },
      { field: this.properties.nseSellers, header: 'Sellers(NSE)' },
      { field: this.properties.nseUpperCircuit, header: 'UC(NSE)' },
      { field: this.properties.nseUpperCircuitReopened, header: 'UC Open(NSE)' },

      { field: this.properties.date, header: 'Triggered at' },
      { field: this.properties.isNifty500, header: 'isNifty500' },
      { field: this.properties.signalDays, header: 'Signal Days' },
    ];

    this.statuses = [
      {name: 'Buy', value: 'Buy'},
      {name: 'Watch', value: 'Watch'},
      {name: 'Sell', value: 'Sell'}
   ]


    this.config.filterMatchModeOptions = {
      text: [
          FilterMatchMode.STARTS_WITH,
          FilterMatchMode.CONTAINS,
          FilterMatchMode.NOT_CONTAINS,
          FilterMatchMode.ENDS_WITH,
          FilterMatchMode.EQUALS,
          FilterMatchMode.NOT_EQUALS
      ],
      numeric: [
          FilterMatchMode.EQUALS,
          FilterMatchMode.NOT_EQUALS,
          FilterMatchMode.LESS_THAN,
          FilterMatchMode.LESS_THAN_OR_EQUAL_TO,
          FilterMatchMode.GREATER_THAN,
          FilterMatchMode.GREATER_THAN_OR_EQUAL_TO
      ],
      date: [
          FilterMatchMode.IS,
          FilterMatchMode.IS_NOT,
          FilterMatchMode.BEFORE,
          FilterMatchMode.AFTER
      ]
    };

    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));

    this.getMarketDepths();
  }

  getMarketDepths() {
    if (this.userName) {
      this.marketDepthsCollection = this.fireStore.collection(
        'MarketDepth',
        (ref) => ref.orderBy('date', 'desc')
      );
      this.marketDepthsCollection.valueChanges().subscribe((res) => {
        if (this.marketDepths.length > 0) this.playAudio();
        this.marketDepths = res;
        this.marketDepths.forEach(element => {
          if (element.signal === 'Buy' && element.lastSignal !== 'Buy'){
            this.playAudio();
          } else if (element.signal === 'UC(Open)' && element.lastSignal !== 'UC(Open)'){
            this.playAudio();
          }

        });
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

  deleteMarketDepth(marketDepth: MarketDepth) {
    this.confirmationService.confirm({
      message:
        'Are you sure you want to delete ' + marketDepth.symbolCode + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.marketDepthsCollection.doc(marketDepth.marketDepthId).delete();
        this.marketDepth = new MarketDepth();
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

  playAudio() {
    if (this.isAlertSound) {
      let audio = new Audio();
      audio.src = '../../../assets/audit/alert.mp3';
      audio.load();
      audio.play();
    }
  }

  handleChange(event: any) {
    this.isAlertSound = event.checked;
  }

  openChart(alert: MarketDepth) {
    window.open(
      'https://in.tradingview.com/chart/?symbol=NSE:' + alert.symbolCode,
      '_blank'
    );
  }

  getFormattedDate(timestamp: any) {
    return timestamp.toDate();
  }

  getPercentageClass(percentage: number) {
    return 'order-badge.status-new';
  }

  exportCSV() {
    var filename = `${'marketDepth'}_${moment
      .tz(new Date(), 'US-en')
      .format('MM-DD-YYYY_HH-mm-ss')} `;

    const csvData = this.convertToCSV(this.marketDepths);
    const link: any = document.createElement('a');
    link.setAttribute('style', 'display:none;');
    document.body.appendChild(link);
    const blob = new Blob([csvData], { type: 'text/csv' });
    link.href = window.URL.createObjectURL(blob);

    const isIE = !!(<any>document).documentMode;

    if (isIE) {
      navigator.msSaveBlob(blob, filename + '.csv');
    } else {
      link.download = filename + '.csv';
    }
    link.click();
    link.remove();
  }

  private convertToCSV(data: any): string {
    const headers: any[] = [];
    const col = [];
    const delimiter = ',';
    let row = '';

    // creating the header
    for (const item of this.cols) {
      headers.push(item.header);
      col.push(item.field);
      row += item.header + delimiter;
    }

    row += '\r\n';
    //  start with the rows
    for (const dataset of data) {
      let line = '';
      for (let i = 0; i < col.length; i++) {
        let dataToAdd = dataset[col[i]];
        if (dataToAdd == null || dataToAdd === undefined) {
          dataToAdd = '';
        } else if (typeof dataToAdd === 'object') {
          dataToAdd = dataToAdd.toDate().toLocaleString();
        } else if (typeof dataToAdd === 'boolean') {
          dataToAdd = dataToAdd ? 'Yes' : '';
        }

        line += '"' + dataToAdd + '"' + delimiter;
      }
      row += line + '\r\n';
    }
    return row;
  }

  clearData() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to clear market depth data?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.marketDepths.forEach((item) => {
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

}
