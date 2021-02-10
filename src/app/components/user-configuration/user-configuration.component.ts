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
    PauseMoneyManagement:'PauseMoneyManagement',
    IsAutoTradeEnabled:'IsAutoTradeEnabled',
    AutoTradeQuantity:'AutoTradeQuantity',
    AutoTradeNumber:'AutoTradeNumber',
    isPaperTradingEnabled:'isPaperTradingEnabled',
    isHedgingEnabled:'isHedgingEnabled',
    userTestMode:'userTestMode'
  };

  private readonly USERIDKEY = 'iBotUserId';
  private readonly MOBILEKEY = 'iBotUserMobile';
  mobile: string;

  constructor(
    private localStorageService: LocalStorageService,
    private fireStore: AngularFirestore,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.userName = this.localStorageService.getItem(this.USERIDKEY);
    this.mobile = this.localStorageService.getItem(this.MOBILEKEY);
    this.setFormData();
  }

  private setFormData() {
    this.formUserInput = new FormGroup({
      userName: new FormControl(this.userConfiguration.userName),
      apiKey: new FormControl(this.userConfiguration.apiKey),
      apiSecret: new FormControl(this.userConfiguration.apiSecret),
      AutoTradeNumber: new FormControl(this.userConfiguration.AutoTradeNumber),
      AutoTradeQuantity: new FormControl(this.userConfiguration.AutoTradeQuantity),
      initialProfit: new FormControl(this.userConfiguration.initialProfit),
      initialStopLoss: new FormControl(this.userConfiguration.initialStopLoss),
      trailingStopLoss: new FormControl(this.userConfiguration.trailingStopLoss),
      IsAutoTradeEnabled: new FormControl(this.userConfiguration.IsAutoTradeEnabled),
      PauseMoneyManagement: new FormControl(this.userConfiguration.PauseMoneyManagement),
      isEnabled: new FormControl(this.userConfiguration.IsEnabled),
      pin: new FormControl(this.userConfiguration.pin),
      password: new FormControl(this.userConfiguration.password),
      isPaperTradingEnabled: new FormControl(this.userConfiguration.isPaperTradingEnabled),
    });
  }

  ngOnInit() {
    this.getUserConfigurations();
  }

  getUserConfigurations() {
    if(this.mobile) {
    this.userConfigurationCollection = this.fireStore.collection('UserConfiguration');
    this.userConfigurationCollection
    .doc(this.mobile).ref.get().then((res) => {
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

    if (this.mobile) {
      this.userConfiguration.apiKey = this.formUserInput.controls[this.properties.apiKey].value;
      this.userConfiguration.apiSecret = this.formUserInput.controls[this.properties.apiSecret].value;
      this.userConfiguration.AutoTradeNumber = this.formUserInput.controls[this.properties.AutoTradeNumber].value;
      this.userConfiguration.AutoTradeQuantity = this.formUserInput.controls[this.properties.AutoTradeQuantity].value;
      this.userConfiguration.initialProfit = this.formUserInput.controls[this.properties.initialProfit].value;
      this.userConfiguration.initialStopLoss = this.formUserInput.controls[this.properties.initialStopLoss].value;
      this.userConfiguration.trailingStopLoss = this.formUserInput.controls[this.properties.trailingStopLoss].value;
      this.userConfiguration.IsAutoTradeEnabled = this.formUserInput.controls[this.properties.IsAutoTradeEnabled].value;
      this.userConfiguration.PauseMoneyManagement = this.formUserInput.controls[this.properties.PauseMoneyManagement].value;
      this.userConfiguration.isPaperTradingEnabled = this.formUserInput.controls[this.properties.isPaperTradingEnabled].value;

      this.userConfigurationCollection
        .doc(this.mobile)
        .set({ ...this.userConfiguration }, { merge: true });
      this.messageService.add({ severity: 'success', summary: 'Successful',
                                detail: 'UserConfiguration Updated', life: 3000,
      });
    } else {
      this.userConfiguration.userName = this.formUserInput.controls[this.properties.userName].value;
      this.userConfiguration.apiKey = this.formUserInput.controls[this.properties.apiKey].value;
      this.userConfiguration.apiSecret = this.formUserInput.controls[this.properties.apiSecret].value;
      this.userConfiguration.AutoTradeNumber = this.formUserInput.controls[this.properties.AutoTradeNumber].value;
      this.userConfiguration.AutoTradeQuantity = this.formUserInput.controls[this.properties.AutoTradeQuantity].value;
      this.userConfiguration.initialProfit = this.formUserInput.controls[this.properties.initialProfit].value;
      this.userConfiguration.initialStopLoss = this.formUserInput.controls[this.properties.initialStopLoss].value;
      this.userConfiguration.trailingStopLoss = this.formUserInput.controls[this.properties.trailingStopLoss].value;
      this.userConfiguration.IsAutoTradeEnabled = this.formUserInput.controls[this.properties.IsAutoTradeEnabled].value;
      this.userConfiguration.PauseMoneyManagement = this.formUserInput.controls[this.properties.PauseMoneyManagement].value;
      this.userConfiguration.isPaperTradingEnabled = this.formUserInput.controls[this.properties.isPaperTradingEnabled].value;

      this.userConfigurationCollection.add({ ...this.userConfiguration });
      this.messageService.add({severity: 'success',summary: 'Successful',
        detail: 'UserConfiguration Created',
        life: 3000,
      });
    }

    this.userConfiguration = new UserConfiguration();
  }

}
