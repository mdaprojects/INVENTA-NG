import { Component, OnInit } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-configurable-progress-bar',
  templateUrl: './configurable-progress-bar.component.html',
  styleUrls: ['./configurable-progress-bar.component.scss']
})
export class ConfigurableProgressBarComponent implements OnInit {
   // (fullScreen, remove, toggle)
  htmlCode: string;
  tsCode: string;
  cssCode: string;

  color = 'primary';
  mode = 'determinate';
  value = 50;
  bufferValue = 75;

  constructor(
    private _clipboardService: ClipboardService,
    private toastr: ToastrService
    ) {}

  ngOnInit() {
    this.htmlCode = `
    <mat-card>
      <mat-card-content>
        <h2 class="example-h2">Progress bar configuration</h2>

        <section class="example-section">
          <label class="example-margin">Color:</label>
          <mat-radio-group [(ngModel)]="color">
            <mat-radio-button class="example-margin" value="primary">
              Primary
            </mat-radio-button>
            <mat-radio-button class="example-margin" value="accent">
              Accent
            </mat-radio-button>
            <mat-radio-button class="example-margin" value="warn">
              Warn
            </mat-radio-button>
          </mat-radio-group>
        </section>

        <section class="example-section">
          <label class="example-margin">Mode:</label>
          <mat-radio-group [(ngModel)]="mode">
            <mat-radio-button class="example-margin" value="determinate">
              Determinate
            </mat-radio-button>
            <mat-radio-button class="example-margin" value="indeterminate">
              Indeterminate
            </mat-radio-button>
            <mat-radio-button class="example-margin" value="buffer">
              Buffer
            </mat-radio-button>
            <mat-radio-button class="example-margin" value="query">
              Query
            </mat-radio-button>
          </mat-radio-group>
        </section>

        <section class="example-section" *ngIf="mode === 'determinate' || mode === 'buffer'">
          <label class="example-margin">Progress:</label>
          <mat-slider class="example-margin" [(ngModel)]="value"></mat-slider>
        </section>
        <section class="example-section" *ngIf="mode === 'buffer'">
          <label class="example-margin">Buffer:</label>
          <mat-slider class="example-margin" [(ngModel)]="bufferValue"></mat-slider>
        </section>
      </mat-card-content>
    </mat-card>

    <mat-card>
      <mat-card-content>
        <h2 class="example-h2">Result</h2>

        <section class="example-section">
          <mat-progress-bar
              class="example-margin"
              [color]="color"
              [mode]="mode"
              [value]="value"
              [bufferValue]="bufferValue">
          </mat-progress-bar>
        </section>
      </mat-card-content>
    </mat-card>
    `;

    this.tsCode = `
    import {Component} from '@angular/core';

    /**
     * @title Configurable progress-bar
     */
    @Component({
      selector: 'progress-bar-configurable-example',
      templateUrl: 'progress-bar-configurable-example.html',
      styleUrls: ['progress-bar-configurable-example.css'],
    })
    export class ProgressBarConfigurableExample {
      color = 'primary';
      mode = 'determinate';
      value = 50;
      bufferValue = 75;
    }
    `;

    this.cssCode = `
    .example-h2 {
      margin: 10px;
    }
    .example-section {
      display: flex;
      align-content: center;
      align-items: center;
      height: 60px;
    }
    .example-margin {
      margin: 0 10px;
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
