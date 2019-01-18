import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FDICircular, GetFDICircularRequest } from '../../../model/fDICircular';
import { FDIChapter, GetFDIChapterRequest } from '../../../model/fDIChapter';
import { FDICircularIndex, GetFDICircularIndexRequest } from '../../../model/fDICircularIndex';
import { FDICircularIndexAmendment, GetFDICircularIndexAmendmentRequest } from '../../../model/fDICircularIndexAmendment';
import { FDICircularSubIndex, GetFDICircularSubIndexRequest } from '../../../model/fDICircularSubIndex';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';
import { FDICircularAdminService } from '../../../service/admin/fDICircular.service';
import { FDIChapterAdminService } from '../../../service/admin/fDIChapter.service';
import { FDICircularIndexAdminService } from '../../../service/admin/fDICircularIndex.service';
import { FDICircularIndexAmendmentAdminService } from '../../../service/admin/fDICircularIndexAmendment.service';
import { FDICircularSubIndexAdminService } from '../../../service/admin/fDICircularSubIndex.service';


import { ModalDialogService, IModalDialogSettings } from 'ngx-modal-dialog';
import { ContentPopUpAdminComponent } from '../../../areas/admin/contentPopUp/contentPopUp.component';

@Component({
    selector: 'my-app',
    templateUrl: './fDICirculars.component.html'
})

