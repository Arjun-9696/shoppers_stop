import { Component } from '@angular/core';
import {Title} from '@angular/platform-browser'
import { ProductService } from '../services/product.service';
import { products } from 'src/data.type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seller-add-product',
  templateUrl: './seller-add-product.component.html',
  styleUrls: ['./seller-add-product.component.css']
})
export class SellerAddProductComponent {

  showSuccesMessage: String = ""

  constructor(
    private productService: ProductService,
    private titleService:Title,
    private navigateRoute:Router
  ) {

  }

  ngOnInit(): void {
  
    this.titleService.setTitle("E-Comm | Seller-Add-Product")
  }

  addProductHandle(data: products) {
    // console.log("data:",data);
    this.productService.postProduct(data).subscribe((result) => {
      console.warn(result);
      if (result) {
        this.showSuccesMessage = 'Product is added successfully';
      }
    });

    setTimeout(() => {
      this.showSuccesMessage = ""
      this.navigateRoute.navigate(['seller-home'])
    }, 1000);
  }
}
