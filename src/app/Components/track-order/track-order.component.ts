import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { CreateOrder } from 'src/app/ViewModels/create-order';
import { Order } from '../../ViewModels/order';
import { Restaurants } from '../../ViewModels/restaurants';

@Component({
  selector: 'app-track-order',
  templateUrl: './track-order.component.html',
  styleUrls: ['./track-order.component.scss']
})
export class TrackOrderComponent implements OnInit {


  selectedOrder: CreateOrder | any;
  selectedOrderId: string;
  restaurant: Restaurants;
  showLoading: boolean = true;
  orderStatus: boolean = true;

  constructor(private db: AngularFirestore) { }

  ngOnInit(): void {
    this.selectedOrderId = localStorage.getItem('reOrderedID');
    console.log("orderID: " + this.selectedOrderId);

    this.db.collection('Orders').doc(this.selectedOrderId).ref.get()
      .then((doc) => {
        if (doc.exists) {
          this.selectedOrder = doc.data();
          console.log(this.selectedOrder);

          this.db.collection('Restaurants').doc(this.selectedOrder.restaurantID).ref.get()
            .then((doc) => {
              if (doc.exists) {
                this.restaurant = doc.data();
                this.showLoading = false
                console.log(this.restaurant);
              }
              else {
                console.log("There is no document");
              }
            }).catch(function (err) {
              console.log("error !!", err);
            })

        }
        else {
          console.log("There is no document");
        }
      }).catch(function (err) {
        console.log("error !!", err);
      })
  }

  cancelOrder() {
    this.orderStatus = false;

    console.log(this.selectedOrder);
    console.log("(Before) -> OrderStatus: " + this.selectedOrder.orderStatus)

    this.selectedOrder.orderStatus = 'Canceled';
    
    console.log("(After) -> OrderStatus: " + this.selectedOrder.orderStatus);

    let updatedOrder = this.db.collection('Orders').doc(this.selectedOrderId);
    var setWithMerge = updatedOrder.set({
      orderStatus: this.selectedOrder.orderStatus
    }, { merge: true });

    console.log("(After updating) -> OrderStatus: " + this.selectedOrder.orderStatus);
    console.log(this.selectedOrder);
  }

}
