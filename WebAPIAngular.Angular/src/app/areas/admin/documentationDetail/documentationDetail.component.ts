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
    templateUrl: './documentationDetail.component.html'
})

export class DocumentationDetailAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _formSummaryDocumentationDetailService: FormSummaryDocumentationDetailAdminService, vcr: ViewContainerRef, private spinnerService: SpinnerService) { }

    _global: Global = new Global();

    formSummaryDocumentationDetail: FormSummaryDocumentationDetail;
    formSummaryDocumentationDetailId: number = 0;
    formSummaryDocumentationId: number = 0;
    searchText: string = '';
    frmDocumentationDetail: FormGroup;
    msg: string;

    wordFiles: any;
    excelFiles: any;
    pdfFiles: any;

    addUpdateText: string;

    wordServerPath: string = Global.FORM_SUMMARY_DOCUMENTATION_WORD_FILEPATH;
    excelServerPath: string = Global.FORM_SUMMARY_DOCUMENTATION_EXCEL_FILEPATH;
    pdfServerPath: string = Global.FORM_SUMMARY_DOCUMENTATION_PDF_FILEPATH;

    documentationDetailWordName: string;
    documentationDetailExcelName: string;
    documentationDetailPDFName: string;

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
                    this.EditDocumentationDetail(parseInt(formSummaryDocumentationDetailId));
                } else {
                    this.addUpdateText = "Add";
                }
            } else {
                this.activatedRoute.queryParams.subscribe(params => {
                    this.router.navigate(['/admin/secure/documentations'], {
                        queryParams: {
                            indexDocumentation: params["indexDocumentation"], sortingDocumentationField: params["sortingDocumentationField"], sortingDocumentationDirection: params["sortingDocumentationDirection"], sortingDocumentationDetailField: params["sortingDocumentationDetailField"], sortingDocumentationDetailDirection: params["sortingDocumentationDetailDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                        }
                    });
                });
            }
        });

        this.frmDocumentationDetail = this.formBuilder.group({
            FormSummaryDocumentationDetailId: [''],
            FormSummaryDocumentationId: [this.formSummaryDocumentationId],
            SubMenuName: [Global.DOCUMENTATION_TYPE],
            FormName: ['', Validators.required],
            WordFileName: [''],
            ExcelFileName: [''],
            PDFFileName: ['']
        });
    }

    wordFileChange(event: any) {
        this.wordFiles = event.target.files;

        if (this.wordFiles[0].type == "application/msword" || this.wordFiles[0].type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            this.frmDocumentationDetail.get('WordFileName').setValue(this.wordFiles[0].name);
            this.frmDocumentationDetail.updateValueAndValidity();
        } else {
            this.frmDocumentationDetail.get('WordFileName').setValue(null);
            this.frmDocumentationDetail.updateValueAndValidity();
            this.toastr.error("Please upload proper word file.", Global.TOASTR_ADMIN_DOCUMENTATIONDETAIL_TITLE, { closeButton: true });
        }
    }

    excelFileChange(event: any) {
        this.excelFiles = event.target.files;

        if (this.excelFiles[0].type == "application/vnd.ms-excel" || this.excelFiles[0].type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            this.frmDocumentationDetail.get('ExcelFileName').setValue(this.excelFiles[0].name);
            this.frmDocumentationDetail.updateValueAndValidity();
        } else {
            this.frmDocumentationDetail.get('ExcelFileName').setValue(null);
            this.frmDocumentationDetail.updateValueAndValidity();
            this.toastr.error("Please upload proper excel file.", Global.TOASTR_ADMIN_DOCUMENTATIONDETAIL_TITLE, { closeButton: true });
        }
    }

    pdfFileChange(event: any) {
        this.pdfFiles = event.target.files;
        
        if (this.pdfFiles[0].type == "application/pdf") {
            this.frmDocumentationDetail.get('PDFFileName').setValue(this.pdfFiles[0].name);
            this.frmDocumentationDetail.updateValueAndValidity();
        } else {
            this.frmDocumentationDetail.get('PDFFileName').setValue(null);
            this.frmDocumentationDetail.updateValueAndValidity();
            this.toastr.error("Please upload proper pdf file.", Global.TOASTR_ADMIN_DOCUMENTATIONDETAIL_TITLE, { closeButton: true });
        }
    }

    EditDocumentationDetail(documentationDetailId: number) {
        this.spinnerService.show();

        let getFormSummaryDocumentationDetailRequest = new GetFormSummaryDocumentationDetailRequest();
        getFormSummaryDocumentationDetailRequest.FormSummaryDocumentationDetailId = documentationDetailId;
        getFormSummaryDocumentationDetailRequest.SubMenuName = Global.DOCUMENTATION_TYPE;
        getFormSummaryDocumentationDetailRequest.IsActive = null;

        this._formSummaryDocumentationDetailService.getFormSummaryDocumentationDetail(getFormSummaryDocumentationDetailRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.documentationDetailWordName = data.Response[0].WordFileName;
                this.documentationDetailExcelName = data.Response[0].ExcelFileName;
                this.documentationDetailPDFName = data.Response[0].PDFFileName;

                this.frmDocumentationDetail.setValue({
                    FormSummaryDocumentationDetailId: documentationDetailId,
                    FormSummaryDocumentationId: this.formSummaryDocumentationId,
                    SubMenuName: Global.DOCUMENTATION_TYPE,
                    FormName: data.Response[0].FormName,
                    WordFileName: data.Response[0].WordFileName,
                    ExcelFileName: data.Response[0].ExcelFileName,
                    PDFFileName: data.Response[0].PDFFileName
                });

                this.frmDocumentationDetail.updateValueAndValidity();
            }, error => this.msg = <any>error);
    }

    SaveDocumentationDetail(formData) {
        this.spinnerService.show();

        if (formData.value.FormSummaryDocumentationDetailId) {
            this._formSummaryDocumentationDetailService.updateFormSummaryDocumentationDetail(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/documentations'], {
                                queryParams: {
                                    indexDocumentation: params["indexDocumentation"], sortingDocumentationField: params["sortingDocumentationField"], sortingDocumentationDirection: params["sortingDocumentationDirection"], sortingDocumentationDetailField: params["sortingDocumentationDetailField"], sortingDocumentationDetailDirection: params["sortingDocumentationDetailDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_DOCUMENTATIONDETAIL_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_DOCUMENTATIONDETAIL_TITLE);
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_DOCUMENTATIONDETAIL_TITLE, { enableHtml: true });
                    });
        } else {
            this._formSummaryDocumentationDetailService.addFormSummaryDocumentationDetail(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/documentations'], {
                                queryParams: {
                                    indexDocumentation: params["indexDocumentation"], sortingDocumentationField: params["sortingDocumentationField"], sortingDocumentationDirection: params["sortingDocumentationDirection"], sortingDocumentationDetailField: params["sortingDocumentationDetailField"], sortingDocumentationDetailDirection: params["sortingDocumentationDetailDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_DOCUMENTATIONDETAIL_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_DOCUMENTATIONDETAIL_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_DOCUMENTATIONDETAIL_TITLE, { enableHtml: true, closeButton: true });
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
                        this.frmDocumentationDetail.get('WordFileName').setValue(response.Response);
                        this.frmDocumentationDetail.updateValueAndValidity();
                        formData.value.WordFileName = response.Response;

                        this.UploadExcelFile(formData);
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(response.Description, Global.TOASTR_ADMIN_DOCUMENTATIONDETAIL_TITLE, { enableHtml: true, closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_DOCUMENTATIONDETAIL_TITLE, { enableHtml: true, closeButton: true });
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
                        this.frmDocumentationDetail.get('ExcelFileName').setValue(response.Response);
                        this.frmDocumentationDetail.updateValueAndValidity();
                        formData.value.ExcelFileName = response.Response;

                        this.UploadPDFFile(formData);
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(response.Description, Global.TOASTR_ADMIN_DOCUMENTATIONDETAIL_TITLE, { enableHtml: true, closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_DOCUMENTATIONDETAIL_TITLE, { enableHtml: true, closeButton: true });
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
                        this.frmDocumentationDetail.get('PDFFileName').setValue(response.Response);
                        this.frmDocumentationDetail.updateValueAndValidity();
                        formData.value.PDFFileName = response.Response;

                        this.SaveDocumentationDetail(formData);
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(response.Description, Global.TOASTR_ADMIN_DOCUMENTATIONDETAIL_TITLE, { enableHtml: true, closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_DOCUMENTATIONDETAIL_TITLE, { enableHtml: true, closeButton: true });
                    });
        } else {
            this.SaveDocumentationDetail(formData);
        }
    }

    OnSubmitDocumentationDetail(formData: any) {
        this.isSubmited = true;

        if (this.frmDocumentationDetail.valid) {
            if (formData.value.FormSummaryDocumentationDetailId || (this.wordFiles != null && this.wordFiles.length > 0) || (this.excelFiles != null && this.excelFiles.length > 0) || (this.pdfFiles != null && this.pdfFiles.length > 0)) {
                this.spinnerService.show();

                this.UploadWordFile(formData);
            } else {
                this.toastr.error("Please upload any one file.", Global.TOASTR_ADMIN_DOCUMENTATIONDETAIL_TITLE, { closeButton: true });
            }
        }
    }

    CancelDocumentationDetail() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.router.navigate(['/admin/secure/documentations'], {
                queryParams: {
                    indexDocumentation: params["indexDocumentation"], sortingDocumentationField: params["sortingDocumentationField"], sortingDocumentationDirection: params["sortingDocumentationDirection"], sortingDocumentationDetailField: params["sortingDocumentationDetailField"], sortingDocumentationDetailDirection: params["sortingDocumentationDetailDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                }
            });
        });
    }
}
