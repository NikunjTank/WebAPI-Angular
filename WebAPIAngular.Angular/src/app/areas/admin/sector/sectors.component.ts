import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Sector, GetSectorRequest } from '../../../model/sector';
import { SectorDetail, GetSectorDetailRequest } from '../../../model/sectorDetail';
import { SubSector, GetSubSectorRequest } from '../../../model/subSector';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';
import { SectorAdminService } from '../../../service/admin/sector.service';
import { SectorDetailAdminService } from '../../../service/admin/sectorDetail.service';
import { SubSectorAdminService } from '../../../service/admin/subSector.service';


@Component({
    selector: 'my-app',
    templateUrl: './sectors.component.html'
})

export class SectorsAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private _sectorService: SectorAdminService, private _sectorDetailService: SectorDetailAdminService, private _subSectorService: SubSectorAdminService, private toastr: ToastrService, private vcr: ViewContainerRef, private spinnerService: SpinnerService, private router: Router) { }

    _global: Global = new Global();

    sectors: Sector[];
    sector: Sector;

    sectorDetails: SectorDetail[];
    subSectors: SubSector[];
    sectorId: number;

    frmSector: FormGroup;
    searchText: string;
    totalRecords: number;
    currentPage: number;
    pageSize: number;
    pageSizes: number[];

    itemDetailSectors1 = { index: -1 };
    itemDetailSectors2 = { index: -1 };

    indexSector1: number = -1;
    indexSector2: number = -1;

    drpPageSize: number;

    sortingSectorField: string;
    sortingSectorDirection: string;

    sortingSectorDetailField: string;
    sortingSectorDetailDirection: string;

    sortingSubSectorField: string;
    sortingSubSectorDirection: string;

    ngOnInit(): void {
        this.pageSizes = Global.PAGE_SIZES;

        this.activatedRoute.queryParams.subscribe(params => {
            this.indexSector1 = (params["indexSector1"]) ? parseInt(params["indexSector1"]) : -1;
            this.indexSector2 = (params["indexSector2"]) ? parseInt(params["indexSector2"]) : -1;

            this.sortingSectorField = (params["sortingSectorField"]) ? params["sortingSectorField"] : "Name";
            this.sortingSectorDirection = (params["sortingSectorDirection"]) ? params["sortingSectorDirection"] : "A";
            this.sortingSectorDetailField = params["sortingSectorDetailField"];
            this.sortingSectorDetailDirection = params["sortingSectorDetailDirection"];
            this.sortingSubSectorField = (params["sortingSubSectorField"]) ? params["sortingSubSectorField"] : "Name";
            this.sortingSubSectorDirection = (params["sortingSubSectorDirection"]) ? params["sortingSubSectorDirection"] : "A";

            this.searchText = (params["searchText"]) ? params["searchText"] : null;
            this.currentPage = (params["pageNumber"]) ? parseInt(params["pageNumber"]) : 1;
            this.pageSize = (params["pageSize"]) ? parseInt(params["pageSize"]) : this.pageSizes[0];
            this.drpPageSize = this.pageSize;
        });


        this.frmSector = this.formBuilder.group({
            SearchText: [this.searchText]
        });

        this.GetSector(this.searchText, this.currentPage, this.pageSizes[0]);
    }

    GetSector(searchText?: string, pageNumber?: number, pageSize?: number): void {
        this.spinnerService.show();

        let getSectorRequest = new GetSectorRequest();
        getSectorRequest.SearchText = searchText;
        getSectorRequest.IsActive = null;
        getSectorRequest.OrderBy = this.sortingSectorField;
        getSectorRequest.OrderByDirection = this.sortingSectorDirection;
        getSectorRequest.PageNumber = (pageNumber != null) ? pageNumber : this.currentPage;
        getSectorRequest.PageSize = (pageSize != null) ? pageSize : this.pageSizes[0];

        this._sectorService.getSector(getSectorRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.sectors = data.Response;

                    if (this.indexSector1 != -1) {
                        this.itemDetailSectors1.index = this.indexSector1;
                        this.GetSectorDetail(this.itemDetailSectors1.index, this.sectors[this.itemDetailSectors1.index].SectorId, true);
                    }

                    if (this.indexSector2 != -1) {
                        this.itemDetailSectors2.index = this.indexSector2;
                        this.GetSubSector(this.itemDetailSectors2.index, this.sectors[this.itemDetailSectors2.index].SectorId, true);
                    }

                    this.pageSize = getSectorRequest.PageSize;
                    this.totalRecords = (data.Response.length != 0) ? data.Response[0].TotalRecord : 0;
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_SECTOR_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_SECTOR_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    SearchSector(formData) {
        this.indexSector1 = -1;
        this.indexSector2 = -1;

        this.itemDetailSectors1.index = this.indexSector1;
        this.itemDetailSectors2.index = this.indexSector2;

        this.currentPage = 1;
        this.searchText = formData.value.SearchText;

        this.ReloadPage(false);
        this.GetSector(this.searchText, this.currentPage, this.pageSize);
    }

    OnPageChange(pageNumber: number) {
        this.currentPage = pageNumber;
        this.ReloadPage(true);
        this.GetSector(this.searchText, pageNumber, this.pageSize);
    }

    OnPageSizeChange() {
        this.currentPage = 1;
        this.pageSize = this.drpPageSize;
        this.ReloadPage(false);
        this.GetSector(this.searchText, null, this.pageSize);
    }

    EditSector(sectorId) {
        this.router.navigate(['/admin/secure/sector/' + this._global.encryptValue(sectorId)], {
            queryParams: {
                indexSector1: this.indexSector1, indexSector2: this.indexSector2, sortingSectorField: this.sortingSectorField, sortingSectorDirection: this.sortingSectorDirection, sortingSectorDetailField: this.sortingSectorDetailField, sortingSectorDetailDirection: this.sortingSectorDetailDirection, sortingSubSectorField: this.sortingSubSectorField, sortingSubSectorDirection: this.sortingSubSectorDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    AddSectorDetail(sectorId, index) {
        this.router.navigate(['/admin/secure/sectordetail/' + this._global.encryptValue(sectorId)], {
            queryParams: {
                indexSector1: this.indexSector1, indexSector2: this.indexSector2, sortingSectorField: this.sortingSectorField, sortingSectorDirection: this.sortingSectorDirection, sortingSectorDetailField: this.sortingSectorDetailField, sortingSectorDetailDirection: this.sortingSectorDetailDirection, sortingSubSectorField: this.sortingSubSectorField, sortingSubSectorDirection: this.sortingSubSectorDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    EditSectorDetail(sectorId, sectorDetailId) {
        this.router.navigate(['/admin/secure/sectordetail/' + this._global.encryptValue(sectorId) + '/' + this._global.encryptValue(sectorDetailId)], {
            queryParams: {
                indexSector1: this.indexSector1, indexSector2: this.indexSector2, sortingSectorField: this.sortingSectorField, sortingSectorDirection: this.sortingSectorDirection, sortingSectorDetailField: this.sortingSectorDetailField, sortingSectorDetailDirection: this.sortingSectorDetailDirection, sortingSubSectorField: this.sortingSubSectorField, sortingSubSectorDirection: this.sortingSubSectorDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    AddSubSector(sectorId, index) {
        this.router.navigate(['/admin/secure/subsector/' + this._global.encryptValue(sectorId)], {
            queryParams: {
                indexSector1: this.indexSector1, indexSector2: this.indexSector2, sortingSectorField: this.sortingSectorField, sortingSectorDirection: this.sortingSectorDirection, sortingSectorDetailField: this.sortingSectorDetailField, sortingSectorDetailDirection: this.sortingSectorDetailDirection, sortingSubSectorField: this.sortingSubSectorField, sortingSubSectorDirection: this.sortingSubSectorDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    EditSubSector(sectorId, subSectorId) {
        this.router.navigate(['/admin/secure/subsector/' + this._global.encryptValue(sectorId) + '/' + this._global.encryptValue(subSectorId)], {
            queryParams: {
                indexSector1: this.indexSector1, indexSector2: this.indexSector2, sortingSectorField: this.sortingSectorField, sortingSectorDirection: this.sortingSectorDirection, sortingSectorDetailField: this.sortingSectorDetailField, sortingSectorDetailDirection: this.sortingSectorDetailDirection, sortingSubSectorField: this.sortingSubSectorField, sortingSubSectorDirection: this.sortingSubSectorDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    ReloadPage(isPageChange) {
        if (isPageChange == true) {
            this.indexSector1 = -1;
            this.indexSector2 = -1;

            this.itemDetailSectors1.index = this.indexSector1;
            this.itemDetailSectors2.index = this.indexSector2;
        }

        this.router.navigate(['/admin/secure/sectors'], {
            queryParams: {
                indexSector1: this.indexSector1, indexSector2: this.indexSector2, sortingSectorField: this.sortingSectorField, sortingSectorDirection: this.sortingSectorDirection, sortingSectorDetailField: this.sortingSectorDetailField, sortingSectorDetailDirection: this.sortingSectorDetailDirection, sortingSubSectorField: this.sortingSubSectorField, sortingSubSectorDirection: this.sortingSubSectorDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    DeleteSector(sectorId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteSector = {
                "SectorId": sectorId
            };

            this._sectorService.deleteSector(deleteSector)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_SECTOR_TITLE, { closeButton: true });
                        this.GetSector();
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_SECTOR_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_SECTOR_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    DeleteSectorDetail(sectorId: number, sectorDetailId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteSectorDetail = {
                "SectorDetailId": sectorDetailId
            };

            this._sectorDetailService.deleteSectorDetail(deleteSectorDetail)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_SECTOR_TITLE, { closeButton: true });
                        this.GetSectorDetail(this.itemDetailSectors1.index, sectorId, true);
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_SECTOR_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_SECTOR_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    DeleteSubSector(sectorId: number, subSectorId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteSubSector = {
                "SubSectorId": subSectorId
            };

            this._subSectorService.deleteSubSector(deleteSubSector)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_SECTOR_TITLE, { closeButton: true });
                        this.GetSubSector(this.itemDetailSectors2.index, sectorId, true);
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_SECTOR_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_SECTOR_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    UpDownSectorArrow1(index) {
        if (index === this.itemDetailSectors1.index) {
            this.itemDetailSectors1.index = null;
        } else {
            this.itemDetailSectors1.index = index;
        }
    }

    UpDownSectorArrow2(index) {
        if (index === this.itemDetailSectors2.index) {
            this.itemDetailSectors2.index = null;
        } else {
            this.itemDetailSectors2.index = index;
        }
    }

    GetSectorDetail(index, sectorId, isDeleted): void {
        this.spinnerService.show();

        let getSectorDetailRequest = new GetSectorDetailRequest();
        getSectorDetailRequest.SectorId = sectorId;
        getSectorDetailRequest.IsActive = null;
        getSectorDetailRequest.OrderBy = this.sortingSectorDetailField;
        getSectorDetailRequest.OrderByDirection = this.sortingSectorDetailDirection;
        getSectorDetailRequest.PageNumber = 1;
        getSectorDetailRequest.PageSize = 100000;

        this._sectorDetailService.getSectorDetail(getSectorDetailRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.sectorDetails = data.Response;

                    if (isDeleted != true) {
                        this.UpDownSectorArrow1(index);
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_SECTOR_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_SECTOR_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    GetSubSector(index, sectorId, isDeleted): void {
        this.spinnerService.show();

        let getSubSectorRequest = new GetSubSectorRequest();
        getSubSectorRequest.SectorId = sectorId;
        getSubSectorRequest.IsActive = null;
        getSubSectorRequest.OrderBy = this.sortingSubSectorField;
        getSubSectorRequest.OrderByDirection = this.sortingSubSectorDirection;
        getSubSectorRequest.PageNumber = 1;
        getSubSectorRequest.PageSize = 100000;

        this._subSectorService.getSubSector(getSubSectorRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.subSectors = data.Response;

                    if (isDeleted != true) {
                        this.UpDownSectorArrow2(index);
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_SECTOR_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_SECTOR_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    ShowSectorDetail(index, sectorId) {
        this.indexSector1 = -1;

        if (this.itemDetailSectors1.index !== index) {
            if (sectorId) {
                this.indexSector1 = index;
                this.GetSectorDetail(index, sectorId, false);
            }
        } else {
            this.UpDownSectorArrow1(index);
        }
        this.ReloadPage(false);
    }

    ShowSubSector(index, sectorId) {
        this.indexSector2 = -1;

        if (this.itemDetailSectors2.index !== index) {
            if (sectorId) {
                this.indexSector2 = index;
                this.GetSubSector(index, sectorId, false);
            }
        } else {
            this.UpDownSectorArrow2(index);
        }
        this.ReloadPage(false);
    }

    OnSectorSort(fieldName) {
        this.sortingSectorDirection = (this.sortingSectorField == fieldName) ? (this.sortingSectorDirection == "A") ? "D" : "A" : "A";
        this.sortingSectorField = fieldName;
        this.ReloadPage(true);
        this.GetSector(this.searchText, this.currentPage, this.pageSize);
    }

    OnSectorDetailSort(sectorId, fieldName) {
        this.sortingSectorDetailDirection = (this.sortingSectorDetailField == fieldName) ? (this.sortingSectorDetailDirection == "A") ? "D" : "A" : "A";
        this.sortingSectorDetailField = fieldName;
        this.ReloadPage(false);
        this.GetSectorDetail(this.itemDetailSectors1.index, sectorId, true);
    }

    OnSubSectorSort(sectorId, fieldName) {
        this.sortingSubSectorDirection = (this.sortingSubSectorField == fieldName) ? (this.sortingSubSectorDirection == "A") ? "D" : "A" : "A";
        this.sortingSubSectorField = fieldName;
        this.ReloadPage(false);
        this.GetSubSector(this.itemDetailSectors2.index, sectorId, true);
    }
}
