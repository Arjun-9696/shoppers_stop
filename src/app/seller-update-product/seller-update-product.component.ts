import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser'
import { ProductService } from '../services/product.service';
import { products } from 'src/data.type';

@Component({
  selector: 'app-seller-update-product',
  templateUrl: './seller-update-product.component.html',
  styleUrls: ['./seller-update-product.component.css']
})
export class SellerUpdateProductComponent implements OnInit {

  // store data
  productData: undefined | products
  showUpdatSuccesMessage: String = ""
  isLoading: boolean = false
  loadingText: string = 'Fetching product...';


  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private navigateRoute: Router,
    private titleService: Title

  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("E-Comm | Seller-Update-Product")
    const productIdParam = this.route.snapshot.paramMap.get("id");
    if (productIdParam !== null) {
      this.isLoading = true
      const productId = parseInt(productIdParam);
      productId && this.productService.getSingleProduct(productId).subscribe((data) => {
        this.productData = data;
        this.isLoading = false
      });

    }
  }


  // update function

  updateProductHandle(data: products) {
    if (this.productData) {
      data.id = this.productData.id
    }
    this.productService.updateProduct(data).subscribe(response => {
      if (response) {
        this.showUpdatSuccesMessage = `Product updated successfully`,
          setTimeout(() => {
            this.navigateRoute.navigate(['seller-home'])
          }, 1000)
      }
    })

  }




}
