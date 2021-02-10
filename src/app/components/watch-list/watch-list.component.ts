import { Component, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { WatchList } from 'src/app/shared/models/watch-list';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Component({
  selector: 'app-watch-list',
  templateUrl: './watch-list.component.html',
  styleUrls: ['./watch-list.component.css'],
  styles: [
    `
      :host ::ng-deep .p-dialog .watchList-image {
        width: 150px;
        margin: 0 auto 2rem auto;
        display: block;
      }
    `,
  ],
  providers: [MessageService, ConfirmationService],
})
export class WatchListComponent implements OnInit {
  watchListDialog: boolean = false;
  watchList: WatchList = new WatchList();
  selectedWatchLists: WatchList[] = [];
  submitted: boolean = false;
  statuses: any[] = [];
  watchListTypes: any[] = [];

  private watchListsCollection!: AngularFirestoreCollection<WatchList>;
  watchLists: WatchList[] = [];
  userName: string = '';

  formInput: FormGroup = new FormGroup({});
  properties = {
    watchListId: 'watchListId',
    userName: 'userName',
    symbol: 'symbol',
    price: 'price',
    status: 'status',
    instrumentToken: 'instrumentToken',
    description: 'description',
    reasonToWatch: 'reasonToWatch',
    updateTime: 'updateTime',
  };

  private readonly USERIDKEY = 'iBotUserId';
  iswatchlistSound: any;

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
      watchListId: new FormControl(this.watchList.watchListId),
      userName: new FormControl(this.watchList.userName),
      symbol: new FormControl(this.watchList.symbol),
      price: new FormControl(this.watchList.price),
      description: new FormControl(this.watchList.description),
      reasonToWatch: new FormControl(this.watchList.reasonToWatch),
      status: new FormControl(this.watchList.status),
      instrumentToken: new FormControl(this.watchList.instrumentToken)
    });
  }

  ngOnInit() {
    this.getWatchLists();
  }

  getWatchLists() {
    if(this.userName) {
    this.watchListsCollection = this.fireStore
          .collection('Watchlists')
          .doc(this.userName)
          .collection('Watchlist', ref=>ref.orderBy('updateTime','desc'));
    this.watchListsCollection.valueChanges({ idField: 'watchListId' }).subscribe((res) => {
      if(this.watchLists.length>0)
          this.playAudio();

        this.watchLists = res;
      });
    }
  }

  openNew() {
    this.watchList = new WatchList();
    this.submitted = false;
    this.watchListDialog = true;
  }

  deleteSelectedWatchLists() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected watchlist?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.selectedWatchLists.forEach((item) => {
          this.watchListsCollection.doc(item.watchListId).delete();
        });
        this.selectedWatchLists = [];
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Stock watchlist Deleted',
          life: 3000,
        });
      },
    });
  }

  editWatchList(watchList: WatchList) {
    this.watchList = { ...watchList };
    this.watchListDialog = true;
    this.formInput.reset();
    this.setFormData();
  }

  deleteWatchList(watchList: WatchList) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + watchList.symbol + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.watchListsCollection.doc(watchList.watchListId).delete();
        this.watchList = new WatchList();
        this.setFormData();
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Stock watchlist Deleted',
          life: 3000,
        });
      },
    });
  }

  hideDialog() {
    this.watchListDialog = false;
    this.submitted = false;
  }

  saveWatchList() {
    this.submitted = true;

    if (this.watchList.watchListId) {
      this.watchList.symbol = this.formInput.controls[this.properties.symbol].value;
      this.watchList.description = this.formInput.controls[this.properties.description].value;
      this.watchList.reasonToWatch = this.formInput.controls[this.properties.reasonToWatch].value;
      this.watchList.price = this.formInput.controls[this.properties.price].value;
      this.watchList.status = this.formInput.controls[this.properties.status].value;
      this.watchList.updateTime = new Date();

      this.watchListsCollection.doc(this.watchList.watchListId)
          .set({ ...this.watchList }, { merge: true });

      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Stock watchlist Updated',
        life: 3000,
      });
    } else {
      this.watchList.watchListId = this.createId();
      this.watchList.symbol = this.formInput.controls[this.properties.symbol].value;
      this.watchList.description = this.formInput.controls[this.properties.description].value;
      this.watchList.reasonToWatch = this.formInput.controls[this.properties.reasonToWatch].value;
      this.watchList.price = this.formInput.controls[this.properties.price].value;
      this.watchList.status = 'New';
      this.watchList.userName = this.userName;
      this.watchList.updateTime = new Date();

      this.watchListsCollection.add({ ...this.watchList });
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Stock watchlist Created',
        life: 3000,
      });
    }

    this.watchListDialog = false;
    this.watchList = new WatchList();
  }

  createId(): string {
    return this.fireStore.createId();
  }

  playAudio(){
    if(this.iswatchlistSound) {
      let audio = new Audio();
      audio.src = "../../../assets/audit/watchlist.mp3";
      audio.load();
      audio.play();
    }
  }

  handleChange(event:any) {
    this.iswatchlistSound = event.checked;
}

openChart(watchlist:WatchList) {
  window.open("https://in.tradingview.com/chart/?symbol=NSE:" + watchlist.symbol, '_blank');
}

}
