import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  //private orderCollection: AngularFirestoreCollection<Order>;
  // orders: Observable<Order[]>;

  constructor(private firestore: AngularFirestore) {

    //this.orderCollection = firestore.collection('Orders').doc(mobileNumber).collection('Order');
    // this.orders = this.orderCollection.stateChanges(['added']).pipe(
    //   map(actions => actions.map(a => {
    //     const data = a.payload.doc.data() as Order;
    //     const id = a.payload.doc.id;
    //     return { id, ...data };
    //   }))
    // );
  }


  //Firestore CRUD actions example
  createOrder(data:Order) {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection('Orders')
        .doc(data.orderId)
        .collection('Order')
        .add(data)
        .then(res => {}, err => reject(err));
    });
  }

  updateOrder(data:Order) {
    return this.firestore
      .collection('Orders')
      .doc(data.orderId)
      .collection('Order')
      .doc(data.orderId)
      .set({ completed: true }, { merge: true });
  }

  getOrders(mobileNumber:string){
    return this.firestore
      .collection('Orders')
      .doc(mobileNumber)
      .collection('Order')
      .snapshotChanges();
  }

  deleteOrder(data:Order) {
    return this.firestore
      .collection('Orders')
      .doc(data.orderId)
      .collection('Order')
      .doc(data.orderId)
      .delete();
  }
}
