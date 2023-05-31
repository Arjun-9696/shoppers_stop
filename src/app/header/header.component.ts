import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { products } from 'src/data.type';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CartServiceService } from '../services/cart-service.service';
import { SharedService } from '../services/shared.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isMenuOpen = false;
  menuType: string = 'default';
  sellerName: string = ""
  userName: string = ""
  searchResult: undefined | products[]
  cartItems = 0;
  private routeSubscription: any;

  @ViewChild('defaultMenu') defaultMenu!: ElementRef;
  @ViewChild('sellerMenu') sellerMenu!: ElementRef;
  @ViewChild('userMenu') userMenu!: ElementRef;

  constructor(
    private productService: ProductService,
    private route: Router,
    private cartService: CartServiceService,
    private sharedService: SharedService


  ) { }



  ngOnInit(): void {
    this.routeSubscription = this.route.events.subscribe((val: any) => {
      // console.log("navbar route value:", val);
      if (val.url) {
        if (localStorage.getItem('sellerLoggedIn') && val.url.includes('/')) {
          let getNameSellerName = localStorage.getItem('sellerLoggedIn')
          if (getNameSellerName) {
            this.sellerName = JSON.parse(getNameSellerName)
          }
          this.menuType = 'seller';
        }
        else if (localStorage.getItem('sellerLoggedIn') && val.url.includes('seller')) {
          let getNameSellerName = localStorage.getItem('sellerLoggedIn')
          if (getNameSellerName) {
            this.sellerName = JSON.parse(getNameSellerName)
          }
          this.menuType = 'seller';
        }
        else if (localStorage.getItem('userLoggedIn')) {
          let userData = localStorage.getItem('userLoggedIn');

          if (userData) {
            let parseData = JSON.parse(userData)
            this.userName = parseData.name
            // this is for when user visit home page and if has cart items then will show even refresh
            this.cartService.getCartItems(parseData.id)
          }
          this.menuType = 'user';
        }
        else {
          this.menuType = 'default';
        }

        // checking user logged In or not for giving access to cart route
      

      }
    })


    // get local storage cart items
    let cartData = localStorage.getItem('localCart');
    if (cartData) {
      this.cartItems = JSON.parse(cartData).length
    }

    // for immidiate changes showing cart items length
    this.cartService.cartData.subscribe((item) => {
      this.cartItems = item.length
    })

  }


  toggleMenu() {

    // console.log("Menu type: ", this.menuType);
    // console.log("Menu open status: ", this.isMenuOpen);

    this.isMenuOpen = !this.isMenuOpen;

    // add or remove the 'open' class based on the current menu type
    if (this.isMenuOpen) {
      switch (this.menuType) {
        case 'default':

          this.defaultMenu?.nativeElement.classList.add('open');
          break;
        case 'seller':

          this.sellerMenu?.nativeElement.classList.add('open');
          break;
        case 'user':

          this.userMenu?.nativeElement.classList.add('open');
          break;
      }
    } else {
      switch (this.menuType) {
        case 'default':

          this.defaultMenu?.nativeElement.classList.remove('open');
          break;
        case 'seller':

          this.sellerMenu?.nativeElement.classList.remove('open');
          break;
        case 'user':

          this.userMenu?.nativeElement.classList.remove('open');
          break;
      }
    }
  }


  // logout for seller

  sellerLogout() {
    let isConfirm = window.confirm("Are you sure want to logout")
    if (isConfirm) {
      localStorage.removeItem('sellerLoggedIn');
      this.sharedService.setIsSellerLoggedIn(false)
      this.route.navigate(['/'])
    }
  }

  // user logout

  userLogout() {
    let isConfirm = window.confirm("Are you sure want to logout")
    if (isConfirm) {
      localStorage.removeItem('userLoggedIn');
      this.route.navigate(['/'])
    }

    this.cartService.cartData.emit([])
  }




  // when user type on input

  searchValue: string = "";

  onSearchInput(event: Event) {
    const inputValue = (event.target as HTMLInputElement)?.value;
    if (inputValue !== null && inputValue !== undefined) {
      this.searchValue = inputValue;
      this.productService.searchProducts(this.searchValue)
        .pipe(
          debounceTime(100),
          distinctUntilChanged()
        )
        .subscribe((data: null | products[]) => {
          if (data && data.length > 0) {
            this.searchResult = data

          } else {
            // console.log("no data found");
            this.searchResult = undefined
          }
        });
    }
  }

  // hide result search bar when click outside
  hideSearch() {
    this.searchResult = undefined
  }

  // redirect user to details page of products when click any search item
  redirectToDetails(id: number) {
    // alert(`You cliked ${id}`)
    this.route.navigate(['product/details/' + id])
  }

  // when click search btn
  searchbtn(value: String) {
    // alert(value)

    if (value == "" || value == undefined) {
      alert("Search input can not be blank..")
    } else {
      this.route.navigate([`search/${value}`])
    }



  }

}
