import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DIPPClarification, GetDIPPClarificationRequest } from '../../../model/dIPPClarification';
import { DIPPClarificationAdminService } from '../../../service/admin/dIPPClarification.service';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


@Component({
    selector: 'my-app',
    templateUrl: './dIPPClarification.component.html'
})

export class DIPPClarificationAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _dIPPClarificationService: DIPPClarificationAdminService, vcr: ViewContainerRef, private spinnerService: SpinnerService) { }

    _global: Global = new Global();

    dIPPClarification: DIPPClarification;
    dIPPClarificationId: number = 0;
    searchText: string = '';
    frmDIPPClarification: FormGroup;
    msg: string;
    files: any;

    addUpdateText: string;

    pdfServerPath: string = Global.DIPPCLARIFICATION_PDF_FILEPATH;
    dIPPClarificationPDFName: string;

    isSubmited: boolean = false;

    ngOnInit(): void {
        this.frmDIPPClarification = this.formBuilder.group({
            DIPPClarificationId: [''],
            ClarificationTopic: ['', Validators.required],
            PDF: ['', Validators.required]
        });

        this.activatedRoute.params.subscribe((params: Params) => {
            let dIPPClarificationId = this._global.decryptValue(params['dIPPClarificationId']);

            if (dIPPClarificationId) {
                this.addUpdateText = "Update";
                this.dIPPClarificationId = parseInt(dIPPClarificationId);
                this.EditDIPPClarification(parseInt(dIPPClarificationId));
            } else {
                this.addUpdateText = "Add";
            }
        });
    }

    fileChange(event: any) {
        this.files = event.target.files;

        if (this.files[0].type == "application/pdf") {
            this.frmDIPPClarification.get('PDF').setValue(this.files[0].name);
            this.frmDIPPClarification.updateValueAndValidity();
        } else {
            this.frmDIPPClarification.get('PDF').setValue(null);
            this.frmDIPPClarification.updateValueAndValidity();
            this.toastr.error("Please upload proper pdf file.", Global.TOASTR_ADMIN_DIPPCLARIFICATION_TITLE, { closeButton: true });
        }
    }

    EditDIPPClarification(dIPPClarificationId: number) {
        this.spinnerService.show();

        let getDIPPClarificationRequest = new GetDIPPClarificationRequest();
        getDIPPClarificationRequest.DIPPClarificationId = dIPPClarificationId;
        getDIPPClarificationRequest.IsActive = null;

        this._dIPPClarificationService.getDIPPClarification(getDIPPClarificationRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.dIPPClarificationPDFName = data.Response[0].PDF;

                this.frmDIPPClarification.setValue({
                    DIPPClarificationId: dIPPClarificationId,
                    ClarificationTopic: data.Response[0].ClarificationTopic,
                    PDF: data.Response[0].PDF
                });

                this.frmDIPPClarification.updateValueAndValidity();
            }, error => this.msg = <any>error);
    }

    SaveDIPPClarification(formData) {
        this.spinnerService.show();

        if (formData.value.DIPPClarificationId) {
            this._dIPPClarificationService.updateDIPPClarification(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.router.navigate(['/admin/secure/dippclarifications']).then(() => {
                            this.toastr.success(data.Description, Global.TOASTR_ADMIN_DIPPCLARIFICATION_TITLE, { closeButton: true });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_DIPPCLARIFICATION_TITLE);
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_DIPPCLARIFICATION_TITLE, { enableHtml: true });
                    });
        } else {
            this._dIPPClarificationService.addDIPPClarification(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.router.navigate(['/admin/secure/dippclarifications']).then(() => {
                            this.toastr.success(data.Description, Global.TOASTR_ADMIN_DIPPCLARIFICATION_TITLE, { closeButton: true });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_DIPPCLARIFICATION_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_DIPPCLARIFICATION_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    OnSubmitDIPPClarification(formData: any) {
        this.isSubmited = true;

        if (this.frmDIPPClarification.valid) {
            this.spinnerService.show();

            if (this.files != null && this.files.length > 0) {
                let fileFormData: FormData = new FormData();
                for (var i = 0; i < this.files.length; i++) {
                    fileFormData.append(this.files[i].name, this.files[i]);
                }
                
                this._dIPPClarificationService.fileUpload(fileFormData)
                    .subscribe(response => {
                        if (response.Status == "Success") {
                            this.frmDIPPClarification.get('PDF').setValue(response.Response);
                            this.frmDIPPClarification.updateValueAndValidity();
                            formData.value.PDF = response.Response;
                            this.files = null;

                            this.SaveDIPPClarification(formData);
                        } else {
                            this.spinnerService.hide();
                            this.toastr.error(response.Description, Global.TOASTR_ADMIN_DIPPCLARIFICATION_TITLE, { enableHtml: true, closeButton: true });
                        }
                    },
                        error => {
                            this.spinnerService.hide();
                            this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_DIPPCLARIFICATION_TITLE, { enableHtml: true, closeButton: true });
                        });
            } else {
                if (formData.value.PDF) {
                    this.SaveDIPPClarification(formData);
                } else {
                    this.spinnerService.hide();
                }
            }
        }
    }

    CancelDIPPClarification() {
        this.router.navigate(['/admin/secure/dippclarifications']);
    }
}
