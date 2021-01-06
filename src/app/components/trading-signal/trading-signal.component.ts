import { Component, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { TradingSignal } from 'src/app/shared/models/trading-signal';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Component({
  selector: 'app-trading-signal',
  templateUrl: './trading-signal.component.html',
  styleUrls: ['./trading-signal.component.css'],
  styles: [
    `
      :host ::ng-deep .p-dialog .tradingSignal-image {
        width: 150px;
        margin: 0 auto 2rem auto;
        display: block;
      }
    `,
  ],
  providers: [MessageService, ConfirmationService],
})
export class TradingSignalComponent implements OnInit {
  tradingSignalDialog: boolean = false;
  tradingSignal: TradingSignal = new TradingSignal();
  selectedTradingSignals: TradingSignal[] = [];
  submitted: boolean = false;
  statuses: any[] = [];
  tradingSignalTypes: any[] = [];

  private tradingSignalsCollection!: AngularFirestoreCollection<TradingSignal>;
  tradingSignals: TradingSignal[] = [];

  formInput: FormGroup = new FormGroup({});
  properties = {
    tradingSignalId: 'tradingSignalId',
    stock: 'stock',
    buyPrice: 'buyPrice',
    date: 'date',
    comment: 'comment',
    deleted: 'deleted',
    stoploss: 'stoploss',
    validTill:'validTill',
    trade: 'trade',
    watchReason: 'watchReason',
    addedBy: 'addedBy',
    instrumentToken: 'instrumentToken'
  };

  private readonly USERIDKEY = 'iBotUserId';

  constructor(
    private localStorageService: LocalStorageService,
    private fireStore: AngularFirestore,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.setFormData();
  }

  private setFormData() {
    this.formInput = new FormGroup({
      tradingSignalId: new FormControl(this.tradingSignal.tradingSignalId),
      stock: new FormControl(this.tradingSignal.stock),
      buyPrice: new FormControl(this.tradingSignal.buyPrice),
      date: new FormControl(this.tradingSignal.date),
      comment: new FormControl(this.tradingSignal.comment),
      deleted: new FormControl(this.tradingSignal.deleted),
      stoploss: new FormControl(this.tradingSignal.stoploss),
      validTill: new FormControl(this.tradingSignal.validTill),
      trade: new FormControl(this.tradingSignal.trade),
      watchReason: new FormControl(this.tradingSignal.watchReason),
      addedBy: new FormControl(this.tradingSignal.addedBy),
      instrumentToken: new FormControl(this.tradingSignal.instrumentToken)
    });
  }

  ngOnInit() {
    this.getTradingSignals();
  }

  getTradingSignals() {
    this.tradingSignalsCollection = this.fireStore.collection('StockAlert');
    this.tradingSignalsCollection.valueChanges({ idField: 'stockAlertId' }).subscribe((res) => {
        this.tradingSignals = res;
      });
    }

  openNew() {
    this.tradingSignal = new TradingSignal();
    this.submitted = false;
    this.tradingSignalDialog = true;
  }

  deleteSelectedTradingSignals() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected alert?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.selectedTradingSignals.forEach((item) => {
          this.tradingSignalsCollection.doc(item.tradingSignalId).delete();
        });
        this.selectedTradingSignals = [];
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Stock Alert Deleted',
          life: 3000,
        });
      },
    });
  }

  editTradingSignal(tradingSignal: TradingSignal) {
    this.tradingSignal = { ...tradingSignal };
    this.tradingSignalDialog = true;
    this.formInput.reset();
    this.setFormData();
  }

  deleteTradingSignal(tradingSignal: TradingSignal) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + tradingSignal.stock + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.tradingSignalsCollection.doc(tradingSignal.tradingSignalId).delete();
        this.tradingSignal = new TradingSignal();
        this.setFormData();
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Stock Alert Deleted',
          life: 3000,
        });
      },
    });
  }

  hideDialog() {
    this.tradingSignalDialog = false;
    this.submitted = false;
  }

  saveTradingSignal() {
    this.submitted = true;

    if (this.tradingSignal.tradingSignalId) {
      this.tradingSignal.stock = this.formInput.controls[this.properties.stock].value;
      this.tradingSignal.buyPrice = this.formInput.controls[this.properties.buyPrice].value;
      this.tradingSignal.date = this.formInput.controls[this.properties.date].value;
      this.tradingSignal.comment = this.formInput.controls[this.properties.comment].value;
      this.tradingSignal.deleted = this.formInput.controls[this.properties.deleted].value;
      this.tradingSignal.stoploss = this.formInput.controls[this.properties.stoploss].value;
      this.tradingSignal.validTill = this.formInput.controls[this.properties.validTill].value;
      this.tradingSignal.trade = this.formInput.controls[this.properties.trade].value;
      this.tradingSignal.watchReason = this.formInput.controls[this.properties.watchReason].value;

      this.tradingSignalsCollection.doc(this.tradingSignal.tradingSignalId)
          .set({ ...this.tradingSignal }, { merge: true });

      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Stock Alert Updated',
        life: 3000,
      });
    } else {
      this.tradingSignal.tradingSignalId = this.createId();
      this.tradingSignal.stock = this.formInput.controls[this.properties.stock].value;
      this.tradingSignal.buyPrice = this.formInput.controls[this.properties.buyPrice].value;
      this.tradingSignal.date = new Date();
      this.tradingSignal.comment = '';
      this.tradingSignal.deleted = false;
      this.tradingSignal.stoploss = this.formInput.controls[this.properties.stoploss].value;
      this.tradingSignal.validTill = 'Valid for next 1 minute';
      this.tradingSignal.trade = this.formInput.controls[this.properties.trade].value;
      this.tradingSignal.watchReason = this.formInput.controls[this.properties.watchReason].value;

      this.tradingSignalsCollection.add({ ...this.tradingSignal });
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Stock Alert Created',
        life: 3000,
      });
    }

    this.tradingSignalDialog = false;
    this.tradingSignal = new TradingSignal();
  }

  createId(): string {
    return this.fireStore.createId();
  }
}
