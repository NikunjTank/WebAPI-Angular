import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NICCode, GetNICCodeRequest } from '../../../model/nICCode';
import { NICCodeAdminService } from '../../../service/admin/nICCode.service';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


@Component({
    selector: 'my-app',
    templateUrl: './nICCode.component.html'
})

export class NICCodeAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _nICCodeService: NICCodeAdminService, vcr: ViewContainerRef, private spinnerService: SpinnerService) { }

    _global: Global = new Global();

    nICCode: NICCode;
    nICCodeId: number = 0;
    searchText: string = '';
    frmNICCode: FormGroup;
    msg: string;
    files: any;

    addUpdateText: string;

    pdfServerPath: string = Global.NICCODE_PDF_FILEPATH;
    nICCodePDFName: string;

    isSubmited: boolean = false;

    ngOnInit(): void {
        this.frmNICCode = this.formBuilder.group({
            NICCodeId: [''],
            NICCodeName: ['', Validators.required],
            PDF: ['', Validators.required]
        });

        this.activatedRoute.params.subscribe((params: Params) => {
            let nICCodeId = this._global.decryptValue(params['nICCodeId']);

            if (nICCodeId) {
                this.addUpdateText = "Update";
                this.nICCodeId = parseInt(nICCodeId);
                this.EditNICCode(parseInt(nICCodeId));
            } else {
                this.addUpdateText = "Add";
            }
        });
    }

    fileChange(event: any) {
        this.files = event.target.files;

        if (this.files[0].type == "application/pdf") {
            this.frmNICCode.get('PDF').setValue(this.files[0].name);
            this.frmNICCode.updateValueAndValidity();
        } else {
            this.frmNICCode.get('PDF').setValue(null);
            this.frmNICCode.updateValueAndValidity();
            this.toastr.error("Please upload proper pdf file.", Global.TOASTR_ADMIN_NICCODE_TITLE, { closeButton: true });
        }
    }

    EditNICCode(nICCodeId: number) {
        this.spinnerService.show();

        let getNICCodeRequest = new GetNICCodeRequest();
        getNICCodeRequest.NICCodeId = nICCodeId;
        getNICCodeRequest.IsActive = null;

        this._nICCodeService.getNICCode(getNICCodeRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.nICCodePDFName = data.Response[0].PDF;

                this.frmNICCode.setValue({
                    NICCodeId: nICCodeId,
                    NICCodeName: data.Response[0].NICCodeName,
                    PDF: data.Response[0].PDF
                });

                this.frmNICCode.updateValueAndValidity();
            }, error => this.msg = <any>error);
    }

    SaveNICCode(formData) {
        this.spinnerService.show();

        if (formData.value.NICCodeId) {
            this._nICCodeService.updateNICCode(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.router.navigate(['/admin/secure/niccodes']).then(() => {
                            this.toastr.success(data.Description, Global.TOASTR_ADMIN_NICCODE_TITLE, { closeButton: true });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_NICCODE_TITLE);
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_NICCODE_TITLE, { enableHtml: true });
                    });
        } else {
            this._nICCodeService.addNICCode(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.router.navigate(['/admin/secure/niccodes']).then(() => {
                            this.toastr.success(data.Description, Global.TOASTR_ADMIN_NICCODE_TITLE, { closeButton: true });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_NICCODE_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_NICCODE_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    OnSubmitNICCode(formData: any) {
        this.isSubmited = true;

        if (this.frmNICCode.valid) {
            this.spinnerService.show();

            if (this.files != null && this.files.length > 0) {
                let fileFormData: FormData = new FormData();
                for (var i = 0; i < this.files.length; i++) {
                    fileFormData.append(this.files[i].name, this.files[i]);
                }
                
                this._nICCodeService.fileUpload(fileFormData)
                    .subscribe(response => {
                        if (response.Status == "Success") {
                            this.frmNICCode.get('PDF').setValue(response.Response);
                            this.frmNICCode.updateValueAndValidity();
                            formData.value.PDF = response.Response;
                            this.files = null;

                            this.SaveNICCode(formData);
                        } else {
                            this.spinnerService.hide();
                            this.toastr.error(response.Description, Global.TOASTR_ADMIN_NICCODE_TITLE, { enableHtml: true, closeButton: true });
                        }
                    },
                        error => {
                            this.spinnerService.hide();
                            this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_NICCODE_TITLE, { enableHtml: true, closeButton: true });
                        });
            } else {
                if (formData.value.PDF) {
                    this.SaveNICCode(formData);
                } else {
                    this.spinnerService.hide();
                }
            }
        }
    }

    CancelNICCode() {
        this.router.navigate(['/admin/secure/niccodes']);
    }
}
