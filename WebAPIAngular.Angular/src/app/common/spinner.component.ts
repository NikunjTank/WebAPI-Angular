import { Component, Input, OnInit } from '@angular/core';
import { SpinnerService } from '../service/common/spinner.service';

@Component({
    selector: 'spinner',
    template: `<div *ngIf="loading" id="loading">
                    <img src="/assets/images/loading.gif" id="loading-image"/>
               </div>`
})
export class SpinnerComponent implements OnInit {
    @Input() loading = false;

    constructor(private spinnerService: SpinnerService) { }

    ngOnInit(): void {
        this.spinnerService._register(this);
    }
} 