import { Component, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { Order } from 'src/app/shared/models/order';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import {TerminalService} from 'primeng/terminal';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-stock-order',
  templateUrl: './stock-order.component.html',
  styleUrls: ['./stock-order.component.css'],
  styles: [
    `
      :host ::ng-deep .p-dialog .order-image {
        width: 150px;
        margin: 0 auto 2rem auto;
        display: block;
      }
    `,
  ],
  providers: [MessageService, ConfirmationService, TerminalService],
})
export class StockOrderComponent implements OnInit {

  subscription: Subscription | undefined;
  orderDialog: boolean = false;
  order: Order = new Order();
  selectedOrders: Order[] = [];
  submitted: boolean = false;
  statuses: any[] = [];
  orderTypes: any[] = [];

  private ordersCollection!: AngularFirestoreCollection<Order>;
  orders: Order[] = [];
  userName: string = '';

  formUserInput: FormGroup = new FormGroup({});
  formInput: FormGroup = new FormGroup({});
  properties = {
    mobileNumber: 'mobileNumber',
    orderId: 'orderId',
    symbol: 'symbol',
    quantity: 'quantity',
    orderPrice: 'orderPrice',
    triggerPrice: 'triggerPrice',
    orderType: 'orderType',
    stoplossPrice: 'stoplossPrice',
    stoplossPercentage: 'stoplossPercentage',
    targetPrice: 'targetPrice',
    targetPercentage: 'targetPercentage',
    executionDateTime: 'executionDateTime',
    status: 'status',
    profit: 'profit',
    exchange: 'profit',
    brokerOrderId: 'brokerOrderId',
    onHold: 'onHold',
    transactionType: 'transactionType',
    userName:'userName'
  };

  private readonly USERIDKEY = 'iBotUserId';
  isAlertSound: boolean = false;

  constructor(
    private localStorageService: LocalStorageService,
    private fireStore: AngularFirestore,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private terminalService: TerminalService
  ) {
    this.userName = this.localStorageService.getItem(this.USERIDKEY);
    this.setFormData();

    this.terminalService.commandHandler.subscribe(command => {
      let response = (command === 'date') ? new Date().toDateString() : 'Unknown command: ' + command;
      this.terminalService.sendResponse(response);
  });
  }

  private setFormData() {
    this.formInput = new FormGroup({
      orderType: new FormControl(this.order.orderType),
      symbol: new FormControl(this.order.symbol),
      quantity: new FormControl(this.order.quantity),
      orderPrice: new FormControl(this.order.orderPrice),
      stoplossPrice: new FormControl(this.order.stoplossPrice),
      stoplossPercentage: new FormControl(this.order.stoplossPercentage),
      targetPrice: new FormControl(this.order.targetPrice),
      targetPercentage: new FormControl(this.order.targetPercentage),
      transactionType: new FormControl(this.order.transactionType),
      triggerPrice: new FormControl(this.order.triggerPrice),
      status: new FormControl(this.order.status),
    });
    this.formUserInput = new FormGroup({
      userName: new FormControl(this.userName),
    });

    this.setFromChangeEvents();
  }

  ngOnInit() {
    this.getOrders();

    this.statuses = [
      { label: 'NEW', value: 'New' },
      { label: 'ACTIVE', value: 'Active' },
      { label: 'COMPLETED', value: 'Completed' },
      { label: 'CLOSED', value: 'Closed' },
      { label: 'PAUSED', value: 'Paused' },
      { label: 'CANCELLED', value: 'Cancelled' },
    ];

    this.orderTypes = [
      { label: 'LONG', value: 'long' },
      { label: 'SHORT', value: 'short' },
    ];

  }

