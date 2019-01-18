import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MasterCircular, GetMasterCircularRequest } from '../../../model/masterCircular';
import { MasterCircularDetail, GetMasterCircularDetailRequest } from '../../../model/masterCircularDetail';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';
import { MasterCircularAdminService } from '../../../service/admin/masterCircular.service';
import { MasterCircularDetailAdminService } from '../../../service/admin/masterCircularDetail.service';


@Component({
    selector: 'my-app',
    templateUrl: './masterCirculars.component.html'
})

export class MasterCircularsAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private _masterCircularService: MasterCircularAdminService, private _masterCircularDetailService: MasterCircularDetailAdminService, private toastr: ToastrService, private vcr: ViewContainerRef, private spinnerService: SpinnerService, private router: Router) { }

    _global: Global = new Global();

    masterCirculars: MasterCircular[];
    masterCircularDetails: MasterCircularDetail[];

    frmMasterCircular: FormGroup;

    searchText: string;
    totalRecords: number;
    currentPage: number;
    pageSize: number;
    pageSizes: number[];

    drpPageSize: number;

    pdfServerPath: string = Global.MASTERCIRCULAR_PDF_FILEPATH;

    itemDetailMasterCirculars = { index: -1 };
    indexMasterCircular: number = -1;

    sortingMasterCircularField: string;
    sortingMasterCircularDirection: string;

    sortingMasterCircularDetailField: string;
    sortingMasterCircularDetailDirection: string;

    ngOnInit(): void {
        this.pageSizes = Global.PAGE_SIZES;

        this.activatedRoute.queryParams.subscribe(params => {
            this.indexMasterCircular = (params["indexMasterCircular"]) ? parseInt(params["indexMasterCircular"]) : -1;

            this.sortingMasterCircularField = params["sortingMasterCircularField"];
            this.sortingMasterCircularDirection = params["sortingMasterCircularDirection"];
            this.sortingMasterCircularDetailField = params["sortingMasterCircularDetailField"];
            this.sortingMasterCircularDetailDirection = params["sortingMasterCircularDetailDirection"];

            this.searchText = (params["searchText"]) ? params["searchText"] : null;
            this.currentPage = (params["pageNumber"]) ? parseInt(params["pageNumber"]) : 1;
            this.pageSize = (params["pageSize"]) ? parseInt(params["pageSize"]) : this.pageSizes[0];
            this.drpPageSize = this.pageSize;
        });


        this.frmMasterCircular = this.formBuilder.group({
            SearchText: [this.searchText]
        });

        this.GetMasterCircular(this.searchText, this.currentPage, this.pageSizes[0]);
    }

    GetMasterCircular(searchText?: string, pageNumber?: number, pageSize?: number): void {
        this.spinnerService.show();

        let getMasterCircularRequest = new GetMasterCircularRequest();
        getMasterCircularRequest.SearchText = searchText;
        getMasterCircularRequest.IsActive = null;
        getMasterCircularRequest.OrderBy = this.sortingMasterCircularField;
        getMasterCircularRequest.OrderByDirection = this.sortingMasterCircularDirection;
        getMasterCircularRequest.PageNumber = (pageNumber != null) ? pageNumber : this.currentPage;
        getMasterCircularRequest.PageSize = (pageSize != null) ? pageSize : this.pageSizes[0];

        this._masterCircularService.getMasterCircular(getMasterCircularRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.masterCirculars = data.Response;

                    if (this.indexMasterCircular != -1 && this.masterCirculars.length > 0) {
                        this.itemDetailMasterCirculars.index = this.indexMasterCircular;
                        this.GetMasterCircularDetail(this.itemDetailMasterCirculars.index, this.masterCirculars[this.itemDetailMasterCirculars.index].MasterCircularId, true);
                    }

                    this.pageSize = getMasterCircularRequest.PageSize;
                    this.totalRecords = (data.Response.length != 0) ? data.Response[0].TotalRecord : 0;
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_MASTER_CIRCULAR_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_MASTER_CIRCULAR_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    SearchMasterCircular(formData) {
        this.indexMasterCircular = -1;
        this.itemDetailMasterCirculars.index = this.indexMasterCircular;

        this.currentPage = 1;
        this.searchText = formData.value.SearchText;

        this.ReloadPage(false);
        this.GetMasterCircular(this.searchText, this.currentPage, this.pageSize);
    }

    OnPageChange(pageNumber: number) {
        this.currentPage = pageNumber;
        this.ReloadPage(true);
        this.GetMasterCircular(this.searchText, pageNumber, this.pageSize);
    }

    OnPageSizeChange() {
        this.currentPage = 1;
        this.pageSize = this.drpPageSize;
        this.ReloadPage(false);
        this.GetMasterCircular(this.searchText, null, this.pageSize);
    }

    EditMasterCircular(masterCircularId) {
        this.router.navigate(['/admin/secure/mastercircular/' + this._global.encryptValue(masterCircularId)], {
            queryParams: {
                indexMasterCircular: this.indexMasterCircular, sortingMasterCircularField: this.sortingMasterCircularField, sortingMasterCircularDirection: this.sortingMasterCircularDirection, sortingMasterCircularDetailField: this.sortingMasterCircularDetailField, sortingMasterCircularDetailDirection: this.sortingMasterCircularDetailDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    AddMasterCircularDetail(masterCircularId, index) {
        this.router.navigate(['/admin/secure/mastercirculardetail/' + this._global.encryptValue(masterCircularId)], {
            queryParams: {
                indexMasterCircular: this.indexMasterCircular, sortingMasterCircularField: this.sortingMasterCircularField, sortingMasterCircularDirection: this.sortingMasterCircularDirection, sortingMasterCircularDetailField: this.sortingMasterCircularDetailField, sortingMasterCircularDetailDirection: this.sortingMasterCircularDetailDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    EditMasterCircularDetail(masterCircularId, masterCircularDetailId) {
        this.router.navigate(['/admin/secure/mastercirculardetail/' + this._global.encryptValue(masterCircularId) + '/' + this._global.encryptValue(masterCircularDetailId)], {
            queryParams: {
                indexMasterCircular: this.indexMasterCircular, sortingMasterCircularField: this.sortingMasterCircularField, sortingMasterCircularDirection: this.sortingMasterCircularDirection, sortingMasterCircularDetailField: this.sortingMasterCircularDetailField, sortingMasterCircularDetailDirection: this.sortingMasterCircularDetailDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    ReloadPage(isPageChange) {
        if (isPageChange == true) {
            this.indexMasterCircular = -1;

            this.itemDetailMasterCirculars.index = this.indexMasterCircular;
        }

        this.router.navigate(['/admin/secure/mastercirculars'], {
            queryParams: {
                indexMasterCircular: this.indexMasterCircular, sortingMasterCircularField: this.sortingMasterCircularField, sortingMasterCircularDirection: this.sortingMasterCircularDirection, sortingMasterCircularDetailField: this.sortingMasterCircularDetailField, sortingMasterCircularDetailDirection: this.sortingMasterCircularDetailDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    DeleteMasterCircular(masterCircularId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteMasterCircular = {
                "MasterCircularId": masterCircularId
            };

            this._masterCircularService.deleteMasterCircular(deleteMasterCircular)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_MASTER_CIRCULAR_TITLE, { closeButton: true });
                        this.GetMasterCircular();
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_MASTER_CIRCULAR_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_MASTER_CIRCULAR_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    DeleteMasterCircularDetail(masterCircularId: number, masterCircularDetailId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteMasterCircularDetail = {
                "MasterCircularDetailId": masterCircularDetailId
            };

            this._masterCircularDetailService.deleteMasterCircularDetail(deleteMasterCircularDetail)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_MASTER_CIRCULAR_TITLE, { closeButton: true });
                        this.GetMasterCircularDetail(this.itemDetailMasterCirculars.index, masterCircularId, true);
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_MASTER_CIRCULAR_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_MASTER_CIRCULAR_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    UpDownMasterCircularArrow(index) {
        if (index === this.itemDetailMasterCirculars.index) {
            this.itemDetailMasterCirculars.index = null;
        } else {
            this.itemDetailMasterCirculars.index = index;
        }
    }

    GetMasterCircularDetail(index, masterCircularId, isDeleted): void {
        this.spinnerService.show();

        let getMasterCircularDetailRequest = new GetMasterCircularDetailRequest();
        getMasterCircularDetailRequest.MasterCircularId = masterCircularId;
        getMasterCircularDetailRequest.IsActive = null;
        getMasterCircularDetailRequest.OrderBy = this.sortingMasterCircularDetailField;
        getMasterCircularDetailRequest.OrderByDirection = this.sortingMasterCircularDetailDirection;
        getMasterCircularDetailRequest.PageNumber = 1;
        getMasterCircularDetailRequest.PageSize = 100000;

        this._masterCircularDetailService.getMasterCircularDetail(getMasterCircularDetailRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.masterCircularDetails = data.Response;

                    if (isDeleted != true) {
                        this.UpDownMasterCircularArrow(index);
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_MASTER_CIRCULAR_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_MASTER_CIRCULAR_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    ShowMasterCircularDetail(index, masterCircularId) {
        this.indexMasterCircular = -1;

        if (this.itemDetailMasterCirculars.index !== index) {
            if (masterCircularId) {
                this.indexMasterCircular = index;
                this.GetMasterCircularDetail(index, masterCircularId, false);
            }
        } else {
            this.UpDownMasterCircularArrow(index);
        }
        this.ReloadPage(false);
    }

    OnMasterCircularSort(fieldName) {
        this.sortingMasterCircularDirection = (this.sortingMasterCircularField == fieldName) ? (this.sortingMasterCircularDirection == "A") ? "D" : "A" : "A";
        this.sortingMasterCircularField = fieldName;
        this.ReloadPage(true);
        this.GetMasterCircular(this.searchText, this.currentPage, this.pageSize);
    }

    OnMasterCircularDetailSort(sectorId, fieldName) {
        this.sortingMasterCircularDetailDirection = (this.sortingMasterCircularDetailField == fieldName) ? (this.sortingMasterCircularDetailDirection == "A") ? "D" : "A" : "A";
        this.sortingMasterCircularDetailField = fieldName;
        this.ReloadPage(false);
        this.GetMasterCircularDetail(this.itemDetailMasterCirculars.index, sectorId, true);
    }
}