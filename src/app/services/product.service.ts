import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { products } from 'src/data.type';
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private http: HttpClient
  ) { }

  baseUrl = "https://backend-e-commerce-site.onrender.com/products"

  // post product 👍👍👍
  postProduct(data: products) {
    return this.http.post(this.baseUrl, data)
  }

  // get product 👍👍👍

  getProductList() {
    return this.http.get<products[]>(this.baseUrl)
  }


  // get Single product

  getSingleProduct(id: Number) {
    return this.http.get<products>(`${this.baseUrl}/${id}`)
  }

  // updated product

  updateProduct(data: products) {
    // console.log("data from update component",data);

    return this.http.patch<products>(`${this.baseUrl}/${data.id}`, data)
  }

  // delete product seller

  deleteProduct(id: Number) {
    return this.http.delete(`${this.baseUrl}/${id}`)
  }

  // search products

  searchProducts(query: String) {
    // console.log("${this.baseUrl}?q=${query}", `${this.baseUrl}?q=${query}`);
    return this.http.get<products[]>(`${this.baseUrl}?q=${query}`)


  }
}
