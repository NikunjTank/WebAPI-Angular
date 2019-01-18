import { Component, ComponentRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SpinnerService } from '../../../service/common/spinner.service';
import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { ModalDialogService, IModalDialogButton, IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';

import { FetersCode, GetFetersCodeRequest } from '../../../model/fetersCode';
import { FetersCodeDetail, GetFetersCodeDetailRequest } from '../../../model/fetersCodeDetail';
import { FetersCodeGroupDetail, GetFetersCodeGroupDetailRequest } from '../../../model/fetersCodeGroupDetail';

import { FetersCodeUserService } from '../../../service/user/fetersCode.service';

@Component({
    selector: 'my-app',
    templateUrl: './fetersCodePopup.component.html'
})

export class FetersCodePopupUserComponent {

    fetersCodes: FetersCode[] = [];
    fetersCodePDFServerPath: string = Global.FETERSCODE_PDF_FILEPATH;
    fetersCodePDFUrl: any;

    _global: Global = new Global();

    //fetersCodeDetails: FetersCodeDetail[] = [];
    //fetersCodeGroupDetails: FetersCodeGroupDetail[] = [];

    //frmGroupFetersCodeDetail: FormGroup;
    //frmLRSFetersCodeDetail: FormGroup;
    //searchText: string;
    //totalRecords: number;
    //currentPage: number = 1;
    //pageSize: number = Global.USER_PAGE_SIZE;

    //indexFetersCodeDetail: number = -1;
    //itemDetailFetersCodeDetails = { index: -1 };

    //sortingFetersCodeDetailField: string;
    //sortingFetersCodeDetailDirection: string;

    //sortingFetersCodeGroupDetailField: string;
    //sortingFetersCodeGroupDetailDirection: string;

    moduleTab: string;

    dialogInit(refernce: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
        //this.frmGroupFetersCodeDetail = this.formBuilder.group({
        //    SearchText: [this.searchText]
        //});

        //this.frmLRSFetersCodeDetail = this.formBuilder.group({
        //    SearchText: [this.searchText]
        //});

        this.GetFetersCode();
    }

    constructor(private formBuilder: FormBuilder, private _spinnerService: SpinnerService, private _toastrService: ToastrService, private _fetersCodeService: FetersCodeUserService, public sanitizer: DomSanitizer) {

    }

    GetFetersCode() {
        this._spinnerService.show();

        let getFetersCodeRequest = new GetFetersCodeRequest();

        this._fetersCodeService.getFetersCode(getFetersCodeRequest)
            .subscribe(data => {
                this._spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.fetersCodes = data.Response;

                    if (data.Response.length > 0) {
                        this.OnClickFetersCode(data.Response[0].FetersCodeId)
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

    //SearchFetersCodeDetail(formData) {
    //    this.indexFetersCodeDetail = -1;
    //    this.itemDetailFetersCodeDetails.index = this.indexFetersCodeDetail;

    //    this.currentPage = 1;
    //    this.searchText = formData.value.SearchText;

    //    this.GetFetersCodeDetail(this.searchText, this.currentPage, this.pageSize);
    //}

    //OnPageChange(pageNumber: number) {
    //    this.currentPage = pageNumber;

    //    this.indexFetersCodeDetail = -1;
    //    this.itemDetailFetersCodeDetails.index = this.indexFetersCodeDetail;

    //    this.GetFetersCodeDetail(this.searchText, pageNumber, this.pageSize);
    //}

    //OnPageSizeChange() {
    //    this.currentPage = 1;

    //    this.GetFetersCodeDetail(this.searchText, null, this.pageSize);
    //}

    OnClickFetersCode(fetersCodeId) {
        this.moduleTab = fetersCodeId;
        this.fetersCodePDFUrl = "";
        //this.indexFetersCodeDetail = -1;
        //this.itemDetailFetersCodeDetails.index = this.indexFetersCodeDetail;

        //this.currentPage = 1;
        //this.searchText = "";
        //this.sortingFetersCodeDetailField = "";
        //this.sortingFetersCodeDetailDirection = "";
        //this.sortingFetersCodeGroupDetailField = "";
        //this.sortingFetersCodeGroupDetailDirection = "";

        let fetersCode = this.fetersCodes.filter(x => x.FetersCodeId == fetersCodeId)[0];
        this.fetersCodePDFUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this._global.getPDFPath(this.fetersCodePDFServerPath + fetersCode.PDF));

        let interval = setInterval(function () {
            let minusHeight = (document.querySelector('body').clientWidth > 766) ? 140 : (document.querySelector('body').clientWidth > 480) ? 200 : (document.querySelector('body').clientWidth > 388) ? 170 : 225;

            document.getElementById(fetersCode.FetersCodeName).style.height = (document.querySelector('.modal-body').clientHeight - minusHeight) + "px";
            clearInterval(interval);
        }, 100);
        //if (fetersCode)
        //    this.GetFetersCodeDetail(this.searchText, this.currentPage, this.pageSize);

    }

    //UpDownFetersCodeDetailArrow(index) {
    //    if (index === this.itemDetailFetersCodeDetails.index) {
    //        this.itemDetailFetersCodeDetails.index = null;
    //    } else {
    //        this.itemDetailFetersCodeDetails.index = index;
    //    }
    //}

    //GetFetersCodeDetail(searchText?: string, pageNumber?: number, pageSize?: number): void {
    //    this._spinnerService.show();

    //    let getFetersCodeDetailRequest = new GetFetersCodeDetailRequest();
    //    getFetersCodeDetailRequest.FetersCodeId = parseInt(this.moduleTab);
    //    getFetersCodeDetailRequest.SearchText = searchText;
    //    getFetersCodeDetailRequest.IsActive = null;
    //    getFetersCodeDetailRequest.OrderBy = this.sortingFetersCodeDetailField;
    //    getFetersCodeDetailRequest.OrderByDirection = this.sortingFetersCodeDetailDirection;
    //    getFetersCodeDetailRequest.PageNumber = (pageNumber != null) ? pageNumber : this.currentPage;
    //    getFetersCodeDetailRequest.PageSize = pageSize;

    //    this._fetersCodeService.getFetersCodeDetail(getFetersCodeDetailRequest)
    //        .subscribe(data => {
    //            this._spinnerService.hide();

    //            if (data.Status == Global.API_SUCCESS) {
    //                this.fetersCodeDetails = data.Response;
    //                this.totalRecords = (data.Response.length != 0) ? data.Response[0].TotalRecord : 0;
    //            } else {
    //                this._toastrService.error(data.Description, Global.TOASTR_ADMIN_FETERSCODE_TITLE, { closeButton: true });
    //            }
    //        },
    //            error => {
    //                this._spinnerService.hide();
    //                this._toastrService.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FETERSCODE_TITLE, { enableHtml: true, closeButton: true });
    //            });
    //}

    //GetFetersCodeGroupDetail(index, fetersCodeDetailId, isDeleted): void {
    //    this._spinnerService.show();

    //    let getFetersCodeGroupDetailRequest = new GetFetersCodeGroupDetailRequest();
    //    getFetersCodeGroupDetailRequest.FetersCodeDetailId = fetersCodeDetailId;
    //    getFetersCodeGroupDetailRequest.IsActive = null;
    //    getFetersCodeGroupDetailRequest.OrderBy = this.sortingFetersCodeGroupDetailField;
    //    getFetersCodeGroupDetailRequest.OrderByDirection = this.sortingFetersCodeGroupDetailDirection;
    //    getFetersCodeGroupDetailRequest.PageNumber = 1;
    //    getFetersCodeGroupDetailRequest.PageSize = 100000;

    //    this._fetersCodeService.getFetersCodeGroupDetail(getFetersCodeGroupDetailRequest)
    //        .subscribe(data => {
    //            this._spinnerService.hide();

    //            if (data.Status == Global.API_SUCCESS) {
    //                this.fetersCodeGroupDetails = data.Response;

    //                if (isDeleted != true) {
    //                    if (this.fetersCodeGroupDetails.length > 0)
    //                        this.UpDownFetersCodeDetailArrow(index);
    //                    else
    //                        this.itemDetailFetersCodeDetails.index = null;
    //                }
    //            } else {
    //                this._toastrService.error(data.Description, Global.TOASTR_ADMIN_FETERSCODE_TITLE, { closeButton: true });
    //            }
    //        },
    //            error => {
    //                this._spinnerService.hide();
    //                this._toastrService.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FETERSCODE_TITLE, { enableHtml: true, closeButton: true });
    //            });
    //}

    //ShowFetersCodeGroupDetail(index, fetersCodeDetailId) {
    //    this.indexFetersCodeDetail = -1;

    //    if (this.itemDetailFetersCodeDetails.index !== index) {
    //        if (fetersCodeDetailId) {
    //            this.indexFetersCodeDetail = index;
    //            this.GetFetersCodeGroupDetail(index, fetersCodeDetailId, false);
    //        }
    //    }
    //}

    //OnFetersCodeDetailSort(fetersCodeId, fieldName) {
    //    this.indexFetersCodeDetail = -1;
    //    this.itemDetailFetersCodeDetails.index = this.indexFetersCodeDetail;

    //    this.sortingFetersCodeDetailDirection = (this.sortingFetersCodeDetailField == fieldName) ? (this.sortingFetersCodeDetailDirection == "A") ? "D" : "A" : "A";
    //    this.sortingFetersCodeDetailField = fieldName;

    //    this.GetFetersCodeDetail(this.searchText, this.currentPage, this.pageSize);
    //}

    //OnFetersCodeGroupDetailSort(fetersCodeDetailId, fieldName) {
    //    this.sortingFetersCodeGroupDetailDirection = (this.sortingFetersCodeGroupDetailField == fieldName) ? (this.sortingFetersCodeGroupDetailDirection == "A") ? "D" : "A" : "A";
    //    this.sortingFetersCodeGroupDetailField = fieldName;
    //    this.GetFetersCodeGroupDetail(this.itemDetailFetersCodeDetails.index, fetersCodeDetailId, true);
    //}
}