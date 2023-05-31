import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser'
import { ProductService } from '../services/product.service';
import { products } from 'src/data.type';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';


@Component({
  selector: 'app-seller-home',
  templateUrl: './seller-home.component.html',
  styleUrls: ['./seller-home.component.css']
})
export class SellerHomeComponent implements OnInit {

  deleteFonticon = faTrash
  EditFonticon = faEdit
  /// creating state as we do in react
  productList: undefined | products[]
  showDeleteSuccessMessage: String = ""
  isLoading: boolean = false
  loadingText: string = 'Please wait while retriving data...';

  constructor(
    private product: ProductService,
    private route: Router,
    private titleService: Title
  ) { }

  ngOnInit(): void {
    this.showProduct();
    this.titleService.setTitle("E-Comm | Seller-Home")
  }

  // delete function
  deleteProductFn(id: Number) {

    let isConfirm = window.confirm(`Are you sure want to delete this product`)
    if (isConfirm) {
      this.product.deleteProduct(id).subscribe(response => {
        if (response) {
          this.showDeleteSuccessMessage = `Product deleted success with id : ${id}`
          this.showProduct()
        }
      })
    }


    setTimeout(() => {
      this.showDeleteSuccessMessage = ""
    }, 4000)

  }


  // edit function 
  editFn(id: Number) {
    // alert(`You cliked edit icon with id : ${id}`)
    this.route.navigate([`seller-update-product/${id}`])
  }
  showProduct() {
    this.isLoading = true
    this.product.getProductList().subscribe(data => {
      this.productList = data
      this.isLoading = false
    })
  }

}
