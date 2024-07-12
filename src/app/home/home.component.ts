import {Component, TemplateRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DropdownComponent} from '../dropdown/dropdown.component';

interface Line {
  start: string
  dropdown: {
    options: string[]
    label: string
  }
  end?: string
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, DropdownComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  lines: Line[] = [
    {
      start: 'As a UI/UX',
      dropdown: {
        options: [
          'researcher',
          'designer',
          'developer'
        ],
        label: 'list of UI/UX roles performed'
      }
    },
    {
      start: 'I build',
      dropdown: {
        options: [
          'intuitive',
          'responsive',
          'accessible'
        ],
        label: 'list of desired application qualities'
      },
      end: 'applications'
    },
    {
      start: 'for',
      dropdown: {
        options: [
          'geospatial analysis',
          'data visualization'
        ],
        label: 'list of focus areas'
      }
    }
  ];
}
