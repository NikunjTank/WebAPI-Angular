import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddRBILiaisonOfficeFromFileResponse } from "../../../model/rBILiaisonOffice";
import { RBILiaisonOfficeAdminService } from '../../../service/admin/rBILiaisonOffice.service';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


@Component({
    selector: 'my-app',
    templateUrl: './rBILiaisonOffice.component.html'
})

export class RBILiaisonOfficeAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _rBILiaisonOfficeService: RBILiaisonOfficeAdminService, vcr: ViewContainerRef, private spinnerService: SpinnerService) { }

    _global: Global = new Global();

    frmRBILiaisonOffice: FormGroup;
    msg: string;
    files: any;
    addRBILiaisonOfficeFromFileResponse: AddRBILiaisonOfficeFromFileResponse;

    addUpdateText: string;

    isSubmited: boolean = false;

    ngOnInit(): void {
        this.frmRBILiaisonOffice = this.formBuilder.group({
            Excel: ['', Validators.required]
        });

        this.activatedRoute.params.subscribe((params: Params) => {
            this.addUpdateText = "Add";
        });
    }

    fileChange(event: any) {
        this.files = event.target.files;

        if (this.files[0].type == "application/vnd.ms-excel" || this.files[0].type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            this.frmRBILiaisonOffice.get('Excel').setValue(this.files[0].name);
            this.frmRBILiaisonOffice.updateValueAndValidity();
        } else {
            this.frmRBILiaisonOffice.get('Excel').setValue(null);
            this.frmRBILiaisonOffice.updateValueAndValidity();
            this.toastr.error("Please upload proper excel file.", Global.TOASTR_ADMIN_RBI_LIAISON_OFFICE_TITLE, { closeButton: true });
        }
    }

    OnSubmitRBILiaisonOffice(formData: any) {
        this.isSubmited = true;

        if (this.frmRBILiaisonOffice.valid) {
            this.spinnerService.show();

            if (this.files != null && this.files.length > 0) {
                let fileFormData: FormData = new FormData();
                for (var i = 0; i < this.files.length; i++) {
                    fileFormData.append(this.files[i].name, this.files[i]);
                }

                this._rBILiaisonOfficeService.addRBILiaisonOfficeFromExcel(fileFormData)
                    .subscribe(data => {
                        this.spinnerService.hide();

                        if (data.Status == "Success") {
                            this.addRBILiaisonOfficeFromFileResponse = data.Response;
                            this.toastr.success(data.Description, Global.TOASTR_ADMIN_RBI_LIAISON_OFFICE_TITLE, { closeButton: true });
                        } else {
                            this.toastr.error(data.Description, Global.TOASTR_ADMIN_RBI_LIAISON_OFFICE_TITLE, { enableHtml: true, closeButton: true });
                        }
                    },
                        error => {
                            this.spinnerService.hide();
                            this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_RBI_LIAISON_OFFICE_TITLE, { enableHtml: true, closeButton: true });
                        });
            } else {
                this.spinnerService.hide();
                this.toastr.error("Please upload excel file.", Global.TOASTR_ADMIN_RBI_LIAISON_OFFICE_TITLE, { closeButton: true });
            }
        }
    }

    CancelRBILiaisonOffice() {
        this.router.navigate(['/admin/secure/rbiliaisonoffices']);
    }
}
