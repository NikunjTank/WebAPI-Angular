import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Rules, GetRulesRequest } from '../../../model/rules';
import { RulesIndex, GetRulesIndexRequest } from '../../../model/rulesIndex';
import { RulesIndexAmendment, GetRulesIndexAmendmentRequest } from '../../../model/rulesIndexAmendment';
import { RulesSubIndex, GetRulesSubIndexRequest } from '../../../model/rulesSubIndex';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';
import { RulesAdminService } from '../../../service/admin/rules.service';
import { RulesIndexAdminService } from '../../../service/admin/rulesIndex.service';
import { RulesIndexAmendmentAdminService } from '../../../service/admin/rulesIndexAmendment.service';
import { RulesSubIndexAdminService } from '../../../service/admin/rulesSubIndex.service';


import { ModalDialogService, IModalDialogSettings } from 'ngx-modal-dialog';
import { ContentPopUpAdminComponent } from '../../../areas/admin/contentPopUp/contentPopUp.component';

@Component({
    selector: 'my-app',
    templateUrl: './ruless.component.html'
})

export class RulessAdminComponent implements OnInit {
    
    constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private _rulesService: RulesAdminService, private _rulesIndexService: RulesIndexAdminService, private _rulesSubIndexService: RulesSubIndexAdminService, private _rulesIndexAmendmentService: RulesIndexAmendmentAdminService, private toastr: ToastrService, private vcr: ViewContainerRef, private spinnerService: SpinnerService, private router: Router, private modalService: ModalDialogService) { }

    _global: Global = new Global();

    ruless: Rules[];
    rulesIndexes: RulesIndex[];
    rulesIndexAmendments: RulesIndexAmendment[];
    rulesSubIndexes: RulesSubIndex[];

    frmRules: FormGroup;

    searchText: string;
    totalRecords: number;
    currentPage: number;
    pageSize: number;
    pageSizes: number[];

    itemDetailRuless1 = { index: -1 };
    itemDetailRuless2 = { index: -1 };
    itemDetailIndexes = { index: -1 };

    indexRules1: number = -1;
    indexRules2: number = -1;
    indexIndex: number = -1;

    drpPageSize: number;

    sortingRulesField: string;
    sortingRulesDirection: string;

    sortingIndexField: string;
    sortingIndexDirection: string;

    sortingSubIndexField: string;
    sortingSubIndexDirection: string;

    sortingIndexAmendmentField: string;
    sortingIndexAmendmentDirection: string;

    ngOnInit(): void {
        this.pageSizes = Global.PAGE_SIZES;

        this.activatedRoute.queryParams.subscribe(params => {
            this.indexRules1 = (params["indexRules1"]) ? parseInt(params["indexRules1"]) : -1;
            this.indexRules2 = (params["indexRules2"]) ? parseInt(params["indexRules2"]) : -1;
            this.indexIndex = (params["indexIndex"]) ? parseInt(params["indexIndex"]) : -1;

            this.sortingRulesField = params["sortingRulesField"];
            this.sortingRulesDirection = params["sortingRulesDirection"];
            this.sortingIndexField = (params["sortingIndexField"]) ? params["sortingIndexField"] : "SortId";
            this.sortingIndexDirection = (params["sortingIndexDirection"]) ? params["sortingIndexDirection"] : "D";
            this.sortingSubIndexField = (params["sortingSubIndexField"]) ? params["sortingSubIndexField"] : "SortId";
            this.sortingSubIndexDirection = (params["sortingSubIndexDirection"]) ? params["sortingSubIndexDirection"] : "D";
            this.sortingIndexAmendmentField = params["sortingIndexAmendmentField"];
            this.sortingIndexAmendmentDirection = params["sortingIndexAmendmentDirection"];

            this.searchText = (params["searchText"]) ? params["searchText"] : null;
            this.currentPage = (params["pageNumber"]) ? parseInt(params["pageNumber"]) : 1;
            this.pageSize = (params["pageSize"]) ? parseInt(params["pageSize"]) : this.pageSizes[0];
            this.drpPageSize = this.pageSize;
        });


        this.frmRules = this.formBuilder.group({
            SearchText: [this.searchText]
        });

        this.GetRules(this.searchText, this.currentPage, this.pageSizes[0]);
    }

    GetRules(searchText?: string, pageNumber?: number, pageSize?: number): void {
        this.spinnerService.show();

        let getRulesRequest = new GetRulesRequest();
        getRulesRequest.SearchText = searchText;
        getRulesRequest.IsActive = null;
        getRulesRequest.OrderBy = this.sortingRulesField;
        getRulesRequest.OrderByDirection = this.sortingRulesDirection;
        getRulesRequest.PageNumber = (pageNumber != null) ? pageNumber : this.currentPage;
        getRulesRequest.PageSize = (pageSize != null) ? pageSize : this.pageSizes[0];

        this._rulesService.getRules(getRulesRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.ruless = data.Response;

                    if (this.indexRules1 != -1 && this.ruless.length > 0) {
                        this.itemDetailRuless1.index = this.indexRules1;
                        this.GetRulesIndex(this.itemDetailRuless1.index, this.ruless[this.itemDetailRuless1.index].RulesId, true);
                    }

                    if (this.indexRules2 != -1 && this.ruless.length > 0) {
                        this.itemDetailRuless2.index = this.indexRules2;
                        this.GetRulesIndexAmendment(this.itemDetailRuless2.index, this.ruless[this.itemDetailRuless2.index].RulesId, true);
                    }

                    this.pageSize = getRulesRequest.PageSize;
                    this.totalRecords = (data.Response.length != 0) ? data.Response[0].TotalRecord : 0;
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_RULES_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_RULES_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    SearchRules(formData) {
        this.indexRules1 = -1;
        this.indexRules2 = -1;

        this.itemDetailRuless1.index = this.indexRules1;
        this.itemDetailRuless2.index = this.indexRules2;

        this.currentPage = 1;
        this.searchText = formData.value.SearchText;

        this.ReloadPage(false);
        this.GetRules(this.searchText, this.currentPage, this.pageSize);
    }

    OnPageChange(pageNumber: number) {
        this.currentPage = pageNumber;
        this.ReloadPage(true);
        this.GetRules(this.searchText, pageNumber, this.pageSize);
    }

    OnPageSizeChange() {
        this.currentPage = 1;
        this.pageSize = this.drpPageSize;
        this.ReloadPage(false);
        this.GetRules(this.searchText, null, this.pageSize);
    }

    EditRules(rulesId) {
        this.router.navigate(['/admin/secure/rule/' + this._global.encryptValue(rulesId)], {
            queryParams: {
                indexRules1: this.indexRules1, indexRules2: this.indexRules2, indexIndex: this.indexIndex, sortingRulesField: this.sortingRulesField, sortingRulesDirection: this.sortingRulesDirection, sortingIndexField: this.sortingIndexField, sortingIndexDirection: this.sortingIndexDirection, sortingSubIndexField: this.sortingSubIndexField, sortingSubIndexDirection: this.sortingSubIndexDirection, sortingIndexAmendmentField: this.sortingIndexAmendmentField, sortingIndexAmendmentDirection: this.sortingIndexAmendmentDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    AddRulesIndex(rulesId, index) {
        this.router.navigate(['/admin/secure/rulesindex/' + this._global.encryptValue(rulesId)], {
            queryParams: {
                indexRules1: this.indexRules1, indexRules2: this.indexRules2, indexIndex: this.indexIndex, sortingRulesField: this.sortingRulesField, sortingRulesDirection: this.sortingRulesDirection, sortingIndexField: this.sortingIndexField, sortingIndexDirection: this.sortingIndexDirection, sortingSubIndexField: this.sortingSubIndexField, sortingSubIndexDirection: this.sortingSubIndexDirection, sortingIndexAmendmentField: this.sortingIndexAmendmentField, sortingIndexAmendmentDirection: this.sortingIndexAmendmentDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    EditRulesIndex(rulesId, indexId) {
        this.router.navigate(['/admin/secure/rulesindex/' + this._global.encryptValue(rulesId) + '/' + this._global.encryptValue(indexId)], {
            queryParams: {
                indexRules1: this.indexRules1, indexRules2: this.indexRules2, indexIndex: this.indexIndex, sortingRulesField: this.sortingRulesField, sortingRulesDirection: this.sortingRulesDirection, sortingIndexField: this.sortingIndexField, sortingIndexDirection: this.sortingIndexDirection, sortingSubIndexField: this.sortingSubIndexField, sortingSubIndexDirection: this.sortingSubIndexDirection, sortingIndexAmendmentField: this.sortingIndexAmendmentField, sortingIndexAmendmentDirection: this.sortingIndexAmendmentDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    AddIndexAmendment(rulesId, index) {
        this.router.navigate(['/admin/secure/rulesindexamendment/' + this._global.encryptValue(rulesId)], {
            queryParams: {
                indexRules1: this.indexRules1, indexRules2: this.indexRules2, indexIndex: this.indexIndex, sortingRulesField: this.sortingRulesField, sortingRulesDirection: this.sortingRulesDirection, sortingIndexField: this.sortingIndexField, sortingIndexDirection: this.sortingIndexDirection, sortingSubIndexField: this.sortingSubIndexField, sortingSubIndexDirection: this.sortingSubIndexDirection, sortingIndexAmendmentField: this.sortingIndexAmendmentField, sortingIndexAmendmentDirection: this.sortingIndexAmendmentDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    EditIndexAmendment(rulesId, rulesIndexAmendmentId) {
        this.router.navigate(['/admin/secure/rulesindexamendment/' + this._global.encryptValue(rulesId) + '/' + this._global.encryptValue(rulesIndexAmendmentId)], {
            queryParams: {
                indexRules1: this.indexRules1, indexRules2: this.indexRules2, indexIndex: this.indexIndex, sortingRulesField: this.sortingRulesField, sortingRulesDirection: this.sortingRulesDirection, sortingIndexField: this.sortingIndexField, sortingIndexDirection: this.sortingIndexDirection, sortingSubIndexField: this.sortingSubIndexField, sortingSubIndexDirection: this.sortingSubIndexDirection, sortingIndexAmendmentField: this.sortingIndexAmendmentField, sortingIndexAmendmentDirection: this.sortingIndexAmendmentDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    AddRulesSubIndex(rulesId, indexId, index) {
        this.router.navigate(['/admin/secure/rulessubindex/' + this._global.encryptValue(rulesId) + '/' + this._global.encryptValue(indexId)], {
            queryParams: {
                indexRules1: this.indexRules1, indexRules2: this.indexRules2, indexIndex: this.indexIndex, sortingRulesField: this.sortingRulesField, sortingRulesDirection: this.sortingRulesDirection, sortingIndexField: this.sortingIndexField, sortingIndexDirection: this.sortingIndexDirection, sortingSubIndexField: this.sortingSubIndexField, sortingSubIndexDirection: this.sortingSubIndexDirection, sortingIndexAmendmentField: this.sortingIndexAmendmentField, sortingIndexAmendmentDirection: this.sortingIndexAmendmentDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    EditRulesSubIndex(rulesId, indexId, subIndexId) {
        this.router.navigate(['/admin/secure/rulessubindex/' + this._global.encryptValue(rulesId) + '/' + this._global.encryptValue(indexId) + '/' + this._global.encryptValue(subIndexId)], {
            queryParams: {
                indexRules1: this.indexRules1, indexRules2: this.indexRules2, indexIndex: this.indexIndex, sortingRulesField: this.sortingRulesField, sortingRulesDirection: this.sortingRulesDirection, sortingIndexField: this.sortingIndexField, sortingIndexDirection: this.sortingIndexDirection, sortingSubIndexField: this.sortingSubIndexField, sortingSubIndexDirection: this.sortingSubIndexDirection, sortingIndexAmendmentField: this.sortingIndexAmendmentField, sortingIndexAmendmentDirection: this.sortingIndexAmendmentDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    ReloadPage(isPageChange) {
        if (isPageChange == true) {
            this.indexRules1 = -1;
            this.indexRules2 = -1;

            this.itemDetailRuless1.index = this.indexRules1;
            this.itemDetailRuless2.index = this.indexRules2;
        }

        this.router.navigate(['/admin/secure/rules'], {
            queryParams: {
                indexRules1: this.indexRules1, indexRules2: this.indexRules2, indexIndex: this.indexIndex, sortingRulesField: this.sortingRulesField, sortingRulesDirection: this.sortingRulesDirection, sortingIndexField: this.sortingIndexField, sortingIndexDirection: this.sortingIndexDirection, sortingSubIndexField: this.sortingSubIndexField, sortingSubIndexDirection: this.sortingSubIndexDirection, sortingIndexAmendmentField: this.sortingIndexAmendmentField, sortingIndexAmendmentDirection: this.sortingIndexAmendmentDirection, searchText: this.searchText, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    DeleteRules(rulesId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteRules = {
                "RulesId": rulesId
            };

            this._rulesService.deleteRules(deleteRules)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_RULES_TITLE, { closeButton: true });
                        this.GetRules();
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_RULES_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_RULES_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    DeleteRulesIndex(rulesId: number, indexId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteRulesIndex = {
                "IndexId": indexId,
                "RulesId": rulesId
            };

            this._rulesIndexService.deleteRulesIndex(deleteRulesIndex)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_RULES_TITLE, { closeButton: true });
                        this.GetRulesIndex(this.itemDetailRuless1.index, rulesId, true);
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_RULES_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_RULES_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    DeleteIndexAmendment(rulesId: number, rulesIndexAmendmentId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteRulesIndexAmendment = {
                "RulesIndexAmendmentId": rulesIndexAmendmentId
            };

            this._rulesIndexAmendmentService.deleteRulesIndexAmendment(deleteRulesIndexAmendment)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_RULES_TITLE, { closeButton: true });
                        this.GetRulesIndexAmendment(this.itemDetailRuless2.index, rulesId, true);
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_RULES_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_RULES_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    DeleteRulesSubIndex(indexId: number, subIndexId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteRulesSubIndex = {
                "SubIndexId": subIndexId,
                "IndexId": indexId
            };

            this._rulesSubIndexService.deleteRulesSubIndex(deleteRulesSubIndex)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_RULES_TITLE, { closeButton: true });
                        this.GetRulesSubIndex(this.itemDetailIndexes.index, indexId, true);
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_RULES_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_RULES_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    UpDownRules1Arrow(index) {
        this.itemDetailIndexes.index = -1;

        if (index === this.itemDetailRuless1.index) {
            this.itemDetailRuless1.index = null;
        } else {
            this.itemDetailRuless1.index = index;
        }
    }

    UpDownRules2Arrow(index) {
        if (index === this.itemDetailRuless2.index) {
            this.itemDetailRuless2.index = null;
        } else {
            this.itemDetailRuless2.index = index;
        }
    }

    UpDownIndexArrow(index) {
        if (index === this.itemDetailIndexes.index) {
            this.itemDetailIndexes.index = null;
        } else {
            this.itemDetailIndexes.index = index;
        }
    }

    GetRulesIndex(index, rulesId, isDeleted): void {
        this.spinnerService.show();

        let getRulesIndexRequest = new GetRulesIndexRequest();
        getRulesIndexRequest.RulesId = rulesId;
        getRulesIndexRequest.OrderBy = this.sortingIndexField;
        getRulesIndexRequest.OrderByDirection = this.sortingIndexDirection;
        getRulesIndexRequest.IsActive = null;
        getRulesIndexRequest.PageNumber = 1;
        getRulesIndexRequest.PageSize = 100000;

        this._rulesIndexService.getRulesIndex(getRulesIndexRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.rulesIndexes = data.Response;

                    if (this.indexIndex != -1 && this.rulesIndexes.length > 0) {
                        this.itemDetailIndexes.index = this.indexIndex;
                        this.GetRulesSubIndex(this.itemDetailIndexes.index, this.rulesIndexes[this.itemDetailIndexes.index].IndexId, true);
                    }

                    if (isDeleted != true) {
                        this.UpDownRules1Arrow(index);
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_RULES_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_RULES_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    GetRulesIndexAmendment(index, rulesId, isDeleted): void {
        this.spinnerService.show();

        let getRulesIndexAmendmentRequest = new GetRulesIndexAmendmentRequest();
        getRulesIndexAmendmentRequest.RulesId = rulesId;
        getRulesIndexAmendmentRequest.OrderBy = this.sortingIndexAmendmentField;
        getRulesIndexAmendmentRequest.OrderByDirection = this.sortingIndexAmendmentDirection;
        getRulesIndexAmendmentRequest.IsActive = null;
        getRulesIndexAmendmentRequest.PageNumber = 1;
        getRulesIndexAmendmentRequest.PageSize = 100000;
        
        this._rulesIndexAmendmentService.getRulesIndexAmendment(getRulesIndexAmendmentRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.rulesIndexAmendments = data.Response;

                    if (isDeleted != true) {
                        this.UpDownRules2Arrow(index);
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_RULES_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_RULES_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    GetRulesSubIndex(index, indexId, isDeleted): void {
        this.spinnerService.show();

        let getRulesSubIndexRequest = new GetRulesSubIndexRequest();
        getRulesSubIndexRequest.IndexId = indexId;
        getRulesSubIndexRequest.OrderBy = this.sortingSubIndexField;
        getRulesSubIndexRequest.OrderByDirection = this.sortingSubIndexDirection;
        getRulesSubIndexRequest.IsActive = null;
        getRulesSubIndexRequest.PageNumber = 1;
        getRulesSubIndexRequest.PageSize = 100000;

        this._rulesSubIndexService.getRulesSubIndex(getRulesSubIndexRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.rulesSubIndexes = data.Response;

                    if (isDeleted != true) {
                        this.UpDownIndexArrow(index);
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_RULES_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_RULES_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    ShowIndex(index, rulesId) {
        this.indexRules1 = -1;
        this.indexIndex = -1;

        if (this.itemDetailRuless1.index !== index) {
            if (rulesId) {
                this.indexRules1 = index;
                this.GetRulesIndex(index, rulesId, false);
            }
        } else {
            this.UpDownRules1Arrow(index);
        }
        this.ReloadPage(false);
    }

    ShowIndexAmendment(index, rulesId) {
        this.indexRules2 = -1;

        if (this.itemDetailRuless2.index !== index) {
            if (rulesId) {
                this.indexRules2 = index;
                this.GetRulesIndexAmendment(index, rulesId, false);
            }
        } else {
            this.UpDownRules2Arrow(index);
        }
        this.ReloadPage(false);
    }

    ShowSubIndex(index, indexId) {
        this.indexIndex = -1;

        if (this.itemDetailIndexes.index !== index) {
            if (indexId) {
                this.indexIndex = index;
                this.GetRulesSubIndex(index, indexId, false);
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

    OnRulesSort(fieldName) {
        this.sortingRulesDirection = (this.sortingRulesField == fieldName) ? (this.sortingRulesDirection == "A") ? "D" : "A" : "A";
        this.sortingRulesField = fieldName;
        this.ReloadPage(true);
        this.GetRules(this.searchText, this.currentPage, this.pageSize);
    }

    OnIndexSort(rulesId, fieldName) {
        this.indexIndex = -1;
        this.itemDetailIndexes.index = this.indexIndex;

        this.sortingIndexDirection = (this.sortingIndexField == fieldName) ? (this.sortingIndexDirection == "A") ? "D" : "A" : "A";
        this.sortingIndexField = fieldName;
        this.ReloadPage(false);
        this.GetRulesIndex(this.itemDetailRuless1.index, rulesId, true);
    }

    OnSubIndexSort(indexId, fieldName) {
        this.sortingSubIndexDirection = (this.sortingSubIndexField == fieldName) ? (this.sortingSubIndexDirection == "A") ? "D" : "A" : "A";
        this.sortingSubIndexField = fieldName;
        this.ReloadPage(false);
        this.GetRulesSubIndex(this.itemDetailIndexes.index, indexId, true);
    }

    OnIndexAmendmentSort(rulesId, fieldName) {
        this.sortingIndexAmendmentDirection = (this.sortingIndexAmendmentField == fieldName) ? (this.sortingIndexAmendmentDirection == "A") ? "D" : "A" : "A";
        this.sortingIndexAmendmentField = fieldName;
        this.ReloadPage(false);
        this.GetRulesIndexAmendment(this.itemDetailRuless2.index, rulesId, true);
    }
}
