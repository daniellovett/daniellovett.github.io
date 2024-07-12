import {Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DropdownMenuComponent} from '../dropdown-menu/dropdown-menu.component';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule, DropdownMenuComponent],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
  host: {
    class: 'dropdown'
  }
})

export class DropdownComponent implements OnInit {
  @Input() options: string[] = [];
  @Input() label: string = '';
  @Input() index: number = 0;
  @ViewChild('dropdownContainer') dropdown!: ElementRef;

  expanded: boolean = false;
  value: string = '';

  ngOnInit(): void {
      this.value = this.options[0];
  }

  toggleDropdown() {
    this.expanded = !this.expanded;
  }

  selectOption(option: string) {
    this.value = option;
    this.expanded = false;
  }

  onLeaveDropdown(e: MouseEvent) {
    if (!this.dropdown.nativeElement.contains(e.relatedTarget)) {
      this.expanded = false;
    }
  };

  onButtonKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      this.toggleDropdown();
      e.preventDefault();
    }
  }
}
