import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FetersCode, GetFetersCodeRequest } from '../../../model/fetersCode';
import { FetersCodeAdminService } from '../../../service/admin/fetersCode.service';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


@Component({
    selector: 'my-app',
    templateUrl: './fetersCode.component.html'
})

export class FetersCodeAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _fetersCodeService: FetersCodeAdminService, vcr: ViewContainerRef, private spinnerService: SpinnerService) { }

    _global: Global = new Global();

    fetersCode: FetersCode;
    fetersCodeId: number = 0;
    searchText: string = '';
    frmFetersCode: FormGroup;
    msg: string;
    files: any;

    addUpdateText: string;

    pdfServerPath: string = Global.FETERSCODE_PDF_FILEPATH;
    fetersCodePDFName: string;

    isSubmited: boolean = false;

    ngOnInit(): void {
        this.frmFetersCode = this.formBuilder.group({
            FetersCodeId: [''],
            FetersCodeName: ['', Validators.required],
            PDF: ['', Validators.required]
        });

        this.activatedRoute.params.subscribe((params: Params) => {
            let fetersCodeId = this._global.decryptValue(params['fetersCodeId']);
            
            if (fetersCodeId) {
                this.addUpdateText = "Update";
                this.fetersCodeId = parseInt(fetersCodeId);
                this.EditFetersCode(parseInt(fetersCodeId));
            } else {
                this.addUpdateText = "Add";
            }
        });
    }

    fileChange(event: any) {
        this.files = event.target.files;

        if (this.files[0].type == "application/pdf") {
            this.frmFetersCode.get('PDF').setValue(this.files[0].name);
            this.frmFetersCode.updateValueAndValidity();
        } else {
            this.frmFetersCode.get('PDF').setValue(null);
            this.frmFetersCode.updateValueAndValidity();
            this.toastr.error("Please upload proper pdf file.", Global.TOASTR_ADMIN_FETERSCODE_TITLE, { closeButton: true });
        }
    }

    EditFetersCode(fetersCodeId: number) {
        this.spinnerService.show();

        let getFetersCodeRequest = new GetFetersCodeRequest();
        getFetersCodeRequest.FetersCodeId = fetersCodeId;
        getFetersCodeRequest.IsActive = null;

        this._fetersCodeService.getFetersCode(getFetersCodeRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.fetersCodePDFName = data.Response[0].PDF;

                this.frmFetersCode.setValue({
                    FetersCodeId: fetersCodeId,
                    FetersCodeName: data.Response[0].FetersCodeName,
                    PDF: data.Response[0].PDF
                });

                this.frmFetersCode.updateValueAndValidity();
            }, error => this.msg = <any>error);
    }

    SaveFetersCode(formData) {
        this.spinnerService.show();

        if (formData.value.FetersCodeId) {
            this._fetersCodeService.updateFetersCode(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe((params: Params) => {
                            this.router.navigate(['/admin/secure/feterscodes'], {
                                queryParams: {
                                    indexFetersCode: params["indexFetersCode"], indexFetersCodeDetail: params["indexFetersCodeDetail"], sortingFetersCodeField: params["sortingFetersCodeField"], sortingFetersCodeDirection: params["sortingFetersCodeDirection"], sortingFetersCodeDetailField: params["sortingFetersCodeDetailField"], sortingFetersCodeDetailDirection: params["sortingFetersCodeDetailDirection"], sortingFetersCodeGroupDetailField: params["sortingFetersCodeGroupDetailField"], sortingFetersCodeGroupDetailDirection: params["sortingFetersCodeGroupDetailDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_FETERSCODE_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_FETERSCODE_TITLE);
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FETERSCODE_TITLE, { enableHtml: true });
                    });
        } else {
            this._fetersCodeService.addFetersCode(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe((params: Params) => {
                            this.router.navigate(['/admin/secure/feterscodes'], {
                                queryParams: {
                                    indexFetersCode: params["indexFetersCode"], indexFetersCodeDetail: params["indexFetersCodeDetail"], sortingFetersCodeField: params["sortingFetersCodeField"], sortingFetersCodeDirection: params["sortingFetersCodeDirection"], sortingFetersCodeDetailField: params["sortingFetersCodeDetailField"], sortingFetersCodeDetailDirection: params["sortingFetersCodeDetailDirection"], sortingFetersCodeGroupDetailField: params["sortingFetersCodeGroupDetailField"], sortingFetersCodeGroupDetailDirection: params["sortingFetersCodeGroupDetailDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_FETERSCODE_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_FETERSCODE_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FETERSCODE_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    OnSubmitFetersCode(formData: any) {
        this.isSubmited = true;

        if (this.frmFetersCode.valid) {
            this.spinnerService.show();

            if (this.files != null && this.files.length > 0) {
                let fileFormData: FormData = new FormData();
                for (var i = 0; i < this.files.length; i++) {
                    fileFormData.append(this.files[i].name, this.files[i]);
                }

                this._fetersCodeService.fileUpload(fileFormData)
                    .subscribe(response => {
                        if (response.Status == "Success") {
                            this.frmFetersCode.get('PDF').setValue(response.Response);
                            this.frmFetersCode.updateValueAndValidity();
                            formData.value.PDF = response.Response;
                            this.files = null;

                            this.SaveFetersCode(formData);
                        } else {
                            this.spinnerService.hide();
                            this.toastr.error(response.Description, Global.TOASTR_ADMIN_FETERSCODE_TITLE, { enableHtml: true, closeButton: true });
                        }
                    },
                        error => {
                            this.spinnerService.hide();
                            this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FETERSCODE_TITLE, { enableHtml: true, closeButton: true });
                        });
            } else {
                if (formData.value.PDF) {
                    this.SaveFetersCode(formData);
                } else {
                    this.spinnerService.hide();
                }
            }
        }
    }

    CancelFetersCode() {
        this.activatedRoute.queryParams.subscribe((params: Params) => {
            this.router.navigate(['/admin/secure/feterscodes'], {
                queryParams: {
                    indexFetersCode: params["indexFetersCode"], indexFetersCodeDetail: params["indexFetersCodeDetail"], sortingFetersCodeField: params["sortingFetersCodeField"], sortingFetersCodeDirection: params["sortingFetersCodeDirection"], sortingFetersCodeDetailField: params["sortingFetersCodeDetailField"], sortingFetersCodeDetailDirection: params["sortingFetersCodeDetailDirection"], sortingFetersCodeGroupDetailField: params["sortingFetersCodeGroupDetailField"], sortingFetersCodeGroupDetailDirection: params["sortingFetersCodeGroupDetailDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                }
            });
        });
    }
}
