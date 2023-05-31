
import { Component, OnInit } from '@angular/core';
import {Title} from '@angular/platform-browser'
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { cartType, products } from 'src/data.type';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { CartServiceService } from '../services/cart-service.service';
@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  productData: undefined | products;
  isProductInCart: boolean = false
  productQuantity: number = 1
  isSellerLoggedIn: boolean = false
  faEditIcon = faEdit
  cartItems: products | undefined
  isLoading: boolean = false
  loadingText: string = 'Loading product details...';

  constructor(
    private activeRoute: ActivatedRoute,
    private productService: ProductService,
    private route: Router,
    private cartService: CartServiceService,
    private titleService:Title
  ) { }

  // getting product id from url and sending to product service
  ngOnInit(): void {
    this.titleService.setTitle("E-Comm | Product-Details")
    this.isLoading = true;
    let isSellerLoggedInLs = localStorage.getItem("sellerLoggedIn");
    if (isSellerLoggedInLs) {
      this.isSellerLoggedIn = true
    }

    this.activeRoute.params.subscribe(params => {
      const paramId = params['productId'];
      if (paramId !== null) {
        const productId = parseInt(paramId);
        productId && this.productService.getSingleProduct(productId).subscribe((data) => {
          this.productData = data;
          this.isLoading = false;
        });

      }


      // get local cart items when user visit this page and show button accordingly
      let cartData = localStorage.getItem('localCart');
      if (paramId && cartData) {
        let items = JSON.parse(cartData);
        items = items.filter((item: products) => paramId === item.id.toString());
        this.isProductInCart = items.length > 0;
      }


      // load cart items when user logged in and visit this page
      let user = localStorage.getItem('userLoggedIn');
      if (user) {
        let userId = user && JSON.parse(user).id;
        this.cartService.getCartItems(userId);
        this.isLoading = true;

        this.cartService.cartData.subscribe((result) => {
          let item = result.filter((item: products) => paramId?.toString() === item.productId?.toString())
          if (item.length) {
            this.cartItems = item[0]
            this.isProductInCart = true;
          }
          this.isLoading = false;
        })
        
        
      }
    });

  }


  // if seller truet then below function will execute

  EditRedirect(id: number) {
    this.route.navigate([`seller-update-product/${id}`])
  }

  // handling incremnt and decremnt product quantity
  handleQuantity(val: string) {
    if (this.productQuantity < 5 && val === 'plus') {
      this.productQuantity += 1;
    } else if (this.productQuantity > 1 && val === 'min') {
      this.productQuantity -= 1;
    }
  }

  addToCart() {
    if (this.productData) {
      this.productData.quantity = this.productQuantity
      let isUserLoggedIn = localStorage.getItem("userLoggedIn")
      if (isUserLoggedIn) {
        let parseUser = JSON.parse(isUserLoggedIn);
        let cartData: cartType = {
          ...this.productData,
          productId: this.productData.id,
          userId: parseUser.id
        }
        delete cartData.id
        // console.log("cart data that would be send",cartData);

        this.cartService.addToCartService(cartData).subscribe((response) => {
          if (response) {
            alert("Product added to cart success")
            this.cartService.getCartItems(parseUser.id);
            this.isProductInCart = true
          }
        })

      } else {

        let cartData = {
          ...this.productData
        }
        this.cartService.localAddToCart(cartData)
        this.isProductInCart = true
        alert("Product added to cart success")
      }
    }
  }
  buyNow() {
    if (this.productData) {
      this.productData.quantity = this.productQuantity
      let isUserLoggedIn = localStorage.getItem("userLoggedIn")
      if (isUserLoggedIn) {
        let parseUser = JSON.parse(isUserLoggedIn);
        let cartData: cartType = {
          ...this.productData,
          productId: this.productData.id,
          userId: parseUser.id
        }
        delete cartData.id
        this.cartService.addToCartService(cartData).subscribe((response) => {
          if (response) {
            alert("Product added to cart success")
            this.route.navigate(['cart'])
            this.cartService.getCartItems(parseUser.id);
            this.isProductInCart = true
          }
        })
      } else {
        let cartData = {
          ...this.productData
        }
        this.cartService.localAddToCart(cartData)
        this.isProductInCart = true
        alert("Product added to cart success")
      }
    }
  }

  // Remove items from cart
  removeFromCart(id: number) {
    if (!localStorage.getItem('userLoggedIn')) {
      this.cartService.removeItemFromCart(id)
      alert("Product removed from cart")
    }
    else {
      this.cartItems && this.cartService.cartItemRemoveFromDb(this.cartItems.id)
        .subscribe((result) => {
          if (result) {
            let user = localStorage.getItem('userLoggedIn');
            let userId = user && JSON.parse(user).id;
            this.cartService.getCartItems(userId)
            alert("Product removed from cart")
          } else {
            alert("Something went wrong")
          }
        })
    }
    this.isProductInCart = false
  }
}
