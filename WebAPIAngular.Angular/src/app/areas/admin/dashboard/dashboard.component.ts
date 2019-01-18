import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';
declare function App(): any;

@Component({
    selector: 'my-app',
    templateUrl: './dashboard.component.html'
})

export class DashboardAdminComponent implements OnInit {
    
    constructor(private formBuilder: FormBuilder, vcr: ViewContainerRef, private spinnerService: SpinnerService) {
    }

    ngOnInit(): void {
        //App.prototype.setSliderMenu('Dashboard');
    }
}
