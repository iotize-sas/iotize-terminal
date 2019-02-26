import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-scroll-table',
  templateUrl: './scroll-table.component.html',
  styleUrls: ['./scroll-table.component.scss'],
})
export class ScrollTableComponent implements OnInit {

  @Input() keyName: any;
  @Input() valueName: any;
  @Input() keyAlias?: string;
  @Input() valueAlias?: string;
  @Input() dataArray: any[];
  @Input() formatFn?: (data) => string;

  constructor() { }

  ngOnInit() {}

}
