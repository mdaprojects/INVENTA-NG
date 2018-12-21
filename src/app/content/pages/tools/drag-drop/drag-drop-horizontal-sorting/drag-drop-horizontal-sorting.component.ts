import { Component, OnInit } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-drag-drop-horizontal-sorting',
  templateUrl: './drag-drop-horizontal-sorting.component.html',
  styleUrls: ['./drag-drop-horizontal-sorting.component.scss']
})
export class DragDropHorizontalSortingComponent implements OnInit {
  htmlCode: string;
  tsCode: string;
  cssCode: string;
  timePeriods = [
    'Bronze age',
    'Iron age',
    'Middle ages',
    'Early modern period',
    'Nineteenth century'
  ];

  constructor(
    private _clipboardService: ClipboardService,
    private toastr: ToastrService
  ) {}

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.timePeriods, event.previousIndex, event.currentIndex);
  }

  ngOnInit() {
    this.htmlCode = `
    <div cdkDropList cdkDropListOrientation="horizontal" class="example-list" (cdkDropListDropped)="drop($event)">
      <div class="example-box" *ngFor="let timePeriod of timePeriods" cdkDrag>{{timePeriod}}</div>
    </div>
    `;

    this.tsCode = `
    import {Component} from '@angular/core';
    import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

    /**
     * @title Drag&Drop horizontal sorting
     */
    @Component({
      selector: 'cdk-drag-drop-horizontal-sorting-example',
      templateUrl: 'cdk-drag-drop-horizontal-sorting-example.html',
      styleUrls: ['cdk-drag-drop-horizontal-sorting-example.css'],
    })
    export class CdkDragDropHorizontalSortingExample {
      timePeriods = [
        'Bronze age',
        'Iron age',
        'Middle ages',
        'Early modern period',
        'Long nineteenth century'
      ];

      drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.timePeriods, event.previousIndex, event.currentIndex);
      }
    }

    `;

    this.cssCode = `
    .example-list {
      width: 1000px;
      max-width: 100%;
      border: solid 1px #ccc;
      min-height: 60px;
      display: flex;
      flex-direction: row;
      background: white;
      border-radius: 4px;
      overflow: hidden;
    }

    .example-box {
      padding: 20px 10px;
      border-right: solid 1px #ccc;
      color: rgba(0, 0, 0, 0.87);
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      cursor: move;
      background: white;
      font-size: 14px;
      flex-grow: 1;
      flex-basis: 0;
    }

    .cdk-drag-preview {
      box-sizing: border-box;
      border-radius: 4px;
      box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
                  0 8px 10px 1px rgba(0, 0, 0, 0.14),
                  0 3px 14px 2px rgba(0, 0, 0, 0.12);
    }

    .cdk-drag-placeholder {
      opacity: 0;
    }

    .cdk-drag-animating {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }

    .example-box:last-child {
      border: none;
    }

    .example-list.cdk-drop-list-dragging .example-box:not(.cdk-drag-placeholder) {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
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
