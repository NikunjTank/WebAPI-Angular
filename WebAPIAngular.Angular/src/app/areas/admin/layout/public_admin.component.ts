import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-public',
    templateUrl: './public_admin.component.html',
    styleUrls: [
        '../../../../assets/css/bootstrap.min.css',
        '../../../../assets/css/components.min.css',
        '../../../../assets/css/login.css',
        '../../../../assets/css/styles.css'
    ],
    encapsulation: ViewEncapsulation.None
})
export class PublicAdminComponent implements OnInit {

    constructor() { }

    ngOnInit() {

    }

}