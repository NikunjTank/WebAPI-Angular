import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FormSummaryDocumentation, GetFormSummaryDocumentationRequest } from '../../../model/formSummaryDocumentation';
import { FormSummaryDocumentationDetail, GetFormSummaryDocumentationDetailRequest } from '../../../model/formSummaryDocumentationDetail';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';
import { FormSummaryDocumentationAdminService } from '../../../service/admin/formSummaryDocumentation.service';
import { FormSummaryDocumentationDetailAdminService } from '../../../service/admin/formSummaryDocumentationDetail.service';


@Component({
    selector: 'my-app',
    templateUrl: './documentations.component.html'
})

export class DocumentationsAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private _formSummaryDocumentationService: FormSummaryDocumentationAdminService, private _formSummaryDocumentationDetailService: FormSummaryDocumentationDetailAdminService, private toastr: ToastrService, private vcr: ViewContainerRef, private spinnerService: SpinnerService, private router: Router) { }

    _global: Global = new Global();

    formSummaryDocumentations: FormSummaryDocumentation[];
    formSummaryDocumentationDetails: FormSummaryDocumentationDetail[];

    frmDocumentation: FormGroup;

    searchText: string;
    totalRecords: number;
    currentPage: number;
    pageSize: number;
    pageSizes: number[];

    drpPageSize: number;

    wordServerPath: string = Global.FORM_SUMMARY_DOCUMENTATION_WORD_FILEPATH;
    excelServerPath: string = Global.FORM_SUMMARY_DOCUMENTATION_EXCEL_FILEPATH;
    pdfServerPath: string = Global.FORM_SUMMARY_DOCUMENTATION_PDF_FILEPATH;

    itemDetailDocumentations = { index: -1 };
    indexDocumentation: number = -1;

    sortingDocumentationField: string;
    sortingDocumentationDirection: string;

    sortingDocumentationDetailField: string;
    sortingDocumentationDetailDirection: string;

    ngOnInit(): void {
        this.pageSizes = Global.PAGE_SIZES;

        this.activatedRoute.queryParams.subscribe(params => {
            this.indexDocumentation = (params["indexDocumentation"]) ? parseInt(params["indexDocumentation"]) : -1;

            this.sortingDocumentationField = params["sortingDocumentationField"];
            this.sortingDocumentationDirection = params["sortingDocumentationDirection"];
            this.sortingDocumentationDetailField = params["sortingDocumentationDetailField"];
            this.sortingDocumentationDetailDirection = params["sortingDocumentationDetailDirection"];

            this.searchText = (params["searchText"]) ? params["searchText"] : null;
            this.currentPage = (params["pageNumber"]) ? parseInt(params["pageNumber"]) : 1;
            this.pageSize = (params["pageSize"]) ? parseInt(params["pageSize"]) : this.pageSizes[0];
            this.drpPageSize = this.pageSize;
        });


        this.frmDocumentation = this.formBuilder.group({
            SearchText: [this.searchText]
        });

        this.GetDocumentation(this.searchText, this.currentPage, this.pageSizes[0]);
    }

    GetDocumentation(searchText?: string, pageNumber?: number, pageSize?: number): void {
        this.spinnerService.show();

        let getFormSummaryDocumentationRequest = new GetFormSummaryDocumentationRequest();
        getFormSummaryDocumentationRequest.SubMenuName = Global.DOCUMENTATION_TYPE;
        getFormSummaryDocumentationRequest.SearchText = searchText;
        getFormSummaryDocumentationRequest.IsActive = null;
        getFormSummaryDocumentationRequest.OrderBy = this.sortingDocumentationField;
        getFormSummaryDocumentationRequest.OrderByDirection = this.sortingDocumentationDirection;
        getFormSummaryDocumentationRequest.PageNumber = (pageNumber != null) ? pageNumber : this.currentPage;
        getFormSummaryDocumentationRequest.PageSize = (pageSize != null) ? pageSize : this.pageSizes[0];

        this._formSummaryDocumentationService.getFormSummaryDocumentation(getFormSummaryDocumentationRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.formSummaryDocumentations = data.Response;

                    if (this.indexDocumentation != -1 && this.formSummaryDocumentations.length > 0) {
                        this.itemDetailDocumentations.index = this.indexDocumentation;
                        this.GetDocumentationDetail(this.itemDetailDocumentations.index, this.formSummaryDocumentations[this.itemDetailDocumentations.index].FormSummaryDocumentationId, true);
                    }

                    this.pageSize = getFormSummaryDocumentationRequest.PageSize;
                    this.totalRecords = (data.Response.length != 0) ? data.Response[0].TotalRecord : 0;
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_DOCUMENTATION_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_DOCUMENTATION_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    SearchDocumentation(formData) {
        this.indexDocumentation = -1;
        this.itemDetailDocumentations.index = this.indexDocumentation;

        this.currentPage = 1;
        this.searchText = formData.value.SearchText;

        this.ReloadPage(false);
        this.GetDocumentation(this.searchText, this.currentPage, this.pageSize);
    }

    OnPageChange(pageNumber: number) {
        this.currentPage = pageNumber;
        this.ReloadPage(true);
        this.GetDocumentation(this.searchText, pageNumber, this.pageSize);
    }

    OnPageSizeChange() {
        this.currentPage = 1;
        this.pageSize = this.drpPageSize;
        this.ReloadPage(false);
        this.GetDocumentation(this.searchText, null, this.pageSize);
    }

    EditDocumentation(documentationId) {
        this.router.navigate(['/admin/secure/documentation/' + this._global.encryptValue(documentationId)], {
            queryParams: {
                indexDocumentation: this.indexDocumentation, sortingDocumentationField: this.sortingDocumentationField, sortingDocumentationDirection: this.sortingDocumentationDirection, sortingDocumentationDetailField: this.sortingDocumentationDetailField, sortingDocumentationDetailDirection: this.sortingDocumentationDetailDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    AddDocumentationDetail(documentationId, index) {
        this.router.navigate(['/admin/secure/documentationdetail/' + this._global.encryptValue(documentationId)], {
            queryParams: {
                indexDocumentation: this.indexDocumentation, sortingDocumentationField: this.sortingDocumentationField, sortingDocumentationDirection: this.sortingDocumentationDirection, sortingDocumentationDetailField: this.sortingDocumentationDetailField, sortingDocumentationDetailDirection: this.sortingDocumentationDetailDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    EditDocumentationDetail(documentationId, formSummaryDocumentationDetailId) {
        this.router.navigate(['/admin/secure/documentationdetail/' + this._global.encryptValue(documentationId) + '/' + this._global.encryptValue(formSummaryDocumentationDetailId)], {
            queryParams: {
                indexDocumentation: this.indexDocumentation, sortingDocumentationField: this.sortingDocumentationField, sortingDocumentationDirection: this.sortingDocumentationDirection, sortingDocumentationDetailField: this.sortingDocumentationDetailField, sortingDocumentationDetailDirection: this.sortingDocumentationDetailDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    ReloadPage(isPageChange) {
        if (isPageChange == true) {
            this.indexDocumentation = -1;
            this.itemDetailDocumentations.index = this.indexDocumentation;
        }

        this.router.navigate(['/admin/secure/documentations'], {
            queryParams: {
                indexDocumentation: this.indexDocumentation, sortingDocumentationField: this.sortingDocumentationField, sortingDocumentationDirection: this.sortingDocumentationDirection, sortingDocumentationDetailField: this.sortingDocumentationDetailField, sortingDocumentationDetailDirection: this.sortingDocumentationDetailDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    DeleteDocumentation(documentationId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteDocumentation = {
                "FormSummaryDocumentationId": documentationId,
                "SubMenuName": Global.DOCUMENTATION_TYPE
            };

            this._formSummaryDocumentationService.deleteFormSummaryDocumentation(deleteDocumentation)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_DOCUMENTATION_TITLE, { closeButton: true });
                        this.GetDocumentation();
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_DOCUMENTATION_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_DOCUMENTATION_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    DeleteDocumentationDetail(documentationId: number, documentationDetailId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteDocumentationDetail = {
                "FormSummaryDocumentationDetailId": documentationDetailId,
                "SubMenuName": Global.DOCUMENTATION_TYPE
            };

            this._formSummaryDocumentationDetailService.deleteFormSummaryDocumentationDetail(deleteDocumentationDetail)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_DOCUMENTATION_TITLE, { closeButton: true });
                        this.GetDocumentationDetail(this.itemDetailDocumentations.index, documentationId, true);
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_DOCUMENTATION_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_DOCUMENTATION_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    UpDownDocumentationArrow(index) {
        if (index === this.itemDetailDocumentations.index) {
            this.itemDetailDocumentations.index = null;
        } else {
            this.itemDetailDocumentations.index = index;
        }
    }

    GetDocumentationDetail(index, documentationId, isDeleted): void {
        this.spinnerService.show();

        let getFormSummaryDocumentationDetailRequest = new GetFormSummaryDocumentationDetailRequest();
        getFormSummaryDocumentationDetailRequest.FormSummaryDocumentationId = documentationId;
        getFormSummaryDocumentationDetailRequest.SubMenuName = Global.DOCUMENTATION_TYPE;
        getFormSummaryDocumentationDetailRequest.IsActive = null;
        getFormSummaryDocumentationDetailRequest.OrderBy = this.sortingDocumentationDetailField;
        getFormSummaryDocumentationDetailRequest.OrderByDirection = this.sortingDocumentationDetailDirection;
        getFormSummaryDocumentationDetailRequest.PageNumber = 1;
        getFormSummaryDocumentationDetailRequest.PageSize = 100000;

        this._formSummaryDocumentationDetailService.getFormSummaryDocumentationDetail(getFormSummaryDocumentationDetailRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.formSummaryDocumentationDetails = data.Response;

                    if (isDeleted != true) {
                        this.UpDownDocumentationArrow(index);
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_DOCUMENTATION_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_DOCUMENTATION_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    ShowDocumentationDetail(index, documentationId) {
        this.indexDocumentation = -1;

        if (this.itemDetailDocumentations.index !== index) {
            if (documentationId) {
                this.indexDocumentation = index;
                this.GetDocumentationDetail(index, documentationId, false);
            }
        } else {
            this.UpDownDocumentationArrow(index);
        }
        this.ReloadPage(false);
    }

    OnDocumentationSort(fieldName) {
        this.sortingDocumentationDirection = (this.sortingDocumentationField == fieldName) ? (this.sortingDocumentationDirection == "A") ? "D" : "A" : "A";
        this.sortingDocumentationField = fieldName;
        this.ReloadPage(true);
        this.GetDocumentation(this.searchText, this.currentPage, this.pageSize);
    }

    OnDocumentationDetailSort(formId, fieldName) {
        this.sortingDocumentationDetailDirection = (this.sortingDocumentationDetailField == fieldName) ? (this.sortingDocumentationDetailDirection == "A") ? "D" : "A" : "A";
        this.sortingDocumentationDetailField = fieldName;
        this.ReloadPage(false);
        this.GetDocumentationDetail(this.itemDetailDocumentations.index, formId, true);
    }
}