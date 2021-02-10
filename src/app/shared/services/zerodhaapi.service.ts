import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { LocalStorageService } from './local-storage.service';
import { UserProfile } from '../models/user-profile';
import { environment } from 'src/environments/environment';
import { Md5 } from 'ts-md5';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ZerodhaAPIService {
  errorMessage: any;

  constructor(
    private httpClient: HttpClient,
    private localStorageService: LocalStorageService
  ) {}

  checkAuthentication() {
    const userData = this.localStorageService.getItem(
      environment.USERDATA
    ) as any;
    if (userData) {
      const userProfile = userData as UserProfile;
      const apiKey = userProfile.apiKey;
      const apiSecret = userProfile.apiSecret;
      const apiAccessToken = userProfile.apiAccessToken;
      const apiRequestToken = '6eIoaLIGiBV8fzcsT2z8lHx5X2QT6H9x';//userProfile.apiRequestToken;

      const headers = { 'X-Kite-Version': '3','Access-Control-Allow-Origin': '*' };
      const md5 = new Md5();
      const key = apiKey + apiRequestToken + apiSecret;
      const checksum = md5
        .appendStr(key)
        .end();
      this.httpClient
        .post<any>(environment.API_URL, {
          api_key: apiKey,
          request_token: apiRequestToken,
          checksum: checksum,
        }, {headers})
        .subscribe({
          next: (data) => {
            //this.postId = data.id;
          },
          error: (error) => {
            this.errorMessage = error.message;
            console.error('There was an error!', error);
          },
        });
    }
  }

  getInstrumentTokens(): Observable<ArrayBuffer> {
    let headers = new HttpHeaders();

    const options: {
        headers?: HttpHeaders;
        observe?: 'body';
        params?: HttpParams;
        reportProgress?: boolean;
        responseType: 'arraybuffer';
        withCredentials?: boolean;
    } = {
        responseType: 'arraybuffer'
    };

    return this.httpClient
        .get('http://api.kite.trade/instruments', options)
        .pipe(
            map((file: ArrayBuffer) => {
                return file;
            })
        );
}

  // public getContacts(){
  // return this.httpClient.get(`${environment.API_URL}`);
  //   return this.httpClient.get<Customer[]>(`${this.apiURL}/customers`);
  // }

  //   public getCustomerById(id: number){
  //     return this.httpClient.get(`${this.apiURL}/customers/${id}`);
  // }

  // public createCustomer(customer: Customer){
  //   return this.httpClient.post(`${this.apiURL}/customers/`,customer);
  // }
}
