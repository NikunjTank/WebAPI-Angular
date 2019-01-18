import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RBIData, GetRBIDataRequest } from '../../../model/rBIData';
import { RBIDataDetail, GetRBIDataDetailRequest } from '../../../model/rBIDataDetail';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';
import { RBIDataAdminService } from '../../../service/admin/rBIData.service';
import { RBIDataDetailAdminService } from '../../../service/admin/rBIDataDetail.service';


@Component({
    selector: 'my-app',
    templateUrl: './rBIDatas.component.html'
})

export class RBIDatasAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private _rBIDataService: RBIDataAdminService, private _rBIDataDetailService: RBIDataDetailAdminService, private toastr: ToastrService, private vcr: ViewContainerRef, private spinnerService: SpinnerService, private router: Router) { }

    _global: Global = new Global();

    rBIDatas: RBIData[];
    rBIDataDetails: RBIDataDetail[];
    rBIData: RBIData;
    rBIDataId: number;

    frmRBIData: FormGroup;
    searchText: string;
    totalRecords: number;
    currentPage: number;
    pageSize: number;
    pageSizes: number[];

    itemDetailRBIDatas = { index: -1 };
    indexRBIData: number = -1;

    excelRBIDataServerPath: string = Global.RBIDATA_EXCEL_FILEPATH;
    excelServerPath: string = Global.RBIDATA_DETAIL_EXCEL_FILEPATH;
    pdfServerPath: string = Global.RBIDATA_DETAIL_PDF_FILEPATH;

    drpPageSize: number;

    sortingRBIDataField: string;
    sortingRBIDataDirection: string;

    sortingRBIDataDetailField: string;
    sortingRBIDataDetailDirection: string;

    ngOnInit(): void {
        this.pageSizes = Global.PAGE_SIZES;

        this.activatedRoute.queryParams.subscribe(params => {
            this.indexRBIData = (params["indexRBIData"]) ? parseInt(params["indexRBIData"]) : -1;

            this.searchText = (params["searchText"]) ? params["searchText"] : null;
            this.currentPage = (params["pageNumber"]) ? parseInt(params["pageNumber"]) : 1;
            this.pageSize = (params["pageSize"]) ? parseInt(params["pageSize"]) : this.pageSizes[0];
            this.drpPageSize = this.pageSize;

            this.sortingRBIDataField = params["sortingRBIDataField"];
            this.sortingRBIDataDirection = params["sortingRBIDataDirection"];
            this.sortingRBIDataDetailField = params["sortingRBIDataDetailField"];
            this.sortingRBIDataDetailDirection = params["sortingRBIDataDetailDirection"];
        });


        this.frmRBIData = this.formBuilder.group({
            SearchText: [this.searchText]
        });

        this.GetRBIData(this.searchText, this.currentPage, this.pageSizes[0]);
    }

    GetRBIData(searchText?: string, pageNumber?: number, pageSize?: number): void {
        this.spinnerService.show();

        let getRBIDataRequest = new GetRBIDataRequest();
        getRBIDataRequest.SearchText = searchText;
        getRBIDataRequest.IsActive = null;
        getRBIDataRequest.OrderBy = this.sortingRBIDataField;
        getRBIDataRequest.OrderByDirection = this.sortingRBIDataDirection;
        getRBIDataRequest.PageNumber = (pageNumber != null) ? pageNumber : this.currentPage;
        getRBIDataRequest.PageSize = (pageSize != null) ? pageSize : this.pageSizes[0];

        this._rBIDataService.getRBIData(getRBIDataRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.rBIDatas = data.Response;

                    if (this.indexRBIData != -1 && this.rBIDatas.length > 0) {
                        this.itemDetailRBIDatas.index = this.indexRBIData;
                        this.GetRBIDataDetail(this.itemDetailRBIDatas.index, this.rBIDatas[this.itemDetailRBIDatas.index].RBIDataId, true);
                    }

                    this.pageSize = getRBIDataRequest.PageSize;
                    this.totalRecords = (data.Response.length != 0) ? data.Response[0].TotalRecord : 0;
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_RBIDATA_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_RBIDATA_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    SearchRBIData(formData) {
        this.indexRBIData = -1;
        this.itemDetailRBIDatas.index = this.indexRBIData;

        this.currentPage = 1;
        this.searchText = formData.value.SearchText;
        this.ReloadPage(false);
        this.GetRBIData(this.searchText, this.currentPage, this.pageSize);
    }

    OnPageChange(pageNumber: number) {
        this.currentPage = pageNumber;
        this.ReloadPage(true);
        this.GetRBIData(this.searchText, pageNumber, this.pageSize);
    }

    OnPageSizeChange() {
        this.currentPage = 1;
        this.pageSize = this.drpPageSize;
        this.ReloadPage(false);
        this.GetRBIData(this.searchText, null, this.pageSize);
    }

    EditRBIData(rBIDataId) {
        this.router.navigate(['/admin/secure/rbidata/' + this._global.encryptValue(rBIDataId)], {
            queryParams: {
                indexRBIData: this.indexRBIData, sortingRBIDataField: this.sortingRBIDataField, sortingRBIDataDirection: this.sortingRBIDataDirection, sortingRBIDataDetailField: this.sortingRBIDataDetailField, sortingRBIDataDetailDirection: this.sortingRBIDataDetailDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    AddRBIDataDetail(rBIDataId, index) {
        this.router.navigate(['/admin/secure/rbidatadetail/' + this._global.encryptValue(rBIDataId)], {
            queryParams: {
                indexRBIData: this.indexRBIData, sortingRBIDataField: this.sortingRBIDataField, sortingRBIDataDirection: this.sortingRBIDataDirection, sortingRBIDataDetailField: this.sortingRBIDataDetailField, sortingRBIDataDetailDirection: this.sortingRBIDataDetailDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    EditRBIDataDetail(rBIDataId, rBIDataDetailId) {
        this.router.navigate(['/admin/secure/rbidatadetail/' + this._global.encryptValue(rBIDataId) + '/' + this._global.encryptValue(rBIDataDetailId)], {
            queryParams: {
                indexRBIData: this.indexRBIData, sortingRBIDataField: this.sortingRBIDataField, sortingRBIDataDirection: this.sortingRBIDataDirection, sortingRBIDataDetailField: this.sortingRBIDataDetailField, sortingRBIDataDetailDirection: this.sortingRBIDataDetailDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    ReloadPage(isPageChange) {
        if (isPageChange == true) {
            this.indexRBIData = -1;
            this.itemDetailRBIDatas.index = this.indexRBIData;
        }

        this.router.navigate(['/admin/secure/rbidatas'], {
            queryParams: {
                indexRBIData: this.indexRBIData, sortingRBIDataField: this.sortingRBIDataField, sortingRBIDataDirection: this.sortingRBIDataDirection, sortingRBIDataDetailField: this.sortingRBIDataDetailField, sortingRBIDataDetailDirection: this.sortingRBIDataDetailDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    DeleteRBIData(rBIDataId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteRBIData = {
                "RBIDataId": rBIDataId
            };

            this._rBIDataService.deleteRBIData(deleteRBIData)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_RBIDATA_TITLE, { closeButton: true });
                        this.GetRBIData();
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_RBIDATA_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_RBIDATA_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    DeleteRBIDataDetail(rBIDataId: number, rBIDataDetailId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteRBIDataDetail = {
                "RBIDataDetailId": rBIDataDetailId
            };

            this._rBIDataDetailService.deleteRBIDataDetail(deleteRBIDataDetail)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_RBIDATA_TITLE, { closeButton: true });
                        this.GetRBIDataDetail(this.itemDetailRBIDatas.index, rBIDataId, true);
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_RBIDATA_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_RBIDATA_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    UpDownRBIDataArrow(index) {
        if (index === this.itemDetailRBIDatas.index) {
            this.itemDetailRBIDatas.index = null;
        } else {
            this.itemDetailRBIDatas.index = index;
        }
    }

    GetRBIDataDetail(index, rBIDataId, isDeleted): void {
        this.spinnerService.show();

        let getRBIDataDetailRequest = new GetRBIDataDetailRequest();
        getRBIDataDetailRequest.RBIDataId = rBIDataId;
        getRBIDataDetailRequest.IsActive = null;
        getRBIDataDetailRequest.OrderBy = this.sortingRBIDataDetailField;
        getRBIDataDetailRequest.OrderByDirection = this.sortingRBIDataDetailDirection;
        getRBIDataDetailRequest.PageNumber = 1;
        getRBIDataDetailRequest.PageSize = 100000;

        this._rBIDataDetailService.getRBIDataDetail(getRBIDataDetailRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.rBIDataDetails = data.Response;

                    if (isDeleted != true) {
                        this.UpDownRBIDataArrow(index);
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_RBIDATA_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_RBIDATA_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    ShowRBIDataDetail(index, rBIDataId) {
        this.indexRBIData = -1;
        this.rBIDataId = null;

        if (this.itemDetailRBIDatas.index !== index) {
            if (rBIDataId) {
                this.rBIDataId = rBIDataId;
                this.indexRBIData = index;
                this.GetRBIDataDetail(index, rBIDataId, false);
            }
        } else {
            this.UpDownRBIDataArrow(index);
        }
        this.ReloadPage(false);
    }

    OnRBIDataSort(fieldName) {
        this.sortingRBIDataDirection = (this.sortingRBIDataField == fieldName) ? (this.sortingRBIDataDirection == "A") ? "D" : "A" : "A";
        this.sortingRBIDataField = fieldName;
        this.ReloadPage(true);
        this.GetRBIData(this.searchText, this.currentPage, this.pageSize);
    }

    OnRBIDataDetailSort(rBIDataId, fieldName) {
        this.sortingRBIDataDetailDirection = (this.sortingRBIDataDetailField == fieldName) ? (this.sortingRBIDataDetailDirection == "A") ? "D" : "A" : "A";
        this.sortingRBIDataDetailField = fieldName;
        this.ReloadPage(false);
        this.GetRBIDataDetail(this.itemDetailRBIDatas.index, rBIDataId, true);
    }
}
