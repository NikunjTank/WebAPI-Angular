import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MasterDirection, GetMasterDirectionRequest } from '../../../model/masterDirection';
import { MasterDirectionFAQ, GetMasterDirectionFAQRequest } from '../../../model/masterDirectionFAQ';
import { MasterDirectionChapter, GetMasterDirectionChapterRequest } from '../../../model/masterDirectionChapter';
import { MasterDirectionIndex, GetMasterDirectionIndexRequest } from '../../../model/masterDirectionIndex';
import { MasterDirectionIndexAmendment, GetMasterDirectionIndexAmendmentRequest } from '../../../model/masterDirectionIndexAmendment';
import { MasterDirectionSubIndex, GetMasterDirectionSubIndexRequest } from '../../../model/masterDirectionSubIndex';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';
import { MasterDirectionAdminService } from '../../../service/admin/masterDirection.service';
import { MasterDirectionFAQAdminService } from '../../../service/admin/masterDirectionFAQ.service';
import { MasterDirectionChapterAdminService } from '../../../service/admin/masterDirectionChapter.service';
import { MasterDirectionIndexAdminService } from '../../../service/admin/masterDirectionIndex.service';
import { MasterDirectionIndexAmendmentAdminService } from '../../../service/admin/masterDirectionIndexAmendment.service';
import { MasterDirectionSubIndexAdminService } from '../../../service/admin/masterDirectionSubIndex.service';


import { ModalDialogService, IModalDialogSettings } from 'ngx-modal-dialog';
import { ContentPopUpAdminComponent } from '../../../areas/admin/contentPopUp/contentPopUp.component';

@Component({
    selector: 'my-app',
    templateUrl: './masterDirections.component.html'
})

