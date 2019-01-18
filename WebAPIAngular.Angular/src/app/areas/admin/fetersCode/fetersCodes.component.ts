import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FetersCode, GetFetersCodeRequest } from '../../../model/fetersCode';
import { FetersCodeDetail, GetFetersCodeDetailRequest } from '../../../model/fetersCodeDetail';
import { FetersCodeGroupDetail, GetFetersCodeGroupDetailRequest } from '../../../model/fetersCodeGroupDetail';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';
import { FetersCodeAdminService } from '../../../service/admin/fetersCode.service';
import { FetersCodeDetailAdminService } from '../../../service/admin/fetersCodeDetail.service';
import { FetersCodeGroupDetailAdminService } from '../../../service/admin/fetersCodeGroupDetail.service';


@Component({
    selector: 'my-app',
    templateUrl: './fetersCodes.component.html'
})

export class FetersCodesAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private _fetersCodeService: FetersCodeAdminService, private _fetersCodeDetailService: FetersCodeDetailAdminService, private _fetersCodeGroupDetailService: FetersCodeGroupDetailAdminService, private toastr: ToastrService, private vcr: ViewContainerRef, private spinnerService: SpinnerService, private router: Router) { }

    _global: Global = new Global();

    fetersCodes: FetersCode[];
    fetersCode: FetersCode;

    fetersCodeDetails: FetersCodeDetail[];
    fetersCodeGroupDetails: FetersCodeGroupDetail[];

    fetersCodeId: number;
    fetersCodeDetailId: number;

    frmFetersCode: FormGroup;
    searchText: string;
    totalRecords: number;
    currentPage: number;
    pageSize: number;
    pageSizes: number[];

    pdfServerPath: string = Global.FETERSCODE_PDF_FILEPATH;

    itemDetailFetersCodes = { index: -1 };
    itemDetailFetersCodeDetails = { index: -1 };

    indexFetersCode: number = -1;
    indexFetersCodeDetail: number = -1;

    drpPageSize: number;

    sortingFetersCodeField: string;
    sortingFetersCodeDirection: string;

    sortingFetersCodeDetailField: string;
    sortingFetersCodeDetailDirection: string;

    sortingFetersCodeGroupDetailField: string;
    sortingFetersCodeGroupDetailDirection: string;

    ngOnInit(): void {
        this.pageSizes = Global.PAGE_SIZES;

        this.activatedRoute.queryParams.subscribe(params => {
            this.indexFetersCode = (params["indexFetersCode"]) ? parseInt(params["indexFetersCode"]) : -1;
            this.indexFetersCodeDetail = (params["indexFetersCodeDetail"]) ? parseInt(params["indexFetersCodeDetail"]) : -1;

            this.searchText = (params["searchText"]) ? params["searchText"] : null;
            this.currentPage = (params["pageNumber"]) ? parseInt(params["pageNumber"]) : 1;
            this.pageSize = (params["pageSize"]) ? parseInt(params["pageSize"]) : this.pageSizes[0];
            this.drpPageSize = this.pageSize;

            this.sortingFetersCodeField = params["sortingFetersCodeField"];
            this.sortingFetersCodeDirection = params["sortingFetersCodeDirection"];
            this.sortingFetersCodeDetailField = params["sortingFetersCodeDetailField"];
            this.sortingFetersCodeDetailDirection = params["sortingFetersCodeDetailDirection"];
            this.sortingFetersCodeGroupDetailField = params["sortingFetersCodeGroupDetailField"];
            this.sortingFetersCodeGroupDetailDirection = params["sortingFetersCodeGroupDetailDirection"];
        });


        this.frmFetersCode = this.formBuilder.group({
            SearchText: [this.searchText]
        });

        this.GetFetersCode(this.searchText, this.currentPage, this.pageSizes[0]);
    }

    GetFetersCode(searchText?: string, pageNumber?: number, pageSize?: number): void {
        this.spinnerService.show();

        let getFetersCodeRequest = new GetFetersCodeRequest();
        getFetersCodeRequest.SearchText = searchText;
        getFetersCodeRequest.IsActive = null;
        getFetersCodeRequest.OrderBy = this.sortingFetersCodeField;
        getFetersCodeRequest.OrderByDirection = this.sortingFetersCodeDirection;
        getFetersCodeRequest.PageNumber = (pageNumber != null) ? pageNumber : this.currentPage;
        getFetersCodeRequest.PageSize = (pageSize != null) ? pageSize : this.pageSizes[0];

        this._fetersCodeService.getFetersCode(getFetersCodeRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.fetersCodes = data.Response;

                    if (this.indexFetersCode != -1 && this.fetersCodes.length > 0) {
                        this.itemDetailFetersCodes.index = this.indexFetersCode;
                        this.GetFetersCodeDetail(this.itemDetailFetersCodes.index, this.fetersCodes[this.itemDetailFetersCodes.index].FetersCodeId, true);
                    }

                    this.pageSize = getFetersCodeRequest.PageSize;
                    this.totalRecords = (data.Response.length != 0) ? data.Response[0].TotalRecord : 0;
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_FETERSCODE_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FETERSCODE_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    SearchFetersCode(formData) {
        this.indexFetersCode = -1;
        this.itemDetailFetersCodes.index = this.indexFetersCode;

        this.currentPage = 1;
        this.searchText = formData.value.SearchText;

        this.ReloadPage(false);
        this.GetFetersCode(this.searchText, this.currentPage, this.pageSize);
    }

    OnPageChange(pageNumber: number) {
        this.currentPage = pageNumber;
        this.ReloadPage(true);
        this.GetFetersCode(this.searchText, pageNumber, this.pageSize);
    }

    OnPageSizeChange() {
        this.currentPage = 1;
        this.pageSize = this.drpPageSize;
        this.ReloadPage(false);
        this.GetFetersCode(this.searchText, null, this.pageSize);
    }

    EditFetersCode(fetersCodeId) {
        this.router.navigate(['/admin/secure/feterscode/' + this._global.encryptValue(fetersCodeId)], {
            queryParams: {
                indexFetersCode: this.indexFetersCode, indexFetersCodeDetail: this.indexFetersCodeDetail, sortingFetersCodeField: this.sortingFetersCodeField, sortingFetersCodeDirection: this.sortingFetersCodeDirection, sortingFetersCodeDetailField: this.sortingFetersCodeDetailField, sortingFetersCodeDetailDirection: this.sortingFetersCodeDetailDirection, sortingFetersCodeGroupDetailField: this.sortingFetersCodeGroupDetailField, sortingFetersCodeGroupDetailDirection: this.sortingFetersCodeGroupDetailDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    AddFetersCodeDetail(fetersCodeId, index) {
        this.router.navigate(['/admin/secure/feterscodedetail/' + this._global.encryptValue(fetersCodeId)], {
            queryParams: {
                indexFetersCode: this.indexFetersCode, indexFetersCodeDetail: this.indexFetersCodeDetail, sortingFetersCodeField: this.sortingFetersCodeField, sortingFetersCodeDirection: this.sortingFetersCodeDirection, sortingFetersCodeDetailField: this.sortingFetersCodeDetailField, sortingFetersCodeDetailDirection: this.sortingFetersCodeDetailDirection, sortingFetersCodeGroupDetailField: this.sortingFetersCodeGroupDetailField, sortingFetersCodeGroupDetailDirection: this.sortingFetersCodeGroupDetailDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    EditFetersCodeDetail(fetersCodeId, fetersCodeDetailId) {
        this.router.navigate(['/admin/secure/feterscodedetail/' + this._global.encryptValue(fetersCodeId) + '/' + this._global.encryptValue(fetersCodeDetailId)], {
            queryParams: {
                indexFetersCode: this.indexFetersCode, indexFetersCodeDetail: this.indexFetersCodeDetail, sortingFetersCodeField: this.sortingFetersCodeField, sortingFetersCodeDirection: this.sortingFetersCodeDirection, sortingFetersCodeDetailField: this.sortingFetersCodeDetailField, sortingFetersCodeDetailDirection: this.sortingFetersCodeDetailDirection, sortingFetersCodeGroupDetailField: this.sortingFetersCodeGroupDetailField, sortingFetersCodeGroupDetailDirection: this.sortingFetersCodeGroupDetailDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    AddFetersCodeGroupDetail(fetersCodeId, fetersCodeDetailId, index) {
        this.router.navigate(['/admin/secure/feterscodegroupdetail/' + this._global.encryptValue(fetersCodeId) + '/' + this._global.encryptValue(fetersCodeDetailId)], {
            queryParams: {
                indexFetersCode: this.indexFetersCode, indexFetersCodeDetail: this.indexFetersCodeDetail, sortingFetersCodeField: this.sortingFetersCodeField, sortingFetersCodeDirection: this.sortingFetersCodeDirection, sortingFetersCodeDetailField: this.sortingFetersCodeDetailField, sortingFetersCodeDetailDirection: this.sortingFetersCodeDetailDirection, sortingFetersCodeGroupDetailField: this.sortingFetersCodeGroupDetailField, sortingFetersCodeGroupDetailDirection: this.sortingFetersCodeGroupDetailDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    EditFetersCodeGroupDetail(fetersCodeId, fetersCodeDetailId, fetersCodeGroupDetailId) {
        this.router.navigate(['/admin/secure/feterscodegroupdetail/' + this._global.encryptValue(fetersCodeId) + '/' + this._global.encryptValue(fetersCodeDetailId) + '/' + this._global.encryptValue(fetersCodeGroupDetailId)], {
            queryParams: {
                indexFetersCode: this.indexFetersCode, indexFetersCodeDetail: this.indexFetersCodeDetail, sortingFetersCodeField: this.sortingFetersCodeField, sortingFetersCodeDirection: this.sortingFetersCodeDirection, sortingFetersCodeDetailField: this.sortingFetersCodeDetailField, sortingFetersCodeDetailDirection: this.sortingFetersCodeDetailDirection, sortingFetersCodeGroupDetailField: this.sortingFetersCodeGroupDetailField, sortingFetersCodeGroupDetailDirection: this.sortingFetersCodeGroupDetailDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    ReloadPage(isPageChange) {
        if (isPageChange == true) {
            this.indexFetersCode = -1;
            this.itemDetailFetersCodes.index = this.indexFetersCode;
        }

        this.router.navigate(['/admin/secure/feterscodes'], {
            queryParams: {
                indexFetersCode: this.indexFetersCode, indexFetersCodeDetail: this.indexFetersCodeDetail, sortingFetersCodeField: this.sortingFetersCodeField, sortingFetersCodeDirection: this.sortingFetersCodeDirection, sortingFetersCodeDetailField: this.sortingFetersCodeDetailField, sortingFetersCodeDetailDirection: this.sortingFetersCodeDetailDirection, sortingFetersCodeGroupDetailField: this.sortingFetersCodeGroupDetailField, sortingFetersCodeGroupDetailDirection: this.sortingFetersCodeGroupDetailDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    DeleteFetersCode(fetersCodeId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteFetersCode = {
                "FetersCodeId": fetersCodeId
            };

            this._fetersCodeService.deleteFetersCode(deleteFetersCode)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_FETERSCODE_TITLE, { closeButton: true });
                        this.GetFetersCode();
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_FETERSCODE_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FETERSCODE_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    DeleteFetersCodeDetail(fetersCodeId: number, fetersCodeDetailId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteFetersCodeDetail = {
                "FetersCodeDetailId": fetersCodeDetailId
            };

            this._fetersCodeDetailService.deleteFetersCodeDetail(deleteFetersCodeDetail)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_FETERSCODE_TITLE, { closeButton: true });
                        this.GetFetersCodeDetail(this.itemDetailFetersCodes.index, fetersCodeId, true);
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_FETERSCODE_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FETERSCODE_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    DeleteFetersCodeGroupDetail(fetersCodeDetailId: number, fetersCodeGroupDetailId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteFetersCodeGroupDetail = {
                "FetersCodeGroupDetailId": fetersCodeGroupDetailId
            };

            this._fetersCodeGroupDetailService.deleteFetersCodeGroupDetail(deleteFetersCodeGroupDetail)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_FETERSCODE_TITLE, { closeButton: true });
                        this.GetFetersCodeGroupDetail(this.itemDetailFetersCodeDetails.index, fetersCodeDetailId, true);
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_FETERSCODE_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FETERSCODE_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    UpDownFetersCodeArrow(index) {
        this.itemDetailFetersCodeDetails.index = -1;

        if (index === this.itemDetailFetersCodes.index) {
            this.itemDetailFetersCodes.index = null;
        } else {
            this.itemDetailFetersCodes.index = index;
        }
    }

    UpDownFetersCodeDetailArrow(index) {
        if (index === this.itemDetailFetersCodeDetails.index) {
            this.itemDetailFetersCodeDetails.index = null;
        } else {
            this.itemDetailFetersCodeDetails.index = index;
        }
    }

    GetFetersCodeDetail(index, fetersCodeId, isDeleted): void {
        this.spinnerService.show();

        let getFetersCodeDetailRequest = new GetFetersCodeDetailRequest();
        getFetersCodeDetailRequest.FetersCodeId = fetersCodeId;
        getFetersCodeDetailRequest.IsActive = null;
        getFetersCodeDetailRequest.OrderBy = this.sortingFetersCodeDetailField;
        getFetersCodeDetailRequest.OrderByDirection = this.sortingFetersCodeDetailDirection;
        getFetersCodeDetailRequest.PageNumber = 1;
        getFetersCodeDetailRequest.PageSize = 100000;

        this._fetersCodeDetailService.getFetersCodeDetail(getFetersCodeDetailRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.fetersCodeDetails = data.Response;

                    if (this.indexFetersCodeDetail != -1 && this.fetersCodeDetails.length > 0) {
                        this.itemDetailFetersCodeDetails.index = this.indexFetersCodeDetail;
                        this.GetFetersCodeGroupDetail(this.itemDetailFetersCodeDetails.index, this.fetersCodeDetails[this.itemDetailFetersCodeDetails.index].FetersCodeDetailId, true);
                    }

                    if (isDeleted != true) {
                        this.UpDownFetersCodeArrow(index);
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_FETERSCODE_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FETERSCODE_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    GetFetersCodeGroupDetail(index, fetersCodeDetailId, isDeleted): void {
        this.spinnerService.show();

        let getFetersCodeGroupDetailRequest = new GetFetersCodeGroupDetailRequest();
        getFetersCodeGroupDetailRequest.FetersCodeDetailId = fetersCodeDetailId;
        getFetersCodeGroupDetailRequest.IsActive = null;
        getFetersCodeGroupDetailRequest.OrderBy = this.sortingFetersCodeGroupDetailField;
        getFetersCodeGroupDetailRequest.OrderByDirection = this.sortingFetersCodeGroupDetailDirection;
        getFetersCodeGroupDetailRequest.PageNumber = 1;
        getFetersCodeGroupDetailRequest.PageSize = 100000;

        this._fetersCodeGroupDetailService.getFetersCodeGroupDetail(getFetersCodeGroupDetailRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.fetersCodeGroupDetails = data.Response;

                    if (isDeleted != true) {
                        this.UpDownFetersCodeDetailArrow(index);
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_FETERSCODE_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FETERSCODE_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    ShowFetersCodeDetail(index, fetersCodeId) {
        this.indexFetersCode = -1;
        this.indexFetersCodeDetail = -1;

        this.fetersCodeId = null;

        if (this.itemDetailFetersCodes.index !== index) {
            if (fetersCodeId) {
                this.fetersCodeId = fetersCodeId;
                this.indexFetersCode = index;
                this.GetFetersCodeDetail(index, fetersCodeId, false);
            }
        } else {
            this.UpDownFetersCodeArrow(index);
        }
        this.ReloadPage(false);
    }

    ShowFetersCodeGroupDetail(index, fetersCodeDetailId) {
        this.indexFetersCodeDetail = -1;

        this.fetersCodeDetailId = null;

        if (this.itemDetailFetersCodeDetails.index !== index) {
            if (fetersCodeDetailId) {
                this.fetersCodeDetailId = fetersCodeDetailId;
                this.indexFetersCodeDetail = index;
                this.GetFetersCodeGroupDetail(index, fetersCodeDetailId, false);
            }
        } else {
            this.UpDownFetersCodeDetailArrow(index);
        }
        this.ReloadPage(false);
    }

    OnFetersCodeSort(fieldName) {
        this.sortingFetersCodeDirection = (this.sortingFetersCodeField == fieldName) ? (this.sortingFetersCodeDirection == "A") ? "D" : "A" : "A";
        this.sortingFetersCodeField = fieldName;

        this.GetFetersCode(this.searchText, this.currentPage, this.pageSize);
    }

    OnFetersCodeDetailSort(fetersCodeId, fieldName) {
        this.indexFetersCodeDetail = -1;
        this.itemDetailFetersCodeDetails.index = this.indexFetersCodeDetail;

        this.sortingFetersCodeDetailDirection = (this.sortingFetersCodeDetailField == fieldName) ? (this.sortingFetersCodeDetailDirection == "A") ? "D" : "A" : "A";
        this.sortingFetersCodeDetailField = fieldName;
        this.ReloadPage(false);
        this.GetFetersCodeDetail(this.itemDetailFetersCodes.index, fetersCodeId, true);
    }

    OnFetersCodeGroupDetailSort(fetersCodeDetailId, fieldName) {
        this.sortingFetersCodeGroupDetailDirection = (this.sortingFetersCodeGroupDetailField == fieldName) ? (this.sortingFetersCodeGroupDetailDirection == "A") ? "D" : "A" : "A";
        this.sortingFetersCodeGroupDetailField = fieldName;
        this.ReloadPage(false);
        this.GetFetersCodeGroupDetail(this.itemDetailFetersCodeDetails.index, fetersCodeDetailId, true);
    }
}
