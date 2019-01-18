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
    templateUrl: './forms.component.html'
})

export class FormsAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private _formSummaryDocumentationService: FormSummaryDocumentationAdminService, private _formSummaryDocumentationDetailService: FormSummaryDocumentationDetailAdminService, private toastr: ToastrService, private vcr: ViewContainerRef, private spinnerService: SpinnerService, private router: Router) { }

    _global: Global = new Global();

    formSummaryDocumentations: FormSummaryDocumentation[];
    formSummaryDocumentationDetails: FormSummaryDocumentationDetail[];

    frmForm: FormGroup;

    searchText: string;
    totalRecords: number;
    currentPage: number;
    pageSize: number;
    pageSizes: number[];

    drpPageSize: number;

    wordServerPath: string = Global.FORM_SUMMARY_DOCUMENTATION_WORD_FILEPATH;
    excelServerPath: string = Global.FORM_SUMMARY_DOCUMENTATION_EXCEL_FILEPATH;
    pdfServerPath: string = Global.FORM_SUMMARY_DOCUMENTATION_PDF_FILEPATH;

    itemDetailForms = { index: -1 };
    indexForm: number = -1;

    sortingFormField: string;
    sortingFormDirection: string;

    sortingFormDetailField: string;
    sortingFormDetailDirection: string;

    ngOnInit(): void {
        this.pageSizes = Global.PAGE_SIZES;

        this.activatedRoute.queryParams.subscribe(params => {
            this.indexForm = (params["indexForm"]) ? parseInt(params["indexForm"]) : -1;

            this.sortingFormField = params["sortingFormField"];
            this.sortingFormDirection = params["sortingFormDirection"];
            this.sortingFormDetailField = params["sortingFormDetailField"];
            this.sortingFormDetailDirection = params["sortingFormDetailDirection"];

            this.searchText = (params["searchText"]) ? params["searchText"] : null;
            this.currentPage = (params["pageNumber"]) ? parseInt(params["pageNumber"]) : 1;
            this.pageSize = (params["pageSize"]) ? parseInt(params["pageSize"]) : this.pageSizes[0];
            this.drpPageSize = this.pageSize;
        });


        this.frmForm = this.formBuilder.group({
            SearchText: [this.searchText]
        });

        this.GetForm(this.searchText, this.currentPage, this.pageSizes[0]);
    }

    GetForm(searchText?: string, pageNumber?: number, pageSize?: number): void {
        this.spinnerService.show();

        let getFormSummaryDocumentationRequest = new GetFormSummaryDocumentationRequest();
        getFormSummaryDocumentationRequest.SubMenuName = Global.FORM_TYPE;
        getFormSummaryDocumentationRequest.SearchText = searchText;
        getFormSummaryDocumentationRequest.IsActive = null;
        getFormSummaryDocumentationRequest.OrderBy = this.sortingFormField;
        getFormSummaryDocumentationRequest.OrderByDirection = this.sortingFormDirection;
        getFormSummaryDocumentationRequest.PageNumber = (pageNumber != null) ? pageNumber : this.currentPage;
        getFormSummaryDocumentationRequest.PageSize = (pageSize != null) ? pageSize : this.pageSizes[0];

        this._formSummaryDocumentationService.getFormSummaryDocumentation(getFormSummaryDocumentationRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.formSummaryDocumentations = data.Response;

                    if (this.indexForm != -1 && this.formSummaryDocumentations.length > 0) {
                        this.itemDetailForms.index = this.indexForm;
                        this.GetFormDetail(this.itemDetailForms.index, this.formSummaryDocumentations[this.itemDetailForms.index].FormSummaryDocumentationId, true);
                    }

                    this.pageSize = getFormSummaryDocumentationRequest.PageSize;
                    this.totalRecords = (data.Response.length != 0) ? data.Response[0].TotalRecord : 0;
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_FORM_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FORM_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    SearchForm(formData) {
        this.indexForm = -1;
        this.itemDetailForms.index = this.indexForm;

        this.currentPage = 1;
        this.searchText = formData.value.SearchText;

        this.ReloadPage(false);
        this.GetForm(this.searchText, this.currentPage, this.pageSize);
    }

    OnPageChange(pageNumber: number) {
        this.currentPage = pageNumber;
        this.ReloadPage(true);
        this.GetForm(this.searchText, pageNumber, this.pageSize);
    }

    OnPageSizeChange() {
        this.currentPage = 1;
        this.pageSize = this.drpPageSize;
        this.ReloadPage(false);
        this.GetForm(this.searchText, null, this.pageSize);
    }

    EditForm(formId) {
        this.router.navigate(['/admin/secure/form/' + this._global.encryptValue(formId)], {
            queryParams: {
                indexForm: this.indexForm, sortingFormField: this.sortingFormField, sortingFormDirection: this.sortingFormDirection, sortingFormDetailField: this.sortingFormDetailField, sortingFormDetailDirection: this.sortingFormDetailDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    AddFormDetail(formId, index) {
        this.router.navigate(['/admin/secure/formdetail/' + this._global.encryptValue(formId)], {
            queryParams: {
                indexForm: this.indexForm, sortingFormField: this.sortingFormField, sortingFormDirection: this.sortingFormDirection, sortingFormDetailField: this.sortingFormDetailField, sortingFormDetailDirection: this.sortingFormDetailDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    EditFormDetail(formId, formSummaryDocumentationDetailId) {
        this.router.navigate(['/admin/secure/formdetail/' + this._global.encryptValue(formId) + '/' + this._global.encryptValue(formSummaryDocumentationDetailId)], {
            queryParams: {
                indexForm: this.indexForm, sortingFormField: this.sortingFormField, sortingFormDirection: this.sortingFormDirection, sortingFormDetailField: this.sortingFormDetailField, sortingFormDetailDirection: this.sortingFormDetailDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    ReloadPage(isPageChange) {
        if (isPageChange == true) {
            this.indexForm = -1;
            this.itemDetailForms.index = this.indexForm;
        }

        this.router.navigate(['/admin/secure/forms'], {
            queryParams: {
                indexForm: this.indexForm, sortingFormField: this.sortingFormField, sortingFormDirection: this.sortingFormDirection, sortingFormDetailField: this.sortingFormDetailField, sortingFormDetailDirection: this.sortingFormDetailDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    DeleteForm(formId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteForm = {
                "FormSummaryDocumentationId": formId,
                "SubMenuName": Global.FORM_TYPE
            };

            this._formSummaryDocumentationService.deleteFormSummaryDocumentation(deleteForm)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_FORM_TITLE, { closeButton: true });
                        this.GetForm();
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_FORM_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FORM_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    DeleteFormDetail(formId: number, formDetailId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteFormDetail = {
                "FormSummaryDocumentationDetailId": formDetailId,
                "SubMenuName": Global.FORM_TYPE
            };

            this._formSummaryDocumentationDetailService.deleteFormSummaryDocumentationDetail(deleteFormDetail)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_FORM_TITLE, { closeButton: true });
                        this.GetFormDetail(this.itemDetailForms.index, formId, true);
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_FORM_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FORM_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    UpDownFormArrow(index) {
        if (index === this.itemDetailForms.index) {
            this.itemDetailForms.index = null;
        } else {
            this.itemDetailForms.index = index;
        }
    }

    GetFormDetail(index, formId, isDeleted): void {
        this.spinnerService.show();

        let getFormSummaryDocumentationDetailRequest = new GetFormSummaryDocumentationDetailRequest();
        getFormSummaryDocumentationDetailRequest.FormSummaryDocumentationId = formId;
        getFormSummaryDocumentationDetailRequest.SubMenuName = Global.FORM_TYPE;
        getFormSummaryDocumentationDetailRequest.IsActive = null;
        getFormSummaryDocumentationDetailRequest.OrderBy = this.sortingFormDetailField;
        getFormSummaryDocumentationDetailRequest.OrderByDirection = this.sortingFormDetailDirection;
        getFormSummaryDocumentationDetailRequest.PageNumber = 1;
        getFormSummaryDocumentationDetailRequest.PageSize = 100000;

        this._formSummaryDocumentationDetailService.getFormSummaryDocumentationDetail(getFormSummaryDocumentationDetailRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.formSummaryDocumentationDetails = data.Response;

                    if (isDeleted != true) {
                        this.UpDownFormArrow(index);
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_FORM_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FORM_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    ShowFormDetail(index, formId) {
        this.indexForm = -1;

        if (this.itemDetailForms.index !== index) {
            if (formId) {
                this.indexForm = index;
                this.GetFormDetail(index, formId, false);
            }
        } else {
            this.UpDownFormArrow(index);
        }
        this.ReloadPage(false);
    }

    OnFormSort(fieldName) {
        this.sortingFormDirection = (this.sortingFormField == fieldName) ? (this.sortingFormDirection == "A") ? "D" : "A" : "A";
        this.sortingFormField = fieldName;
        this.ReloadPage(true);
        this.GetForm(this.searchText, this.currentPage, this.pageSize);
    }

    OnFormDetailSort(formId, fieldName) {
        this.sortingFormDetailDirection = (this.sortingFormDetailField == fieldName) ? (this.sortingFormDetailDirection == "A") ? "D" : "A" : "A";
        this.sortingFormDetailField = fieldName;
        this.ReloadPage(false);
        this.GetFormDetail(this.itemDetailForms.index, formId, true);
    }
}