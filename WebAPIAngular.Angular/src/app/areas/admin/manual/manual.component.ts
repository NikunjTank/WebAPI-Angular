import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Manual, GetManualRequest } from '../../../model/manual';
import { ManualAdminService } from '../../../service/admin/manual.service';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


@Component({
    selector: 'my-app',
    templateUrl: './manual.component.html'
})

export class ManualAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _manualService: ManualAdminService, vcr: ViewContainerRef, private spinnerService: SpinnerService) { }

    _global: Global = new Global();

    manual: Manual;
    manualId: number = 0;
    searchText: string = '';
    frmManual: FormGroup;
    msg: string;
    files: any;

    addUpdateText: string;

    pdfServerPath: string = Global.MANUAL_PDF_FILEPATH;
    manualPDFName: string;

    isSubmited: boolean = false;

    ngOnInit(): void {
        this.frmManual = this.formBuilder.group({
            ManualId: [''],
            ManualName: ['', Validators.required],
            PDF: ['', Validators.required]
        });

        this.activatedRoute.params.subscribe((params: Params) => {
            let manualId = this._global.decryptValue(params['manualId']);

            if (manualId) {
                this.addUpdateText = "Update";
                this.manualId = parseInt(manualId);
                this.EditManual(parseInt(manualId));
            } else {
                this.addUpdateText = "Add";
            }
        });
    }

    fileChange(event: any) {
        this.files = event.target.files;

        if (this.files[0].type == "application/pdf") {
            this.frmManual.get('PDF').setValue(this.files[0].name);
            this.frmManual.updateValueAndValidity();
        } else {
            this.frmManual.get('PDF').setValue(null);
            this.frmManual.updateValueAndValidity();
            this.toastr.error("Please upload proper pdf file.", Global.TOASTR_ADMIN_MANUAL_TITLE, { closeButton: true });
        }
    }

    EditManual(manualId: number) {
        this.spinnerService.show();

        let getManualRequest = new GetManualRequest();
        getManualRequest.ManualId = manualId;
        getManualRequest.IsActive = null;

        this._manualService.getManual(getManualRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.manualPDFName = data.Response[0].PDF;

                this.frmManual.setValue({
                    ManualId: manualId,
                    ManualName: data.Response[0].ManualName,
                    PDF: data.Response[0].PDF
                });

                this.frmManual.updateValueAndValidity();
            }, error => this.msg = <any>error);
    }

    SaveManual(formData) {
        this.spinnerService.show();

        if (formData.value.ManualId) {
            this._manualService.updateManual(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.router.navigate(['/admin/secure/manuals']).then(() => {
                            this.toastr.success(data.Description, Global.TOASTR_ADMIN_MANUAL_TITLE, { closeButton: true });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_MANUAL_TITLE);
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_MANUAL_TITLE, { enableHtml: true });
                    });
        } else {
            this._manualService.addManual(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.router.navigate(['/admin/secure/manuals']).then(() => {
                            this.toastr.success(data.Description, Global.TOASTR_ADMIN_MANUAL_TITLE, { closeButton: true });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_MANUAL_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_MANUAL_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    OnSubmitManual(formData: any) {
        this.isSubmited = true;

        if (this.frmManual.valid) {
            this.spinnerService.show();

            if (this.files != null && this.files.length > 0) {
                let fileFormData: FormData = new FormData();
                for (var i = 0; i < this.files.length; i++) {
                    fileFormData.append(this.files[i].name, this.files[i]);
                }

                this._manualService.fileUpload(fileFormData)
                    .subscribe(response => {
                        if (response.Status == "Success") {
                            this.frmManual.get('PDF').setValue(response.Response);
                            this.frmManual.updateValueAndValidity();
                            formData.value.PDF = response.Response;
                            this.files = null;

                            this.SaveManual(formData);
                        } else {
                            this.spinnerService.hide();
                            this.toastr.error(response.Description, Global.TOASTR_ADMIN_MANUAL_TITLE, { enableHtml: true, closeButton: true });
                        }
                    },
                        error => {
                            this.spinnerService.hide();
                            this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_MANUAL_TITLE, { enableHtml: true, closeButton: true });
                        });
            } else {
                if (formData.value.PDF) {
                    this.SaveManual(formData);
                } else {
                    this.spinnerService.hide();
                }
            }
        }
    }

    CancelManual() {
        this.router.navigate(['/admin/secure/manuals']);
    }
}
