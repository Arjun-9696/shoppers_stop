import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { login, signUp } from 'src/data.type';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  isSellerLoggedIn = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private navigate: Router
  ) { }

  baseUrl = "https://backend-e-commerce-site.onrender.com/registeredUsers"

  // POST request for Register Users
  userSignup(data: signUp) {
    // console.log("user sign up getting called from service file");
    return this.http.post(this.baseUrl, data)
  }

  //GET request for Login
  loginUser(data: login) {
    return this.http.get(`${this.baseUrl}?email=${data.email}&password=${data.password}`)
  }

  reloadSeller() {
    if (localStorage.getItem('sellerLoggedIn')) {
      this.isSellerLoggedIn.next(true)
      this.navigate.navigate(['seller-home'])
    }
  }
  // not allowed to visit login or auth url when already logged in
  notAllowedAuth() {
    if (localStorage.getItem("userLoggedIn") || localStorage.getItem("sellerLoggedIn")) {
      this.navigate.navigate(['/'])
    }
  }
}