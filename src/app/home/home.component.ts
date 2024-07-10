import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatSelectModule} from '@angular/material/select';
import {ActivatedRoute, Router} from "@angular/router";

interface DropDown {
  value: string,
  expanded: boolean,
  options: string[]
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatSelectModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  selectedTemplate!: TemplateRef<any>;
  
  @ViewChild('researchIntuitiveGIS', { static: true }) researchIntuitiveGIS!: TemplateRef<any>;
  @ViewChild('researchIntuitiveDataviz', { static: true }) researchIntuitiveDataviz!: TemplateRef<any>;
  @ViewChild('researchResponsiveGIS', { static: true }) researchResponsiveGIS!: TemplateRef<any>;
  @ViewChild('researchResponsiveDataviz', { static: true }) researchResponsiveDataviz!: TemplateRef<any>;
  @ViewChild('researchAccessibleGIS', { static: true }) researchAccessibleGIS!: TemplateRef<any>;
  @ViewChild('researchAccessibleDataviz', { static: true }) researchAccessibleDataviz!: TemplateRef<any>;
  @ViewChild('designIntuitiveGIS', { static: true }) designIntuitiveGIS!: TemplateRef<any>;
  @ViewChild('designIntuitiveDataviz', { static: true }) designIntuitiveDataviz!: TemplateRef<any>;
  @ViewChild('designResponsiveGIS', { static: true }) designResponsiveGIS!: TemplateRef<any>;
  @ViewChild('designResponsiveDataviz', { static: true }) designResponsiveDataviz!: TemplateRef<any>;
  @ViewChild('designAccessibleGIS', { static: true }) designAccessibleGIS!: TemplateRef<any>;
  @ViewChild('designAccessibleDataviz', { static: true }) designAccessibleDataviz!: TemplateRef<any>;
  @ViewChild('developIntuitiveGIS', { static: true }) developIntuitiveGIS!: TemplateRef<any>;
  @ViewChild('developIntuitiveDataviz', { static: true }) developIntuitiveDataviz!: TemplateRef<any>;
  @ViewChild('developResponsiveGIS', { static: true }) developResponsiveGIS!: TemplateRef<any>;
  @ViewChild('developResponsiveDataviz', { static: true }) developResponsiveDataviz!: TemplateRef<any>;
  @ViewChild('developAccessibleGIS', { static: true }) developAccessibleGIS!: TemplateRef<any>;
  @ViewChild('developAccessibleDataviz', { static: true }) developAccessibleDataviz!: TemplateRef<any>;

  dropdownOne: DropDown = {
    value: 'researcher',
    expanded: false,
    options: [
      'researcher',
      'designer',
      'developer'
    ]
  };

  dropdownTwo: DropDown = {
    value: 'intuitive',
    expanded: false,
    options: [
      'intuitive',
      'responsive',
      'accessible'
    ]
  };

  dropdownThree: DropDown = {
    value: 'geospatial analysis',
    expanded: false,
    options: [
      'geospatial analysis',
      'data visualization'
    ]
  };

  constructor(public router: Router, public route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.selectedTemplate = this.researchIntuitiveGIS;
  }

  onLeaveDropdown(e: any, id: string) {
    if (!e.toElement?.closest(`#${id}`)) {
      this.dropdownOne.expanded = false;
      this.dropdownTwo.expanded = false;
      this.dropdownThree.expanded = false;
    };
  };

  updateContent() {
    const selectedOptions = [this.dropdownOne.value, this.dropdownTwo.value, this.dropdownThree.value].join(', ');
    switch (selectedOptions) {
      // Researcher
      case 'researcher, intuitive, geospatial analysis':
        this.selectedTemplate = this.researchIntuitiveGIS;
        break;
      case 'researcher, intuitive, data visualization':
        this.selectedTemplate = this.researchIntuitiveDataviz;
        break;
      case 'researcher, responsive, geospatial analysis':
        this.selectedTemplate = this.researchResponsiveGIS;
        break;
      case 'researcher, responsive, data visualization':
        this.selectedTemplate = this.researchResponsiveDataviz;
        break;
      case 'researcher, accessible, geospatial analysis':
        this.selectedTemplate = this.researchAccessibleGIS;
        break;
      case 'researcher, accessible, data visualization':
        this.selectedTemplate = this.researchAccessibleDataviz;
        break;

      // Designer
      case 'designer, intuitive, geospatial analysis':
        this.selectedTemplate = this.designIntuitiveGIS;
        break;
      case 'designer, intuitive, data visualization':
        this.selectedTemplate = this.designIntuitiveDataviz;
        break;
      case 'designer, responsive, geospatial analysis':
        this.selectedTemplate = this.designResponsiveGIS;
        break;
      case 'designer, responsive, data visualization':
        this.selectedTemplate = this.designResponsiveDataviz;
        break;
      case 'designer, accessible, geospatial analysis':
        this.selectedTemplate = this.designAccessibleGIS;
        break;
      case 'designer, accessible, data visualization':
        this.selectedTemplate = this.designAccessibleDataviz;
        break;
      
      // Developer
      case 'developer, intuitive, geospatial analysis':
        this.selectedTemplate = this.developIntuitiveGIS;
        break;
      case 'developer, intuitive, data visualization':
        this.selectedTemplate = this.developIntuitiveDataviz;
        break;
      case 'developer, responsive, geospatial analysis':
        this.selectedTemplate = this.developResponsiveGIS;
        break;
      case 'developer, responsive, data visualization':
        this.selectedTemplate = this.developResponsiveDataviz;
        break;
      case 'developer, accessible, geospatial analysis':
        this.selectedTemplate = this.developAccessibleGIS;
        break;
      case 'developer, accessible, data visualization':
        this.selectedTemplate = this.developAccessibleDataviz;
        break;
    };
  };
}
