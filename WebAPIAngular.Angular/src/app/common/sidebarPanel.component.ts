import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'panel',
    template: `<div class="panel panel-header">
                <div class="panel-heading {{headerclass}}" (click)="toggle.emit()">
                  <b><i [class]="(opened) ? 'fa fa-minus' : 'fa fa-plus'"></i>&nbsp;&nbsp;{{title}}</b>
                </div>
                <div class="panel-body {{contentclass}}" *ngIf="opened">
                  <ng-content></ng-content>
                </div>
              <div>`
})

export class SidebarPanelComponent {
    @Input() opened = false;
    @Input() title: string;
    @Input() headerclass: string;
    @Input() contentclass: string;
    @Output() toggle: EventEmitter<any> = new EventEmitter<any>();
}