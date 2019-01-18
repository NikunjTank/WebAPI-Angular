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
    templateUrl: './summaries.component.html'
})

export class SummariesAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private _formSummaryDocumentationService: FormSummaryDocumentationAdminService, private _formSummaryDocumentationDetailService: FormSummaryDocumentationDetailAdminService, private toastr: ToastrService, private vcr: ViewContainerRef, private spinnerService: SpinnerService, private router: Router) { }

    _global: Global = new Global();

    formSummaryDocumentations: FormSummaryDocumentation[];
    formSummaryDocumentationDetails: FormSummaryDocumentationDetail[];

    frmSummary: FormGroup;

    searchText: string;
    totalRecords: number;
    currentPage: number;
    pageSize: number;
    pageSizes: number[];

    drpPageSize: number;

    wordServerPath: string = Global.FORM_SUMMARY_DOCUMENTATION_WORD_FILEPATH;
    excelServerPath: string = Global.FORM_SUMMARY_DOCUMENTATION_EXCEL_FILEPATH;
    pdfServerPath: string = Global.FORM_SUMMARY_DOCUMENTATION_PDF_FILEPATH;

    itemDetailSummaries = { index: -1 };
    indexSummary: number = -1;

    sortingSummaryField: string;
    sortingSummaryDirection: string;

    sortingSummaryDetailField: string;
    sortingSummaryDetailDirection: string;

    ngOnInit(): void {
        this.pageSizes = Global.PAGE_SIZES;

        this.activatedRoute.queryParams.subscribe(params => {
            this.indexSummary = (params["indexSummary"]) ? parseInt(params["indexSummary"]) : -1;

            this.sortingSummaryField = params["sortingSummaryField"];
            this.sortingSummaryDirection = params["sortingSummaryDirection"];
            this.sortingSummaryDetailField = params["sortingSummaryDetailField"];
            this.sortingSummaryDetailDirection = params["sortingSummaryDetailDirection"];

            this.searchText = (params["searchText"]) ? params["searchText"] : null;
            this.currentPage = (params["pageNumber"]) ? parseInt(params["pageNumber"]) : 1;
            this.pageSize = (params["pageSize"]) ? parseInt(params["pageSize"]) : this.pageSizes[0];
            this.drpPageSize = this.pageSize;
        });


        this.frmSummary = this.formBuilder.group({
            SearchText: [this.searchText]
        });

        this.GetSummary(this.searchText, this.currentPage, this.pageSizes[0]);
    }

    GetSummary(searchText?: string, pageNumber?: number, pageSize?: number): void {
        this.spinnerService.show();

        let getFormSummaryDocumentationRequest = new GetFormSummaryDocumentationRequest();
        getFormSummaryDocumentationRequest.SubMenuName = Global.SUMMARY_TYPE;
        getFormSummaryDocumentationRequest.SearchText = searchText;
        getFormSummaryDocumentationRequest.IsActive = null;
        getFormSummaryDocumentationRequest.OrderBy = this.sortingSummaryField;
        getFormSummaryDocumentationRequest.OrderByDirection = this.sortingSummaryDirection;
        getFormSummaryDocumentationRequest.PageNumber = (pageNumber != null) ? pageNumber : this.currentPage;
        getFormSummaryDocumentationRequest.PageSize = (pageSize != null) ? pageSize : this.pageSizes[0];

        this._formSummaryDocumentationService.getFormSummaryDocumentation(getFormSummaryDocumentationRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.formSummaryDocumentations = data.Response;

                    if (this.indexSummary != -1 && this.formSummaryDocumentations.length > 0) {
                        this.itemDetailSummaries.index = this.indexSummary;
                        this.GetSummaryDetail(this.itemDetailSummaries.index, this.formSummaryDocumentations[this.itemDetailSummaries.index].FormSummaryDocumentationId, true);
                    }

                    this.pageSize = getFormSummaryDocumentationRequest.PageSize;
                    this.totalRecords = (data.Response.length != 0) ? data.Response[0].TotalRecord : 0;
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_SUMMARY_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_SUMMARY_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    SearchSummary(formData) {
        this.indexSummary = -1;
        this.itemDetailSummaries.index = this.indexSummary;

        this.currentPage = 1;
        this.searchText = formData.value.SearchText;

        this.ReloadPage(false);
        this.GetSummary(this.searchText, this.currentPage, this.pageSize);
    }

    OnPageChange(pageNumber: number) {
        this.currentPage = pageNumber;
        this.ReloadPage(true);
        this.GetSummary(this.searchText, pageNumber, this.pageSize);
    }

    OnPageSizeChange() {
        this.currentPage = 1;
        this.pageSize = this.drpPageSize;
        this.ReloadPage(false);
        this.GetSummary(this.searchText, null, this.pageSize);
    }

    EditSummary(summaryId) {
        this.router.navigate(['/admin/secure/summary/' + this._global.encryptValue(summaryId)], {
            queryParams: {
                indexSummary: this.indexSummary, sortingSummaryField: this.sortingSummaryField, sortingSummaryDirection: this.sortingSummaryDirection, sortingSummaryDetailField: this.sortingSummaryDetailField, sortingSummaryDetailDirection: this.sortingSummaryDetailDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    AddSummaryDetail(summaryId, index) {
        this.router.navigate(['/admin/secure/summarydetail/' + this._global.encryptValue(summaryId)], {
            queryParams: {
                indexSummary: this.indexSummary, sortingSummaryField: this.sortingSummaryField, sortingSummaryDirection: this.sortingSummaryDirection, sortingSummaryDetailField: this.sortingSummaryDetailField, sortingSummaryDetailDirection: this.sortingSummaryDetailDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    EditSummaryDetail(summaryId, formSummaryDocumentationDetailId) {
        this.router.navigate(['/admin/secure/summarydetail/' + this._global.encryptValue(summaryId) + '/' + this._global.encryptValue(formSummaryDocumentationDetailId)], {
            queryParams: {
                indexSummary: this.indexSummary, sortingSummaryField: this.sortingSummaryField, sortingSummaryDirection: this.sortingSummaryDirection, sortingSummaryDetailField: this.sortingSummaryDetailField, sortingSummaryDetailDirection: this.sortingSummaryDetailDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    ReloadPage(isPageChange) {
        if (isPageChange == true) {
            this.indexSummary = -1;
            this.itemDetailSummaries.index = this.indexSummary;
        }

        this.router.navigate(['/admin/secure/summaries'], {
            queryParams: {
                indexSummary: this.indexSummary, sortingSummaryField: this.sortingSummaryField, sortingSummaryDirection: this.sortingSummaryDirection, sortingSummaryDetailField: this.sortingSummaryDetailField, sortingSummaryDetailDirection: this.sortingSummaryDetailDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    DeleteSummary(summaryId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteSummary = {
                "FormSummaryDocumentationId": summaryId,
                "SubMenuName": Global.SUMMARY_TYPE
            };

            this._formSummaryDocumentationService.deleteFormSummaryDocumentation(deleteSummary)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_SUMMARY_TITLE, { closeButton: true });
                        this.GetSummary();
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_SUMMARY_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_SUMMARY_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    DeleteSummaryDetail(summaryId: number, summaryDetailId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteFormDetail = {
                "FormSummaryDocumentationDetailId": summaryDetailId,
                "SubMenuName": Global.SUMMARY_TYPE
            };

            this._formSummaryDocumentationDetailService.deleteFormSummaryDocumentationDetail(deleteFormDetail)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_SUMMARY_TITLE, { closeButton: true });
                        this.GetSummaryDetail(this.itemDetailSummaries.index, summaryId, true);
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_SUMMARY_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_SUMMARY_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    UpDownSummaryArrow(index) {
        if (index === this.itemDetailSummaries.index) {
            this.itemDetailSummaries.index = null;
        } else {
            this.itemDetailSummaries.index = index;
        }
    }

    GetSummaryDetail(index, summaryId, isDeleted): void {
        this.spinnerService.show();

        let getFormSummaryDocumentationDetailRequest = new GetFormSummaryDocumentationDetailRequest();
        getFormSummaryDocumentationDetailRequest.FormSummaryDocumentationId = summaryId;
        getFormSummaryDocumentationDetailRequest.SubMenuName = Global.SUMMARY_TYPE;
        getFormSummaryDocumentationDetailRequest.IsActive = null;
        getFormSummaryDocumentationDetailRequest.OrderBy = this.sortingSummaryDetailField;
        getFormSummaryDocumentationDetailRequest.OrderByDirection = this.sortingSummaryDetailDirection;
        getFormSummaryDocumentationDetailRequest.PageNumber = 1;
        getFormSummaryDocumentationDetailRequest.PageSize = 100000;

        this._formSummaryDocumentationDetailService.getFormSummaryDocumentationDetail(getFormSummaryDocumentationDetailRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.formSummaryDocumentationDetails = data.Response;

                    if (isDeleted != true) {
                        this.UpDownSummaryArrow(index);
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_SUMMARY_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_SUMMARY_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    ShowSummaryDetail(index, summaryId) {
        this.indexSummary = -1;

        if (this.itemDetailSummaries.index !== index) {
            if (summaryId) {
                this.indexSummary = index;
                this.GetSummaryDetail(index, summaryId, false);
            }
        } else {
            this.UpDownSummaryArrow(index);
        }
        this.ReloadPage(false);
    }

    OnSummarySort(fieldName) {
        this.sortingSummaryDirection = (this.sortingSummaryField == fieldName) ? (this.sortingSummaryDirection == "A") ? "D" : "A" : "A";
        this.sortingSummaryField = fieldName;
        this.ReloadPage(true);
        this.GetSummary(this.searchText, this.currentPage, this.pageSize);
    }

    OnSummaryDetailSort(summaryId, fieldName) {
        this.sortingSummaryDetailDirection = (this.sortingSummaryDetailField == fieldName) ? (this.sortingSummaryDetailDirection == "A") ? "D" : "A" : "A";
        this.sortingSummaryDetailField = fieldName;
        this.ReloadPage(false);
        this.GetSummaryDetail(this.itemDetailSummaries.index, summaryId, true);
    }
}