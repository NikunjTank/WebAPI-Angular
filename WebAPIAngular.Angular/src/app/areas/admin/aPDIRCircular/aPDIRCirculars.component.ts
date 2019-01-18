import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { APDIRCircular, GetAPDIRCircularRequest } from '../../../model/aPDIRCircular';
import { APDIRCircularBefore, GetAPDIRCircularBeforeRequest } from '../../../model/aPDIRCircularBefore';
import { APDIRCircularAfter, GetAPDIRCircularAfterRequest } from '../../../model/aPDIRCircularAfter';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';
import { APDIRCircularAdminService } from '../../../service/admin/aPDIRCircular.service';
import { APDIRCircularBeforeAdminService } from '../../../service/admin/aPDIRCircularBefore.service';
import { APDIRCircularAfterAdminService } from '../../../service/admin/aPDIRCircularAfter.service';


@Component({
    selector: 'my-app',
    templateUrl: './aPDIRCirculars.component.html'
})

export class APDIRCircularsAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private _aPDIRCircularService: APDIRCircularAdminService, private _aPDIRCircularBeforeService: APDIRCircularBeforeAdminService, private _aPDIRCircularAfterService: APDIRCircularAfterAdminService, private toastr: ToastrService, private vcr: ViewContainerRef, private spinnerService: SpinnerService, private router: Router) { }

    _global: Global = new Global();

    aPDIRCirculars: APDIRCircular[];
    aPDIRCircularBefores: APDIRCircularBefore[];
    aPDIRCircularAfters: APDIRCircularAfter[];

    aPDIRCircularId: number;

    frmAPDIRCircular: FormGroup;

    searchText: string;
    totalRecords: number;
    currentPage: number;
    pageSize: number;
    pageSizes: number[];

    pdfServerPath: string = Global.APDIRCIRCULAR_PDF_FILEPATH;

    itemDetailAPDIRCirculars1 = { index: -1 };
    itemDetailAPDIRCirculars2 = { index: -1 };

    indexAPDIRCircular1: number = -1;
    indexAPDIRCircular2: number = -1;

    drpPageSize: number;

    sortingAPDIRCircularField: string;
    sortingAPDIRCircularDirection: string;

    sortingAPDIRCircularBeforeField: string;
    sortingAPDIRCircularBeforeDirection: string;

    sortingAPDIRCircularAfterField: string;
    sortingAPDIRCircularAfterDirection: string;

    ngOnInit(): void {
        this.pageSizes = Global.PAGE_SIZES;

        this.activatedRoute.queryParams.subscribe(params => {
            this.indexAPDIRCircular1 = (params["indexAPDIRCircular1"]) ? parseInt(params["indexAPDIRCircular1"]) : -1;
            this.indexAPDIRCircular2 = (params["indexAPDIRCircular2"]) ? parseInt(params["indexAPDIRCircular2"]) : -1;

            this.sortingAPDIRCircularField = (params["sortingAPDIRCircularField"]) ? params["sortingAPDIRCircularField"] : "APDIRCircularDate";
            this.sortingAPDIRCircularDirection = (params["sortingAPDIRCircularDirection"]) ? params["sortingAPDIRCircularDirection"] : "D";
            this.sortingAPDIRCircularBeforeField = params["sortingAPDIRCircularBeforeField"];
            this.sortingAPDIRCircularBeforeDirection = params["sortingAPDIRCircularBeforeDirection"];
            this.sortingAPDIRCircularAfterField = params["sortingAPDIRCircularAfterField"];
            this.sortingAPDIRCircularAfterDirection = params["sortingAPDIRCircularAfterDirection"];

            this.searchText = (params["searchText"]) ? params["searchText"] : null;
            this.currentPage = (params["pageNumber"]) ? parseInt(params["pageNumber"]) : 1;
            this.pageSize = (params["pageSize"]) ? parseInt(params["pageSize"]) : this.pageSizes[0];
            this.drpPageSize = this.pageSize;
        });


        this.frmAPDIRCircular = this.formBuilder.group({
            SearchText: [this.searchText]
        });

        this.GetAPDIRCircular(this.searchText, this.currentPage, this.pageSizes[0]);
    }

    GetAPDIRCircular(searchText?: string, pageNumber?: number, pageSize?: number): void {
        this.spinnerService.show();

        let getAPDIRCircularRequest = new GetAPDIRCircularRequest();
        getAPDIRCircularRequest.SearchText = searchText;
        getAPDIRCircularRequest.IsActive = null;
        getAPDIRCircularRequest.OrderBy = this.sortingAPDIRCircularField;
        getAPDIRCircularRequest.OrderByDirection = this.sortingAPDIRCircularDirection;
        getAPDIRCircularRequest.PageNumber = (pageNumber != null) ? pageNumber : this.currentPage;
        getAPDIRCircularRequest.PageSize = (pageSize != null) ? pageSize : this.pageSizes[0];

        this._aPDIRCircularService.getAPDIRCircular(getAPDIRCircularRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.aPDIRCirculars = data.Response;

                    if (this.indexAPDIRCircular1 != -1 && this.aPDIRCirculars.length > 0) {
                        this.itemDetailAPDIRCirculars1.index = this.indexAPDIRCircular1;
                        this.GetAPDIRCircularBefore(this.itemDetailAPDIRCirculars1.index, this.aPDIRCirculars[this.itemDetailAPDIRCirculars1.index].APDIRCircularId, true);
                    }

                    if (this.indexAPDIRCircular2 != -1 && this.aPDIRCirculars.length > 0) {
                        this.itemDetailAPDIRCirculars2.index = this.indexAPDIRCircular2;
                        this.GetAPDIRCircularAfter(this.itemDetailAPDIRCirculars2.index, this.aPDIRCirculars[this.itemDetailAPDIRCirculars2.index].APDIRCircularId, true);
                    }

                    this.pageSize = getAPDIRCircularRequest.PageSize;
                    this.totalRecords = (data.Response.length != 0) ? data.Response[0].TotalRecord : 0;
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_APDIR_CIRCULAR_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_APDIR_CIRCULAR_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    SearchAPDIRCircular(formData) {
        this.indexAPDIRCircular1 = -1;
        this.indexAPDIRCircular2 = -1;

        this.itemDetailAPDIRCirculars1.index = this.indexAPDIRCircular1;
        this.itemDetailAPDIRCirculars2.index = this.indexAPDIRCircular2;

        this.currentPage = 1;
        this.searchText = formData.value.SearchText;

        this.ReloadPage(false);
        this.GetAPDIRCircular(this.searchText, this.currentPage, this.pageSize);
    }

    OnPageChange(pageNumber: number) {
        this.currentPage = pageNumber;
        this.ReloadPage(true);
        this.GetAPDIRCircular(this.searchText, pageNumber, this.pageSize);
    }

    OnPageSizeChange() {
        this.currentPage = 1;
        this.pageSize = this.drpPageSize;
        this.ReloadPage(false);
        this.GetAPDIRCircular(this.searchText, null, this.pageSize);
    }

    EditAPDIRCircular(aPDIRCircularId) {
        this.router.navigate(['/admin/secure/apdircircular/' + this._global.encryptValue(aPDIRCircularId)], {
            queryParams: {
                indexAPDIRCircular1: this.indexAPDIRCircular1, indexAPDIRCircular2: this.indexAPDIRCircular2, sortingAPDIRCircularField: this.sortingAPDIRCircularField, sortingAPDIRCircularDirection: this.sortingAPDIRCircularDirection, sortingAPDIRCircularBeforeField: this.sortingAPDIRCircularBeforeField, sortingAPDIRCircularBeforeDirection: this.sortingAPDIRCircularBeforeDirection, sortingAPDIRCircularAfterField: this.sortingAPDIRCircularAfterField, sortingAPDIRCircularAfterDirection: this.sortingAPDIRCircularAfterDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    AddAPDIRCircularBefore(aPDIRCircularId, index) {
        this.router.navigate(['/admin/secure/apdircircularbefore/' + this._global.encryptValue(aPDIRCircularId)], {
            queryParams: {
                indexAPDIRCircular1: this.indexAPDIRCircular1, indexAPDIRCircular2: this.indexAPDIRCircular2, sortingAPDIRCircularField: this.sortingAPDIRCircularField, sortingAPDIRCircularDirection: this.sortingAPDIRCircularDirection, sortingAPDIRCircularBeforeField: this.sortingAPDIRCircularBeforeField, sortingAPDIRCircularBeforeDirection: this.sortingAPDIRCircularBeforeDirection, sortingAPDIRCircularAfterField: this.sortingAPDIRCircularAfterField, sortingAPDIRCircularAfterDirection: this.sortingAPDIRCircularAfterDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    EditAPDIRCircularBefore(aPDIRCircularBeforeId, aPDIRCircularId) {
        this.router.navigate(['/admin/secure/apdircircularbefore/' + this._global.encryptValue(aPDIRCircularId) + "/" + this._global.encryptValue(aPDIRCircularBeforeId)], {
            queryParams: {
                indexAPDIRCircular1: this.indexAPDIRCircular1, indexAPDIRCircular2: this.indexAPDIRCircular2, sortingAPDIRCircularField: this.sortingAPDIRCircularField, sortingAPDIRCircularDirection: this.sortingAPDIRCircularDirection, sortingAPDIRCircularBeforeField: this.sortingAPDIRCircularBeforeField, sortingAPDIRCircularBeforeDirection: this.sortingAPDIRCircularBeforeDirection, sortingAPDIRCircularAfterField: this.sortingAPDIRCircularAfterField, sortingAPDIRCircularAfterDirection: this.sortingAPDIRCircularAfterDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    AddAPDIRCircularAfter(aPDIRCircularId, index) {
        this.router.navigate(['/admin/secure/apdircircularafter/' + this._global.encryptValue(aPDIRCircularId)], {
            queryParams: {
                indexAPDIRCircular1: this.indexAPDIRCircular1, indexAPDIRCircular2: this.indexAPDIRCircular2, sortingAPDIRCircularField: this.sortingAPDIRCircularField, sortingAPDIRCircularDirection: this.sortingAPDIRCircularDirection, sortingAPDIRCircularBeforeField: this.sortingAPDIRCircularBeforeField, sortingAPDIRCircularBeforeDirection: this.sortingAPDIRCircularBeforeDirection, sortingAPDIRCircularAfterField: this.sortingAPDIRCircularAfterField, sortingAPDIRCircularAfterDirection: this.sortingAPDIRCircularAfterDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    EditAPDIRCircularAfter(aPDIRCircularAfterId, aPDIRCircularId) {
        this.router.navigate(['/admin/secure/apdircircularafter/' + this._global.encryptValue(aPDIRCircularId) + "/" + this._global.encryptValue(aPDIRCircularAfterId)], {
            queryParams: {
                indexAPDIRCircular1: this.indexAPDIRCircular1, indexAPDIRCircular2: this.indexAPDIRCircular2, sortingAPDIRCircularField: this.sortingAPDIRCircularField, sortingAPDIRCircularDirection: this.sortingAPDIRCircularDirection, sortingAPDIRCircularBeforeField: this.sortingAPDIRCircularBeforeField, sortingAPDIRCircularBeforeDirection: this.sortingAPDIRCircularBeforeDirection, sortingAPDIRCircularAfterField: this.sortingAPDIRCircularAfterField, sortingAPDIRCircularAfterDirection: this.sortingAPDIRCircularAfterDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    ReloadPage(isPageChange) {
        if (isPageChange == true) {
            this.indexAPDIRCircular1 = -1;
            this.indexAPDIRCircular2 = -1;

            this.itemDetailAPDIRCirculars1.index = this.indexAPDIRCircular1;
            this.itemDetailAPDIRCirculars2.index = this.indexAPDIRCircular2;
        }

        this.router.navigate(['/admin/secure/apdircirculars'], {
            queryParams: {
                indexAPDIRCircular1: this.indexAPDIRCircular1, indexAPDIRCircular2: this.indexAPDIRCircular2, sortingAPDIRCircularField: this.sortingAPDIRCircularField, sortingAPDIRCircularDirection: this.sortingAPDIRCircularDirection, sortingAPDIRCircularBeforeField: this.sortingAPDIRCircularBeforeField, sortingAPDIRCircularBeforeDirection: this.sortingAPDIRCircularBeforeDirection, sortingAPDIRCircularAfterField: this.sortingAPDIRCircularAfterField, sortingAPDIRCircularAfterDirection: this.sortingAPDIRCircularAfterDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    DeleteAPDIRCircular(aPDIRCircularId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteAPDIRCircular = {
                "APDIRCircularId": aPDIRCircularId
            };

            this._aPDIRCircularService.deleteAPDIRCircular(deleteAPDIRCircular)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_APDIR_CIRCULAR_TITLE, { closeButton: true });
                        this.GetAPDIRCircular();
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_APDIR_CIRCULAR_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_APDIR_CIRCULAR_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    DeleteAPDIRCircularBefore(aPDIRCircularId: number, aPDIRCircularBeforeId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteAPDIRCircularBefore = {
                "APDIRCircularBeforeId": aPDIRCircularBeforeId
            };

            this._aPDIRCircularBeforeService.deleteAPDIRCircularBefore(deleteAPDIRCircularBefore)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_APDIR_CIRCULAR_TITLE, { closeButton: true });
                        this.GetAPDIRCircularBefore(this.itemDetailAPDIRCirculars1.index, aPDIRCircularId, true);
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_APDIR_CIRCULAR_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_APDIR_CIRCULAR_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    DeleteAPDIRCircularAfter(aPDIRCircularId: number, aPDIRCircularAfterId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteAPDIRCircularAfter = {
                "APDIRCircularAfterId": aPDIRCircularAfterId
            };

            this._aPDIRCircularAfterService.deleteAPDIRCircularAfter(deleteAPDIRCircularAfter)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_APDIR_CIRCULAR_TITLE, { closeButton: true });
                        this.GetAPDIRCircularAfter(this.itemDetailAPDIRCirculars2.index, aPDIRCircularId, true);
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_APDIR_CIRCULAR_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_APDIR_CIRCULAR_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    UpDownAPDIRCircular1Arrow(index) {
        if (index === this.itemDetailAPDIRCirculars1.index) {
            this.itemDetailAPDIRCirculars1.index = null;
        } else {
            this.itemDetailAPDIRCirculars1.index = index;
        }
    }

    UpDownAPDIRCircular2Arrow(index) {
        if (index === this.itemDetailAPDIRCirculars2.index) {
            this.itemDetailAPDIRCirculars2.index = null;
        } else {
            this.itemDetailAPDIRCirculars2.index = index;
        }
    }

    GetAPDIRCircularBefore(index, aPDIRCircularId, isDeleted): void {
        this.spinnerService.show();

        let getAPDIRCircularBeforeRequest = new GetAPDIRCircularBeforeRequest();
        getAPDIRCircularBeforeRequest.APDIRCircularParentId = aPDIRCircularId;
        getAPDIRCircularBeforeRequest.IsActive = null;
        getAPDIRCircularBeforeRequest.OrderBy = this.sortingAPDIRCircularBeforeField;
        getAPDIRCircularBeforeRequest.OrderByDirection = this.sortingAPDIRCircularBeforeDirection;
        getAPDIRCircularBeforeRequest.PageNumber = 1;
        getAPDIRCircularBeforeRequest.PageSize = 100000;

        this._aPDIRCircularBeforeService.getAPDIRCircularBefore(getAPDIRCircularBeforeRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.aPDIRCircularBefores = data.Response;

                    if (isDeleted != true) {
                        this.UpDownAPDIRCircular1Arrow(index);
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_APDIR_CIRCULAR_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_APDIR_CIRCULAR_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    GetAPDIRCircularAfter(index, aPDIRCircularId, isDeleted): void {
        this.spinnerService.show();

        let getAPDIRCircularAfterRequest = new GetAPDIRCircularAfterRequest();
        getAPDIRCircularAfterRequest.APDIRCircularParentId = aPDIRCircularId;
        getAPDIRCircularAfterRequest.IsActive = null;
        getAPDIRCircularAfterRequest.OrderBy = this.sortingAPDIRCircularBeforeField;
        getAPDIRCircularAfterRequest.OrderByDirection = this.sortingAPDIRCircularBeforeDirection;
        getAPDIRCircularAfterRequest.PageNumber = 1;
        getAPDIRCircularAfterRequest.PageSize = 100000;

        this._aPDIRCircularAfterService.getAPDIRCircularAfter(getAPDIRCircularAfterRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.aPDIRCircularAfters = data.Response;

                    if (isDeleted != true) {
                        this.UpDownAPDIRCircular2Arrow(index);
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_APDIR_CIRCULAR_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_APDIR_CIRCULAR_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    ShowAPDIRCircularBefore(index, aPDIRCircularId) {
        this.indexAPDIRCircular1 = -1;

        if (this.itemDetailAPDIRCirculars1.index !== index) {
            if (aPDIRCircularId) {
                this.indexAPDIRCircular1 = index;
                this.GetAPDIRCircularBefore(index, aPDIRCircularId, false);
            }
        } else {
            this.UpDownAPDIRCircular1Arrow(index);
        }
        this.ReloadPage(false);
    }

    ShowAPDIRCircularAfter(index, aPDIRCircularId) {
        this.indexAPDIRCircular2 = -1;

        if (this.itemDetailAPDIRCirculars2.index !== index) {
            if (aPDIRCircularId) {
                this.indexAPDIRCircular2 = index;
                this.GetAPDIRCircularAfter(index, aPDIRCircularId, false);
            }
        } else {
            this.UpDownAPDIRCircular2Arrow(index);
        }
        this.ReloadPage(false);
    }

    OnAPDIRCircularSort(fieldName) {
        this.sortingAPDIRCircularDirection = (this.sortingAPDIRCircularField == fieldName) ? (this.sortingAPDIRCircularDirection == "A") ? "D" : "A" : "A";
        this.sortingAPDIRCircularField = fieldName;
        this.ReloadPage(true);
        this.GetAPDIRCircular(this.searchText, this.currentPage, this.pageSize);
    }

    OnAPDIRCircularBeforeSort(aPDIRCircularId, fieldName) {
        this.sortingAPDIRCircularBeforeDirection = (this.sortingAPDIRCircularBeforeField == fieldName) ? (this.sortingAPDIRCircularBeforeDirection == "A") ? "D" : "A" : "A";
        this.sortingAPDIRCircularBeforeField = fieldName;
        this.ReloadPage(false);
        this.GetAPDIRCircularBefore(this.itemDetailAPDIRCirculars1.index, aPDIRCircularId, true);
    }

    OnAPDIRCircularAfterSort(aPDIRCircularId, fieldName) {
        this.sortingAPDIRCircularAfterDirection = (this.sortingAPDIRCircularAfterField == fieldName) ? (this.sortingAPDIRCircularAfterDirection == "A") ? "D" : "A" : "A";
        this.sortingAPDIRCircularAfterField = fieldName;
        this.ReloadPage(false);
        this.GetAPDIRCircularAfter(this.itemDetailAPDIRCirculars2.index, aPDIRCircularId, true);
    }
}