  private setFromChangeEvents() {
    this.formInput.controls[this.properties.orderPrice].valueChanges.subscribe(
      (val) => {
        const orderType = this.formInput.controls[this.properties.orderType].value;
        const targetPercentage = 1;
        const stoplossPercentage = -0.5;
        const targetPrice = this.calculateTargetPrice(val, targetPercentage, orderType);
        const stoplossPrice = this.calculateStoplossPrice(val, stoplossPercentage, orderType);

        this.formInput.controls[this.properties.targetPrice].setValue(targetPrice);
        this.formInput.controls[this.properties.stoplossPrice].setValue(stoplossPrice);
        this.formInput.controls[this.properties.targetPercentage].setValue(targetPercentage);
        this.formInput.controls[this.properties.stoplossPercentage].setValue(stoplossPercentage);
        this.order.orderPrice = val;
      }
    );

    this.formInput.controls[this.properties.targetPrice].valueChanges.subscribe((val) => {
      const orderPrice = this.formInput.controls[this.properties.orderPrice].value;
      const orderType = this.formInput.controls[this.properties.orderType].value;

      if (orderPrice && orderPrice > 0) {
        const targetPercentage = this.calculateTargetPercentage(val, orderPrice, orderType);
        this.formInput.controls[this.properties.targetPercentage].setValue(targetPercentage);
        this.order.targetPercentage = targetPercentage;
      }
    }
    );

    this.formInput.controls[this.properties.stoplossPrice].valueChanges.subscribe((val) => {
      const price = this.formInput.controls[this.properties.orderPrice].value;
      const orderType = this.formInput.controls[this.properties.orderType].value;

      if (price && price > 0) {
        const stoplossPercentage = this.calculateStoplossPercentage(val, price, orderType);
        this.formInput.controls[this.properties.stoplossPercentage].setValue(stoplossPercentage);
        this.order.stoplossPercentage = stoplossPercentage;

      }
    }
    );

    this.formInput.controls[this.properties.quantity].valueChanges.subscribe(
      (val) => {
        const quantity = val;
        this.order.targetPercentage = this.formInput.controls[this.properties.targetPercentage].value;
        this.order.stoplossPercentage = this.formInput.controls[this.properties.stoplossPercentage].value;
        this.order.orderPrice = this.formInput.controls[this.properties.orderPrice].value;
        this.order.quantity = quantity;
      }
    );
  }

  private calculateStoplossPercentage(stoplossPrice: number, price: number, orderType: string) {
    if (orderType == 'long') {
      return -+parseFloat((((price - stoplossPrice) / price) * 100).toString()).toFixed(2);
    } else if (orderType == 'short') {
      return -+parseFloat((((stoplossPrice - price) / price) * 100).toString()).toFixed(2);
    }
    return 0;
  }

  private calculateTargetPercentage(targetPrice: number, price: number, orderType: string) {
    if (orderType == 'long') {
      return +parseFloat((((targetPrice - price) / price) * 100).toString()).toFixed(2);
    } else if (orderType == 'short') {
      return +parseFloat((((price - targetPrice) / price) * 100).toString()).toFixed(2);
    }
    return 0;
  }

  private calculateTargetPrice( price: number, targetPercentage: number, orderType: string) {
    const perceentage = (price * targetPercentage) / 100;
    if (orderType == 'long') {
      return price + perceentage;
    } else if (orderType == 'short') {
      return price - perceentage;
    }
    return price;
  }

  private calculateStoplossPrice(
    price: number,
    stoplossPercentage: number,
    orderType: string
  ) {
    const perceentage = (price * stoplossPercentage) / 100;
    if (orderType == 'long') {
      return price + perceentage;
    } else if (orderType == 'short') {
      return price - perceentage;
    }
    return price;
  }

  getOrders() {
    if(this.userName) {
    this.ordersCollection = this.fireStore.collection('Orders').doc(this.userName).collection('Order', ref=>ref.orderBy('executionDateTime','desc'));
    this.ordersCollection.valueChanges({ idField: 'orderId' }).subscribe((res) => {
      if(this.orders.length>0)
            this.playAudio();
        this.orders = res;
        this.orders.forEach(element => {
          element.profit = +parseFloat(element.profit.toString()).toFixed(2);
        });
      });
    }
  }

  openNew() {
    this.formInput.reset();
    this.order = new Order();

    this.setFormData();
    this.submitted = false;
    this.orderDialog = true;
  }

