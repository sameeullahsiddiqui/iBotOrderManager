import { Component, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { UserConfiguration } from 'src/app/shared/models/user-configuration';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Component({
  selector: 'app-user-configuration',
  templateUrl: './user-configuration.component.html',
  styleUrls: ['./user-configuration.component.css'],
  styles: [
    `
      :host ::ng-deep .p-dialog .user-configuration-image {
        width: 150px;
        margin: 0 auto 2rem auto;
        display: block;
      }
    `,
  ],
  providers: [MessageService, ConfirmationService],
})
export class UserConfigurationComponent implements OnInit {

  private userConfigurationCollection!: AngularFirestoreCollection<UserConfiguration>;
  userConfiguration: UserConfiguration = new UserConfiguration();
  selectedUserConfigurations: UserConfiguration[] = [];
  submitted: boolean = false;

  userName: string = '';

  formUserInput: FormGroup = new FormGroup({});
  properties = {
    userName:'userName',
    apiKey:'apiKey',
    apiSecret:'apiSecret',
    apiRequestToken:'apiRequestToken',
    apiAccessToken:'apiAccessToken',
    initialProfit:'initialProfit',
    initialStopLoss:'initialStopLoss',
    trailingStopLoss:'trailingStopLoss',
    pauseMoneyManagement:'pauseMoneyManagement',
    isAutoTradeEnabled:'isAutoTradeEnabled',
    autoTradeQuantity:'autoTradeQuantity',
    autoTradeNumber:'autoTradeNumber'
  };

  private readonly USERIDKEY = 'iBotUserId';

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
    this.formUserInput = new FormGroup({
      userName: new FormControl(this.userConfiguration.userName),
      apiKey: new FormControl(this.userConfiguration.apiKey),
      apiSecret: new FormControl(this.userConfiguration.apiSecret),
      apiAccessToken: new FormControl(this.userConfiguration.apiAccessToken),
      apiRequestToken: new FormControl(this.userConfiguration.apiRequestToken),
      autoTradeNumber: new FormControl(this.userConfiguration.autoTradeNumber),
      autoTradeQuantity: new FormControl(this.userConfiguration.autoTradeQuantity),
      initialProfit: new FormControl(this.userConfiguration.initialProfit),
      initialStopLoss: new FormControl(this.userConfiguration.initialStopLoss),
      trailingStopLoss: new FormControl(this.userConfiguration.trailingStopLoss),
      isAutoTradeEnabled: new FormControl(this.userConfiguration.isAutoTradeEnabled),
      pauseMoneyManagement: new FormControl(this.userConfiguration.pauseMoneyManagement),
      isEnabled: new FormControl(this.userConfiguration.isEnabled),
      pin: new FormControl(this.userConfiguration.pin),
      password: new FormControl(this.userConfiguration.password),
    });
  }

  ngOnInit() {
    this.getUserConfigurations();
  }

  getUserConfigurations() {
    if(this.userName) {
    this.userConfigurationCollection = this.fireStore.collection('UserConfiguration');
    this.userConfigurationCollection
    .doc(this.userConfiguration.userName).ref.get().then((res) => {
      if(res.exists) {
          this.userConfiguration = res.data() as UserConfiguration;
          this.setFormData();
      }
      });
    }
  }

  editUserConfiguration(userConfiguration: UserConfiguration) {
    this.userConfiguration = { ...userConfiguration };
    this.formUserInput.reset();
    this.setFormData();
  }

  saveUserConfiguration() {
    this.submitted = true;

    if (this.userConfiguration.userName) {
      this.userConfiguration.apiKey = this.formUserInput.controls[this.properties.apiKey].value;
      this.userConfiguration.apiSecret = this.formUserInput.controls[this.properties.apiSecret].value;
      this.userConfiguration.apiAccessToken = this.formUserInput.controls[this.properties.apiAccessToken].value;
      this.userConfiguration.apiRequestToken = this.formUserInput.controls[this.properties.apiRequestToken].value;
      this.userConfiguration.autoTradeNumber = this.formUserInput.controls[this.properties.autoTradeNumber].value;
      this.userConfiguration.autoTradeQuantity = this.formUserInput.controls[this.properties.autoTradeQuantity].value;
      this.userConfiguration.initialProfit = this.formUserInput.controls[this.properties.initialProfit].value;
      this.userConfiguration.initialStopLoss = this.formUserInput.controls[this.properties.initialStopLoss].value;
      this.userConfiguration.trailingStopLoss = this.formUserInput.controls[this.properties.trailingStopLoss].value;
      this.userConfiguration.isAutoTradeEnabled = this.formUserInput.controls[this.properties.isAutoTradeEnabled].value;
      this.userConfiguration.pauseMoneyManagement = this.formUserInput.controls[this.properties.pauseMoneyManagement].value;

      this.userConfigurationCollection
        .doc(this.userConfiguration.userName)
        .set({ ...this.userConfiguration }, { merge: true });
      this.messageService.add({ severity: 'success', summary: 'Successful',
                                detail: 'UserConfiguration Updated', life: 3000,
      });
    } else {
      this.userConfiguration.userName = this.formUserInput.controls[this.properties.userName].value;
      this.userConfiguration.apiKey = this.formUserInput.controls[this.properties.apiKey].value;
      this.userConfiguration.apiSecret = this.formUserInput.controls[this.properties.apiSecret].value;
      this.userConfiguration.apiAccessToken = this.formUserInput.controls[this.properties.apiAccessToken].value;
      this.userConfiguration.apiRequestToken = this.formUserInput.controls[this.properties.apiRequestToken].value;
      this.userConfiguration.autoTradeNumber = this.formUserInput.controls[this.properties.autoTradeNumber].value;
      this.userConfiguration.autoTradeQuantity = this.formUserInput.controls[this.properties.autoTradeQuantity].value;
      this.userConfiguration.initialProfit = this.formUserInput.controls[this.properties.initialProfit].value;
      this.userConfiguration.initialStopLoss = this.formUserInput.controls[this.properties.initialStopLoss].value;
      this.userConfiguration.trailingStopLoss = this.formUserInput.controls[this.properties.trailingStopLoss].value;
      this.userConfiguration.isAutoTradeEnabled = this.formUserInput.controls[this.properties.isAutoTradeEnabled].value;
      this.userConfiguration.pauseMoneyManagement = this.formUserInput.controls[this.properties.pauseMoneyManagement].value;

      this.userConfigurationCollection.add({ ...this.userConfiguration });
      this.messageService.add({severity: 'success',summary: 'Successful',
        detail: 'UserConfiguration Created',
        life: 3000,
      });
    }

    this.userConfiguration = new UserConfiguration();
  }

}
