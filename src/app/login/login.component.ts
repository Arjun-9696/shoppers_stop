import { Component } from '@angular/core';
import {Title} from '@angular/platform-browser'
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { CartServiceService } from '../services/cart-service.service';
import { cartType, products } from 'src/data.type';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(
    private authService: AuthenticationService,
    private navigate: Router,
    private cartService: CartServiceService,
    private titleService:Title
  ) { }
  loginFailed: String = "";
  isLoading: boolean = false

  ngOnInit(): void {
    this.titleService.setTitle("E-Comm | Login")
    this.authService.notAllowedAuth();
    
  }

  LoginFormHandle(loginData: NgForm): void {
    this.isLoading = true
    this.authService.loginUser(loginData.value)
      .subscribe(
        (result: any) => {
          if (result[0] && result[0].role_type === "seller") {
            alert("Login Successful")
            this.isLoading=false
            localStorage.setItem("sellerLoggedIn", JSON.stringify(result[0].name))
            this.navigate.navigate(['seller-home'])

          } else if (result[0] && result[0].role_type === "user") {
            alert("Login Successful")
            this.isLoading=false

            // for saving only name and id
            const user = {
              name: result[0].name,
              id: result[0].id
            };
            localStorage.setItem("userLoggedIn", JSON.stringify(user));
            this.localCartToRemoteCart()
            this.navigate.navigate([''])

          }
          else if (result.length === 0) {
            this.loginFailed = "Credentials not found"
            this.isLoading=false
          } else {
            this.loginFailed = "Something went wrong"
            this.isLoading=false
          }
        },
        (error: any) => {
          this.loginFailed = "Network or server error"
          // console.error(error)
        }
      );


  }

  redirectToSignup() {
    this.navigate.navigate(['auth'])
  }


  localCartToRemoteCart() {
    let data = localStorage.getItem('localCart');
    let user = localStorage.getItem('userLoggedIn');
    let userId = user && JSON.parse(user).id;
    if (data) {
      let cartDataList: products[] = JSON.parse(data);

      cartDataList.forEach((product: products, index) => {
        let cartData: cartType = {
          ...product,
          productId: product.id,
          userId
        }
        delete cartData.id;
        setTimeout(() => {
          this.cartService.addToCartService(cartData).subscribe((result) => {
            if (result) {
              console.warn("data is stored in DB");
            }
          })
        }, 500);
        if (cartDataList.length === index + 1) {
          localStorage.removeItem('localCart')
        }
      })
    }

    // load cart items when user logged in
    setTimeout(() => {
      this.cartService.getCartItems(userId)
    }, 500);

  }

}
