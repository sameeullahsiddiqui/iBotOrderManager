import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { UserProfile } from 'src/app/shared/models/user-profile';
import { ZerodhaAPIService } from 'src/app/shared/services/zerodhaapi.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [],
})
export class HomeComponent implements OnInit {
  userName: string;
  private readonly USERIDKEY = 'iBotUserId';
  private readonly MOBILEKEY = 'iBotUserMobile';
  USERDATA: string = 'iBotUserData';
  userSettings: any;
  userData!: UserProfile;
  formUserInput: FormGroup = new FormGroup({});
  properties = {
    userName:'userName',
    mobile:'mobile'
  };
  mobile: any;

  constructor(
    private localStorageService: LocalStorageService,
    private fireStore: AngularFirestore,
    private zerodhaAPIService: ZerodhaAPIService
  ) {
    this.userName = this.localStorageService.getItem(this.USERIDKEY);
    this.mobile = this.localStorageService.getItem(this.MOBILEKEY);
  }

  ngOnInit(): void {
    this.formUserInput = new FormGroup({
      userName: new FormControl(this.userName),
      mobile: new FormControl(this.mobile),
    });
  }

  saveUserId(){
    this.userName = this.formUserInput.controls[this.properties.userName].value;
    this.mobile = this.formUserInput.controls[this.properties.mobile].value;
    this.localStorageService.setItem(this.USERIDKEY,this.userName);
    this.localStorageService.setItem(this.MOBILEKEY,this.mobile);
  }

  getUserSettings() {
    const isUserSaved = localStorage.getItem(this.USERDATA);
    if (!isUserSaved && this.userName) {
      this.userSettings = this.fireStore
        .collection('UserConfiguration')
        .doc(this.mobile);
      this.userSettings.valueChanges().subscribe((res: any) => {
        if (res) {
          this.userData = res as UserProfile;
          const serializedData = JSON.stringify(this.userData);
          localStorage.setItem(this.USERDATA, serializedData);
        }
      });
    } else {
      this.zerodhaAPIService.checkAuthentication();
    }
  }

  saveZerodhaToken() {
    if (this.userName) {
      this.userSettings = this.fireStore
        .collection('UserConfiguration')
        .doc(this.mobile);
      const userData = localStorage.getItem(this.USERDATA) as string;
      const userProfile = JSON.parse(userData) as UserProfile;
      userProfile.apiAccessToken = '';
      userProfile.apiRequestToken = '';
      this.userSettings.set({ ...userProfile }, { merge: true });

      this.userSettings.valueChanges().subscribe((res: any) => {
        if (res) {
          this.userData = res as UserProfile;
          const serializedData = JSON.stringify(this.userData);
          localStorage.setItem(this.USERDATA, serializedData);
        }
      });
    }
  }

  getInstrumentTokens() {
    this.zerodhaAPIService
    .getInstrumentTokens()
    .subscribe((data: any) => {
      debugger;
        const blob = new Blob([data], { type: 'application/octet-stream' });
        const fileName = 'InstrumentTokens.csv';
        //saveAs(blob, fileName);
    })
  }

}
