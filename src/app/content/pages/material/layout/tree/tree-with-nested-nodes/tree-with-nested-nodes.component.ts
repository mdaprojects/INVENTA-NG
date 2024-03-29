import { Component, OnInit, ViewEncapsulation, Injectable } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';

import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import {BehaviorSubject} from 'rxjs';

/**
 * Json node data with nested structure. Each node has a filename and a value or a list of children
 */
export class FileNode {
  children: FileNode[];
  filename: string;
  type: any;
}

/**
 * The Json tree data in string. The data could be parsed into Json object
 */
const TREE_DATA = JSON.stringify({
  Applications: {
    Calendar: 'app',
    Chrome: 'app',
    Webstorm: 'app'
  },
  Documents: {
    angular: {
      src: {
        compiler: 'ts',
        core: 'ts'
      }
    },
    material2: {
      src: {
        button: 'ts',
        checkbox: 'ts',
        input: 'ts'
      }
    }
  },
  Downloads: {
    October: 'pdf',
    November: 'pdf',
    Tutorial: 'html'
  },
  Pictures: {
    'Photo Booth Library': {
      Contents: 'dir',
      Pictures: 'dir'
    },
    Sun: 'png',
    Woods: 'jpg'
  }
});

/**
 * File database, it can build a tree structured Json object from string.
 * Each node in Json object represents a file or a directory. For a file, it has filename and type.
 * For a directory, it has filename and children (a list of files or directories).
 * The input will be a json object string, and the output is a list of `FileNode` with nested
 * structure.
 */
@Injectable()
export class FileDatabase {
  dataChange = new BehaviorSubject<FileNode[]>([]);

  get data(): FileNode[] { return this.dataChange.value; }

  constructor() {
    this.initialize();
  }

  initialize() {
    // Parse the string to json object.
    const dataObject = JSON.parse(TREE_DATA);

    // Build the tree nodes from Json object. The result is a list of `FileNode` with nested
    //     file node as children.
    const data = this.buildFileTree(dataObject, 0);

    // Notify the change.
    this.dataChange.next(data);
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `FileNode`.
   */
  buildFileTree(obj: object, level: number): FileNode[] {
    return Object.keys(obj).reduce<FileNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new FileNode();
      node.filename = key;

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.type = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }
}

@Component({
  selector: 'app-tree-with-nested-nodes',
  templateUrl: './tree-with-nested-nodes.component.html',
  styleUrls: ['./tree-with-nested-nodes.component.scss'],
  providers: [FileDatabase],
  encapsulation: ViewEncapsulation.None
})
export class TreeWithNestedNodesComponent implements OnInit {
  
  htmlCode: string;
  tsCode: string;
  cssCode: string;

  nestedTreeControl: NestedTreeControl<FileNode>;
  nestedDataSource: MatTreeNestedDataSource<FileNode>;

  constructor(
    private _clipboardService: ClipboardService,
    private toastr: ToastrService,
    database: FileDatabase
    ) {
      this.nestedTreeControl = new NestedTreeControl<FileNode>(this._getChildren);
      this.nestedDataSource = new MatTreeNestedDataSource();

      database.dataChange.subscribe(data => this.nestedDataSource.data = data);
    }

    hasNestedChild = (_: number, nodeData: FileNode) => !nodeData.type;

  private _getChildren = (node: FileNode) => node.children;

  ngOnInit() {
    this.htmlCode = `
    <mat-tree [dataSource]="nestedDataSource" [treeControl]="nestedTreeControl" class="example-tree">
      <mat-tree-node *matTreeNodeDef="let node" matTreeNodeToggle>
        <li class="mat-tree-node">
          <button mat-icon-button disabled></button>
          {{node.filename}}:  {{node.type}}
        </li>
      </mat-tree-node>

      <mat-nested-tree-node *matTreeNodeDef="let node; when: hasNestedChild">
        <li>
          <div class="mat-tree-node">
            <button mat-icon-button matTreeNodeToggle
                    [attr.aria-label]="'toggle ' + node.filename">
              <mat-icon class="mat-icon-rtl-mirror">
                {{nestedTreeControl.isExpanded(node) ? 'expand_more' : 'chevron_right'}}
              </mat-icon>
            </button>
            {{node.filename}}
          </div>
          <ul [class.example-tree-invisible]="!nestedTreeControl.isExpanded(node)">
            <ng-container matTreeNodeOutlet></ng-container>
          </ul>
        </li>
      </mat-nested-tree-node>
    </mat-tree>
    `;

    this.tsCode = `
    import {NestedTreeControl} from '@angular/cdk/tree';
    import {Component, Injectable} from '@angular/core';
    import {MatTreeNestedDataSource} from '@angular/material/tree';
    import {BehaviorSubject} from 'rxjs';

    /**
     * Json node data with nested structure. Each node has a filename and a value or a list of children
     */
    export class FileNode {
      children: FileNode[];
      filename: string;
      type: any;
    }

    /**
     * The Json tree data in string. The data could be parsed into Json object
     */
    const TREE_DATA = JSON.stringify({
      Applications: {
        Calendar: 'app',
        Chrome: 'app',
        Webstorm: 'app'
      },
      Documents: {
        angular: {
          src: {
            compiler: 'ts',
            core: 'ts'
          }
        },
        material2: {
          src: {
            button: 'ts',
            checkbox: 'ts',
            input: 'ts'
          }
        }
      },
      Downloads: {
        October: 'pdf',
        November: 'pdf',
        Tutorial: 'html'
      },
      Pictures: {
        'Photo Booth Library': {
          Contents: 'dir',
          Pictures: 'dir'
        },
        Sun: 'png',
        Woods: 'jpg'
      }
    });


    @Injectable()
    export class FileDatabase {
      dataChange = new BehaviorSubject<FileNode[]>([]);

      get data(): FileNode[] { return this.dataChange.value; }

      constructor() {
        this.initialize();
      }

      initialize() {
        // Parse the string to json object.
        const dataObject = JSON.parse(TREE_DATA);


        const data = this.buildFileTree(dataObject, 0);

        // Notify the change.
        this.dataChange.next(data);
      }

      buildFileTree(obj: object, level: number): FileNode[] {
        return Object.keys(obj).reduce<FileNode[]>((accumulator, key) => {
          const value = obj[key];
          const node = new FileNode();
          node.filename = key;

          if (value != null) {
            if (typeof value === 'object') {
              node.children = this.buildFileTree(value, level + 1);
            } else {
              node.type = value;
            }
          }

          return accumulator.concat(node);
        }, []);
      }
    }

    /**
     * @title Tree with nested nodes
     */
    @Component({
      selector: 'tree-nested-overview-example',
      templateUrl: 'tree-nested-overview-example.html',
      styleUrls: ['tree-nested-overview-example.css'],
      providers: [FileDatabase]
    })
    export class TreeNestedOverviewExample {
      nestedTreeControl: NestedTreeControl<FileNode>;
      nestedDataSource: MatTreeNestedDataSource<FileNode>;

      constructor(database: FileDatabase) {
        this.nestedTreeControl = new NestedTreeControl<FileNode>(this._getChildren);
        this.nestedDataSource = new MatTreeNestedDataSource();

        database.dataChange.subscribe(data => this.nestedDataSource.data = data);
      }

      hasNestedChild = (_: number, nodeData: FileNode) => !nodeData.type;

      private _getChildren = (node: FileNode) => node.children;
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
