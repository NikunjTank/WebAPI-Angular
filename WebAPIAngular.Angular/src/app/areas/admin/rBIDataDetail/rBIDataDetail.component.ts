import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RBIDataDetail, GetRBIDataDetailRequest } from '../../../model/rBIDataDetail';
import { RBIDataDetailAdminService } from '../../../service/admin/rBIDataDetail.service';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


@Component({
    selector: 'my-app',
    templateUrl: './rBIDataDetail.component.html'
})

export class RBIDataDetailAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _rBIDataDetailService: RBIDataDetailAdminService, vcr: ViewContainerRef, private spinnerService: SpinnerService) { }

    _global: Global = new Global();

    rBIDataDetail: RBIDataDetail;
    rBIDataDetailId: number = 0;
    rBIDataId: number;
    searchText: string = '';
    frmRBIDataDetail: FormGroup;
    msg: string;

    excelFiles: any;
    pdfFiles: any;

    addUpdateText: string;

    rBIDataDetailYears: any[];
    rBIDataDetailMonths: any[];

    excelServerPath: string = Global.RBIDATA_DETAIL_EXCEL_FILEPATH;
    pdfServerPath: string = Global.RBIDATA_DETAIL_PDF_FILEPATH;
    rBIDataDetailExcelName: string;
    rBIDataDetailPDFName: string;

    isSubmited: boolean = false;

    ngOnInit(): void {
        this.frmRBIDataDetail = this.formBuilder.group({
            RBIDataDetailId: [''],
            RBIDataId: [this.rBIDataId],
            Month: ['', Validators.required],
            Year: ['', Validators.required],
            Excel: ['', Validators.required],
            PDF: ['', Validators.required],
        });

        this.activatedRoute.params.subscribe((params: Params) => {
            let rBIDataDetailId = this._global.decryptValue(params['rBIDataDetailId']);
            let rBIDataId = this._global.decryptValue(params['rBIDataId']);

            if (rBIDataId) {
                this.rBIDataId = parseInt(rBIDataId);

                if (rBIDataDetailId) {
                    this.addUpdateText = "Update";
                    this.rBIDataDetailId = parseInt(rBIDataDetailId);
                    this.EditRBIDataDetail(parseInt(rBIDataDetailId));
                } else {
                    this.GetRBIDataDetailYear(null);
                    this.GetRBIDataDetailMonth(null);
                    this.addUpdateText = "Add";
                }
            } else {
                this.activatedRoute.queryParams.subscribe(params => {
                    this.router.navigate(['/admin/secure/rbidatas'], {
                        queryParams: {
                            indexRBIData: params["indexRBIData"], sortingRBIDataField: params["sortingRBIDataField"], sortingRBIDataDirection: params["sortingRBIDataDirection"], sortingRBIDataDetailField: params["sortingRBIDataDetailField"], sortingRBIDataDetailDirection: params["sortingRBIDataDetailDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                        }
                    });
                });
            }
        });
    }

    excelFileChange(event: any) {
        this.excelFiles = event.target.files;

        if (this.excelFiles[0].type == "application/vnd.ms-excel" || this.excelFiles[0].type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            this.frmRBIDataDetail.get('Excel').setValue(this.excelFiles[0].name);
            this.frmRBIDataDetail.updateValueAndValidity();
        } else {
            this.frmRBIDataDetail.get('Excel').setValue(null);
            this.frmRBIDataDetail.updateValueAndValidity();
            this.toastr.error("Please upload proper excel file.", Global.TOASTR_ADMIN_RBIDATA_DETAIL_TITLE, { closeButton: true });
        }
    }

    pdfFileChange(event: any) {
        this.pdfFiles = event.target.files;

        if (this.pdfFiles[0].type == "application/pdf") {
            this.frmRBIDataDetail.get('PDF').setValue(this.pdfFiles[0].name);
            this.frmRBIDataDetail.updateValueAndValidity();
        } else {
            this.frmRBIDataDetail.get('PDF').setValue(null);
            this.frmRBIDataDetail.updateValueAndValidity();
            this.toastr.error("Please upload proper pdf file.", Global.TOASTR_ADMIN_RBIDATA_DETAIL_TITLE, { closeButton: true });
        }
    }

    GetRBIDataDetailYear(rBIDataDetailData): void {
        this.spinnerService.show();

        this._rBIDataDetailService.getRBIDataDetailYear()
            .subscribe(data => {
                this.spinnerService.hide();
                this.rBIDataDetailYears = [];

                if (data.Status == Global.API_SUCCESS) {

                    this.rBIDataDetailYears.push({ YearId: null, YearName: "--Select--" });

                    data.Response.forEach(item => {
                        this.rBIDataDetailYears.push({ YearId: item, YearName: item });
                    });

                    this.frmRBIDataDetail.get("Year").setValue((rBIDataDetailData != null) ? rBIDataDetailData.Year : rBIDataDetailData);
                    this.frmRBIDataDetail.updateValueAndValidity();
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_RBIDATA_DETAIL_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_RBIDATA_DETAIL_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    GetRBIDataDetailMonth(rBIDataDetailData): void {
        this.spinnerService.show();

        this._rBIDataDetailService.getRBIDataDetailMonth()
            .subscribe(data => {
                this.spinnerService.hide();
                this.rBIDataDetailMonths = [];

                if (data.Status == Global.API_SUCCESS) {

                    this.rBIDataDetailMonths.push({ MonthId: null, MonthName: "--Select--" });

                    data.Response.forEach(item => {
                        this.rBIDataDetailMonths.push({ MonthId: item, MonthName: item });
                    });

                    this.frmRBIDataDetail.get("Month").setValue((rBIDataDetailData != null) ? rBIDataDetailData.Month : rBIDataDetailData);
                    this.frmRBIDataDetail.updateValueAndValidity();
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_RBIDATA_DETAIL_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_RBIDATA_DETAIL_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    EditRBIDataDetail(rBIDataDetailId: number) {
        this.spinnerService.show();

        let getRBIDataDetailRequest = new GetRBIDataDetailRequest();
        getRBIDataDetailRequest.RBIDataDetailId = rBIDataDetailId;
        getRBIDataDetailRequest.IsActive = null;

        this._rBIDataDetailService.getRBIDataDetail(getRBIDataDetailRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.rBIDataDetailExcelName = data.Response[0].Excel;
                this.rBIDataDetailPDFName = data.Response[0].PDF;

                this.GetRBIDataDetailYear(data.Response[0]);
                this.GetRBIDataDetailMonth(data.Response[0]);

                this.frmRBIDataDetail.setValue({
                    RBIDataDetailId: rBIDataDetailId,
                    RBIDataId: data.Response[0].RBIDataId,
                    Month: data.Response[0].Month,
                    Year: data.Response[0].Year,
                    Excel: data.Response[0].Excel,
                    PDF: data.Response[0].PDF
                });

                this.frmRBIDataDetail.updateValueAndValidity();
            }, error => this.msg = <any>error);
    }

    SaveRBIDataDetail(formData) {

        formData.value.RBIDataId = this.rBIDataId;

        if (formData.value.RBIDataDetailId) {
            this._rBIDataDetailService.updateRBIDataDetail(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/rbidatas'], {
                                queryParams: {
                                    indexRBIData: params["indexRBIData"], sortingRBIDataField: params["sortingRBIDataField"], sortingRBIDataDirection: params["sortingRBIDataDirection"], sortingRBIDataDetailField: params["sortingRBIDataDetailField"], sortingRBIDataDetailDirection: params["sortingRBIDataDetailDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_RBIDATA_DETAIL_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_RBIDATA_DETAIL_TITLE);
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_RBIDATA_DETAIL_TITLE, { enableHtml: true });
                    });
        } else {
            this._rBIDataDetailService.addRBIDataDetail(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/rbidatas'], {
                                queryParams: {
                                    indexRBIData: params["indexRBIData"], sortingRBIDataField: params["sortingRBIDataField"], sortingRBIDataDirection: params["sortingRBIDataDirection"], sortingRBIDataDetailField: params["sortingRBIDataDetailField"], sortingRBIDataDetailDirection: params["sortingRBIDataDetailDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_RBIDATA_DETAIL_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_RBIDATA_DETAIL_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_RBIDATA_DETAIL_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    UploadExcelFile(formData: any) {
        this.spinnerService.show();
        
        if (this.excelFiles != null && this.excelFiles.length > 0) {
            let fileFormData: FormData = new FormData();
            for (var i = 0; i < this.excelFiles.length; i++) {
                fileFormData.append(this.excelFiles[i].name, this.excelFiles[i]);
            }

            this._rBIDataDetailService.excelFileUpload(fileFormData)
                .subscribe(response => {
                    this.frmRBIDataDetail.get('Excel').setValue(response.Response);
                    this.frmRBIDataDetail.updateValueAndValidity();
                    formData.value.Excel = response.Response;

                    this.UploadPDFFile(formData);
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_RBIDATA_DETAIL_TITLE, { enableHtml: true, closeButton: true });
                    });
        } else {
            if (formData.value.Excel) {
                this.UploadPDFFile(formData);
            } else {
                this.spinnerService.hide();
            }
        }
    }

    UploadPDFFile(formData: any) {
        if (this.pdfFiles != null && this.pdfFiles.length > 0) {
            let fileFormData: FormData = new FormData();
            for (var i = 0; i < this.pdfFiles.length; i++) {
                fileFormData.append(this.pdfFiles[i].name, this.pdfFiles[i]);
            }

            this._rBIDataDetailService.pdfFileUpload(fileFormData)
                .subscribe(response => {
                    this.frmRBIDataDetail.get('PDF').setValue(response.Response);
                    this.frmRBIDataDetail.updateValueAndValidity();
                    formData.value.PDF = response.Response;

                    this.SaveRBIDataDetail(formData);
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_RBIDATA_DETAIL_TITLE, { enableHtml: true, closeButton: true });
                    });
        } else {
            if (formData.value.PDF) {
                this.SaveRBIDataDetail(formData);
            } else {
                this.spinnerService.hide();
            }
        }
    }

    OnSubmitRBIDataDetail(formData: any) {
        this.isSubmited = true;
        
        if (this.frmRBIDataDetail.valid) {
            this.UploadExcelFile(formData);
        }
    }

    CancelRBIDataDetail() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.router.navigate(['/admin/secure/rbidatas'], {
                queryParams: {
                    indexRBIData: params["indexRBIData"], sortingRBIDataField: params["sortingRBIDataField"], sortingRBIDataDirection: params["sortingRBIDataDirection"], sortingRBIDataDetailField: params["sortingRBIDataDetailField"], sortingRBIDataDetailDirection: params["sortingRBIDataDetailDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                }
            });
        });
    }
}
