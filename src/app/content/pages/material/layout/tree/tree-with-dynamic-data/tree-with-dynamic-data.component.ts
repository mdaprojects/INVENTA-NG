import { Component, OnInit, ViewEncapsulation, Injectable } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import {CollectionViewer, SelectionChange} from '@angular/cdk/collections';
import {FlatTreeControl} from '@angular/cdk/tree';
import {BehaviorSubject, merge, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

/** Flat node with expandable and level information */
export class DynamicFlatNode {
  constructor(public item: string, public level = 1, public expandable = false,
              public isLoading = false) {}
}

/**
 * Database for dynamic data. When expanding a node in the tree, the data source will need to fetch
 * the descendants data from the database.
 */
export class DynamicDatabase {
  dataMap = new Map<string, string[]>([
    ['Fruits', ['Apple', 'Orange', 'Banana']],
    ['Vegetables', ['Tomato', 'Potato', 'Onion']],
    ['Apple', ['Fuji', 'Macintosh']],
    ['Onion', ['Yellow', 'White', 'Purple']]
  ]);

  rootLevelNodes: string[] = ['Fruits', 'Vegetables'];

  /** Initial data from database */
  initialData(): DynamicFlatNode[] {
    return this.rootLevelNodes.map(name => new DynamicFlatNode(name, 0, true));
  }

  getChildren(node: string): string[] | undefined {
    return this.dataMap.get(node);
  }

  isExpandable(node: string): boolean {
    return this.dataMap.has(node);
  }
}
/**
 * File database, it can build a tree structured Json object from string.
 * Each node in Json object represents a file or a directory. For a file, it has filename and type.
 * For a directory, it has filename and children (a list of files or directories).
 * The input will be a json object string, and the output is a list of `FileNode` with nested
 * structure.
 */
@Injectable()
export class DynamicDataSource {

  dataChange = new BehaviorSubject<DynamicFlatNode[]>([]);

  get data(): DynamicFlatNode[] { return this.dataChange.value; }
  set data(value: DynamicFlatNode[]) {
    this.treeControl.dataNodes = value;
    this.dataChange.next(value);
  }

  constructor(private treeControl: FlatTreeControl<DynamicFlatNode>,
              private database: DynamicDatabase) {}

  connect(collectionViewer: CollectionViewer): Observable<DynamicFlatNode[]> {
    // tslint:disable-next-line:no-non-null-assertion
    this.treeControl.expansionModel.onChange!.subscribe(change => {
      if ((change as SelectionChange<DynamicFlatNode>).added ||
        (change as SelectionChange<DynamicFlatNode>).removed) {
        this.handleTreeControl(change as SelectionChange<DynamicFlatNode>);
      }
    });

    return merge(collectionViewer.viewChange, this.dataChange).pipe(map(() => this.data));
  }

  /** Handle expand/collapse behaviors */
  handleTreeControl(change: SelectionChange<DynamicFlatNode>) {
    if (change.added) {
      change.added.forEach(node => this.toggleNode(node, true));
    }
    if (change.removed) {
      change.removed.slice().reverse().forEach(node => this.toggleNode(node, false));
    }
  }

  /**
   * Toggle the node, remove from display list
   */
  toggleNode(node: DynamicFlatNode, expand: boolean) {
    const children = this.database.getChildren(node.item);
    const index = this.data.indexOf(node);
    if (!children || index < 0) { // If no children, or cannot find the node, no op
      return;
    }

    node.isLoading = true;

    setTimeout(() => {
      if (expand) {
        const nodes = children.map(name =>
          new DynamicFlatNode(name, node.level + 1, this.database.isExpandable(name)));
        this.data.splice(index + 1, 0, ...nodes);
      } else {
        let count = 0;
        for (let i = index + 1; i < this.data.length
          && this.data[i].level > node.level; i++, count++) {}
        this.data.splice(index + 1, count);
      }

      // notify the change
      this.dataChange.next(this.data);
      node.isLoading = false;
    }, 1000);
  }
}

/**
 * @title Tree with dynamic data
 */

@Component({
  selector: 'app-tree-with-dynamic-data',
  templateUrl: './tree-with-dynamic-data.component.html',
  styleUrls: ['./tree-with-dynamic-data.component.scss'],
  providers: [DynamicDatabase],
  encapsulation: ViewEncapsulation.None
})
export class TreeWithDynamicDataComponent implements OnInit {
  
  htmlCode: string;
  tsCode: string;
  cssCode: string;

  constructor(
    private _clipboardService: ClipboardService,
    private toastr: ToastrService,
    database: DynamicDatabase
    ) {
      this.treeControl = new FlatTreeControl<DynamicFlatNode>(this.getLevel, this.isExpandable);
      this.dataSource = new DynamicDataSource(this.treeControl, database);

      this.dataSource.data = database.initialData();
    }

    treeControl: FlatTreeControl<DynamicFlatNode>;

  dataSource: DynamicDataSource;

  getLevel = (node: DynamicFlatNode) => node.level;

  isExpandable = (node: DynamicFlatNode) => node.expandable;

  hasChild = (_: number, _nodeData: DynamicFlatNode) => _nodeData.expandable;

  ngOnInit() {
    this.htmlCode = `
    <mat-tree [dataSource]="dataSource" [treeControl]="treeControl">
      <mat-tree-node *matTreeNodeDef="let node" matTreeNodePadding>
        <button mat-icon-button disabled></button>
        {{node.item}}
      </mat-tree-node>
      <mat-tree-node *matTreeNodeDef="let node; when: hasChild" matTreeNodePadding>
        <button mat-icon-button
                [attr.aria-label]="'toggle ' + node.filename" matTreeNodeToggle>
          <mat-icon class="mat-icon-rtl-mirror">
            {{treeControl.isExpanded(node) ? 'expand_more' : 'chevron_right'}}
          </mat-icon>
        </button>
        {{node.item}}
        <mat-progress-bar *ngIf="node.isLoading"
                          mode="indeterminate"
                          class="example-tree-progress-bar"></mat-progress-bar>
      </mat-tree-node>
      </mat-tree>
    `;

    this.tsCode = `
    import {CollectionViewer, SelectionChange} from '@angular/cdk/collections';
    import {FlatTreeControl} from '@angular/cdk/tree';
    import {Component, Injectable} from '@angular/core';
    import {BehaviorSubject, merge, Observable} from 'rxjs';
    import {map} from 'rxjs/operators';

    /** Flat node with expandable and level information */
    export class DynamicFlatNode {
      constructor(public item: string, public level = 1, public expandable = false,
                  public isLoading = false) {}
    }

    /**
     * Database for dynamic data. When expanding a node in the tree, the data source will need to fetch
     * the descendants data from the database.
     */
    export class DynamicDatabase {
      dataMap = new Map<string, string[]>([
        ['Fruits', ['Apple', 'Orange', 'Banana']],
        ['Vegetables', ['Tomato', 'Potato', 'Onion']],
        ['Apple', ['Fuji', 'Macintosh']],
        ['Onion', ['Yellow', 'White', 'Purple']]
      ]);

      rootLevelNodes: string[] = ['Fruits', 'Vegetables'];

      /** Initial data from database */
      initialData(): DynamicFlatNode[] {
        return this.rootLevelNodes.map(name => new DynamicFlatNode(name, 0, true));
      }

      getChildren(node: string): string[] | undefined {
        return this.dataMap.get(node);
      }

      isExpandable(node: string): boolean {
        return this.dataMap.has(node);
      }
    }

    @Injectable()
    export class DynamicDataSource {

      dataChange = new BehaviorSubject<DynamicFlatNode[]>([]);

      get data(): DynamicFlatNode[] { return this.dataChange.value; }
      set data(value: DynamicFlatNode[]) {
        this.treeControl.dataNodes = value;
        this.dataChange.next(value);
      }

      constructor(private treeControl: FlatTreeControl<DynamicFlatNode>,
                  private database: DynamicDatabase) {}

      connect(collectionViewer: CollectionViewer): Observable<DynamicFlatNode[]> {
        this.treeControl.expansionModel.onChange!.subscribe(change => {
          if ((change as SelectionChange<DynamicFlatNode>).added ||
            (change as SelectionChange<DynamicFlatNode>).removed) {
            this.handleTreeControl(change as SelectionChange<DynamicFlatNode>);
          }
        });

        return merge(collectionViewer.viewChange, this.dataChange).pipe(map(() => this.data));
      }

      /** Handle expand/collapse behaviors */
      handleTreeControl(change: SelectionChange<DynamicFlatNode>) {
        if (change.added) {
          change.added.forEach(node => this.toggleNode(node, true));
        }
        if (change.removed) {
          change.removed.slice().reverse().forEach(node => this.toggleNode(node, false));
        }
      }

      toggleNode(node: DynamicFlatNode, expand: boolean) {
        const children = this.database.getChildren(node.item);
        const index = this.data.indexOf(node);
        if (!children || index < 0) { // If no children, or cannot find the node, no op
          return;
        }

        node.isLoading = true;

        setTimeout(() => {
          if (expand) {
            const nodes = children.map(name =>
              new DynamicFlatNode(name, node.level + 1, this.database.isExpandable(name)));
            this.data.splice(index + 1, 0, ...nodes);
          } else {
            let count = 0;
            for (let i = index + 1; i < this.data.length
              && this.data[i].level > node.level; i++, count++) {}
            this.data.splice(index + 1, count);
          }

          // notify the change
          this.dataChange.next(this.data);
          node.isLoading = false;
        }, 1000);
      }
    }

    /**
     * @title Tree with dynamic data
     */
    @Component({
      selector: 'tree-dynamic-example',
      templateUrl: 'tree-dynamic-example.html',
      styleUrls: ['tree-dynamic-example.css'],
      providers: [DynamicDatabase]
    })
    export class TreeDynamicExample {
      constructor(database: DynamicDatabase) {
        this.treeControl = new FlatTreeControl<DynamicFlatNode>(this.getLevel, this.isExpandable);
        this.dataSource = new DynamicDataSource(this.treeControl, database);

        this.dataSource.data = database.initialData();
      }

      treeControl: FlatTreeControl<DynamicFlatNode>;

      dataSource: DynamicDataSource;

      getLevel = (node: DynamicFlatNode) => node.level;

      isExpandable = (node: DynamicFlatNode) => node.expandable;

      hasChild = (_: number, _nodeData: DynamicFlatNode) => _nodeData.expandable;
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
