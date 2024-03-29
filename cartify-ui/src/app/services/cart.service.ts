import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItems: CartItem[] = [];

  // Subject is a subclass of Observable. We can use Subject to publish events in our code,
  // The event will be sent to all of the subscribers
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  constructor() {}

  addToCart(theCartItem: CartItem) {
    let alreadyExistsInCart: boolean = false; // check if we already have the item in our cart
    let existingCartItem: CartItem = undefined;

    if (this.cartItems.length > 0) {
      for (let tempCartItem of this.cartItems) {
        if (tempCartItem.id === theCartItem.id) {
          //find the item in the cart based on item id
          existingCartItem = tempCartItem;
          break;
        }
      }

      alreadyExistsInCart = existingCartItem != undefined; // check if we found it
    }

    if (alreadyExistsInCart) {
      existingCartItem.quantity++; // increment the quantity
    } else {
      this.cartItems.push(theCartItem); // just add the item to the array
    }

    this.computeCartTotals(); // compute cart quantity and cart total
  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    // publish the new values ... all subscribers will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    this.logCartData(totalPriceValue, totalQuantityValue);
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('Contents of the Cart : ');
    for (let tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(
        `name=${tempCartItem.name} , quantity=${tempCartItem.quantity}, unitPrice=${tempCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`
      );
    }
    console.log(
      `totalPrice= ${totalPriceValue.toFixed(
        2
      )}, totalQuantity= ${totalQuantityValue}`
    );
    console.log('-------');
  }

  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;

    if (theCartItem.quantity === 0) {
      this.remove(theCartItem);
    } else {
      this.computeCartTotals();
    }
  }

  remove(theCartItem: CartItem) {
    // get index of item in the array
    const itemIndex = this.cartItems.findIndex(
      (tempCartItem) => tempCartItem.id == theCartItem.id
    );

    // if found, remove the item from the array at the given index
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
    }
  }


}
