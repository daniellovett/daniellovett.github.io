import { Component, Input, Output, EventEmitter, OnInit, ViewChildren, QueryList, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dropdown-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown-menu.component.html',
  styleUrl: './dropdown-menu.component.scss'
})
export class DropdownMenuComponent implements AfterViewInit {
  @Input() options: string[] = [];
  @Input() value: string = '';
  @Input() label: string = '';
  @Input() index: number = 0;
  @Input() role: string = 'listbox';
  @Output() optionSelected = new EventEmitter<string>
  @Output() closeDropdown = new EventEmitter<boolean>
  @ViewChildren('option') optionElementRefs!: QueryList<ElementRef>;

  ngAfterViewInit(): void {
    this.focusOnSelectedOption()
  }

  selectOption(option: string) {
    this.optionSelected.emit(option)
  }
  
  focusOnSelectedOption() {
    const selectedIndex = this.options.indexOf(this.value);
    let selectedElement: ElementRef;
    if (selectedIndex === -1) {
      selectedElement = this.optionElementRefs.toArray()[0];
    } else {
      selectedElement = this.optionElementRefs.toArray()[selectedIndex];
    }
    selectedElement.nativeElement.focus({focusVisible: true})
  }

  onKeyDown(e: KeyboardEvent, option: string) {
    const optionsArray = this.optionElementRefs.toArray();
    const focusedIndex = optionsArray.findIndex(el => el.nativeElement === document.activeElement);
  
    switch (e.key) {
      case 'Enter':
        this.selectOption(option);
        break;
  
      case 'Escape':
        this.closeDropdown.emit(false);
        break;
  
      case 'Tab':
        if (e.shiftKey && focusedIndex > 0) {
          const prevOption = optionsArray[focusedIndex - 1];
          console.log('test')
          prevOption.nativeElement.focus();
        } else if (!e.shiftKey && focusedIndex < optionsArray.length - 1) {
          const nextOption = optionsArray[focusedIndex + 1];
          nextOption.nativeElement.focus();
        }
        break;

      case 'ArrowDown':
        if (focusedIndex < optionsArray.length - 1) {
          const nextOption = optionsArray[focusedIndex + 1];
          nextOption.nativeElement.focus();
        }
        break;
  
      case 'ArrowUp':
        if (focusedIndex > 0) {
          const prevOption = optionsArray[focusedIndex - 1];
          prevOption.nativeElement.focus();
        }
        break;
  
      case 'Home':
        const firstOption = optionsArray[0];
        firstOption.nativeElement.focus();
        break;
  
      case 'End':
        const lastOption = optionsArray[optionsArray.length - 1];
        lastOption.nativeElement.focus();
        break;
  
      default:
        const typedChar = e.key;
        const matchingOption = optionsArray.find((optionEl, index) => 
          optionEl.nativeElement.innerText.startsWith(typedChar) &&
          index !== focusedIndex
        );
  
        if (matchingOption) {
          matchingOption.nativeElement.focus();
        }
        break;
    }
  
    e.preventDefault();
  }
}
