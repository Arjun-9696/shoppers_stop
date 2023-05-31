import { Component, OnInit } from '@angular/core';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import {Title} from '@angular/platform-browser'
import { ProductService } from '../services/product.service';
import { products } from 'src/data.type';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  // loading 
  isLoading: boolean = false;
  loadingText: string = 'Loading products...';
  // data
  productData: undefined | products[]

  // icons
  nextFontIcon = faChevronLeft
  prevFonticon = faChevronRight




  constructor(
    private product: ProductService,
    private titleService:Title
  ) { }


  popularProduct = [
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    "https://images.unsplash.com/photo-1627384113972-f4c0392fe5aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    "https://images.unsplash.com/photo-1593998066526-65fcab3021a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1769&q=80",
    "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2189&q=80",
    "https://images.unsplash.com/flagged/photo-1556637640-2c80d3201be8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    "https://images.unsplash.com/photo-1487447054015-16918f0e7999?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1771&q=80",
    "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80"
  ];
  slidePosition = 0;
  autoplayInterval: any;

  ngOnInit() {
    this.startAutoplay();
    this.getProductList();
    this.titleService.setTitle("E-Comm | Home")
  }

  // fetching or calling fetch functioin which is defined 
  // in side product services
  getProductList() {
    this.isLoading = true
    this.product.getProductList().subscribe(data => {
      if (data) {
        this.productData = data
        this.isLoading = false
      }
    })
  }


  // carousal function ⬇️

  previousSlide() {
    if (this.slidePosition === 0) {
      this.slidePosition = (this.popularProduct.length - 1) * -100;
    } else {
      this.slidePosition += 100;
    }
  }

  nextSlide() {
    if (this.slidePosition === (this.popularProduct.length - 1) * -100) {
      this.slidePosition = 0;
    } else {
      this.slidePosition -= 100;
    }
  }

  startAutoplay() {
    this.autoplayInterval = setInterval(() => {
      this.nextSlide();
    }, 4000);
  }

  stopAutoplay() {
    clearInterval(this.autoplayInterval);
  }


}
