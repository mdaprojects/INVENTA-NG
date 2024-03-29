import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-expansion-panel-as-accordion',
  templateUrl: './expansion-panel-as-accordion.component.html',
  styleUrls: ['./expansion-panel-as-accordion.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ExpansionPanelAsAccordionComponent implements OnInit {
  
  htmlCode: string;
  tsCode: string;
  cssCode: string;

  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  constructor(
    private _clipboardService: ClipboardService,
    private toastr: ToastrService
    ) {}

  ngOnInit() {
    this.htmlCode = `
    <mat-accordion class="example-headers-align">
    <mat-expansion-panel [expanded]="step === 0" (opened)="setStep(0)" hideToggle>
      <mat-expansion-panel-header>
        <mat-panel-title>
          Personal data
        </mat-panel-title>
        <mat-panel-description>
          Type your name and age
          <mat-icon>account_circle</mat-icon>
        </mat-panel-description>
      </mat-expansion-panel-header>

      <mat-form-field>
        <input matInput placeholder="First name">
      </mat-form-field>

      <mat-form-field>
        <input matInput type="number" min="1" placeholder="Age">
      </mat-form-field>

      <mat-action-row>
        <button mat-button color="primary" (click)="nextStep()">Next</button>
      </mat-action-row>
    </mat-expansion-panel>

    <mat-expansion-panel [expanded]="step === 1" (opened)="setStep(1)" hideToggle>
      <mat-expansion-panel-header>
        <mat-panel-title>
          Destination
        </mat-panel-title>
        <mat-panel-description>
          Type the country name
          <mat-icon>map</mat-icon>
        </mat-panel-description>
      </mat-expansion-panel-header>

      <mat-form-field>
        <input matInput placeholder="Country">
      </mat-form-field>

      <mat-action-row>
        <button mat-button color="warn" (click)="prevStep()">Previous</button>
        <button mat-button color="primary" (click)="nextStep()">Next</button>
      </mat-action-row>
    </mat-expansion-panel>

    <mat-expansion-panel [expanded]="step === 2" (opened)="setStep(2)" hideToggle>
      <mat-expansion-panel-header>
        <mat-panel-title>
          Day of the trip
        </mat-panel-title>
        <mat-panel-description>
          Inform the date you wish to travel
          <mat-icon>date_range</mat-icon>
        </mat-panel-description>
      </mat-expansion-panel-header>

      <mat-form-field>
        <input matInput placeholder="Date" [matDatepicker]="picker" (focus)="picker.open()" readonly>
      </mat-form-field>
      <mat-datepicker #picker></mat-datepicker>

      <mat-action-row>
        <button mat-button color="warn" (click)="prevStep()">Previous</button>
        <button mat-button color="primary" (click)="nextStep()">End</button>
      </mat-action-row>
    </mat-expansion-panel>

  </mat-accordion>
    `;

    this.tsCode = `
    import {Component} from '@angular/core';

    /**
     * @title Expansion panel as accordion
     */
    @Component({
      selector: 'expansion-steps-example',
      templateUrl: 'expansion-steps-example.html',
      styleUrls: ['expansion-steps-example.css'],
    })
    export class ExpansionStepsExample {
      step = 0;

      setStep(index: number) {
        this.step = index;
      }

      nextStep() {
        this.step++;
      }

      prevStep() {
        this.step--;
      }
    }

    `;

    this.cssCode = `
    .example-headers-align .mat-expansion-panel-header-title,
    .example-headers-align .mat-expansion-panel-header-description {
      flex-basis: 0;
    }
    .example-headers-align .mat-expansion-panel-header-description {
      justify-content: space-between;
      align-items: center;
    }
    `;
  }

  copy(type: string) {
    let code: string;
    if (type === 'html') {
      code = this.htmlCode;
    } else if (type === 'ts') {
      code = this.tsCode;
    } else if (type === 'css') {
      code = this.cssCode;
    }

    this._clipboardService.copyFromContent(code);
    this.toastr.success('Code copied!');
  }
}
