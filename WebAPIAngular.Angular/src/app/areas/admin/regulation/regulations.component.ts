import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Regulation, GetRegulationRequest } from '../../../model/regulation';
import { FemaIndex, GetFemaIndexRequest } from '../../../model/femaIndex';
import { IndexAmendment, GetIndexAmendmentRequest } from '../../../model/indexAmendment';
import { FemaSubIndex, GetFemaSubIndexRequest } from '../../../model/femaSubIndex';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';
import { RegulationAdminService } from '../../../service/admin/regulation.service';
import { FemaIndexAdminService } from '../../../service/admin/femaIndex.service';
import { IndexAmendmentAdminService } from '../../../service/admin/indexAmendment.service';
import { FemaSubIndexAdminService } from '../../../service/admin/femaSubIndex.service';


import { ModalDialogService, IModalDialogSettings } from 'ngx-modal-dialog';
import { ContentPopUpAdminComponent } from '../../../areas/admin/contentPopUp/contentPopUp.component';

@Component({
    selector: 'my-app',
    templateUrl: './regulations.component.html'
})

export class RegulationsAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private _regulationService: RegulationAdminService, private _femaIndexService: FemaIndexAdminService, private _indexAmendmentService: IndexAmendmentAdminService, private _femaSubIndexService: FemaSubIndexAdminService, private toastr: ToastrService, private vcr: ViewContainerRef, private spinnerService: SpinnerService, private router: Router, private modalService: ModalDialogService) { }

    _global: Global = new Global();

    regulations: Regulation[];
    femaIndexes: FemaIndex[];
    indexAmendments: IndexAmendment[];
    femaSubIndexes: FemaSubIndex[];

    frmRegulation: FormGroup;

    searchText: string;
    totalRecords: number;
    currentPage: number;
    pageSize: number;
    pageSizes: number[];

    itemDetailRegulations1 = { index: -1 };
    itemDetailRegulations2 = { index: -1 };
    itemDetailIndexes = { index: -1 };

    indexRegulation1: number = -1;
    indexRegulation2: number = -1;
    indexIndex: number = -1;

    drpPageSize: number;

    sortingRegulationField: string;
    sortingRegulationDirection: string;

    sortingFemaIndexField: string;
    sortingFemaIndexDirection: string;

    sortingFemaSubIndexField: string;
    sortingFemaSubIndexDirection: string;

    sortingIndexAmendmentField: string;
    sortingIndexAmendmentDirection: string;

    ngOnInit(): void {
        this.pageSizes = Global.PAGE_SIZES;

        this.activatedRoute.queryParams.subscribe(params => {
            this.indexRegulation1 = (params["indexRegulation1"]) ? parseInt(params["indexRegulation1"]) : -1;
            this.indexRegulation2 = (params["indexRegulation2"]) ? parseInt(params["indexRegulation2"]) : -1;
            this.indexIndex = (params["indexIndex"]) ? parseInt(params["indexIndex"]) : -1;

            this.sortingRegulationField = params["sortingRegulationField"];
            this.sortingRegulationDirection = params["sortingRegulationDirection"];
            this.sortingFemaIndexField = (params["sortingFemaIndexField"]) ? params["sortingFemaIndexField"] : "SortId";
            this.sortingFemaIndexDirection = (params["sortingFemaIndexDirection"]) ? params["sortingFemaIndexDirection"] : "D";
            this.sortingFemaSubIndexField = (params["sortingFemaSubIndexField"]) ? params["sortingFemaSubIndexField"] : "SortId";
            this.sortingFemaSubIndexDirection = (params["sortingFemaSubIndexDirection"]) ? params["sortingFemaSubIndexDirection"] : "D";
            this.sortingIndexAmendmentField = params["sortingIndexAmendmentField"];
            this.sortingIndexAmendmentDirection = params["sortingIndexAmendmentDirection"];

            this.searchText = (params["searchText"]) ? params["searchText"] : null;
            this.currentPage = (params["pageNumber"]) ? parseInt(params["pageNumber"]) : 1;
            this.pageSize = (params["pageSize"]) ? parseInt(params["pageSize"]) : this.pageSizes[0];
            this.drpPageSize = this.pageSize;
        });


        this.frmRegulation = this.formBuilder.group({
            SearchText: [this.searchText]
        });

        this.GetRegulation(this.searchText, this.currentPage, this.pageSizes[0]);
    }

    GetRegulation(searchText?: string, pageNumber?: number, pageSize?: number): void {
        this.spinnerService.show();

        let getRegulationRequest = new GetRegulationRequest();
        getRegulationRequest.SearchText = searchText;
        getRegulationRequest.IsActive = null;
        getRegulationRequest.OrderBy = this.sortingRegulationField;
        getRegulationRequest.OrderByDirection = this.sortingRegulationDirection;
        getRegulationRequest.PageNumber = (pageNumber != null) ? pageNumber : this.currentPage;
        getRegulationRequest.PageSize = (pageSize != null) ? pageSize : this.pageSizes[0];

        this._regulationService.getRegulation(getRegulationRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.regulations = data.Response;

                    if (this.indexRegulation1 != -1 && this.regulations.length > 0) {
                        this.itemDetailRegulations1.index = this.indexRegulation1;
                        this.GetFemaIndex(this.itemDetailRegulations1.index, this.regulations[this.itemDetailRegulations1.index].RegulationId, true);
                    }

                    if (this.indexRegulation2 != -1 && this.regulations.length > 0) {
                        this.itemDetailRegulations2.index = this.indexRegulation2;
                        this.GetIndexAmendment(this.itemDetailRegulations2.index, this.regulations[this.itemDetailRegulations2.index].RegulationId, true);
                    }

                    this.pageSize = getRegulationRequest.PageSize;
                    this.totalRecords = (data.Response.length != 0) ? data.Response[0].TotalRecord : 0;
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_REGULATION_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_REGULATION_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    SearchRegulation(formData) {
        this.indexRegulation1 = -1;
        this.indexRegulation2 = -1;

        this.itemDetailRegulations1.index = this.indexRegulation1;
        this.itemDetailRegulations2.index = this.indexRegulation2;

        this.currentPage = 1;
        this.searchText = formData.value.SearchText;

        this.ReloadPage(false);
        this.GetRegulation(this.searchText, this.currentPage, this.pageSize);
    }

    OnPageChange(pageNumber: number) {
        this.currentPage = pageNumber;
        this.ReloadPage(true);
        this.GetRegulation(this.searchText, pageNumber, this.pageSize);
    }

    OnPageSizeChange() {
        this.currentPage = 1;
        this.pageSize = this.drpPageSize;
        this.ReloadPage(false);
        this.GetRegulation(this.searchText, null, this.pageSize);
    }

    EditRegulation(regulationId) {
        this.router.navigate(['/admin/secure/regulation/' + this._global.encryptValue(regulationId)], {
            queryParams: {
                indexRegulation1: this.indexRegulation1, indexRegulation2: this.indexRegulation2, indexIndex: this.indexIndex, sortingRegulationField: this.sortingRegulationField, sortingRegulationDirection: this.sortingRegulationDirection, sortingFemaIndexField: this.sortingFemaIndexField, sortingFemaIndexDirection: this.sortingFemaIndexDirection, sortingFemaSubIndexField: this.sortingFemaSubIndexField, sortingFemaSubIndexDirection: this.sortingFemaSubIndexDirection, sortingIndexAmendmentField: this.sortingIndexAmendmentField, sortingIndexAmendmentDirection: this.sortingIndexAmendmentDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    AddFemaIndex(regulationId, index) {
        this.router.navigate(['/admin/secure/femaindex/' + this._global.encryptValue(regulationId)], {
            queryParams: {
                indexRegulation1: this.indexRegulation1, indexRegulation2: this.indexRegulation2, indexIndex: this.indexIndex, sortingRegulationField: this.sortingRegulationField, sortingRegulationDirection: this.sortingRegulationDirection, sortingFemaIndexField: this.sortingFemaIndexField, sortingFemaIndexDirection: this.sortingFemaIndexDirection, sortingFemaSubIndexField: this.sortingFemaSubIndexField, sortingFemaSubIndexDirection: this.sortingFemaSubIndexDirection, sortingIndexAmendmentField: this.sortingIndexAmendmentField, sortingIndexAmendmentDirection: this.sortingIndexAmendmentDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    EditFemaIndex(regulationId, indexId) {
        this.router.navigate(['/admin/secure/femaindex/' + this._global.encryptValue(regulationId) + '/' + this._global.encryptValue(indexId)], {
            queryParams: {
                indexRegulation1: this.indexRegulation1, indexRegulation2: this.indexRegulation2, indexIndex: this.indexIndex, sortingRegulationField: this.sortingRegulationField, sortingRegulationDirection: this.sortingRegulationDirection, sortingFemaIndexField: this.sortingFemaIndexField, sortingFemaIndexDirection: this.sortingFemaIndexDirection, sortingFemaSubIndexField: this.sortingFemaSubIndexField, sortingFemaSubIndexDirection: this.sortingFemaSubIndexDirection, sortingIndexAmendmentField: this.sortingIndexAmendmentField, sortingIndexAmendmentDirection: this.sortingIndexAmendmentDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    AddIndexAmendment(regulationId, index) {
        this.router.navigate(['/admin/secure/indexamendment/' + this._global.encryptValue(regulationId)], {
            queryParams: {
                indexRegulation1: this.indexRegulation1, indexRegulation2: this.indexRegulation2, indexIndex: this.indexIndex, sortingRegulationField: this.sortingRegulationField, sortingRegulationDirection: this.sortingRegulationDirection, sortingFemaIndexField: this.sortingFemaIndexField, sortingFemaIndexDirection: this.sortingFemaIndexDirection, sortingFemaSubIndexField: this.sortingFemaSubIndexField, sortingFemaSubIndexDirection: this.sortingFemaSubIndexDirection, sortingIndexAmendmentField: this.sortingIndexAmendmentField, sortingIndexAmendmentDirection: this.sortingIndexAmendmentDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    EditIndexAmendment(regulationId, indexAmendmentId) {
        this.router.navigate(['/admin/secure/indexamendment/' + this._global.encryptValue(regulationId) + '/' + this._global.encryptValue(indexAmendmentId)], {
            queryParams: {
                indexRegulation1: this.indexRegulation1, indexRegulation2: this.indexRegulation2, indexIndex: this.indexIndex, sortingRegulationField: this.sortingRegulationField, sortingRegulationDirection: this.sortingRegulationDirection, sortingFemaIndexField: this.sortingFemaIndexField, sortingFemaIndexDirection: this.sortingFemaIndexDirection, sortingFemaSubIndexField: this.sortingFemaSubIndexField, sortingFemaSubIndexDirection: this.sortingFemaSubIndexDirection, sortingIndexAmendmentField: this.sortingIndexAmendmentField, sortingIndexAmendmentDirection: this.sortingIndexAmendmentDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    AddFemaSubIndex(regulationId, indexId, index) {
        this.router.navigate(['/admin/secure/femasubindex/' + this._global.encryptValue(regulationId) + '/' + this._global.encryptValue(indexId)], {
            queryParams: {
                indexRegulation1: this.indexRegulation1, indexRegulation2: this.indexRegulation2, indexIndex: this.indexIndex, sortingRegulationField: this.sortingRegulationField, sortingRegulationDirection: this.sortingRegulationDirection, sortingFemaIndexField: this.sortingFemaIndexField, sortingFemaIndexDirection: this.sortingFemaIndexDirection, sortingFemaSubIndexField: this.sortingFemaSubIndexField, sortingFemaSubIndexDirection: this.sortingFemaSubIndexDirection, sortingIndexAmendmentField: this.sortingIndexAmendmentField, sortingIndexAmendmentDirection: this.sortingIndexAmendmentDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    EditFemaSubIndex(regulationId, indexId, subIndexId) {
        this.router.navigate(['/admin/secure/femasubindex/' + this._global.encryptValue(regulationId) + '/' + this._global.encryptValue(indexId) + '/' + this._global.encryptValue(subIndexId)], {
            queryParams: {
                indexRegulation1: this.indexRegulation1, indexRegulation2: this.indexRegulation2, indexIndex: this.indexIndex, sortingRegulationField: this.sortingRegulationField, sortingRegulationDirection: this.sortingRegulationDirection, sortingFemaIndexField: this.sortingFemaIndexField, sortingFemaIndexDirection: this.sortingFemaIndexDirection, sortingFemaSubIndexField: this.sortingFemaSubIndexField, sortingFemaSubIndexDirection: this.sortingFemaSubIndexDirection, sortingIndexAmendmentField: this.sortingIndexAmendmentField, sortingIndexAmendmentDirection: this.sortingIndexAmendmentDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    ReloadPage(isPageChange) {
        if (isPageChange == true) {
            this.indexRegulation1 = -1;
            this.indexRegulation2 = -1;

            this.itemDetailRegulations1.index = this.indexRegulation1;
            this.itemDetailRegulations2.index = this.indexRegulation2;
        }

        this.router.navigate(['/admin/secure/regulations'], {
            queryParams: {
                indexRegulation1: this.indexRegulation1, indexRegulation2: this.indexRegulation2, indexIndex: this.indexIndex, sortingRegulationField: this.sortingRegulationField, sortingRegulationDirection: this.sortingRegulationDirection, sortingFemaIndexField: this.sortingFemaIndexField, sortingFemaIndexDirection: this.sortingFemaIndexDirection, sortingFemaSubIndexField: this.sortingFemaSubIndexField, sortingFemaSubIndexDirection: this.sortingFemaSubIndexDirection, sortingIndexAmendmentField: this.sortingIndexAmendmentField, sortingIndexAmendmentDirection: this.sortingIndexAmendmentDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    DeleteRegulation(regulationId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteRegulation = {
                "RegulationId": regulationId
            };

            this._regulationService.deleteRegulation(deleteRegulation)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_REGULATION_TITLE, { closeButton: true });
                        this.GetRegulation();
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_REGULATION_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_REGULATION_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    DeleteFemaIndex(regulationId: number, indexId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteFemaIndex = {
                "IndexId": indexId,
                "RegulationId": regulationId
            };

            this._femaIndexService.deleteFemaIndex(deleteFemaIndex)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_REGULATION_TITLE, { closeButton: true });
                        this.GetFemaIndex(this.itemDetailRegulations1.index, regulationId, true);
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_REGULATION_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_REGULATION_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    DeleteIndexAmendment(regulationId: number, indexAmendmentId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteIndexAmendment = {
                "IndexAmendmentId": indexAmendmentId
            };

            this._indexAmendmentService.deleteIndexAmendment(deleteIndexAmendment)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_REGULATION_TITLE, { closeButton: true });
                        this.GetIndexAmendment(this.itemDetailRegulations2.index, regulationId, true);
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_REGULATION_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_REGULATION_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    DeleteFemaSubIndex(indexId: number, subIndexId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteFemaSubIndex = {
                "SubIndexId": subIndexId,
                "IndexId": indexId
            };

            this._femaSubIndexService.deleteFemaSubIndex(deleteFemaSubIndex)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_REGULATION_TITLE, { closeButton: true });
                        this.GetFemaSubIndex(this.itemDetailIndexes.index, indexId, true);
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_REGULATION_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_REGULATION_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    UpDownRegulation1Arrow(index) {
        this.itemDetailIndexes.index = -1;

        if (index === this.itemDetailRegulations1.index) {
            this.itemDetailRegulations1.index = null;
        } else {
            this.itemDetailRegulations1.index = index;
        }
    }

    UpDownRegulation2Arrow(index) {
        if (index === this.itemDetailRegulations2.index) {
            this.itemDetailRegulations2.index = null;
        } else {
            this.itemDetailRegulations2.index = index;
        }
    }

    UpDownIndexArrow(index) {
        if (index === this.itemDetailIndexes.index) {
            this.itemDetailIndexes.index = null;
        } else {
            this.itemDetailIndexes.index = index;
        }
    }

    GetFemaIndex(index, regulationId, isDeleted): void {
        this.spinnerService.show();

        let getFemaIndexRequest = new GetFemaIndexRequest();
        getFemaIndexRequest.RegulationId = regulationId;
        getFemaIndexRequest.OrderBy = this.sortingFemaIndexField;
        getFemaIndexRequest.OrderByDirection = this.sortingFemaIndexDirection;
        getFemaIndexRequest.IsActive = null;
        getFemaIndexRequest.PageNumber = 1;
        getFemaIndexRequest.PageSize = 100000;

        this._femaIndexService.getFemaIndex(getFemaIndexRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.femaIndexes = data.Response;

                    if (this.indexIndex != -1 && this.femaIndexes.length > 0) {
                        this.itemDetailIndexes.index = this.indexIndex;
                        this.GetFemaSubIndex(this.itemDetailIndexes.index, this.femaIndexes[this.itemDetailIndexes.index].IndexId, true);
                    }

                    if (isDeleted != true) {
                        this.UpDownRegulation1Arrow(index);
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_REGULATION_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_REGULATION_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    GetIndexAmendment(index, regulationId, isDeleted): void {
        this.spinnerService.show();

        let getIndexAmendmentRequest = new GetIndexAmendmentRequest();
        getIndexAmendmentRequest.RegulationId = regulationId;
        getIndexAmendmentRequest.OrderBy = this.sortingIndexAmendmentField;
        getIndexAmendmentRequest.OrderByDirection = this.sortingIndexAmendmentDirection;
        getIndexAmendmentRequest.IsActive = null;
        getIndexAmendmentRequest.PageNumber = 1;
        getIndexAmendmentRequest.PageSize = 100000;

        this._indexAmendmentService.getIndexAmendment(getIndexAmendmentRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.indexAmendments = data.Response;

                    if (isDeleted != true) {
                        this.UpDownRegulation2Arrow(index);
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_REGULATION_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_REGULATION_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    GetFemaSubIndex(index, indexId, isDeleted): void {
        this.spinnerService.show();

        let getFemaSubIndexRequest = new GetFemaSubIndexRequest();
        getFemaSubIndexRequest.IndexId = indexId;
        getFemaSubIndexRequest.OrderBy = this.sortingFemaSubIndexField;
        getFemaSubIndexRequest.OrderByDirection = this.sortingFemaSubIndexDirection;
        getFemaSubIndexRequest.IsActive = null;
        getFemaSubIndexRequest.PageNumber = 1;
        getFemaSubIndexRequest.PageSize = 100000;

        this._femaSubIndexService.getFemaSubIndex(getFemaSubIndexRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.femaSubIndexes = data.Response;

                    if (isDeleted != true) {
                        this.UpDownIndexArrow(index);
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_REGULATION_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_REGULATION_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    ShowFemaIndex(index, regulationId) {
        this.indexRegulation1 = -1;
        this.indexIndex = -1;

        if (this.itemDetailRegulations1.index !== index) {
            if (regulationId) {
                this.indexRegulation1 = index;
                this.GetFemaIndex(index, regulationId, false);
            }
        } else {
            this.UpDownRegulation1Arrow(index);
        }
        this.ReloadPage(false);
    }

    ShowIndexAmendment(index, regulationId) {
        this.indexRegulation2 = -1;

        if (this.itemDetailRegulations2.index !== index) {
            if (regulationId) {
                this.indexRegulation2 = index;
                this.GetIndexAmendment(index, regulationId, false);
            }
        } else {
            this.UpDownRegulation2Arrow(index);
        }
        this.ReloadPage(false);
    }

    ShowFemaSubIndex(index, indexId) {
        this.indexIndex = -1;

        if (this.itemDetailIndexes.index !== index) {
            if (indexId) {
                this.indexIndex = index;
                this.GetFemaSubIndex(index, indexId, false);
            }
        } else {
            this.UpDownIndexArrow(index);
        }
        this.ReloadPage(false);
    }

    ShowContent(title, content) {
        this.modalService.openDialog(this.vcr, {
            title: title,
            childComponent: ContentPopUpAdminComponent,
            data: content
        });
    }

    OnRegulationSort(fieldName) {
        this.sortingRegulationDirection = (this.sortingRegulationField == fieldName) ? (this.sortingRegulationDirection == "A") ? "D" : "A" : "A";
        this.sortingRegulationField = fieldName;
        this.ReloadPage(true);
        this.GetRegulation(this.searchText, this.currentPage, this.pageSize);
    }

    OnFemaIndexSort(regulationId, fieldName) {
        this.indexIndex = -1;
        this.itemDetailIndexes.index = this.indexIndex;

        this.sortingFemaIndexDirection = (this.sortingFemaIndexField == fieldName) ? (this.sortingFemaIndexDirection == "A") ? "D" : "A" : "A";
        this.sortingFemaIndexField = fieldName;
        this.ReloadPage(false);
        this.GetFemaIndex(this.itemDetailRegulations1.index, regulationId, true);
    }

    OnFemaSubIndexSort(indexId, fieldName) {
        this.sortingFemaSubIndexDirection = (this.sortingFemaSubIndexField == fieldName) ? (this.sortingFemaSubIndexDirection == "A") ? "D" : "A" : "A";
        this.sortingFemaSubIndexField = fieldName;
        this.ReloadPage(false);
        this.GetFemaSubIndex(this.itemDetailIndexes.index, indexId, true);
    }

    OnIndexAmendmentSort(regulationId, fieldName) {
        this.sortingIndexAmendmentDirection = (this.sortingIndexAmendmentField == fieldName) ? (this.sortingIndexAmendmentDirection == "A") ? "D" : "A" : "A";
        this.sortingIndexAmendmentField = fieldName;
        this.ReloadPage(false);
        this.GetIndexAmendment(this.itemDetailRegulations2.index, regulationId, true);
    }
}
