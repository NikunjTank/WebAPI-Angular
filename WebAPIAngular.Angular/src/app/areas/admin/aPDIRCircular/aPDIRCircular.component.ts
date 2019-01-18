import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { APDIRCircular, GetAPDIRCircularRequest } from '../../../model/aPDIRCircular';
import { MasterDirection, GetMasterDirectionRequest } from '../../../model/masterDirection';
import { APDIRCircularAdminService } from '../../../service/admin/aPDIRCircular.service';
import { MasterDirectionAdminService } from '../../../service/admin/masterDirection.service';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


import { DropDown } from '../../../common/dropDown';

@Component({
    selector: 'my-app',
    templateUrl: './aPDIRCircular.component.html'
})

export class APDIRCircularAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _aPDIRCircularService: APDIRCircularAdminService, private _masterDirectionService: MasterDirectionAdminService, vcr: ViewContainerRef, private spinnerService: SpinnerService) { }

    _global: Global = new Global();

    aPDIRCircular: APDIRCircular;
    aPDIRCircularId: number = 0;
    searchText: string = '';
    frmAPDIRCircular: FormGroup;
    msg: string;
    files: any;
    aPDIRCircularYears: DropDown[] = [];
    masterDirections: DropDown[] = [];

    addUpdateText: string;

    pdfServerPath: string = Global.APDIRCIRCULAR_PDF_FILEPATH;
    aPDIRCircularPDFName: string;

    minDate: any = { year: 1970, month: 1, day: 1 };

    isSubmited: boolean = false;

    ngOnInit(): void {
        this.frmAPDIRCircular = this.formBuilder.group({
            APDIRCircularId: [''],
            MasterDirectionId: [''],
            APDIRCircularNo: ['', Validators.required],
            APDIRCircularName: ['', Validators.required],
            APDIRCircularDate: ['', Validators.required],
            APDIRCircularEffectiveDate: ['', Validators.required],
            Year: ['', Validators.required],
            APDIRCircularPDF: ['', Validators.required]
        });

        this.activatedRoute.params.subscribe((params: Params) => {
            let aPDIRCircularId = this._global.decryptValue(params['aPDIRCircularId']);

            if (aPDIRCircularId) {
                this.addUpdateText = "Update";
                this.aPDIRCircularId = parseInt(aPDIRCircularId);
                this.EditAPDIRCircular(parseInt(aPDIRCircularId));
            } else {
                this.GetMasterDirection(null);
                this.GetAPDIRCircularYear(null);
                this.addUpdateText = "Add";
            }
        });
    }

    fileChange(event: any) {
        this.files = event.target.files;

        if (this.files[0].type == "application/pdf") {
            this.frmAPDIRCircular.get('APDIRCircularPDF').setValue(this.files[0].name);
            this.frmAPDIRCircular.updateValueAndValidity();
        } else {
            this.frmAPDIRCircular.get('APDIRCircularPDF').setValue(null);
            this.frmAPDIRCircular.updateValueAndValidity();
            this.toastr.error("Please upload proper pdf file.", Global.TOASTR_ADMIN_APDIR_CIRCULAR_TITLE, { closeButton: true });
        }
    }

    GetMasterDirection(aPDIRCircularData): void {
        this.spinnerService.show();

        let getMasterDirectionRequest = new GetMasterDirectionRequest();

        this._masterDirectionService.getMasterDirection(getMasterDirectionRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.masterDirections = [];

                if (data.Status == Global.API_SUCCESS) {

                    this.masterDirections.push({ Value: "", Text: "--Select--" });

                    data.Response.forEach(item => {
                        this.masterDirections.push({ Value: item.MasterDirectionId, Text: item.MasterDirectionName });
                    });

                    this.frmAPDIRCircular.get("MasterDirectionId").setValue((aPDIRCircularData != null) ? (aPDIRCircularData.MasterDirectionId) ? aPDIRCircularData.MasterDirectionId : "" : "");
                    this.frmAPDIRCircular.updateValueAndValidity();
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_APDIR_CIRCULAR_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_APDIR_CIRCULAR_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    GetAPDIRCircularYear(aPDIRCircularData): void {
        this.spinnerService.show();

        this._aPDIRCircularService.getAPDIRCircularYears()
            .subscribe(data => {
                this.spinnerService.hide();
                this.aPDIRCircularYears = [];

                if (data.Status == Global.API_SUCCESS) {

                    this.aPDIRCircularYears.push({ Value: "", Text: "--Select--" });

                    data.Response.forEach(item => {
                        this.aPDIRCircularYears.push({ Value: item.APDIRCircularYearId, Text: item.APDIRCircularYearName });
                    });

                    this.frmAPDIRCircular.get("Year").setValue((aPDIRCircularData != null) ? aPDIRCircularData.Year : "");
                    this.frmAPDIRCircular.updateValueAndValidity();
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_APDIR_CIRCULAR_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_APDIR_CIRCULAR_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    EditAPDIRCircular(aPDIRCircularId: number) {
        this.spinnerService.show();

        let getAPDIRCircularRequest = new GetAPDIRCircularRequest();
        getAPDIRCircularRequest.APDIRCircularId = aPDIRCircularId;
        getAPDIRCircularRequest.PageNumber = 1;
        getAPDIRCircularRequest.PageSize = 10;
        getAPDIRCircularRequest.IsActive = null;

        this._aPDIRCircularService.getAPDIRCircular(getAPDIRCircularRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.GetAPDIRCircularYear(data.Response[0]);
                this.GetMasterDirection(data.Response[0]);

                this.aPDIRCircularPDFName = data.Response[0].APDIRCircularPDF;

                let aPDIRCircularDate = new Date(data.Response[0].APDIRCircularDate);
                let aPDIRCircularEffectiveDate = new Date(data.Response[0].APDIRCircularEffectiveDate);
                console.log(data.Response);
                this.frmAPDIRCircular.setValue({
                    APDIRCircularId: aPDIRCircularId,
                    MasterDirectionId: data.Response[0].MasterDirectionId,
                    APDIRCircularNo: data.Response[0].APDIRCircularNo,
                    APDIRCircularName: data.Response[0].APDIRCircularName,
                    APDIRCircularDate: { year: aPDIRCircularDate.getFullYear(), month: aPDIRCircularDate.getMonth() + 1, day: aPDIRCircularDate.getDate() },
                    APDIRCircularEffectiveDate: { year: aPDIRCircularEffectiveDate.getFullYear(), month: aPDIRCircularEffectiveDate.getMonth() + 1, day: aPDIRCircularEffectiveDate.getDate() },
                    Year: data.Response[0].Year,
                    APDIRCircularPDF: data.Response[0].APDIRCircularPDF
                });

                this.frmAPDIRCircular.updateValueAndValidity();
            }, error => this.msg = <any>error);
    }

    SaveAPDIRCircular(formData) {
        this.spinnerService.show();

        formData.value.APDIRCircularDate = (formData.value.APDIRCircularDate != null) ? formData.value.APDIRCircularDate.year + "/" + formData.value.APDIRCircularDate.month + "/" + formData.value.APDIRCircularDate.day : null;
        formData.value.APDIRCircularEffectiveDate = (formData.value.APDIRCircularEffectiveDate != null) ? formData.value.APDIRCircularEffectiveDate.year + "/" + formData.value.APDIRCircularEffectiveDate.month + "/" + formData.value.APDIRCircularEffectiveDate.day : null;

        if (formData.value.APDIRCircularId) {
            this._aPDIRCircularService.updateAPDIRCircular(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/apdircirculars'], {
                                queryParams: {
                                    indexAPDIRCircular1: params["indexAPDIRCircular1"], indexAPDIRCircular2: params["indexAPDIRCircular2"], sortingAPDIRCircularField: params["sortingAPDIRCircularField"], sortingAPDIRCircularDirection: params["sortingAPDIRCircularDirection"], sortingAPDIRCircularBeforeField: params["sortingAPDIRCircularBeforeField"], sortingAPDIRCircularBeforeDirection: params["sortingAPDIRCircularBeforeDirection"], sortingAPDIRCircularAfterField: params["sortingAPDIRCircularAfterField"], sortingAPDIRCircularAfterDirection: params["sortingAPDIRCircularAfterDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_APDIR_CIRCULAR_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_APDIR_CIRCULAR_TITLE);
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_APDIR_CIRCULAR_TITLE, { enableHtml: true });
                    });
        } else {
            this._aPDIRCircularService.addAPDIRCircular(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/apdircirculars'], {
                                queryParams: {
                                    indexAPDIRCircular1: params["indexAPDIRCircular1"], indexAPDIRCircular2: params["indexAPDIRCircular2"], sortingAPDIRCircularField: params["sortingAPDIRCircularField"], sortingAPDIRCircularDirection: params["sortingAPDIRCircularDirection"], sortingAPDIRCircularBeforeField: params["sortingAPDIRCircularBeforeField"], sortingAPDIRCircularBeforeDirection: params["sortingAPDIRCircularBeforeDirection"], sortingAPDIRCircularAfterField: params["sortingAPDIRCircularAfterField"], sortingAPDIRCircularAfterDirection: params["sortingAPDIRCircularAfterDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_APDIR_CIRCULAR_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_APDIR_CIRCULAR_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_APDIR_CIRCULAR_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    OnSubmitAPDIRCircular(formData: any) {
        this.isSubmited = true;

        if (this.frmAPDIRCircular.valid) {
            this.spinnerService.show();

            if (this.files != null && this.files.length > 0) {
                let fileFormData: FormData = new FormData();
                for (var i = 0; i < this.files.length; i++) {
                    fileFormData.append(this.files[i].name, this.files[i]);
                }

                this._aPDIRCircularService.fileUpload(fileFormData)
                    .subscribe(response => {
                        if (response.Status == "Success") {
                            this.frmAPDIRCircular.get('APDIRCircularPDF').setValue(response.Response);
                            this.frmAPDIRCircular.updateValueAndValidity();
                            formData.value.APDIRCircularPDF = response.Response;

                            this.files = null;

                            this.SaveAPDIRCircular(formData);
                        } else {
                            this.spinnerService.hide();
                            this.toastr.error(response.Description, Global.TOASTR_ADMIN_APDIR_CIRCULAR_TITLE, { enableHtml: true, closeButton: true });
                        }
                    },
                        error => {
                            this.spinnerService.hide();
                            this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_APDIR_CIRCULAR_TITLE, { enableHtml: true, closeButton: true });
                        });
            } else {
                if (formData.value.APDIRCircularPDF) {
                    this.SaveAPDIRCircular(formData);
                } else {
                    this.spinnerService.hide();
                }
            }
        }
    }

    ClearAPDIRCircularDate() {
        this.frmAPDIRCircular.get("APDIRCircularDate").setValue("");
        this.frmAPDIRCircular.updateValueAndValidity();
    }

    ClearAPDIRCircularEffectiveDate() {
        this.frmAPDIRCircular.get("APDIRCircularEffectiveDate").setValue("");
        this.frmAPDIRCircular.updateValueAndValidity();
    }

    CancelAPDIRCircular() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.router.navigate(['/admin/secure/apdircirculars'], {
                queryParams: {
                    indexAPDIRCircular1: params["indexAPDIRCircular1"], indexAPDIRCircular2: params["indexAPDIRCircular2"], sortingAPDIRCircularField: params["sortingAPDIRCircularField"], sortingAPDIRCircularDirection: params["sortingAPDIRCircularDirection"], sortingAPDIRCircularBeforeField: params["sortingAPDIRCircularBeforeField"], sortingAPDIRCircularBeforeDirection: params["sortingAPDIRCircularBeforeDirection"], sortingAPDIRCircularAfterField: params["sortingAPDIRCircularAfterField"], sortingAPDIRCircularAfterDirection: params["sortingAPDIRCircularAfterDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                }
            });
        });
    }
}
