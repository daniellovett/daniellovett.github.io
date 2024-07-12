import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SidenavComponent } from "./sidenav/sidenav.component";
import { Router } from '@angular/router';
import { DropdownMenuComponent } from "./dropdown-menu/dropdown-menu.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HomeComponent, SidenavComponent, DropdownMenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  constructor(public router: Router){}
  
  title = 'portfolio';
  startYear: number = 2024;
  year: number = new Date(Date.now()).getFullYear();
  copyText: string = this.startYear === this.year ? ` ${this.year}` : ` 2024 to ${this.year}`;
  
  navMenuExpanded: boolean = false;
  navOptions: string[] =['ReSHAPE'];
  index: number = 99;
  role: string = 'menu';

  changeRoute(e: string) {
    this.router.navigate([e.toLowerCase()]);
  }

  toggleNavDropdown() {
    this.navMenuExpanded = !this.navMenuExpanded;
  }
}
