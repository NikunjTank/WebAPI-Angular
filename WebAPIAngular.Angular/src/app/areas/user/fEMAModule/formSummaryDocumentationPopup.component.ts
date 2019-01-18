import { Component, ComponentRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SpinnerService } from '../../../service/common/spinner.service';
import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { ModalDialogService, IModalDialogButton, IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { DropDown } from '../../../common/dropDown';

import { FormSummaryDocumentation, GetFormSummaryDocumentationRequest } from '../../../model/formSummaryDocumentation';
import { FormSummaryDocumentationDetail, GetFormSummaryDocumentationDetailRequest } from '../../../model/formSummaryDocumentationDetail';

import { FormSummaryDocumentationUserService } from '../../../service/user/formSummaryDocumentation.service';

@Component({
    selector: 'my-app',
    templateUrl: './formSummaryDocumentationPopup.component.html'
})

export class FormSummaryDocumentationPopupUserComponent {

    formSummaryDocumentations: DropDown[] = [];
    formSummaryDocumentationDetails: FormSummaryDocumentationDetail[] = [];

    totalRecords: number;
    currentPage: number = 1;
    pageSize: number = Global.USER_PAGE_SIZE;

    subMenuName: string = Global.FORM_TYPE;
    formSummaryDocumentationId: any = "";

    wordServerPath: string = Global.FORM_SUMMARY_DOCUMENTATION_WORD_FILEPATH;
    excelServerPath: string = Global.FORM_SUMMARY_DOCUMENTATION_EXCEL_FILEPATH;
    pdfServerPath: string = Global.FORM_SUMMARY_DOCUMENTATION_PDF_FILEPATH;

    sortingFormDetailField: string;
    sortingFormDetailDirection: string;

    moduleTab: string;

    dialogInit(refernce: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
        this.OnClickFormSummaryDocumentation('form');
    }

    constructor(private formBuilder: FormBuilder, private _spinnerService: SpinnerService, private _toastrService: ToastrService, private _formSummaryDocumentationService: FormSummaryDocumentationUserService, public sanitizer: DomSanitizer) { }

    GetFormSummaryDocumentation() {
        this._spinnerService.show();

        let getFormSummaryDocumentationRequest = new GetFormSummaryDocumentationRequest();
        getFormSummaryDocumentationRequest.SubMenuName = this.subMenuName;

        this._formSummaryDocumentationService.getFormSummaryDocumentation(getFormSummaryDocumentationRequest)
            .subscribe(data => {
                this._spinnerService.hide();
                this.formSummaryDocumentations = [];

                if (data.Status == Global.API_SUCCESS) {
                    this.formSummaryDocumentations.push({ Value: "", Text: "All Topic" });

                    data.Response.forEach(item => {
                        this.formSummaryDocumentations.push({ Value: item.FormSummaryDocumentationId, Text: item.TopicName });
                    });

                    if (data.Response.length > 0) {
                        this.GetFormSummaryDocumentationDetail(this.currentPage, this.pageSize);
                    }
                }
                else {
                    this._toastrService.error(data.Description, Global.TOASTR_ADMIN_NICCODE_TITLE, { closeButton: true });
                }
            },
                error => {
                    this._spinnerService.hide();
                    this._toastrService.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_NICCODE_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    OnPageChange(pageNumber: number) {
        this.currentPage = pageNumber;
        this.GetFormSummaryDocumentationDetail(pageNumber, this.pageSize);
    }

    OnPageSizeChange() {
        this.currentPage = 1;
        this.GetFormSummaryDocumentationDetail(null, this.pageSize);
    }

    GetFormSummaryDocumentationDetail(pageNumber?: number, pageSize?: number): void {
        this._spinnerService.show();

        let getFormSummaryDocumentationDetailRequest = new GetFormSummaryDocumentationDetailRequest();
        getFormSummaryDocumentationDetailRequest.FormSummaryDocumentationId = this.formSummaryDocumentationId;
        getFormSummaryDocumentationDetailRequest.SubMenuName = this.subMenuName;
        getFormSummaryDocumentationDetailRequest.IsActive = null;
        getFormSummaryDocumentationDetailRequest.OrderBy = this.sortingFormDetailField;
        getFormSummaryDocumentationDetailRequest.OrderByDirection = this.sortingFormDetailDirection;
        getFormSummaryDocumentationDetailRequest.PageNumber = (pageNumber != null) ? pageNumber : this.currentPage;
        getFormSummaryDocumentationDetailRequest.PageSize = pageSize;

        this._formSummaryDocumentationService.getFormSummaryDocumentationDetail(getFormSummaryDocumentationDetailRequest)
            .subscribe(data => {
                this._spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.formSummaryDocumentationDetails = data.Response;
                    this.totalRecords = (data.Response.length != 0) ? data.Response[0].TotalRecord : 0;
                } else {
                    this._toastrService.error(data.Description, Global.TOASTR_ADMIN_FORM_TITLE, { closeButton: true });
                }
            },
                error => {
                    this._spinnerService.hide();
                    this._toastrService.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FORM_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    OnChangeTopic(formSummaryDocumentationId) {
        this.currentPage = 1;
        this.formSummaryDocumentationId = formSummaryDocumentationId;
        this.GetFormSummaryDocumentationDetail(this.currentPage, this.pageSize);
    }

    OnFormSummaryDocumentationDetailSort(fieldName) {
        this.sortingFormDetailDirection = (this.sortingFormDetailField == fieldName) ? (this.sortingFormDetailDirection == "A") ? "D" : "A" : "A";
        this.sortingFormDetailField = fieldName;

        this.GetFormSummaryDocumentationDetail(this.currentPage, this.pageSize);
    }

    OnClickFormSummaryDocumentation(moduleTab) {
        this.moduleTab = moduleTab;
        this.currentPage = 1;
        this.sortingFormDetailField = "";
        this.sortingFormDetailDirection = "";

        if (moduleTab == "form") {
            this.subMenuName = Global.FORM_TYPE;
        } else if (moduleTab == "summary") {
            this.subMenuName = Global.SUMMARY_TYPE;
        } else if (moduleTab == "documentation") {
            this.subMenuName = Global.DOCUMENTATION_TYPE;
        }

        this.GetFormSummaryDocumentation();
    }

}