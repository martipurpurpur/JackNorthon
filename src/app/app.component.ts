import {Component} from '@angular/core';
import {OnInit} from 'angular2/core';
import {MenuItem} from 'primeng/api';
import {Type} from './model/Type';
import {MenuItemsService} from './service/menuItems-service';
import {ProductService} from './service/product-service.service';
import {Router} from '@angular/router';
import {Product} from './model/product';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  searchProductsUrl: string = 'http://localhost:8082/products/search?searchLine=';
  menu: MenuItem[];
  items: MenuItem[] = [];
  types: Type[];
  searchResults: any[];
  product: Product;
  currentSearchText: string;

  constructor(private router: Router, private productService: ProductService, private menuItemsService: MenuItemsService) {
  }

  onSelect(product: Product) {
    this.product = product;
    this.router
      .navigate(['/'])
      .then(() => this.router.navigate(['/productPage/', product.productId]));
  }

  search(event) {
    this.currentSearchText = event.query;
    this.productService
      .getProducts(this.searchProductsUrl + this.currentSearchText)
      .subscribe(products => this.searchResults = products);
  }

  searchEnter(event) {
    if (event.key === 'Enter') {
      this.router.navigate(['/search', {searchLine: this.currentSearchText}]);
    }
  }

  ngOnInit() {
    this.menu = [
      {label: 'Main', url: 'main'},
      {label: 'Каталог', items: this.items}
    ];

    this.menuItemsService.getMenuItems().subscribe(menuItems => menuItems.forEach(mi => {
        this.refreshCommandSetting(mi);
        this.items.push(mi);
        const cutMenuItem: MenuItem = {
          label: mi.label, url: mi.url, routerLink: mi.routerLink, queryParams: mi.queryParams, command: mi.command
        };
        this.menu.push(cutMenuItem);
      }
    ));

    console.log('vertical');
    console.log(this.items);
    console.log('horizontal');
    console.log(this.menu);
  }

  refreshCommandSetting(mi: MenuItem) {
    mi.command = (event) => {
      this.router.navigate(['/']).then(() => this.router.navigate(event.item.routerLink, {queryParams: event.item.queryParams}));
    };
    const items = mi.items;
    if (items !== null && items.length !== 0) {
      items.forEach(item => {
        this.refreshCommandSetting(item);
      });
    }
  }
}
