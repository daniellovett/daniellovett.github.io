import { Component } from '@angular/core';

@Component({
  selector: 'app-reshape',
  standalone: true,
  imports: [],
  templateUrl: './reshape.component.html',
  styleUrl: './reshape.component.scss',
  host: {
    class: 'project'
  }

})
export class ReshapeComponent {
  email: string = 'danielvlovett@gmail.com'
}
