import { AsyncState, HttpResult, loadingAsyncState, Unit } from "widgets-for-react";
import { ProductInfo, ProductsState } from "./productsState";

export const mockProducts:Array<ProductInfo> = [
  {
    productId:1,
    name:"Gillette Fusion Razor",
    description: "Something to trim your beard with. Or whatever else, we don't have any preconceptions.",
    rating:4,
    price:15,
    imageURL:"images/gilletteFusionRazor.jpg"
  },
  {
    productId:2,
    name:"Gillette Fusion Blades",
    description: "When you have trimmed enough, you need a new blade to trim some more!",
    rating:5,
    price:25,
    imageURL:"images/gilletteBlades.jpg"
  },
  {
    productId:3,
    name:"Iron",
    description: "It is nice when your clothes look straight and orderly.",
    rating:3,
    price:55,
    imageURL:"images/iron.jpg"
  },
  {
    productId:4,
    name:"Lego AT-AT",
    description: "'I am buying it for my son, not for myself.' Yeah, right.",
    rating:5,
    price:55,
    imageURL:"images/legoATAT.jpg"
  },
  {
    productId:5,
    name:"Mixer",
    description: "A mixer. You put different foods in, and you get a single, merged food out.",
    rating:4,
    price:249,
    imageURL:"images/mixer.jpg"
  },
  {
    productId:6,
    name:"Modeling clay",
    description: "You can make clay models out of it. Let your imagination roam free!",
    rating:4,
    price:12,
    imageURL:"images/modelingClay.jpg"
  },
  {
    productId:7,
    name:"Shampoo",
    description: "Wash your hair with it. Or, if you are lazy, everything else as well. It is just fancy soap after all, right?",
    rating:4,
    price:4.5,
    imageURL:"images/palmoliveShampoo.jpg"
  },
  {
    productId:8,
    name:"Pasta maker",
    description: "Pasta is as close to happiness on Earth as you can get. And with this machine, you will never run out of pasta.",
    rating:5,
    price:45,
    imageURL:"images/pastamaker.jpg"
  },
  {
    productId:9,
    name:"philipsAirfryer",
    description: "For when you need to pretend that you can both eat fries and stick to your diet.",
    rating:3,
    price:65,
    imageURL:"images/philipsAirfryer.jpg"
  },
  {
    productId:10,
    name:"switch",
    description: "Network switch. The thing that nobody besides network admins really knows what it does, but everyone goes 'Ah, the switch, yes, I know what it is!' anyway.",
    rating:5,
    price:95,
    imageURL:"images/switch.jpg"
  },
]

export const loadProducts = () : AsyncState<Array<ProductInfo>> =>
  loadingAsyncState(() => 
    new Promise((res,rej) => setTimeout(() => res({ kind:"result", 
      value:[
        ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, 
        ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, 
        ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, 
        ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, 
        ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, 
        ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, 
        ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, 
        ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, 
        ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, 
        ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, 
        ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, 
        ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, 
        ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, 
        ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, 
        ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, 
        ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, 
        ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, 
        ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, 
        ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, 
        ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, 
        ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, 
        ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, 
        ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, 
        ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, 
        ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, 
        ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, 
        ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, 
        ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, 
        ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, 
        ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, 
        ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, 
        ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, 
        ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, 
        ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, 
        ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, 
        ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, 
        ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, 
        ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, 
        ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, 
        ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, 
        ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, 
        ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, 
        ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, 
        ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, 
        ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, 
        ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, 
        ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, 
        ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, ...mockProducts, 
      ].map((p,i) => ({...p, productId:i })), 
    status:200 }), 250)))
