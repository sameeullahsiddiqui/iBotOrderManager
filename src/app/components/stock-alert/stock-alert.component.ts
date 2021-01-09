import { Component, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { StockAlert } from 'src/app/shared/models/stock-alert';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Component({
  selector: 'app-stock-alert',
  templateUrl: './stock-alert.component.html',
  styleUrls: ['./stock-alert.component.css'],
  styles: [
    `
      :host ::ng-deep .p-dialog .stockAlert-image {
        width: 150px;
        margin: 0 auto 2rem auto;
        display: block;
      }
    `,
  ],
  providers: [MessageService, ConfirmationService],
})
export class StockAlertComponent implements OnInit {
  stockAlertDialog: boolean = false;
  stockAlert: StockAlert = new StockAlert();
  selectedStockAlerts: StockAlert[] = [];
  submitted: boolean = false;
  statuses: any[] = [];
  stockAlertTypes: any[] = [];

  private stockAlertsCollection!: AngularFirestoreCollection<StockAlert>;
  stockAlerts: StockAlert[] = [];
  userName: string = '';

  formUserInput: FormGroup = new FormGroup({});
  formInput: FormGroup = new FormGroup({});
  properties = {
    stockAlertId: 'stockAlertId',
    userName: 'userName',
    symbol: 'symbol',
    price: 'price',
    isCrossAbove: 'isCrossAbove',
    status: 'status',
    instrumentToken: 'instrumentToken'
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
      stockAlertId: new FormControl(this.stockAlert.stockAlertId),
      userName: new FormControl(this.stockAlert.userName),
      symbol: new FormControl(this.stockAlert.symbol),
      price: new FormControl(this.stockAlert.price),
      isCrossAbove: new FormControl(this.stockAlert.isCrossAbove),
      status: new FormControl(this.stockAlert.status),
      instrumentToken: new FormControl(this.stockAlert.instrumentToken)
    });
    this.formUserInput = new FormGroup({
      userName: new FormControl(this.userName),
    });
  }

  ngOnInit() {
    this.getStockAlerts();
  }

  getStockAlerts() {
    if(this.userName) {
    this.stockAlertsCollection = this.fireStore.collection('Alerts', ref=>ref.orderBy('updateTime','desc'));
    this.stockAlertsCollection.valueChanges({ idField: 'stockAlertId' }).subscribe((res) => {
      if(this.stockAlerts.length>0)
          this.playAudio();

        this.stockAlerts = res;
      });
    }
  }

  openNew() {
    this.stockAlert = new StockAlert();
    this.submitted = false;
    this.stockAlertDialog = true;
  }

  deleteSelectedStockAlerts() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected alert?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.selectedStockAlerts.forEach((item) => {
          this.stockAlertsCollection.doc(item.stockAlertId).delete();
        });
        this.selectedStockAlerts = [];
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Stock Alert Deleted',
          life: 3000,
        });
      },
    });
  }

  editStockAlert(stockAlert: StockAlert) {
    this.stockAlert = { ...stockAlert };
    this.stockAlertDialog = true;
    this.formInput.reset();
    this.setFormData();
  }

  deleteStockAlert(stockAlert: StockAlert) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + stockAlert.symbol + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.stockAlertsCollection.doc(stockAlert.stockAlertId).delete();
        this.stockAlert = new StockAlert();
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
    this.stockAlertDialog = false;
    this.submitted = false;
  }

  saveStockAlert() {
    this.submitted = true;

    if (this.stockAlert.stockAlertId) {
      this.stockAlert.symbol = this.formInput.controls[this.properties.symbol].value;
      this.stockAlert.isCrossAbove = this.formInput.controls[this.properties.isCrossAbove].value;
      this.stockAlert.price = this.formInput.controls[this.properties.price].value;
      this.stockAlert.status = this.formInput.controls[this.properties.status].value;
      this.stockAlert.updateTime = new Date();

      this.stockAlertsCollection.doc(this.stockAlert.stockAlertId)
          .set({ ...this.stockAlert }, { merge: true });

      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Stock Alert Updated',
        life: 3000,
      });
    } else {
      this.stockAlert.stockAlertId = this.createId();
      this.stockAlert.symbol = this.formInput.controls[this.properties.symbol].value;
      this.stockAlert.isCrossAbove = this.formInput.controls[this.properties.isCrossAbove].value;
      this.stockAlert.price = this.formInput.controls[this.properties.price].value;
      this.stockAlert.status = 'New';
      this.stockAlert.userName = this.userName;
      this.stockAlert.lastPrice = this.stockAlert.price;
      this.stockAlert.updateTime = new Date();

      this.stockAlertsCollection.add({ ...this.stockAlert });
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Stock Alert Created',
        life: 3000,
      });
    }

    this.stockAlertDialog = false;
    this.stockAlert = new StockAlert();
  }

  createId(): string {
    return this.fireStore.createId();
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

openChart(alert:StockAlert) {
  window.open("https://kite.zerodha.com/chart/ext/tvc/NSE/" + alert.symbol +"/2815745", '_blank');
}

}