export class MasterDirectionsAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private _masterDirectionService: MasterDirectionAdminService, private _masterDirectionFAQService: MasterDirectionFAQAdminService, private _masterDirectionChapterService: MasterDirectionChapterAdminService, private _masterDirectionIndexService: MasterDirectionIndexAdminService, private _masterDirectionIndexAmendmentService: MasterDirectionIndexAmendmentAdminService, private _masterDirectionSubIndexService: MasterDirectionSubIndexAdminService, private toastr: ToastrService, private vcr: ViewContainerRef, private spinnerService: SpinnerService, private router: Router, private modalService: ModalDialogService) { }

    _global: Global = new Global();

    masterDirections: MasterDirection[];
    masterDirectionFAQs: MasterDirectionFAQ[];
    masterDirectionChapters: MasterDirectionChapter[];
    masterDirectionIndexes: MasterDirectionIndex[];
    masterDirectionIndexAmendments: MasterDirectionIndexAmendment[];
    masterDirectionSubIndexes: MasterDirectionSubIndex[];

    frmMasterDirection: FormGroup;

    searchText: string;
    totalRecords: number;
    currentPage: number;
    pageSize: number;
    pageSizes: number[];

    itemDetailMasterDirections1 = { index: -1 };
    itemDetailMasterDirections2 = { index: -1 };
    itemDetailMasterDirections3 = { index: -1 };
    itemDetailChapters = { index: -1 };
    itemDetailIndexes = { index: -1 };

    indexMasterDirection1: number = -1;
    indexMasterDirection2: number = -1;
    indexMasterDirection3: number = -1;
    indexChapter: number = -1;
    indexIndex: number = -1;

    drpPageSize: number;

    sortingMasterDirectionField: string;
    sortingMasterDirectionDirection: string;

    sortingFAQField: string;
    sortingFAQDirection: string;

    sortingMasterChapterField: string;
    sortingMasterChapterDirection: string;

    sortingMasterDirectionIndexField: string;
    sortingMasterDirectionIndexDirection: string;

    sortingMasterDirectionSubIndexField: string;
    sortingMasterDirectionSubIndexDirection: string;

    sortingMasterDirectionIndexAmendmentField: string;
    sortingMasterDirectionIndexAmendmentDirection: string;

    masterDirectionPDFPath: string = Global.MASTERDIRECTION_PDF_FILEPATH;
    fAQPDFPath: string = Global.FAQ_PDF_FILEPATH;

    ngOnInit(): void {
        this.pageSizes = Global.PAGE_SIZES;

        this.activatedRoute.queryParams.subscribe(params => {
            this.indexMasterDirection1 = (params["indexMasterDirection1"]) ? parseInt(params["indexMasterDirection1"]) : -1;
            this.indexMasterDirection2 = (params["indexMasterDirection2"]) ? parseInt(params["indexMasterDirection2"]) : -1;
            this.indexMasterDirection3 = (params["indexMasterDirection3"]) ? parseInt(params["indexMasterDirection3"]) : -1;
            this.indexChapter = (params["indexChapter"]) ? parseInt(params["indexChapter"]) : -1;
            this.indexIndex = (params["indexIndex"]) ? parseInt(params["indexIndex"]) : -1;

            this.sortingMasterDirectionField = params["sortingMasterDirectionField"];
            this.sortingMasterDirectionDirection = params["sortingMasterDirectionDirection"];
            this.sortingFAQField = params["sortingFAQField"];
            this.sortingFAQDirection = params["sortingFAQDirection"];
            this.sortingMasterChapterField = (params["sortingMasterChapterField"]) ? params["sortingMasterChapterField"] : "SortId";
            this.sortingMasterChapterDirection = (params["sortingMasterChapterDirection"]) ? params["sortingMasterChapterDirection"] : "A";
            this.sortingMasterDirectionIndexField = (params["sortingMasterDirectionIndexField"]) ? params["sortingMasterDirectionIndexField"] : "SortId";
            this.sortingMasterDirectionIndexDirection = (params["sortingMasterDirectionIndexDirection"]) ? params["sortingMasterDirectionIndexDirection"] : "A";
            this.sortingMasterDirectionSubIndexField = (params["sortingMasterDirectionSubIndexField"]) ? params["sortingMasterDirectionSubIndexField"] : "SortId";
            this.sortingMasterDirectionSubIndexDirection = (params["sortingMasterDirectionSubIndexDirection"]) ? params["sortingMasterDirectionSubIndexDirection"] : "A";
            this.sortingMasterDirectionIndexAmendmentField = params["sortingMasterDirectionIndexAmendmentField"];
            this.sortingMasterDirectionIndexAmendmentDirection = params["sortingMasterDirectionIndexAmendmentDirection"];
            
            this.searchText = (params["searchText"]) ? params["searchText"] : null;
            this.currentPage = (params["pageNumber"]) ? parseInt(params["pageNumber"]) : 1;
            this.pageSize = (params["pageSize"]) ? parseInt(params["pageSize"]) : this.pageSizes[0];
            this.drpPageSize = this.pageSize;
        });


        this.frmMasterDirection = this.formBuilder.group({
            SearchText: [this.searchText]
        });

        this.GetMasterDirection(this.searchText, this.currentPage, this.pageSizes[0]);
    }

    GetMasterDirection(searchText?: string, pageNumber?: number, pageSize?: number): void {
        this.spinnerService.show();

        let getMasterDirectionRequest = new GetMasterDirectionRequest();
        getMasterDirectionRequest.SearchText = searchText;
        getMasterDirectionRequest.IsActive = null;
        getMasterDirectionRequest.OrderBy = this.sortingMasterDirectionField;
        getMasterDirectionRequest.OrderByDirection = this.sortingMasterDirectionDirection;
        getMasterDirectionRequest.PageNumber = (pageNumber != null) ? pageNumber : this.currentPage;
        getMasterDirectionRequest.PageSize = (pageSize != null) ? pageSize : this.pageSizes[0];

        this._masterDirectionService.getMasterDirection(getMasterDirectionRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.masterDirections = data.Response;

                    if (this.indexMasterDirection1 != -1 && this.masterDirections.length > 0) {
                        this.itemDetailMasterDirections1.index = this.indexMasterDirection1;
                        this.GetMasterDirectionFAQ(this.itemDetailMasterDirections1.index, this.masterDirections[this.itemDetailMasterDirections1.index].MasterDirectionId, true);
                    }

                    if (this.indexMasterDirection2 != -1 && this.masterDirections.length > 0) {
                        this.itemDetailMasterDirections2.index = this.indexMasterDirection2;
                        this.GetMasterDirectionChapter(this.itemDetailMasterDirections2.index, this.masterDirections[this.itemDetailMasterDirections2.index].MasterDirectionId, true);
                    }

                    if (this.indexMasterDirection3 != -1 && this.masterDirections.length > 0) {
                        this.itemDetailMasterDirections3.index = this.indexMasterDirection3;
                        this.GetMasterDirectionIndexAmendment(this.itemDetailMasterDirections3.index, this.masterDirections[this.itemDetailMasterDirections3.index].MasterDirectionId, true);
                    }

                    this.pageSize = getMasterDirectionRequest.PageSize;
                    this.totalRecords = (data.Response.length != 0) ? data.Response[0].TotalRecord : 0;
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_MASTER_DIRECTION_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_MASTER_DIRECTION_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    SearchMasterDirection(formData) {
        this.indexMasterDirection1 = -1;
        this.indexMasterDirection2 = -1;
        this.indexMasterDirection3 = -1;

        this.itemDetailMasterDirections1.index = this.indexMasterDirection1;
        this.itemDetailMasterDirections2.index = this.indexMasterDirection2;
        this.itemDetailMasterDirections3.index = this.indexMasterDirection3;

        this.currentPage = 1;
        this.searchText = formData.value.SearchText;

        this.ReloadPage(false);
        this.GetMasterDirection(this.searchText, this.currentPage, this.pageSize);
    }

    OnPageChange(pageNumber: number) {
        this.currentPage = pageNumber;
        this.ReloadPage(true);
        this.GetMasterDirection(this.searchText, pageNumber, this.pageSize);
    }

    OnPageSizeChange() {
        this.currentPage = 1;
        this.pageSize = this.drpPageSize;
        this.ReloadPage(false);
        this.GetMasterDirection(this.searchText, null, this.pageSize);
    }

    EditMasterDirection(masterDirectionId) {
        this.router.navigate(['/admin/secure/masterdirection/' + this._global.encryptValue(masterDirectionId)], {
            queryParams: {
                indexMasterDirection1: this.indexMasterDirection1, indexMasterDirection2: this.indexMasterDirection2, indexMasterDirection3: this.indexMasterDirection3, indexChapter: this.indexChapter, indexIndex: this.indexIndex, sortingMasterDirectionField: this.sortingMasterDirectionField, sortingMasterDirectionDirection: this.sortingMasterDirectionDirection, sortingFAQField: this.sortingFAQField, sortingFAQDirection: this.sortingFAQDirection, sortingMasterChapterField: this.sortingMasterChapterField, sortingMasterChapterDirection: this.sortingMasterChapterDirection, sortingMasterDirectionIndexField: this.sortingMasterDirectionIndexField, sortingMasterDirectionIndexDirection: this.sortingMasterDirectionIndexDirection, sortingMasterDirectionSubIndexField: this.sortingMasterDirectionSubIndexField, sortingMasterDirectionSubIndexDirection: this.sortingMasterDirectionSubIndexDirection, sortingMasterDirectionIndexAmendmentField: this.sortingMasterDirectionIndexAmendmentField, sortingMasterDirectionIndexAmendmentDirection: this.sortingMasterDirectionIndexAmendmentDirection, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    AddMasterDirectionFAQ(masterDirectionId, index) {
        this.router.navigate(['/admin/secure/masterdirectionfaq/' + this._global.encryptValue(masterDirectionId)], {
            queryParams: {
                indexMasterDirection1: this.indexMasterDirection1, indexMasterDirection2: this.indexMasterDirection2, indexMasterDirection3: this.indexMasterDirection3, indexChapter: this.indexChapter, indexIndex: this.indexIndex, sortingMasterDirectionField: this.sortingMasterDirectionField, sortingMasterDirectionDirection: this.sortingMasterDirectionDirection, sortingFAQField: this.sortingFAQField, sortingFAQDirection: this.sortingFAQDirection, sortingMasterChapterField: this.sortingMasterChapterField, sortingMasterChapterDirection: this.sortingMasterChapterDirection, sortingMasterDirectionIndexField: this.sortingMasterDirectionIndexField, sortingMasterDirectionIndexDirection: this.sortingMasterDirectionIndexDirection, sortingMasterDirectionSubIndexField: this.sortingMasterDirectionSubIndexField, sortingMasterDirectionSubIndexDirection: this.sortingMasterDirectionSubIndexDirection, sortingMasterDirectionIndexAmendmentField: this.sortingMasterDirectionIndexAmendmentField, sortingMasterDirectionIndexAmendmentDirection: this.sortingMasterDirectionIndexAmendmentDirection, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    EditMasterDirectionFAQ(masterDirectionId, masterDirectionFAQId) {
        this.router.navigate(['/admin/secure/masterdirectionfaq/' + this._global.encryptValue(masterDirectionId) + '/' + this._global.encryptValue(masterDirectionFAQId)], {
            queryParams: {
                indexMasterDirection1: this.indexMasterDirection1, indexMasterDirection2: this.indexMasterDirection2, indexMasterDirection3: this.indexMasterDirection3, indexChapter: this.indexChapter, indexIndex: this.indexIndex, sortingMasterDirectionField: this.sortingMasterDirectionField, sortingMasterDirectionDirection: this.sortingMasterDirectionDirection, sortingFAQField: this.sortingFAQField, sortingFAQDirection: this.sortingFAQDirection, sortingMasterChapterField: this.sortingMasterChapterField, sortingMasterChapterDirection: this.sortingMasterChapterDirection, sortingMasterDirectionIndexField: this.sortingMasterDirectionIndexField, sortingMasterDirectionIndexDirection: this.sortingMasterDirectionIndexDirection, sortingMasterDirectionSubIndexField: this.sortingMasterDirectionSubIndexField, sortingMasterDirectionSubIndexDirection: this.sortingMasterDirectionSubIndexDirection, sortingMasterDirectionIndexAmendmentField: this.sortingMasterDirectionIndexAmendmentField, sortingMasterDirectionIndexAmendmentDirection: this.sortingMasterDirectionIndexAmendmentDirection, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    AddMasterDirectionChapter(masterDirectionId, index) {
        this.router.navigate(['/admin/secure/masterdirectionchapter/' + this._global.encryptValue(masterDirectionId)], {
            queryParams: {
                indexMasterDirection1: this.indexMasterDirection1, indexMasterDirection2: this.indexMasterDirection2, indexMasterDirection3: this.indexMasterDirection3, indexChapter: this.indexChapter, indexIndex: this.indexIndex, sortingMasterDirectionField: this.sortingMasterDirectionField, sortingMasterDirectionDirection: this.sortingMasterDirectionDirection, sortingFAQField: this.sortingFAQField, sortingFAQDirection: this.sortingFAQDirection, sortingMasterChapterField: this.sortingMasterChapterField, sortingMasterChapterDirection: this.sortingMasterChapterDirection, sortingMasterDirectionIndexField: this.sortingMasterDirectionIndexField, sortingMasterDirectionIndexDirection: this.sortingMasterDirectionIndexDirection, sortingMasterDirectionSubIndexField: this.sortingMasterDirectionSubIndexField, sortingMasterDirectionSubIndexDirection: this.sortingMasterDirectionSubIndexDirection, sortingMasterDirectionIndexAmendmentField: this.sortingMasterDirectionIndexAmendmentField, sortingMasterDirectionIndexAmendmentDirection: this.sortingMasterDirectionIndexAmendmentDirection, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    EditMasterDirectionChapter(masterDirectionId, masterDirectionChapterId) {
        this.router.navigate(['/admin/secure/masterdirectionchapter/' + this._global.encryptValue(masterDirectionId) + '/' + this._global.encryptValue(masterDirectionChapterId)], {
            queryParams: {
                indexMasterDirection1: this.indexMasterDirection1, indexMasterDirection2: this.indexMasterDirection2, indexMasterDirection3: this.indexMasterDirection3, indexChapter: this.indexChapter, indexIndex: this.indexIndex, sortingMasterDirectionField: this.sortingMasterDirectionField, sortingMasterDirectionDirection: this.sortingMasterDirectionDirection, sortingFAQField: this.sortingFAQField, sortingFAQDirection: this.sortingFAQDirection, sortingMasterChapterField: this.sortingMasterChapterField, sortingMasterChapterDirection: this.sortingMasterChapterDirection, sortingMasterDirectionIndexField: this.sortingMasterDirectionIndexField, sortingMasterDirectionIndexDirection: this.sortingMasterDirectionIndexDirection, sortingMasterDirectionSubIndexField: this.sortingMasterDirectionSubIndexField, sortingMasterDirectionSubIndexDirection: this.sortingMasterDirectionSubIndexDirection, sortingMasterDirectionIndexAmendmentField: this.sortingMasterDirectionIndexAmendmentField, sortingMasterDirectionIndexAmendmentDirection: this.sortingMasterDirectionIndexAmendmentDirection, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    AddMasterDirectionIndex(masterDirectionId, masterDirectionChapterId, index) {
        this.router.navigate(['/admin/secure/masterdirectionindex/' + this._global.encryptValue(masterDirectionId) + '/' + this._global.encryptValue(masterDirectionChapterId)], {
            queryParams: {
                indexMasterDirection1: this.indexMasterDirection1, indexMasterDirection2: this.indexMasterDirection2, indexMasterDirection3: this.indexMasterDirection3, indexChapter: this.indexChapter, indexIndex: this.indexIndex, sortingMasterDirectionField: this.sortingMasterDirectionField, sortingMasterDirectionDirection: this.sortingMasterDirectionDirection, sortingFAQField: this.sortingFAQField, sortingFAQDirection: this.sortingFAQDirection, sortingMasterChapterField: this.sortingMasterChapterField, sortingMasterChapterDirection: this.sortingMasterChapterDirection, sortingMasterDirectionIndexField: this.sortingMasterDirectionIndexField, sortingMasterDirectionIndexDirection: this.sortingMasterDirectionIndexDirection, sortingMasterDirectionSubIndexField: this.sortingMasterDirectionSubIndexField, sortingMasterDirectionSubIndexDirection: this.sortingMasterDirectionSubIndexDirection, sortingMasterDirectionIndexAmendmentField: this.sortingMasterDirectionIndexAmendmentField, sortingMasterDirectionIndexAmendmentDirection: this.sortingMasterDirectionIndexAmendmentDirection, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    EditMasterDirectionIndex(masterDirectionId, masterDirectionChapterId, masterDirectionIndexId) {
        this.router.navigate(['/admin/secure/masterdirectionindex/' + this._global.encryptValue(masterDirectionId) + '/' + this._global.encryptValue(masterDirectionChapterId) + '/' + this._global.encryptValue(masterDirectionIndexId)], {
            queryParams: {
                indexMasterDirection1: this.indexMasterDirection1, indexMasterDirection2: this.indexMasterDirection2, indexMasterDirection3: this.indexMasterDirection3, indexChapter: this.indexChapter, indexIndex: this.indexIndex, sortingMasterDirectionField: this.sortingMasterDirectionField, sortingMasterDirectionDirection: this.sortingMasterDirectionDirection, sortingFAQField: this.sortingFAQField, sortingFAQDirection: this.sortingFAQDirection, sortingMasterChapterField: this.sortingMasterChapterField, sortingMasterChapterDirection: this.sortingMasterChapterDirection, sortingMasterDirectionIndexField: this.sortingMasterDirectionIndexField, sortingMasterDirectionIndexDirection: this.sortingMasterDirectionIndexDirection, sortingMasterDirectionSubIndexField: this.sortingMasterDirectionSubIndexField, sortingMasterDirectionSubIndexDirection: this.sortingMasterDirectionSubIndexDirection, sortingMasterDirectionIndexAmendmentField: this.sortingMasterDirectionIndexAmendmentField, sortingMasterDirectionIndexAmendmentDirection: this.sortingMasterDirectionIndexAmendmentDirection, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    AddMasterDirectionSubIndex(masterDirectionId, masterDirectionChapterId, masterDirectionIndexId, index) {
        this.router.navigate(['/admin/secure/masterdirectionsubindex/' + this._global.encryptValue(masterDirectionId) + '/' + this._global.encryptValue(masterDirectionChapterId) + '/' + this._global.encryptValue(masterDirectionIndexId)], {
            queryParams: {
                indexMasterDirection1: this.indexMasterDirection1, indexMasterDirection2: this.indexMasterDirection2, indexMasterDirection3: this.indexMasterDirection3, indexChapter: this.indexChapter, indexIndex: this.indexIndex, sortingMasterDirectionField: this.sortingMasterDirectionField, sortingMasterDirectionDirection: this.sortingMasterDirectionDirection, sortingFAQField: this.sortingFAQField, sortingFAQDirection: this.sortingFAQDirection, sortingMasterChapterField: this.sortingMasterChapterField, sortingMasterChapterDirection: this.sortingMasterChapterDirection, sortingMasterDirectionIndexField: this.sortingMasterDirectionIndexField, sortingMasterDirectionIndexDirection: this.sortingMasterDirectionIndexDirection, sortingMasterDirectionSubIndexField: this.sortingMasterDirectionSubIndexField, sortingMasterDirectionSubIndexDirection: this.sortingMasterDirectionSubIndexDirection, sortingMasterDirectionIndexAmendmentField: this.sortingMasterDirectionIndexAmendmentField, sortingMasterDirectionIndexAmendmentDirection: this.sortingMasterDirectionIndexAmendmentDirection, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    EditMasterDirectionSubIndex(masterDirectionId, masterDirectionChapterId, masterDirectionIndexId, masterDirectionSubIndexId) {
        this.router.navigate(['/admin/secure/masterdirectionsubindex/' + this._global.encryptValue(masterDirectionId) + '/' + this._global.encryptValue(masterDirectionChapterId) + '/' + this._global.encryptValue(masterDirectionIndexId) + '/' + this._global.encryptValue(masterDirectionSubIndexId)], {
            queryParams: {
                indexMasterDirection1: this.indexMasterDirection1, indexMasterDirection2: this.indexMasterDirection2, indexMasterDirection3: this.indexMasterDirection3, indexChapter: this.indexChapter, indexIndex: this.indexIndex, sortingMasterDirectionField: this.sortingMasterDirectionField, sortingMasterDirectionDirection: this.sortingMasterDirectionDirection, sortingFAQField: this.sortingFAQField, sortingFAQDirection: this.sortingFAQDirection, sortingMasterChapterField: this.sortingMasterChapterField, sortingMasterChapterDirection: this.sortingMasterChapterDirection, sortingMasterDirectionIndexField: this.sortingMasterDirectionIndexField, sortingMasterDirectionIndexDirection: this.sortingMasterDirectionIndexDirection, sortingMasterDirectionSubIndexField: this.sortingMasterDirectionSubIndexField, sortingMasterDirectionSubIndexDirection: this.sortingMasterDirectionSubIndexDirection, sortingMasterDirectionIndexAmendmentField: this.sortingMasterDirectionIndexAmendmentField, sortingMasterDirectionIndexAmendmentDirection: this.sortingMasterDirectionIndexAmendmentDirection, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    AddMasterDirectionIndexAmendment(masterDirectionId, index) {
        this.router.navigate(['/admin/secure/masterdirectionindexamendment/' + this._global.encryptValue(masterDirectionId)], {
            queryParams: {
                indexMasterDirection1: this.indexMasterDirection1, indexMasterDirection2: this.indexMasterDirection2, indexMasterDirection3: this.indexMasterDirection3, indexChapter: this.indexChapter, indexIndex: this.indexIndex, sortingMasterDirectionField: this.sortingMasterDirectionField, sortingMasterDirectionDirection: this.sortingMasterDirectionDirection, sortingFAQField: this.sortingFAQField, sortingFAQDirection: this.sortingFAQDirection, sortingMasterChapterField: this.sortingMasterChapterField, sortingMasterChapterDirection: this.sortingMasterChapterDirection, sortingMasterDirectionIndexField: this.sortingMasterDirectionIndexField, sortingMasterDirectionIndexDirection: this.sortingMasterDirectionIndexDirection, sortingMasterDirectionSubIndexField: this.sortingMasterDirectionSubIndexField, sortingMasterDirectionSubIndexDirection: this.sortingMasterDirectionSubIndexDirection, sortingMasterDirectionIndexAmendmentField: this.sortingMasterDirectionIndexAmendmentField, sortingMasterDirectionIndexAmendmentDirection: this.sortingMasterDirectionIndexAmendmentDirection, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    EditMasterDirectionIndexAmendment(masterDirectionId, masterDirectionIndexAmendmentId) {
        this.router.navigate(['/admin/secure/masterdirectionindexamendment/' + this._global.encryptValue(masterDirectionId) + '/' + this._global.encryptValue(masterDirectionIndexAmendmentId)], {
            queryParams: {
                indexMasterDirection1: this.indexMasterDirection1, indexMasterDirection2: this.indexMasterDirection2, indexMasterDirection3: this.indexMasterDirection3, indexChapter: this.indexChapter, indexIndex: this.indexIndex, sortingMasterDirectionField: this.sortingMasterDirectionField, sortingMasterDirectionDirection: this.sortingMasterDirectionDirection, sortingFAQField: this.sortingFAQField, sortingFAQDirection: this.sortingFAQDirection, sortingMasterChapterField: this.sortingMasterChapterField, sortingMasterChapterDirection: this.sortingMasterChapterDirection, sortingMasterDirectionIndexField: this.sortingMasterDirectionIndexField, sortingMasterDirectionIndexDirection: this.sortingMasterDirectionIndexDirection, sortingMasterDirectionSubIndexField: this.sortingMasterDirectionSubIndexField, sortingMasterDirectionSubIndexDirection: this.sortingMasterDirectionSubIndexDirection, sortingMasterDirectionIndexAmendmentField: this.sortingMasterDirectionIndexAmendmentField, sortingMasterDirectionIndexAmendmentDirection: this.sortingMasterDirectionIndexAmendmentDirection, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    ReloadPage(isPageChange) {
        if (isPageChange == true) {
            this.indexMasterDirection1 = -1;
            this.indexMasterDirection2 = -1;
            this.indexMasterDirection3 = -1;

            this.itemDetailMasterDirections1.index = this.indexMasterDirection1;
            this.itemDetailMasterDirections2.index = this.indexMasterDirection2;
            this.itemDetailMasterDirections3.index = this.indexMasterDirection3;
        }

        this.router.navigate(['/admin/secure/masterdirections'], {
            queryParams: {
                indexMasterDirection1: this.indexMasterDirection1, indexMasterDirection2: this.indexMasterDirection2, indexMasterDirection3: this.indexMasterDirection3, indexChapter: this.indexChapter, indexIndex: this.indexIndex, sortingMasterDirectionField: this.sortingMasterDirectionField, sortingMasterDirectionDirection: this.sortingMasterDirectionDirection, sortingFAQField: this.sortingFAQField, sortingFAQDirection: this.sortingFAQDirection, sortingMasterChapterField: this.sortingMasterChapterField, sortingMasterChapterDirection: this.sortingMasterChapterDirection, sortingMasterDirectionIndexField: this.sortingMasterDirectionIndexField, sortingMasterDirectionIndexDirection: this.sortingMasterDirectionIndexDirection, sortingMasterDirectionSubIndexField: this.sortingMasterDirectionSubIndexField, sortingMasterDirectionSubIndexDirection: this.sortingMasterDirectionSubIndexDirection, sortingMasterDirectionIndexAmendmentField: this.sortingMasterDirectionIndexAmendmentField, sortingMasterDirectionIndexAmendmentDirection: this.sortingMasterDirectionIndexAmendmentDirection, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    DeleteMasterDirection(masterDirectionId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteMasterDirection = {
                "MasterDirectionId": masterDirectionId
            };

            this._masterDirectionService.deleteMasterDirection(deleteMasterDirection)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_MASTER_DIRECTION_TITLE, { closeButton: true });
                        this.GetMasterDirection();
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_MASTER_DIRECTION_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_MASTER_DIRECTION_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    DeleteMasterDirectionFAQ(masterDirectionId: number, masterDirectionFAQId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteMasterDirectionFAQ = {
                "MasterDirectionId": masterDirectionId,
                "MasterDirectionFAQId": masterDirectionFAQId
            };

            this._masterDirectionFAQService.deleteMasterDirectionFAQ(deleteMasterDirectionFAQ)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_MASTER_DIRECTION_TITLE, { closeButton: true });
                        this.GetMasterDirectionFAQ(this.itemDetailMasterDirections1.index, masterDirectionId, true);
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_MASTER_DIRECTION_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_MASTER_DIRECTION_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    DeleteMasterDirectionChapter(masterDirectionId: number, masterDirectionChapterId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteMasterDirectionChapter = {
                "MasterDirectionChapterId": masterDirectionChapterId,
                "MasterDirectionId": masterDirectionId
            };

            this._masterDirectionChapterService.deleteMasterDirectionChapter(deleteMasterDirectionChapter)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_MASTER_DIRECTION_TITLE, { closeButton: true });
                        this.GetMasterDirectionChapter(this.itemDetailMasterDirections2.index, masterDirectionId, true);
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_MASTER_DIRECTION_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_MASTER_DIRECTION_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    DeleteMasterDirectionIndex(masterDirectionChapterId: number, masterDirectionIndexId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteMasterDirectionIndex = {
                "MasterDirectionIndexId": masterDirectionIndexId,
                "MasterDirectionChapterId": masterDirectionChapterId
            };

            this._masterDirectionIndexService.deleteMasterDirectionIndex(deleteMasterDirectionIndex)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_MASTER_DIRECTION_TITLE, { closeButton: true });
                        this.GetMasterDirectionIndex(this.itemDetailMasterDirections2.index, masterDirectionChapterId, true);
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_MASTER_DIRECTION_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_MASTER_DIRECTION_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    DeleteMasterDirectionIndexAmendment(masterDirectionId: number, masterDirectionIndexAmendmentId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteMasterDirectionIndexAmendment = {
                "MasterDirectionIndexAmendmentId": masterDirectionIndexAmendmentId
            };

            this._masterDirectionIndexAmendmentService.deleteMasterDirectionIndexAmendment(deleteMasterDirectionIndexAmendment)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_MASTER_DIRECTION_TITLE, { closeButton: true });
                        this.GetMasterDirectionIndexAmendment(this.itemDetailMasterDirections3.index, masterDirectionId, true);
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_MASTER_DIRECTION_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_MASTER_DIRECTION_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    DeleteMasterDirectionSubIndex(masterDirectionIndexId: number, masterDirectionSubIndexId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteMasterDirectionSubIndex = {
                "MasterDirectionSubIndexId": masterDirectionSubIndexId,
                "MasterDirectionIndexId": masterDirectionIndexId
            };

            this._masterDirectionSubIndexService.deleteMasterDirectionSubIndex(deleteMasterDirectionSubIndex)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_MASTER_DIRECTION_TITLE, { closeButton: true });
                        this.GetMasterDirectionSubIndex(this.itemDetailIndexes.index, masterDirectionIndexId, true);
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_MASTER_DIRECTION_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_MASTER_DIRECTION_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    UpDownMasterDirection1Arrow(index) {
        if (index === this.itemDetailMasterDirections1.index) {
            this.itemDetailMasterDirections1.index = null;
        } else {
            this.itemDetailMasterDirections1.index = index;
        }
    }

    UpDownMasterDirection2Arrow(index) {
        this.itemDetailChapters.index = -1;
        this.itemDetailIndexes.index = -1;

        if (index === this.itemDetailMasterDirections2.index) {
            this.itemDetailMasterDirections2.index = null;
        } else {
            this.itemDetailMasterDirections2.index = index;
        }
    }

    UpDownChapterArrow(index) {
        this.itemDetailIndexes.index = -1;

        if (index === this.itemDetailChapters.index) {
            this.itemDetailChapters.index = null;
        } else {
            this.itemDetailChapters.index = index;
        }
    }

    UpDownIndexArrow(index) {
        if (index === this.itemDetailIndexes.index) {
            this.itemDetailIndexes.index = null;
        } else {
            this.itemDetailIndexes.index = index;
        }
    }

    UpDownMasterDirection3Arrow(index) {
        if (index === this.itemDetailMasterDirections3.index) {
            this.itemDetailMasterDirections3.index = null;
        } else {
            this.itemDetailMasterDirections3.index = index;
        }
    }

    GetMasterDirectionFAQ(index, masterDirectionId, isDeleted): void {
        this.spinnerService.show();

        let getMasterDirectionFAQRequest = new GetMasterDirectionFAQRequest();
        getMasterDirectionFAQRequest.MasterDirectionId = masterDirectionId;
        getMasterDirectionFAQRequest.OrderBy = this.sortingFAQField;
        getMasterDirectionFAQRequest.OrderByDirection = this.sortingFAQDirection;
        getMasterDirectionFAQRequest.IsActive = null;
        getMasterDirectionFAQRequest.PageNumber = 1;
        getMasterDirectionFAQRequest.PageSize = 100000;

        this._masterDirectionFAQService.getMasterDirectionFAQ(getMasterDirectionFAQRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.masterDirectionFAQs = data.Response;

                    if (isDeleted != true) {
                        this.UpDownMasterDirection1Arrow(index);
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_MASTER_DIRECTION_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_MASTER_DIRECTION_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    GetMasterDirectionChapter(index, masterDirectionId, isDeleted): void {
        this.spinnerService.show();
        
        let getMasterDirectionChapterRequest = new GetMasterDirectionChapterRequest();
        getMasterDirectionChapterRequest.MasterDirectionId = masterDirectionId;
        getMasterDirectionChapterRequest.OrderBy = this.sortingMasterChapterField;
        getMasterDirectionChapterRequest.OrderByDirection = this.sortingMasterChapterDirection;
        getMasterDirectionChapterRequest.IsActive = null;
        getMasterDirectionChapterRequest.PageNumber = 1;
        getMasterDirectionChapterRequest.PageSize = 100000;

        this._masterDirectionChapterService.getMasterDirectionChapter(getMasterDirectionChapterRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.masterDirectionChapters = data.Response;

                    if (this.indexChapter != -1 && this.masterDirectionChapters.length > 0) {
                        this.itemDetailChapters.index = this.indexChapter;
                        this.GetMasterDirectionIndex(this.itemDetailMasterDirections2.index, this.masterDirectionChapters[this.itemDetailChapters.index].MasterDirectionChapterId, true);
                    }

                    if (isDeleted != true) {
                        this.UpDownMasterDirection2Arrow(index);
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_MASTER_DIRECTION_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_MASTER_DIRECTION_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    GetMasterDirectionIndex(index, masterDirectionChapterId, isDeleted): void {
        this.spinnerService.show();

        let getMasterDirectionIndexRequest = new GetMasterDirectionIndexRequest();
        getMasterDirectionIndexRequest.MasterDirectionChapterId = masterDirectionChapterId;
        getMasterDirectionIndexRequest.OrderBy = this.sortingMasterDirectionIndexField;
        getMasterDirectionIndexRequest.OrderByDirection = this.sortingMasterDirectionIndexDirection;
        getMasterDirectionIndexRequest.IsActive = null;
        getMasterDirectionIndexRequest.PageNumber = 1;
        getMasterDirectionIndexRequest.PageSize = 100000;

        this._masterDirectionIndexService.getMasterDirectionIndex(getMasterDirectionIndexRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.masterDirectionIndexes = data.Response;

                    if (this.indexIndex != -1 && this.masterDirectionIndexes.length > 0) {
                        this.itemDetailIndexes.index = this.indexIndex;
                        this.GetMasterDirectionSubIndex(this.itemDetailIndexes.index, this.masterDirectionIndexes[this.itemDetailIndexes.index].MasterDirectionIndexId, true);
                    }

                    if (isDeleted != true) {
                        this.UpDownChapterArrow(index);
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_MASTER_DIRECTION_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_MASTER_DIRECTION_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    GetMasterDirectionIndexAmendment(index, masterDirectionId, isDeleted): void {
        this.spinnerService.show();

        let getMasterDirectionIndexAmendmentRequest = new GetMasterDirectionIndexAmendmentRequest();
        getMasterDirectionIndexAmendmentRequest.MasterDirectionId = masterDirectionId;
        getMasterDirectionIndexAmendmentRequest.OrderBy = this.sortingMasterDirectionIndexAmendmentField;
        getMasterDirectionIndexAmendmentRequest.OrderByDirection = this.sortingMasterDirectionIndexAmendmentDirection;
        getMasterDirectionIndexAmendmentRequest.IsActive = null;
        getMasterDirectionIndexAmendmentRequest.PageNumber = 1;
        getMasterDirectionIndexAmendmentRequest.PageSize = 100000;

        this._masterDirectionIndexAmendmentService.getMasterDirectionIndexAmendment(getMasterDirectionIndexAmendmentRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.masterDirectionIndexAmendments = data.Response;

                    if (isDeleted != true) {
                        this.UpDownMasterDirection3Arrow(index);
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_MASTER_DIRECTION_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_MASTER_DIRECTION_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    GetMasterDirectionSubIndex(index, masterDirectionIndexId, isDeleted): void {
        this.spinnerService.show();

        let getMasterDirectionSubIndexRequest = new GetMasterDirectionSubIndexRequest();
        getMasterDirectionSubIndexRequest.MasterDirectionIndexId = masterDirectionIndexId;
        getMasterDirectionSubIndexRequest.OrderBy = this.sortingMasterDirectionSubIndexField;
        getMasterDirectionSubIndexRequest.OrderByDirection = this.sortingMasterDirectionSubIndexDirection;
        getMasterDirectionSubIndexRequest.IsActive = null;
        getMasterDirectionSubIndexRequest.PageNumber = 1;
        getMasterDirectionSubIndexRequest.PageSize = 100000;

        this._masterDirectionSubIndexService.getMasterDirectionSubIndex(getMasterDirectionSubIndexRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.masterDirectionSubIndexes = data.Response;

                    if (isDeleted != true) {
                        this.UpDownIndexArrow(index);
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_MASTER_DIRECTION_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_MASTER_DIRECTION_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    ShowMasterDirectionFAQ(index, masterDirectionId) {
        this.indexMasterDirection1 = -1;

        if (this.itemDetailMasterDirections1.index !== index) {
            if (masterDirectionId) {
                this.indexMasterDirection1 = index;
                this.GetMasterDirectionFAQ(index, masterDirectionId, false);
            }
        } else {
            this.UpDownMasterDirection1Arrow(index);
        }
        this.ReloadPage(false);
    }

    ShowMasterDirectionChapter(index, masterDirectionId) {
        this.indexMasterDirection2 = -1;
        this.indexChapter = -1;
        this.indexIndex = -1;

        if (this.itemDetailMasterDirections2.index !== index) {
            if (masterDirectionId) {
                this.indexMasterDirection2 = index;
                this.GetMasterDirectionChapter(index, masterDirectionId, false);
            }
        } else {
            this.UpDownMasterDirection2Arrow(index);
        }
        this.ReloadPage(false);
    }

    ShowMasterDirectionIndex(index, masterDirectionChapterId) {
        this.indexChapter = -1;
        this.indexIndex = -1;

        if (this.itemDetailChapters.index !== index) {
            if (masterDirectionChapterId) {
                this.indexChapter = index;
                this.GetMasterDirectionIndex(index, masterDirectionChapterId, false);
            }
        } else {
            this.UpDownChapterArrow(index);
        }
        this.ReloadPage(false);
    }

    ShowMasterDirectionIndexAmendment(index, masterDirectionId) {
        this.indexMasterDirection3 = -1;

        if (this.itemDetailMasterDirections3.index !== index) {
            if (masterDirectionId) {
                this.indexMasterDirection3 = index;
                this.GetMasterDirectionIndexAmendment(index, masterDirectionId, false);
            }
        } else {
            this.UpDownMasterDirection3Arrow(index);
        }
        this.ReloadPage(false);
    }

    ShowMasterDirectionSubIndex(index, masterDirectionIndexId) {
        this.indexIndex = -1;

        if (this.itemDetailIndexes.index !== index) {
            if (masterDirectionIndexId) {
                this.indexIndex = index;
                this.GetMasterDirectionSubIndex(index, masterDirectionIndexId, false);
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

    OnMasterDirectionSort(fieldName) {
        this.sortingMasterDirectionDirection = (this.sortingMasterDirectionField == fieldName) ? (this.sortingMasterDirectionDirection == "A") ? "D" : "A" : "A";
        this.sortingMasterDirectionField = fieldName;
        this.ReloadPage(true);

        this.GetMasterDirection(this.searchText, this.currentPage, this.pageSize);
    }

    OnMasterDirectionFAQSort(masterDirectionId, fieldName) {
        this.sortingFAQDirection = (this.sortingFAQField == fieldName) ? (this.sortingFAQDirection == "A") ? "D" : "A" : "A";
        this.sortingFAQField = fieldName;
        this.ReloadPage(false);

        this.GetMasterDirectionFAQ(this.itemDetailMasterDirections1.index, masterDirectionId, true);
    }

    OnMasterDirectionChapterSort(masterDirectionId, fieldName) {
        this.indexChapter = -1;
        this.itemDetailChapters.index = this.indexChapter;

        this.sortingMasterChapterDirection = (this.sortingMasterChapterField == fieldName) ? (this.sortingMasterChapterDirection == "A") ? "D" : "A" : "A";
        this.sortingMasterChapterField = fieldName;
        this.ReloadPage(false);

        this.GetMasterDirectionChapter(this.itemDetailMasterDirections2.index, masterDirectionId, true);
    }

    OnMasterDirectionIndexSort(masterDirectionChapterId, fieldName) {
        this.indexIndex = -1;
        this.itemDetailIndexes.index = this.indexIndex;

        this.sortingMasterDirectionIndexDirection = (this.sortingMasterDirectionIndexField == fieldName) ? (this.sortingMasterDirectionIndexDirection == "A") ? "D" : "A" : "A";
        this.sortingMasterDirectionIndexField = fieldName;
        this.ReloadPage(false);

        this.GetMasterDirectionIndex(this.itemDetailChapters.index, masterDirectionChapterId, true);
    }

    OnMasterDirectionSubIndexSort(masterDirectionIndexId, fieldName) {
        this.sortingMasterDirectionSubIndexDirection = (this.sortingMasterDirectionSubIndexField == fieldName) ? (this.sortingMasterDirectionSubIndexDirection == "A") ? "D" : "A" : "A";
        this.sortingMasterDirectionSubIndexField = fieldName;
        this.ReloadPage(false);

        this.GetMasterDirectionSubIndex(this.itemDetailIndexes.index, masterDirectionIndexId, true);
    }

    OnMasterDirectionIndexAmendmentSort(masterDirectionId, fieldName) {
        this.sortingMasterDirectionIndexAmendmentDirection = (this.sortingMasterDirectionIndexAmendmentField == fieldName) ? (this.sortingMasterDirectionIndexAmendmentDirection == "A") ? "D" : "A" : "A";
        this.sortingMasterDirectionIndexAmendmentField = fieldName;
        this.ReloadPage(false);

        this.GetMasterDirectionIndexAmendment(this.itemDetailMasterDirections3.index, masterDirectionId, true);
    }
}