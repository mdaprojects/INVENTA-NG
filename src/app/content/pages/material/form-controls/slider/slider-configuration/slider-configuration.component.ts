import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import { coerceNumberProperty } from '@angular/cdk/coercion';

@Component({
  selector: 'app-slider-configuration',
  templateUrl: './slider-configuration.component.html',
  styleUrls: ['./slider-configuration.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SliderConfigurationComponent implements OnInit {
  
  htmlCode: string;
  tsCode: string;
  cssCode: string;

  autoTicks = false;
  disabled = false;
  invert = false;
  max = 100;
  min = 0;
  showTicks = false;
  step = 1;
  thumbLabel = false;
  value = 0;
  vertical = false;

  get tickInterval(): number | 'auto' {
    return this.showTicks ? (this.autoTicks ? 'auto' : this._tickInterval) : 0;
  }
  set tickInterval(value) {
    this._tickInterval = coerceNumberProperty(value);
  }
  private _tickInterval = 1;

  constructor(
    private _clipboardService: ClipboardService,
    private toastr: ToastrService
    ) {}

  ngOnInit() {
    this.htmlCode = `
    <mat-card>
      <mat-card-content>
        <h2 class="example-h2">Slider configuration</h2>

        <section class="example-section">
          <mat-form-field class="example-margin">
            <input matInput type="number" placeholder="Value" [(ngModel)]="value">
          </mat-form-field>
          <mat-form-field class="example-margin">
            <input matInput type="number" placeholder="Min value" [(ngModel)]="min">
          </mat-form-field>
          <mat-form-field class="example-margin">
            <input matInput type="number" placeholder="Max value" [(ngModel)]="max">
          </mat-form-field>
          <mat-form-field class="example-margin">
            <input matInput type="number" placeholder="Step size" [(ngModel)]="step">
          </mat-form-field>
        </section>

        <section class="example-section">
          <mat-checkbox class="example-margin" [(ngModel)]="showTicks">Show ticks</mat-checkbox>
          <mat-checkbox class="example-margin" [(ngModel)]="autoTicks" *ngIf="showTicks">
            Auto ticks
          </mat-checkbox>
          <mat-form-field class="example-margin" *ngIf="showTicks && !autoTicks">
            <input matInput type="number" placeholder="Tick interval" [(ngModel)]="tickInterval">
          </mat-form-field>
        </section>

        <section class="example-section">
          <mat-checkbox class="example-margin" [(ngModel)]="thumbLabel">Show thumb label</mat-checkbox>
        </section>

        <section class="example-section">
          <mat-checkbox class="example-margin" [(ngModel)]="vertical">Vertical</mat-checkbox>
          <mat-checkbox class="example-margin" [(ngModel)]="invert">Inverted</mat-checkbox>
        </section>

        <section class="example-section">
          <mat-checkbox class="example-margin" [(ngModel)]="disabled">Disabled</mat-checkbox>
        </section>

      </mat-card-content>
    </mat-card>

    <mat-card class="result">
      <mat-card-content>
        <h2 class="example-h2">Result</h2>

        <mat-slider
            class="example-margin"
            [disabled]="disabled"
            [invert]="invert"
            [max]="max"
            [min]="min"
            [step]="step"
            [thumbLabel]="thumbLabel"
            [tickInterval]="tickInterval"
            [(ngModel)]="value"
            [vertical]="vertical">
        </mat-slider>
      </mat-card-content>
    </mat-card>
    `;

    this.tsCode = `
    import {coerceNumberProperty} from '@angular/cdk/coercion';
    import {Component} from '@angular/core';

    /**
     * @title Configurable slider
     */
    @Component({
      selector: 'slider-configurable-example',
      templateUrl: 'slider-configurable-example.html',
      styleUrls: ['slider-configurable-example.css'],
    })
    export class SliderConfigurableExample {
      autoTicks = false;
      disabled = false;
      invert = false;
      max = 100;
      min = 0;
      showTicks = false;
      step = 1;
      thumbLabel = false;
      value = 0;
      vertical = false;

      get tickInterval(): number | 'auto' {
        return this.showTicks ? (this.autoTicks ? 'auto' : this._tickInterval) : 0;
      }
      set tickInterval(value) {
        this._tickInterval = coerceNumberProperty(value);
      }
      private _tickInterval = 1;
    }

    `;

    this.cssCode = `
    /** No CSS for this example */
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
