import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactUs, GetContactUsRequest } from '../../../model/contactUs';
import { ContactUsService } from '../../../service/common/contactUs.service';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


@Component({
    selector: 'app-public',
    templateUrl: './contactus.component.html'
})
export class ContactUsGuestComponent implements OnInit {

    constructor(private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private _conatctUsService: ContactUsService,
        vcr: ViewContainerRef,
        private spinnerService: SpinnerService) { }

    _global: Global = new Global();

    frmContactUs: FormGroup;
    msg: string;

    isSubmited: boolean = false;

    ngOnInit(): void {
        this.frmContactUs = this.formBuilder.group({
            Name: ['', Validators.required],
            Email: ['', Validators.compose([Validators.required, Validators.email])],
            Mobile: ['', Validators.required],
            Comment: ['', Validators.required]
        });
    }

    SaveContactUs(formData) {
        this.spinnerService.show();

        this._conatctUsService.addContactUs(formData.value)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.isSubmited = false;
                    this.frmContactUs.reset();
                    this.toastr.success(data.Description, Global.TOASTR_CONTACT_US_TITLE, { closeButton: true });
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_CONTACT_US_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_CONTACT_US_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    OnSubmitContactUs(formData: any) {
        this.isSubmited = true;

        if (this.frmContactUs.valid) {
            this.SaveContactUs(formData);
        }
    }
}