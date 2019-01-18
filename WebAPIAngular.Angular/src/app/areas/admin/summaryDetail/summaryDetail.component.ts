import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormSummaryDocumentationDetail, GetFormSummaryDocumentationDetailRequest } from '../../../model/formSummaryDocumentationDetail';
import { FormSummaryDocumentationDetailAdminService } from '../../../service/admin/formSummaryDocumentationDetail.service';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


@Component({
    selector: 'my-app',
    templateUrl: './summaryDetail.component.html'
})

export class SummaryDetailAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _formSummaryDocumentationDetailService: FormSummaryDocumentationDetailAdminService, vcr: ViewContainerRef, private spinnerService: SpinnerService) { }

    _global: Global = new Global();

    formSummaryDocumentationDetail: FormSummaryDocumentationDetail;
    formSummaryDocumentationDetailId: number = 0;
    formSummaryDocumentationId: number = 0;
    searchText: string = '';
    frmSummaryDetail: FormGroup;
    msg: string;

    wordFiles: any;
    excelFiles: any;
    pdfFiles: any;

    addUpdateText: string;

    wordServerPath: string = Global.FORM_SUMMARY_DOCUMENTATION_WORD_FILEPATH;
    excelServerPath: string = Global.FORM_SUMMARY_DOCUMENTATION_EXCEL_FILEPATH;
    pdfServerPath: string = Global.FORM_SUMMARY_DOCUMENTATION_PDF_FILEPATH;

    summaryDetailWordName: string;
    summaryDetailExcelName: string;
    summaryDetailPDFName: string;

    isSubmited: boolean = false;

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params: Params) => {
            let formSummaryDocumentationId = this._global.decryptValue(params['formSummaryDocumentationId']);
            let formSummaryDocumentationDetailId = this._global.decryptValue(params['formSummaryDocumentationDetailId']);

            if (formSummaryDocumentationId) {
                this.formSummaryDocumentationId = parseInt(formSummaryDocumentationId);

                if (formSummaryDocumentationDetailId) {
                    this.addUpdateText = "Update";
                    this.formSummaryDocumentationDetailId = parseInt(formSummaryDocumentationDetailId);
                    this.EditSummaryDetail(parseInt(formSummaryDocumentationDetailId));
                } else {
                    this.addUpdateText = "Add";
                }
            } else {
                this.activatedRoute.queryParams.subscribe(params => {
                    this.router.navigate(['/admin/secure/summaries'], {
                        queryParams: {
                            indexSummary: params["indexSummary"], sortingSummaryField: params["sortingSummaryField"], sortingSummaryDirection: params["sortingSummaryDirection"], sortingSummaryDetailField: params["sortingSummaryDetailField"], sortingSummaryDetailDirection: params["sortingSummaryDetailDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                        }
                    });
                });
            }
        });

        this.frmSummaryDetail = this.formBuilder.group({
            FormSummaryDocumentationDetailId: [''],
            FormSummaryDocumentationId: [this.formSummaryDocumentationId],
            SubMenuName: [Global.SUMMARY_TYPE],
            FormName: ['', Validators.required],
            WordFileName: [''],
            ExcelFileName: [''],
            PDFFileName: ['']
        });
    }

    wordFileChange(event: any) {
        this.wordFiles = event.target.files;

        if (this.wordFiles[0].type == "application/msword" || this.wordFiles[0].type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            this.frmSummaryDetail.get('WordFileName').setValue(this.wordFiles[0].name);
            this.frmSummaryDetail.updateValueAndValidity();
        } else {
            this.frmSummaryDetail.get('WordFileName').setValue(null);
            this.frmSummaryDetail.updateValueAndValidity();
            this.toastr.error("Please upload proper word file.", Global.TOASTR_ADMIN_SUMMARYDETAIL_TITLE, { closeButton: true });
        }
    }

    excelFileChange(event: any) {
        this.excelFiles = event.target.files;

        if (this.excelFiles[0].type == "application/vnd.ms-excel" || this.excelFiles[0].type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            this.frmSummaryDetail.get('ExcelFileName').setValue(this.excelFiles[0].name);
            this.frmSummaryDetail.updateValueAndValidity();
        } else {
            this.frmSummaryDetail.get('ExcelFileName').setValue(null);
            this.frmSummaryDetail.updateValueAndValidity();
            this.toastr.error("Please upload proper excel file.", Global.TOASTR_ADMIN_SUMMARYDETAIL_TITLE, { closeButton: true });
        }
    }

    pdfFileChange(event: any) {
        this.pdfFiles = event.target.files;
        
        if (this.pdfFiles[0].type == "application/pdf") {
            this.frmSummaryDetail.get('PDFFileName').setValue(this.pdfFiles[0].name);
            this.frmSummaryDetail.updateValueAndValidity();
        } else {
            this.frmSummaryDetail.get('PDFFileName').setValue(null);
            this.frmSummaryDetail.updateValueAndValidity();
            this.toastr.error("Please upload proper pdf file.", Global.TOASTR_ADMIN_SUMMARYDETAIL_TITLE, { closeButton: true });
        }
    }

    EditSummaryDetail(formDetailId: number) {
        this.spinnerService.show();

        let getFormSummaryDocumentationDetailRequest = new GetFormSummaryDocumentationDetailRequest();
        getFormSummaryDocumentationDetailRequest.FormSummaryDocumentationDetailId = formDetailId;
        getFormSummaryDocumentationDetailRequest.SubMenuName = Global.SUMMARY_TYPE;
        getFormSummaryDocumentationDetailRequest.IsActive = null;

        this._formSummaryDocumentationDetailService.getFormSummaryDocumentationDetail(getFormSummaryDocumentationDetailRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.summaryDetailWordName = data.Response[0].WordFileName;
                this.summaryDetailExcelName = data.Response[0].ExcelFileName;
                this.summaryDetailPDFName = data.Response[0].PDFFileName;

                this.frmSummaryDetail.setValue({
                    FormSummaryDocumentationDetailId: formDetailId,
                    FormSummaryDocumentationId: this.formSummaryDocumentationId,
                    SubMenuName: Global.SUMMARY_TYPE,
                    FormName: data.Response[0].FormName,
                    WordFileName: data.Response[0].WordFileName,
                    ExcelFileName: data.Response[0].ExcelFileName,
                    PDFFileName: data.Response[0].PDFFileName
                });

                this.frmSummaryDetail.updateValueAndValidity();
            }, error => this.msg = <any>error);
    }

    SaveSummaryDetail(formData) {
        this.spinnerService.show();

        if (formData.value.FormSummaryDocumentationDetailId) {
            this._formSummaryDocumentationDetailService.updateFormSummaryDocumentationDetail(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/summaries'], {
                                queryParams: {
                                    indexSummary: params["indexSummary"], sortingSummaryField: params["sortingSummaryField"], sortingSummaryDirection: params["sortingSummaryDirection"], sortingSummaryDetailField: params["sortingSummaryDetailField"], sortingSummaryDetailDirection: params["sortingSummaryDetailDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_SUMMARYDETAIL_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_SUMMARYDETAIL_TITLE);
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_SUMMARYDETAIL_TITLE, { enableHtml: true });
                    });
        } else {
            this._formSummaryDocumentationDetailService.addFormSummaryDocumentationDetail(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/summaries'], {
                                queryParams: {
                                    indexSummary: params["indexSummary"], sortingSummaryField: params["sortingSummaryField"], sortingSummaryDirection: params["sortingSummaryDirection"], sortingSummaryDetailField: params["sortingSummaryDetailField"], sortingSummaryDetailDirection: params["sortingSummaryDetailDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_SUMMARYDETAIL_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_SUMMARYDETAIL_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_SUMMARYDETAIL_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    UploadWordFile(formData: any) {
        if (this.wordFiles != null && this.wordFiles.length > 0) {
            let fileFormData: FormData = new FormData();
            for (var i = 0; i < this.wordFiles.length; i++) {
                fileFormData.append(this.wordFiles[i].name, this.wordFiles[i]);
            }

            this._formSummaryDocumentationDetailService.wordFileUpload(fileFormData)
                .subscribe(response => {
                    if (response.Status == "Success") {
                        this.frmSummaryDetail.get('WordFileName').setValue(response.Response);
                        this.frmSummaryDetail.updateValueAndValidity();
                        formData.value.WordFileName = response.Response;

                        this.UploadExcelFile(formData);
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(response.Description, Global.TOASTR_ADMIN_SUMMARYDETAIL_TITLE, { enableHtml: true, closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_SUMMARYDETAIL_TITLE, { enableHtml: true, closeButton: true });
                    });
        } else {
            this.UploadExcelFile(formData);
        }
    }

    UploadExcelFile(formData: any) {
        if (this.excelFiles != null && this.excelFiles.length > 0) {
            let fileFormData: FormData = new FormData();
            for (var i = 0; i < this.excelFiles.length; i++) {
                fileFormData.append(this.excelFiles[i].name, this.excelFiles[i]);
            }

            this._formSummaryDocumentationDetailService.excelFileUpload(fileFormData)
                .subscribe(response => {
                    if (response.Status == "Success") {
                        this.frmSummaryDetail.get('ExcelFileName').setValue(response.Response);
                        this.frmSummaryDetail.updateValueAndValidity();
                        formData.value.ExcelFileName = response.Response;

                        this.UploadPDFFile(formData);
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(response.Description, Global.TOASTR_ADMIN_SUMMARYDETAIL_TITLE, { enableHtml: true, closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_SUMMARYDETAIL_TITLE, { enableHtml: true, closeButton: true });
                    });
        } else {
            this.UploadPDFFile(formData);
        }
    }

    UploadPDFFile(formData: any) {
        if (this.pdfFiles != null && this.pdfFiles.length > 0) {
            let fileFormData: FormData = new FormData();
            for (var i = 0; i < this.pdfFiles.length; i++) {
                fileFormData.append(this.pdfFiles[i].name, this.pdfFiles[i]);
            }

            this._formSummaryDocumentationDetailService.pdfFileUpload(fileFormData)
                .subscribe(response => {
                    if (response.Status == "Success") {
                        this.frmSummaryDetail.get('PDFFileName').setValue(response.Response);
                        this.frmSummaryDetail.updateValueAndValidity();
                        formData.value.PDFFileName = response.Response;

                        this.SaveSummaryDetail(formData);
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(response.Description, Global.TOASTR_ADMIN_SUMMARYDETAIL_TITLE, { enableHtml: true, closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_SUMMARYDETAIL_TITLE, { enableHtml: true, closeButton: true });
                    });
        } else {
            this.SaveSummaryDetail(formData);
        }
    }

    OnSubmitSummaryDetail(formData: any) {
        this.isSubmited = true;

        if (this.frmSummaryDetail.valid) {
            if (formData.value.FormSummaryDocumentationDetailId || (this.wordFiles != null && this.wordFiles.length > 0) || (this.excelFiles != null && this.excelFiles.length > 0) || (this.pdfFiles != null && this.pdfFiles.length > 0)) {
                this.spinnerService.show();

                this.UploadWordFile(formData);
            } else {
                this.toastr.error("Please upload any one file.", Global.TOASTR_ADMIN_SUMMARYDETAIL_TITLE, { closeButton: true });
            }
        }
    }

    CancelSummaryDetail() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.router.navigate(['/admin/secure/summaries'], {
                queryParams: {
                    indexSummary: params["indexSummary"], sortingSummaryField: params["sortingSummaryField"], sortingSummaryDirection: params["sortingSummaryDirection"], sortingSummaryDetailField: params["sortingSummaryDetailField"], sortingSummaryDetailDirection: params["sortingSummaryDetailDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                }
            });
        });
    }
}
