import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  productList!: any[];
  products: any[] = [];
  subTotal!: any;
  filteredProducts: any[] = [];
  showCart: boolean = false;
  showCartBtn: boolean = true;
  showCancel: boolean = false;
  constructor(
    private product_service: ProductService,
    private router: Router
  ) { }

  ngOnInit() {
    this.product_service.getAllProducts().subscribe({
      next: (res: any) => {
        console.log(res);
        this.productList = res;
      },
      error: (error) => {
        alert(error);
      },
      complete: () => {
        console.log('Request Completed');
      },
    });

    this.product_service.loadCart();
    this.products = this.product_service.getProduct();
  }

  //Add product to Cart
  addToCart(product: any) {
    if (!this.product_service.productInCart(product)) {
      product.quantity = 1;
      this.product_service.addToCart(product);
      this.products = [...this.product_service.getProduct()];
      this.subTotal = product.price;
    }

  }

  // hideCancel() {
  //   this.showCancel = true;
  //   this.showCartBtn = false;

  // }
  // hideCart() {
  //   this.showCartBtn = true;
  //   this.showCancel = false;

  // }

  filterProducts(event: any) {
    const value = event.target.value;
    console.log(value.length);

    if (!value) {
      // If input is empty, show all products
      this.product_service.getAllProducts().subscribe({
        next: (res: any) => {
          console.log(res);
          this.productList = res;
        },
        error: (error) => {
          alert(error);
        },
        complete: () => {
          console.log('Request Completed');
        },
      });
    } else {
      // Filter products based on input value
      this.filteredProducts = this.productList.filter((product) =>
        product.name.toLowerCase().includes(value.toLowerCase())
      );
      this.productList = this.filteredProducts
    }
  }



  // Change sub total amount
  // changeSubTotal(product: any, index: any) {
  //   const qty = product.quantity;
  //   const amt = product.price;

  //   this.subTotal = amt * qty;

  //   this.product_service.saveCart();
  // }

  //Remove a Product from Cart
  removeFromCart(product: any) {
    this.product_service.removeProduct(product);
    this.products = this.product_service.getProduct();
  }

  //Calculate Total

  get total() {
    return this.products?.reduce(
      (sum, product) => ({
        quantity: 1,
        price: sum.price + product.quantity * product.price,
      }),
      { quantity: 1, price: 0 }
    ).price;
  }

  checkout() {
    localStorage.setItem('cart_total', JSON.stringify(this.total));
    this.router.navigate(['/payment']);
  }
  cartFunctinality() {
    this.showCart = true;
  }
  showHome() {
    this.showCart = false;

  }
  rateProduct(product: any, rating: number): void {
    product.ratings.push({ value: rating });
    product.totalRatings = product.ratings.length;
  }

  calculateAverageRating(ratings: any[]): number {
    const total = ratings.reduce((acc, curr) => acc + curr.value, 0);
    return total / ratings.length;
  }
}
