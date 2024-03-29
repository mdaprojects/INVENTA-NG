import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';

export interface Transaction {
  item: string;
  cost: number;
}

@Component({
  selector: 'app-table-with-multi-header-and-footer-rows',
  templateUrl: './table-with-multi-header-and-footer-rows.component.html',
  styleUrls: ['./table-with-multi-header-and-footer-rows.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TableWithMultiHeaderAndFooterRowsComponent implements OnInit {

  
  htmlCode: string;
  tsCode: string;
  cssCode: string;

  displayedColumns: string[] = ['item', 'cost'];
  transactions: Transaction[] = [
    {item: 'Beach ball', cost: 4},
    {item: 'Towel', cost: 5},
    {item: 'Frisbee', cost: 2},
    {item: 'Sunscreen', cost: 4},
    {item: 'Cooler', cost: 25},
    {item: 'Swim suit', cost: 15},
  ];

  /** Gets the total cost of all transactions. */
  getTotalCost() {
    return this.transactions.map(t => t.cost).reduce((acc, value) => acc + value, 0);
  }

  constructor(
    private _clipboardService: ClipboardService,
    private toastr: ToastrService
    ) {}

  ngOnInit() {
    this.htmlCode = `
    <table mat-table [dataSource]="transactions" class="mat-elevation-z8">
      <!-- Item Column -->
      <ng-container matColumnDef="item">
        <th mat-header-cell *matHeaderCellDef> Item </th>
        <td mat-cell *matCellDef="let transaction"> {{transaction.item}} </td>
        <td mat-footer-cell *matFooterCellDef> Total </td>
      </ng-container>

      <!-- Cost Column -->
      <ng-container matColumnDef="cost">
        <th mat-header-cell *matHeaderCellDef> Cost </th>
        <td mat-cell *matCellDef="let transaction"> {{transaction.cost | currency}} </td>
        <td mat-footer-cell *matFooterCellDef> {{getTotalCost() | currency}} </td>
      </ng-container>

      <!-- Item Description Column -->
      <ng-container matColumnDef="item-description">
        <th mat-header-cell *matHeaderCellDef> Name of the item purchased </th>
      </ng-container>

      <!-- Cost Description Column -->
      <ng-container matColumnDef="cost-description">
        <th mat-header-cell *matHeaderCellDef> Cost of the item in USD </th>
      </ng-container>

      <!-- Disclaimer column -->
      <ng-container matColumnDef="disclaimer">
        <td mat-footer-cell *matFooterCellDef colspan="2">
          Please note that the cost of items displayed are completely and totally made up.
        </td>
      </ng-container>

      <!-- The table will render two header rows, one data row per data object, and two footer rows. -->
      <tr mat-header-row *matHeaderRowDef="displayedColumns"
          class="example-first-header-row">
      </tr>
      <tr mat-header-row *matHeaderRowDef="['item-description', 'cost-description']"
          class="example-second-header-row">
      </tr>

      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

      <tr mat-footer-row *matFooterRowDef="displayedColumns" class="example-first-footer-row"></tr>
      <tr mat-footer-row *matFooterRowDef="['disclaimer']" class="example-second-footer-row"></tr>
    </table>
    `;

    this.tsCode = `
    import {Component} from '@angular/core';
    import {Transaction} from '../table-footer-row/table-footer-row-example';

    export interface Transaction {
      item: string;
      cost: number;
    }

    /**
     * @title Table with multiple header and footer rows
     */
    @Component({
      selector: 'table-multiple-header-footer-example',
      styleUrls: ['table-multiple-header-footer-example.css'],
      templateUrl: 'table-multiple-header-footer-example.html',
    })
    export class TableMultipleHeaderFooterExample {
      displayedColumns: string[] = ['item', 'cost'];
      transactions: Transaction[] = [
        {item: 'Beach ball', cost: 4},
        {item: 'Towel', cost: 5},
        {item: 'Frisbee', cost: 2},
        {item: 'Sunscreen', cost: 4},
        {item: 'Cooler', cost: 25},
        {item: 'Swim suit', cost: 15},
      ];

      /** Gets the total cost of all transactions. */
      getTotalCost() {
        return this.transactions.map(t => t.cost).reduce((acc, value) => acc + value, 0);
      }
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