  deleteSelectedOrders() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected orders?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        //this.orders = this.orders.filter(val => !this.selectedOrders.includes(val));
        this.selectedOrders.forEach((item) => {
          this.ordersCollection.doc(item.orderId).delete();
        });
        this.selectedOrders = [];
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Orders Deleted',
          life: 3000,
        });
      },
    });
  }

  editOrder(order: Order) {
    this.formInput.reset();
    this.order = { ...order };
    this.order.targetPercentage = +parseFloat(order.targetPercentage.toString()).toFixed(2);
    this.order.stoplossPercentage= +parseFloat(order.stoplossPercentage.toString()).toFixed(2);
    this.setFormData();
    this.orderDialog = true;
  }

  deleteOrder(order: Order) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + order.symbol + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        //this.orders = this.orders.filter(val => val.orderId !== order.orderId);
        this.ordersCollection.doc(order.orderId).delete();
        this.order = new Order();
        this.setFormData();
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Order Deleted',
          life: 3000,
        });
      },
    });
  }

  hideDialog() {
    this.orderDialog = false;
    this.submitted = false;
  }

  saveOrder() {
    this.submitted = true;

    //if (this.order.name.trim()) {
    if (this.order.orderId) {
      this.order.orderType = this.formInput.controls[this.properties.orderType].value;
      this.order.symbol = this.formInput.controls[this.properties.symbol].value;
      this.order.quantity = this.formInput.controls[this.properties.quantity].value;
      this.order.orderPrice = this.formInput.controls[this.properties.orderPrice].value;
      this.order.currentPrice = this.formInput.controls[this.properties.orderPrice].value;
      this.order.stoplossPrice = this.formInput.controls[this.properties.stoplossPrice].value;
      this.order.targetPrice = this.formInput.controls[this.properties.targetPrice].value;
      this.order.transactionType = this.formInput.controls[this.properties.transactionType].value;
      this.order.triggerPrice = this.formInput.controls[this.properties.triggerPrice].value;
      this.order.status = this.formInput.controls[this.properties.status].value;
      this.order.executionDateTime = new Date();

      if(this.order.orderType == 'long')
      {
        this.order.buyPrice = this.order.orderPrice;
      }else {
        this.order.sellPrice = this.order.orderPrice;
      }

      //this.orders[this.findIndexById(this.order.orderId)] = this.order;
      this.ordersCollection
        .doc(this.order.orderId)
        .set({ ...this.order }, { merge: true });
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Order Updated',
        life: 3000,
      });
    } else {
      this.order.orderId = this.createId();
      this.order.orderType = this.formInput.controls[this.properties.orderType].value;
      this.order.symbol = this.formInput.controls[this.properties.symbol].value;
      this.order.quantity = this.formInput.controls[this.properties.quantity].value;
      this.order.orderPrice = this.formInput.controls[this.properties.orderPrice].value;
      this.order.currentPrice = this.formInput.controls[this.properties.orderPrice].value;
      this.order.stoplossPrice = this.formInput.controls[this.properties.stoplossPrice].value;
      this.order.targetPrice = this.formInput.controls[this.properties.targetPrice].value;
      this.order.transactionType = this.formInput.controls[this.properties.transactionType].value;
      this.order.triggerPrice = this.formInput.controls[this.properties.triggerPrice].value;
      this.order.status = this.formInput.controls[this.properties.status].value;
      //this.order.status = 'New';
      this.order.executionDateTime = new Date();
      this.order.profit = 0;
      this.order.exchange = 'NSE';
      this.order.brokerOrderId = '';
      this.order.onHold = false;

      //this.order.image = 'order-placeholder.svg';
      //this.orders.push(this.order);
      this.ordersCollection.add({ ...this.order });
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Order Created',
        life: 3000,
      });
    }

    //this.orders = [...this.orders];
    this.orderDialog = false;
    this.order = new Order();
    this.formInput.reset();
    //}
  }

  // findIndexById(orderId: string): number {
  //     let index = -1;
  //     for (let i = 0; i < this.orders.length; i++) {
  //         if (this.orders[i].orderId === orderId) {
  //             index = i;
  //             break;
  //         }
  //     }

  //     return index;
  // }

  createId(): string {
    return this.fireStore.createId();
    // let id = '';
    // var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    // for ( var i = 0; i < 5; i++ ) {
    //     id += chars.charAt(Math.floor(Math.random() * chars.length));
    // }
    // return id;
  }

  // getItemsList(query={}): FirebaseListObservable<Order[]> {
  //   this.items = this.db.list(this.basePath, {
  //     query: query
  //   });
  //   return this.items
  // }

  // // Return a single observable item
  // getItem(key: string): FirebaseObjectObservable<Order> {
  //   const itemPath =  `${this.basePath}/${key}`;
  //   this.item = this.db.object(itemPath)
  //   return this.item
  // }

  saveUserId(){
    this.userName = this.formUserInput.controls[this.properties.userName].value;
    this.localStorageService.setItem(this.USERIDKEY,this.userName);
    this.getOrders();
  }

  playAudio(){
    if(this.isAlertSound) {
      let audio = new Audio();
      audio.src = "../../../assets/audit/order.mp3";
      audio.load();
      audio.play();
    }
  }

  handleChange(event:any) {
    this.isAlertSound = event.checked;
  }

 openChart(order:Order) {
      window.open("https://kite.zerodha.com/chart/ext/tvc/NSE/" + order.symbol +"/2815745" + order.instrumentToken, '_blank');
 }

 ngOnDestroy() {
  if (this.subscription) {
      this.subscription.unsubscribe();
  }
}

}