export class FDICircularsAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private _fDICircularService: FDICircularAdminService, private _fDIChapterService: FDIChapterAdminService, private _fDICircularIndexService: FDICircularIndexAdminService, private _fDICircularIndexAmendmentService: FDICircularIndexAmendmentAdminService, private _fDICircularSubIndexService: FDICircularSubIndexAdminService, private toastr: ToastrService, private vcr: ViewContainerRef, private spinnerService: SpinnerService, private router: Router, private modalService: ModalDialogService) { }

    _global: Global = new Global();

    fDICirculars: FDICircular[];
    fDIChapters: FDIChapter[];
    fDICircularIndexes: FDICircularIndex[];
    fDICircularIndexAmendments: FDICircularIndexAmendment[];
    fDICircularSubIndexes: FDICircularSubIndex[];

    frmFDICircular: FormGroup;

    searchText: string;
    totalRecords: number;
    currentPage: number;
    pageSize: number;
    pageSizes: number[];

    itemDetailFDICirculars1 = { index: -1 };
    itemDetailFDICirculars2 = { index: -1 };
    itemDetailChapters = { index: -1 };
    itemDetailIndexes = { index: -1 };

    indexFDICircular1: number = -1;
    indexFDICircular2: number = -1;
    indexChapter: number = -1;
    indexIndex: number = -1;

    drpPageSize: number;

    sortingFDICircularField: string;
    sortingFDICircularDirection: string;

    sortingFDIChapterField: string;
    sortingFDIChapterDirection: string;

    sortingFDICircularIndexField: string;
    sortingFDICircularIndexDirection: string;

    sortingFDICircularSubIndexField: string;
    sortingFDICircularSubIndexDirection: string;

    sortingFDICircularIndexAmendmentField: string;
    sortingFDICircularIndexAmendmentDirection: string;

    pdfServerPath: string = Global.FDICIRCULAR_PDF_FILEPATH;

    ngOnInit(): void {
        this.pageSizes = Global.PAGE_SIZES;

        this.activatedRoute.queryParams.subscribe(params => {
            this.indexFDICircular1 = (params["indexFDICircular1"]) ? parseInt(params["indexFDICircular1"]) : -1;
            this.indexFDICircular2 = (params["indexFDICircular2"]) ? parseInt(params["indexFDICircular2"]) : -1;
            this.indexChapter = (params["indexChapter"]) ? parseInt(params["indexChapter"]) : -1;
            this.indexIndex = (params["indexIndex"]) ? parseInt(params["indexIndex"]) : -1;

            this.sortingFDICircularField = params["sortingFDICircularField"];
            this.sortingFDICircularDirection = params["sortingFDICircularDirection"];
            this.sortingFDIChapterField = (params["sortingFDIChapterField"]) ? params["sortingFDIChapterField"] : "SortId";
            this.sortingFDIChapterDirection = (params["sortingFDIChapterDirection"]) ? params["sortingFDIChapterDirection"] : "D";
            this.sortingFDICircularIndexField = (params["sortingFDICircularIndexField"]) ? params["sortingFDICircularIndexField"] : "SortId";
            this.sortingFDICircularIndexDirection = (params["sortingFDICircularIndexDirection"]) ? params["sortingFDICircularIndexDirection"] : "D";
            this.sortingFDICircularSubIndexField = (params["sortingFDICircularSubIndexField"]) ? params["sortingFDICircularSubIndexField"] : "SortId";
            this.sortingFDICircularSubIndexDirection = (params["sortingFDICircularSubIndexDirection"]) ? params["sortingFDICircularSubIndexDirection"] : "D";
            this.sortingFDICircularIndexAmendmentField = params["sortingFDICircularIndexAmendmentField"];
            this.sortingFDICircularIndexAmendmentDirection = params["sortingFDICircularIndexAmendmentDirection"];

            this.searchText = (params["searchText"]) ? params["searchText"] : null;
            this.currentPage = (params["pageNumber"]) ? parseInt(params["pageNumber"]) : 1;
            this.pageSize = (params["pageSize"]) ? parseInt(params["pageSize"]) : this.pageSizes[0];
            this.drpPageSize = this.pageSize;
        });


        this.frmFDICircular = this.formBuilder.group({
            SearchText: [this.searchText]
        });

        this.GetFDICircular(this.searchText, this.currentPage, this.pageSizes[0]);
    }

    GetFDICircular(searchText?: string, pageNumber?: number, pageSize?: number): void {
        this.spinnerService.show();

        let getFDICircularRequest = new GetFDICircularRequest();
        getFDICircularRequest.SearchText = searchText;
        getFDICircularRequest.IsActive = null;
        getFDICircularRequest.OrderBy = this.sortingFDICircularField;
        getFDICircularRequest.OrderByDirection = this.sortingFDICircularDirection;
        getFDICircularRequest.PageNumber = (pageNumber != null) ? pageNumber : this.currentPage;
        getFDICircularRequest.PageSize = (pageSize != null) ? pageSize : this.pageSizes[0];

        this._fDICircularService.getFDICircular(getFDICircularRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.fDICirculars = data.Response;

                    if (this.indexFDICircular1 != -1 && this.fDICirculars.length > 0) {
                        this.itemDetailFDICirculars1.index = this.indexFDICircular1;
                        this.GetFDIChapter(this.itemDetailFDICirculars1.index, this.fDICirculars[this.itemDetailFDICirculars1.index].FDICircularId, true);
                    }

                    if (this.indexFDICircular2 != -1 && this.fDICirculars.length > 0) {
                        this.itemDetailFDICirculars2.index = this.indexFDICircular2;
                        this.GetFDICircularIndexAmendment(this.itemDetailFDICirculars2.index, this.fDICirculars[this.itemDetailFDICirculars2.index].FDICircularId, true);
                    }

                    this.pageSize = getFDICircularRequest.PageSize;
                    this.totalRecords = (data.Response.length != 0) ? data.Response[0].TotalRecord : 0;
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_FDI_CIRCULAR_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FDI_CIRCULAR_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    SearchFDICircular(formData) {
        this.indexFDICircular1 = -1;
        this.indexFDICircular2 = -1;

        this.itemDetailFDICirculars1.index = this.indexFDICircular1;
        this.itemDetailFDICirculars2.index = this.indexFDICircular2;

        this.currentPage = 1;
        this.searchText = formData.value.SearchText;

        this.ReloadPage(false);
        this.GetFDICircular(this.searchText, this.currentPage, this.pageSize);
    }

    OnPageChange(pageNumber: number) {
        this.currentPage = pageNumber;
        this.ReloadPage(true);
        this.GetFDICircular(this.searchText, pageNumber, this.pageSize);
    }

    OnPageSizeChange() {
        this.currentPage = 1;
        this.pageSize = this.drpPageSize;
        this.ReloadPage(false);
        this.GetFDICircular(this.searchText, null, this.pageSize);
    }

    EditFDICircular(fDICircularId) {
        this.router.navigate(['/admin/secure/fdicircular/' + this._global.encryptValue(fDICircularId)], {
            queryParams: {
                indexFDICircular1: this.indexFDICircular1, indexFDICircular2: this.indexFDICircular2, indexChapter: this.indexChapter, indexIndex: this.indexIndex, sortingFDICircularField: this.sortingFDICircularField, sortingFDICircularDirection: this.sortingFDICircularDirection, sortingFDIChapterField: this.sortingFDIChapterField, sortingFDIChapterDirection: this.sortingFDIChapterDirection, sortingFDICircularIndexField: this.sortingFDICircularIndexField, sortingFDICircularIndexDirection: this.sortingFDICircularIndexDirection, sortingFDICircularSubIndexField: this.sortingFDICircularSubIndexField, sortingFDICircularSubIndexDirection: this.sortingFDICircularSubIndexDirection, sortingFDICircularIndexAmendmentField: this.sortingFDICircularIndexAmendmentField, sortingFDICircularIndexAmendmentDirection: this.sortingFDICircularIndexAmendmentDirection, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    AddFDIChapter(fDICircularId, index) {
        this.router.navigate(['/admin/secure/fdichapter/' + this._global.encryptValue(fDICircularId)], {
            queryParams: {
                indexFDICircular1: this.indexFDICircular1, indexFDICircular2: this.indexFDICircular2, indexChapter: this.indexChapter, indexIndex: this.indexIndex, sortingFDICircularField: this.sortingFDICircularField, sortingFDICircularDirection: this.sortingFDICircularDirection, sortingFDIChapterField: this.sortingFDIChapterField, sortingFDIChapterDirection: this.sortingFDIChapterDirection, sortingFDICircularIndexField: this.sortingFDICircularIndexField, sortingFDICircularIndexDirection: this.sortingFDICircularIndexDirection, sortingFDICircularSubIndexField: this.sortingFDICircularSubIndexField, sortingFDICircularSubIndexDirection: this.sortingFDICircularSubIndexDirection, sortingFDICircularIndexAmendmentField: this.sortingFDICircularIndexAmendmentField, sortingFDICircularIndexAmendmentDirection: this.sortingFDICircularIndexAmendmentDirection, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    EditFDIChapter(fDICircularId, fDIChapterId) {
        this.router.navigate(['/admin/secure/fdichapter/' + this._global.encryptValue(fDICircularId) + '/' + this._global.encryptValue(fDIChapterId)], {
            queryParams: {
                indexFDICircular1: this.indexFDICircular1, indexFDICircular2: this.indexFDICircular2, indexChapter: this.indexChapter, indexIndex: this.indexIndex, sortingFDICircularField: this.sortingFDICircularField, sortingFDICircularDirection: this.sortingFDICircularDirection, sortingFDIChapterField: this.sortingFDIChapterField, sortingFDIChapterDirection: this.sortingFDIChapterDirection, sortingFDICircularIndexField: this.sortingFDICircularIndexField, sortingFDICircularIndexDirection: this.sortingFDICircularIndexDirection, sortingFDICircularSubIndexField: this.sortingFDICircularSubIndexField, sortingFDICircularSubIndexDirection: this.sortingFDICircularSubIndexDirection, sortingFDICircularIndexAmendmentField: this.sortingFDICircularIndexAmendmentField, sortingFDICircularIndexAmendmentDirection: this.sortingFDICircularIndexAmendmentDirection, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    AddFDICircularIndex(fDICircularId, fDIChapterId, index) {
        this.router.navigate(['/admin/secure/fdicircularindex/' + this._global.encryptValue(fDICircularId) + '/' + this._global.encryptValue(fDIChapterId)], {
            queryParams: {
                indexFDICircular1: this.indexFDICircular1, indexFDICircular2: this.indexFDICircular2, indexChapter: this.indexChapter, indexIndex: this.indexIndex, sortingFDICircularField: this.sortingFDICircularField, sortingFDICircularDirection: this.sortingFDICircularDirection, sortingFDIChapterField: this.sortingFDIChapterField, sortingFDIChapterDirection: this.sortingFDIChapterDirection, sortingFDICircularIndexField: this.sortingFDICircularIndexField, sortingFDICircularIndexDirection: this.sortingFDICircularIndexDirection, sortingFDICircularSubIndexField: this.sortingFDICircularSubIndexField, sortingFDICircularSubIndexDirection: this.sortingFDICircularSubIndexDirection, sortingFDICircularIndexAmendmentField: this.sortingFDICircularIndexAmendmentField, sortingFDICircularIndexAmendmentDirection: this.sortingFDICircularIndexAmendmentDirection, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    EditFDICircularIndex(fDICircularId, fDIChapterId, fDICircularIndexId) {
        this.router.navigate(['/admin/secure/fdicircularindex/' + this._global.encryptValue(fDICircularId) + '/' + this._global.encryptValue(fDIChapterId) + '/' + this._global.encryptValue(fDICircularIndexId)], {
            queryParams: {
                indexFDICircular1: this.indexFDICircular1, indexFDICircular2: this.indexFDICircular2, indexChapter: this.indexChapter, indexIndex: this.indexIndex, sortingFDICircularField: this.sortingFDICircularField, sortingFDICircularDirection: this.sortingFDICircularDirection, sortingFDIChapterField: this.sortingFDIChapterField, sortingFDIChapterDirection: this.sortingFDIChapterDirection, sortingFDICircularIndexField: this.sortingFDICircularIndexField, sortingFDICircularIndexDirection: this.sortingFDICircularIndexDirection, sortingFDICircularSubIndexField: this.sortingFDICircularSubIndexField, sortingFDICircularSubIndexDirection: this.sortingFDICircularSubIndexDirection, sortingFDICircularIndexAmendmentField: this.sortingFDICircularIndexAmendmentField, sortingFDICircularIndexAmendmentDirection: this.sortingFDICircularIndexAmendmentDirection, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    AddFDICircularSubIndex(fDICircularId, fDIChapterId, fDICircularIndexId, index) {
        this.router.navigate(['/admin/secure/fdicircularsubindex/' + this._global.encryptValue(fDICircularId) + '/' + this._global.encryptValue(fDIChapterId) + '/' + this._global.encryptValue(fDICircularIndexId)], {
            queryParams: {
                indexFDICircular1: this.indexFDICircular1, indexFDICircular2: this.indexFDICircular2, indexChapter: this.indexChapter, indexIndex: this.indexIndex, sortingFDICircularField: this.sortingFDICircularField, sortingFDICircularDirection: this.sortingFDICircularDirection, sortingFDIChapterField: this.sortingFDIChapterField, sortingFDIChapterDirection: this.sortingFDIChapterDirection, sortingFDICircularIndexField: this.sortingFDICircularIndexField, sortingFDICircularIndexDirection: this.sortingFDICircularIndexDirection, sortingFDICircularSubIndexField: this.sortingFDICircularSubIndexField, sortingFDICircularSubIndexDirection: this.sortingFDICircularSubIndexDirection, sortingFDICircularIndexAmendmentField: this.sortingFDICircularIndexAmendmentField, sortingFDICircularIndexAmendmentDirection: this.sortingFDICircularIndexAmendmentDirection, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    EditFDICircularSubIndex(fDICircularId, fDIChapterId, fDICircularIndexId, fDICircularSubIndexId) {
        this.router.navigate(['/admin/secure/fdicircularsubindex/' + this._global.encryptValue(fDICircularId) + '/' + this._global.encryptValue(fDIChapterId) + '/' + this._global.encryptValue(fDICircularIndexId) + '/' + this._global.encryptValue(fDICircularSubIndexId)], {
            queryParams: {
                indexFDICircular1: this.indexFDICircular1, indexFDICircular2: this.indexFDICircular2, indexChapter: this.indexChapter, indexIndex: this.indexIndex, sortingFDICircularField: this.sortingFDICircularField, sortingFDICircularDirection: this.sortingFDICircularDirection, sortingFDIChapterField: this.sortingFDIChapterField, sortingFDIChapterDirection: this.sortingFDIChapterDirection, sortingFDICircularIndexField: this.sortingFDICircularIndexField, sortingFDICircularIndexDirection: this.sortingFDICircularIndexDirection, sortingFDICircularSubIndexField: this.sortingFDICircularSubIndexField, sortingFDICircularSubIndexDirection: this.sortingFDICircularSubIndexDirection, sortingFDICircularIndexAmendmentField: this.sortingFDICircularIndexAmendmentField, sortingFDICircularIndexAmendmentDirection: this.sortingFDICircularIndexAmendmentDirection, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    AddFDICircularIndexAmendment(fDICircularId, index) {
        this.router.navigate(['/admin/secure/fdicircularindexamendment/' + this._global.encryptValue(fDICircularId)], {
            queryParams: {
                indexFDICircular1: this.indexFDICircular1, indexFDICircular2: this.indexFDICircular2, indexChapter: this.indexChapter, indexIndex: this.indexIndex, sortingFDICircularField: this.sortingFDICircularField, sortingFDICircularDirection: this.sortingFDICircularDirection, sortingFDIChapterField: this.sortingFDIChapterField, sortingFDIChapterDirection: this.sortingFDIChapterDirection, sortingFDICircularIndexField: this.sortingFDICircularIndexField, sortingFDICircularIndexDirection: this.sortingFDICircularIndexDirection, sortingFDICircularSubIndexField: this.sortingFDICircularSubIndexField, sortingFDICircularSubIndexDirection: this.sortingFDICircularSubIndexDirection, sortingFDICircularIndexAmendmentField: this.sortingFDICircularIndexAmendmentField, sortingFDICircularIndexAmendmentDirection: this.sortingFDICircularIndexAmendmentDirection, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    EditFDICircularIndexAmendment(fDICircularId, fDICircularIndexAmendmentId) {
        this.router.navigate(['/admin/secure/fdicircularindexamendment/' + this._global.encryptValue(fDICircularId) + '/' + this._global.encryptValue(fDICircularIndexAmendmentId)], {
            queryParams: {
                indexFDICircular1: this.indexFDICircular1, indexFDICircular2: this.indexFDICircular2, indexChapter: this.indexChapter, indexIndex: this.indexIndex, sortingFDICircularField: this.sortingFDICircularField, sortingFDICircularDirection: this.sortingFDICircularDirection, sortingFDIChapterField: this.sortingFDIChapterField, sortingFDIChapterDirection: this.sortingFDIChapterDirection, sortingFDICircularIndexField: this.sortingFDICircularIndexField, sortingFDICircularIndexDirection: this.sortingFDICircularIndexDirection, sortingFDICircularSubIndexField: this.sortingFDICircularSubIndexField, sortingFDICircularSubIndexDirection: this.sortingFDICircularSubIndexDirection, sortingFDICircularIndexAmendmentField: this.sortingFDICircularIndexAmendmentField, sortingFDICircularIndexAmendmentDirection: this.sortingFDICircularIndexAmendmentDirection, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    ReloadPage(isPageChange) {
        if (isPageChange == true) {
            this.indexFDICircular1 = -1;
            this.indexFDICircular2 = -1;

            this.itemDetailFDICirculars1.index = this.indexFDICircular1;
            this.itemDetailFDICirculars2.index = this.indexFDICircular2;
        }

        this.router.navigate(['/admin/secure/fdicirculars'], {
            queryParams: {
                indexFDICircular1: this.indexFDICircular1, indexFDICircular2: this.indexFDICircular2, indexChapter: this.indexChapter, indexIndex: this.indexIndex, sortingFDICircularField: this.sortingFDICircularField, sortingFDICircularDirection: this.sortingFDICircularDirection, sortingFDIChapterField: this.sortingFDIChapterField, sortingFDIChapterDirection: this.sortingFDIChapterDirection, sortingFDICircularIndexField: this.sortingFDICircularIndexField, sortingFDICircularIndexDirection: this.sortingFDICircularIndexDirection, sortingFDICircularSubIndexField: this.sortingFDICircularSubIndexField, sortingFDICircularSubIndexDirection: this.sortingFDICircularSubIndexDirection, sortingFDICircularIndexAmendmentField: this.sortingFDICircularIndexAmendmentField, sortingFDICircularIndexAmendmentDirection: this.sortingFDICircularIndexAmendmentDirection, pageNumber: this.currentPage, pageSize: this.pageSize
            }
        });
    }

    DeleteFDICircular(fDICircularId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteFDICircular = {
                "FDICircularId": fDICircularId
            };

            this._fDICircularService.deleteFDICircular(deleteFDICircular)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_FDI_CIRCULAR_TITLE, { closeButton: true });
                        this.GetFDICircular();
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_FDI_CIRCULAR_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FDI_CIRCULAR_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    DeleteFDIChapter(fDICircularId: number, fDIChapterId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteFDIChapter = {
                "FDIChapterId": fDIChapterId,
                "FDICircularId": fDICircularId
            };

            this._fDIChapterService.deleteFDIChapter(deleteFDIChapter)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_FDI_CIRCULAR_TITLE, { closeButton: true });
                        this.GetFDIChapter(this.itemDetailFDICirculars1.index, fDICircularId, true);
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_FDI_CIRCULAR_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FDI_CIRCULAR_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    DeleteFDICircularIndex(fDIChapterId: number, fDICircularIndexId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteFDICircularIndex = {
                "FDICircularIndexId": fDICircularIndexId,
                "FDIChapterId": fDIChapterId
            };

            this._fDICircularIndexService.deleteFDICircularIndex(deleteFDICircularIndex)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_FDI_CIRCULAR_TITLE, { closeButton: true });
                        this.GetFDICircularIndex(this.itemDetailFDICirculars1.index, fDIChapterId, true);
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_FDI_CIRCULAR_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FDI_CIRCULAR_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    DeleteFDICircularIndexAmendment(fDICircularId: number, fDICircularIndexAmendmentId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteFDICircularIndexAmendment = {
                "FDICircularIndexAmendmentId": fDICircularIndexAmendmentId
            };

            this._fDICircularIndexAmendmentService.deleteFDICircularIndexAmendment(deleteFDICircularIndexAmendment)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_FDI_CIRCULAR_TITLE, { closeButton: true });
                        this.GetFDICircularIndexAmendment(this.itemDetailFDICirculars2.index, fDICircularId, true);
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_FDI_CIRCULAR_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FDI_CIRCULAR_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    DeleteFDICircularSubIndex(fDICircularIndexId: number, fDICircularSubIndexId: number) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteFDICircularSubIndex = {
                "FDICircularSubIndexId": fDICircularSubIndexId,
                "FDICircularIndexId": fDICircularIndexId
            };

            this._fDICircularSubIndexService.deleteFDICircularSubIndex(deleteFDICircularSubIndex)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_FDI_CIRCULAR_TITLE, { closeButton: true });
                        this.GetFDICircularSubIndex(this.itemDetailIndexes.index, fDICircularIndexId, true);
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_FDI_CIRCULAR_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FDI_CIRCULAR_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    UpDownFDICircular1Arrow(index) {
        this.itemDetailChapters.index = -1;
        this.itemDetailIndexes.index = -1;

        if (index === this.itemDetailFDICirculars1.index) {
            this.itemDetailFDICirculars1.index = null;
        } else {
            this.itemDetailFDICirculars1.index = index;
        }
    }

    UpDownFDICircular2Arrow(index) {
        if (index === this.itemDetailFDICirculars2.index) {
            this.itemDetailFDICirculars2.index = null;
        } else {
            this.itemDetailFDICirculars2.index = index;
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

    GetFDIChapter(index, fDICircularId, isDeleted): void {
        this.spinnerService.show();

        let getFDIChapterRequest = new GetFDIChapterRequest();
        getFDIChapterRequest.FDICircularId = fDICircularId;
        getFDIChapterRequest.OrderBy = this.sortingFDIChapterField;
        getFDIChapterRequest.OrderByDirection = this.sortingFDIChapterDirection;
        getFDIChapterRequest.IsActive = null;
        getFDIChapterRequest.PageNumber = 1;
        getFDIChapterRequest.PageSize = 100000;
        
        this._fDIChapterService.getFDIChapter(getFDIChapterRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.fDIChapters = data.Response;
                    
                    if (this.indexChapter != -1 && this.fDIChapters.length > 0) {
                        this.itemDetailChapters.index = this.indexChapter;
                        this.GetFDICircularIndex(this.itemDetailFDICirculars1.index, this.fDIChapters[this.itemDetailChapters.index].FDIChapterId, true);
                    }
                    
                    if (isDeleted != true) {
                        this.UpDownFDICircular1Arrow(index);
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_FDI_CIRCULAR_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FDI_CIRCULAR_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    GetFDICircularIndex(index, fDIChapterId, isDeleted): void {
        this.spinnerService.show();

        let getFDICircularIndexRequest = new GetFDICircularIndexRequest();
        getFDICircularIndexRequest.FDIChapterId = fDIChapterId;
        getFDICircularIndexRequest.OrderBy = this.sortingFDICircularIndexField;
        getFDICircularIndexRequest.OrderByDirection = this.sortingFDICircularIndexDirection;
        getFDICircularIndexRequest.IsActive = null;
        getFDICircularIndexRequest.PageNumber = 1;
        getFDICircularIndexRequest.PageSize = 100000;

        this._fDICircularIndexService.getFDICircularIndex(getFDICircularIndexRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.fDICircularIndexes = data.Response;

                    if (this.indexIndex != -1 && this.fDICircularIndexes.length > 0) {
                        this.itemDetailIndexes.index = this.indexIndex;
                        this.GetFDICircularSubIndex(this.itemDetailIndexes.index, this.fDICircularIndexes[this.itemDetailIndexes.index].FDICircularIndexId, true);
                    }

                    if (isDeleted != true) {
                        this.UpDownChapterArrow(index);
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_FDI_CIRCULAR_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FDI_CIRCULAR_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    GetFDICircularIndexAmendment(index, fDICircularId, isDeleted): void {
        this.spinnerService.show();

        let getFDICircularIndexAmendmentRequest = new GetFDICircularIndexAmendmentRequest();
        getFDICircularIndexAmendmentRequest.FDICircularId = fDICircularId;
        getFDICircularIndexAmendmentRequest.OrderBy = this.sortingFDICircularIndexAmendmentField;
        getFDICircularIndexAmendmentRequest.OrderByDirection = this.sortingFDICircularIndexAmendmentDirection;
        getFDICircularIndexAmendmentRequest.IsActive = null;
        getFDICircularIndexAmendmentRequest.PageNumber = 1;
        getFDICircularIndexAmendmentRequest.PageSize = 100000;

        this._fDICircularIndexAmendmentService.getFDICircularIndexAmendment(getFDICircularIndexAmendmentRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.fDICircularIndexAmendments = data.Response;

                    if (isDeleted != true) {
                        this.UpDownFDICircular2Arrow(index);
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_FDI_CIRCULAR_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FDI_CIRCULAR_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    GetFDICircularSubIndex(index, fDICircularIndexId, isDeleted): void {
        this.spinnerService.show();

        let getFDICircularSubIndexRequest = new GetFDICircularSubIndexRequest();
        getFDICircularSubIndexRequest.FDICircularIndexId = fDICircularIndexId;
        getFDICircularSubIndexRequest.OrderBy = this.sortingFDICircularSubIndexField;
        getFDICircularSubIndexRequest.OrderByDirection = this.sortingFDICircularSubIndexDirection;
        getFDICircularSubIndexRequest.IsActive = null;
        getFDICircularSubIndexRequest.PageNumber = 1;
        getFDICircularSubIndexRequest.PageSize = 100000;

        this._fDICircularSubIndexService.getFDICircularSubIndex(getFDICircularSubIndexRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.fDICircularSubIndexes = data.Response;

                    if (isDeleted != true) {
                        this.UpDownIndexArrow(index);
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_FDI_CIRCULAR_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FDI_CIRCULAR_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    ShowFDIChapter(index, fDICircularId) {
        this.indexFDICircular1 = -1;
        this.indexChapter = -1;
        this.indexIndex = -1;

        if (this.itemDetailFDICirculars1.index !== index) {
            if (fDICircularId) {
                this.indexFDICircular1 = index;
                this.GetFDIChapter(index, fDICircularId, false);
            }
        } else {
            this.UpDownFDICircular1Arrow(index);
        }
        this.ReloadPage(false);
    }

    ShowFDICircularIndex(index, fDIChapterId) {
        this.indexChapter = -1;
        this.indexIndex = -1;

        if (this.itemDetailChapters.index !== index) {
            if (fDIChapterId) {
                this.indexChapter = index;
                this.GetFDICircularIndex(index, fDIChapterId, false);
            }
        } else {
            this.UpDownChapterArrow(index);
        }
        this.ReloadPage(false);
    }

    ShowFDICircularIndexAmendment(index, fDICircularId) {
        this.indexFDICircular2 = -1;

        if (this.itemDetailFDICirculars2.index !== index) {
            if (fDICircularId) {
                this.indexFDICircular2 = index;
                this.GetFDICircularIndexAmendment(index, fDICircularId, false);
            }
        } else {
            this.UpDownFDICircular2Arrow(index);
        }
        this.ReloadPage(false);
    }

    ShowFDICircularSubIndex(index, fDICircularIndexId) {
        this.indexIndex = -1;

        if (this.itemDetailIndexes.index !== index) {
            if (fDICircularIndexId) {
                this.indexIndex = index;
                this.GetFDICircularSubIndex(index, fDICircularIndexId, false);
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

    OnFDICircularSort(fieldName) {
        this.sortingFDICircularDirection = (this.sortingFDICircularField == fieldName) ? (this.sortingFDICircularDirection == "A") ? "D" : "A" : "A";
        this.sortingFDICircularField = fieldName;
        this.ReloadPage(true);

        this.GetFDICircular(this.searchText, this.currentPage, this.pageSize);
    }

    OnFDIChapterSort(fDICircularId, fieldName) {
        this.indexChapter = -1;
        this.itemDetailChapters.index = this.indexChapter;

        this.sortingFDIChapterDirection = (this.sortingFDIChapterField == fieldName) ? (this.sortingFDIChapterDirection == "A") ? "D" : "A" : "A";
        this.sortingFDIChapterField = fieldName;
        this.ReloadPage(false);

        this.GetFDIChapter(this.itemDetailFDICirculars1.index, fDICircularId, true);
    }

    OnFDICircularIndexSort(fDIChapterId, fieldName) {
        this.indexIndex = -1;
        this.itemDetailIndexes.index = this.indexIndex;

        this.sortingFDICircularIndexDirection = (this.sortingFDICircularIndexField == fieldName) ? (this.sortingFDICircularIndexDirection == "A") ? "D" : "A" : "A";
        this.sortingFDICircularIndexField = fieldName;
        this.ReloadPage(false);

        this.GetFDICircularIndex(this.itemDetailChapters.index, fDIChapterId, true);
    }

    OnFDICircularSubIndexSort(fDICircularIndexId, fieldName) {
        this.sortingFDICircularSubIndexDirection = (this.sortingFDICircularSubIndexField == fieldName) ? (this.sortingFDICircularSubIndexDirection == "A") ? "D" : "A" : "A";
        this.sortingFDICircularSubIndexField = fieldName;
        this.ReloadPage(false);

        this.GetFDICircularSubIndex(this.itemDetailIndexes.index, fDICircularIndexId, true);
    }

    OnFDICircularIndexAmendmentSort(fDICircularId, fieldName) {
        this.sortingFDICircularIndexAmendmentDirection = (this.sortingFDICircularIndexAmendmentField == fieldName) ? (this.sortingFDICircularIndexAmendmentDirection == "A") ? "D" : "A" : "A";
        this.sortingFDICircularIndexAmendmentField = fieldName;
        this.ReloadPage(false);

        this.GetFDICircularIndexAmendment(this.itemDetailFDICirculars2.index, fDICircularId, true);
    }
}