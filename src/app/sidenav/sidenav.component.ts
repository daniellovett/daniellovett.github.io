import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Project {
  label: string,
  route: string
}

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent {

  constructor(public router: Router){}

  projects: Project[] = [
    {
      label: "ReSHAPE",
      route: "reshape"
    }
  ]

  getRouterLink(route: string) {
    return `../${route}`
  }
}
