 interface signUp {
    name: string;
    email: string;
    password: string;
  }
   interface login {
    email: String;
    password: String;
  }

  interface products{
    name:string,
    price:number,
    category:string,
    color:string,
    image:string,
    description:string,
    id:number,
    quantity:undefined | number,
    productId:undefined|number
  }
  interface cartType{
    name:string,
    price:number,
    category:string,
    color:string,
    image:string,
    description:string,
    quantity:undefined | number,
    productId:number,
    id:number|undefined,
    userId:number
  }

  interface priceSummary{
    price:number,
    discount:number,
    tax:number,
    delivery:number,
    total:number
  }

  export{
    signUp,
    login,
    products,
    cartType,
    priceSummary
  }