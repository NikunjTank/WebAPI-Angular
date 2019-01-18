import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterDirectionIndex, GetMasterDirectionIndexRequest } from '../../../model/masterDirectionIndex';
import { MasterDirection, GetMasterDirectionRequest } from '../../../model/masterDirection';
import { MasterDirectionChapter, GetMasterDirectionChapterRequest } from '../../../model/masterDirectionChapter';
import { MasterDirectionIndexAdminService } from '../../../service/admin/masterDirectionIndex.service';
import { MasterDirectionAdminService } from '../../../service/admin/masterDirection.service';
import { MasterDirectionChapterAdminService } from '../../../service/admin/masterDirectionChapter.service';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


@Component({
    selector: 'my-app',
    templateUrl: './masterDirectionIndex.component.html'
})

export class MasterDirectionIndexAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _masterDirectionIndexService: MasterDirectionIndexAdminService, private _masterDirectionService: MasterDirectionAdminService, private _masterDriectionChapterService: MasterDirectionChapterAdminService, vcr: ViewContainerRef, private spinnerService: SpinnerService) { }

    _global: Global = new Global();

    masterDirectionIndex: MasterDirectionIndex;
    masterDirection: MasterDirection = new MasterDirection();
    masterDirectionChapter: MasterDirectionChapter = new MasterDirectionChapter();
    masterDirectionIndexes: MasterDirectionIndex[] = [];

    masterDirectionIndexId: number = 0;
    masterDirectionId: number;
    masterDirectionChapterId: number;

    frmMasterDirectionIndex: FormGroup;
    msg: string;

    addUpdateText: string;

    isSubmited: boolean = false;

    masterDirectionPDFPath: string = Global.MASTERDIRECTION_PDF_FILEPATH;

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params: Params) => {
            let masterDirectionId = this._global.decryptValue(params['masterDirectionId']);
            let masterDirectionChapterId = this._global.decryptValue(params['masterDirectionChapterId']);
            let masterDirectionIndexId = this._global.decryptValue(params['masterDirectionIndexId']);

            this.masterDirectionId = parseInt(masterDirectionId);
            this.masterDirectionChapterId = parseInt(masterDirectionChapterId);

            if (masterDirectionId && masterDirectionChapterId) {
                this.GetMasterDirection(this.masterDirectionId);
                this.GetMasterDirectionChapter(this.masterDirectionChapterId);

                if (masterDirectionIndexId) {
                    this.addUpdateText = "Update";

                    this.masterDirectionIndexId = parseInt(masterDirectionIndexId);
                    this.EditMasterDirectionIndex(parseInt(masterDirectionIndexId));
                } else {
                    this.GetMasterDirectionIndex(null);
                    this.addUpdateText = "Add";
                }
            } else {
                this.activatedRoute.queryParams.subscribe(params => {
                    this.router.navigate(['/admin/secure/masterdirections'], {
                        queryParams: {
                            indexMasterDirection1: params["indexMasterDirection1"], indexMasterDirection2: params["indexMasterDirection2"], indexMasterDirection3: params["indexMasterDirection3"], indexChapter: params["indexChapter"], indexIndex: params["indexIndex"], sortingMasterDirectionField: params["sortingMasterDirectionField"], sortingMasterDirectionDirection: params["sortingMasterDirectionDirection"], sortingFAQField: params["sortingFAQField"], sortingFAQDirection: params["sortingFAQDirection"], sortingMasterChapterField: params["sortingMasterChapterField"], sortingMasterChapterDirection: params["sortingMasterChapterDirection"], sortingMasterDirectionIndexField: params["sortingMasterDirectionIndexField"], sortingMasterDirectionIndexDirection: params["sortingMasterDirectionIndexDirection"], sortingMasterDirectionSubIndexField: params["sortingMasterDirectionSubIndexField"], sortingMasterDirectionSubIndexDirection: params["sortingMasterDirectionSubIndexDirection"], sortingMasterDirectionIndexAmendmentField: params["sortingMasterDirectionIndexAmendmentField"], sortingMasterDirectionIndexAmendmentDirection: params["sortingMasterDirectionIndexAmendmentDirection"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                        }
                    });
                });
            }
        });
        
        this.frmMasterDirectionIndex = this.formBuilder.group({
            MasterDirectionIndexId: [''],
            MasterDirectionChapterId: [this.masterDirectionChapterId],
            IndexNo: ['', Validators.required],
            IndexName: ['', Validators.required],
            IndexContent: ['', Validators.required],
            SaveAfterIndexId: ['']
        });
    }

    GetMasterDirection(masterDriectionId: number) {
        this.spinnerService.show();

        let getMasterDirectionRequest = new GetMasterDirectionRequest();
        getMasterDirectionRequest.MasterDirectionId = masterDriectionId;
        getMasterDirectionRequest.IsActive = null;

        this._masterDirectionService.getMasterDirection(getMasterDirectionRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.masterDirection = data.Response[0];
            }, error => this.msg = <any>error);
    }

    GetMasterDirectionChapter(masterDirectionChapterId: number) {
        this.spinnerService.show();

        let getMasterDirectionChapterRequest = new GetMasterDirectionChapterRequest();
        getMasterDirectionChapterRequest.MasterDirectionChapterId = masterDirectionChapterId;
        getMasterDirectionChapterRequest.IsActive = null;

        this._masterDriectionChapterService.getMasterDirectionChapter(getMasterDirectionChapterRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.masterDirectionChapter = data.Response[0];
            }, error => this.msg = <any>error);
    }

    GetMasterDirectionIndex(indexData): void {
        this.spinnerService.show();

        let getMasterDirectionIndexRequest = new GetMasterDirectionIndexRequest();
        getMasterDirectionIndexRequest.MasterDirectionChapterId = this.masterDirectionChapterId;

        this._masterDirectionIndexService.getMasterDirectionIndex(getMasterDirectionIndexRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.masterDirectionIndexes = [];

                if (data.Status == Global.API_SUCCESS) {

                    this.masterDirectionIndexes.push({ MasterDirectionIndexId: null, IndexNo: null, CreatedDate: null, IndexContent: null, IndexName: "--Select Index--", SortId: null, IsActive: null, IsDeleted: null, ModifiedDate: null, MasterDirectionChapterId: null });

                    data.Response.forEach(item => {
                        //if (data.Response.length != this.masterDirectionIndexes.length)
                            this.masterDirectionIndexes.push({ MasterDirectionIndexId: item.MasterDirectionIndexId, IndexNo: item.IndexNo, CreatedDate: null, IndexContent: null, IndexName: item.IndexName, SortId: item.SortId, IsActive: null, IsDeleted: null, ModifiedDate: null, MasterDirectionChapterId: null });
                    });

                    if (indexData) {
                        let index = this.masterDirectionIndexes.filter(x => x.SortId == (indexData.SortId - 1));

                        this.frmMasterDirectionIndex.get("SaveAfterIndexId").setValue((index.length > 0) ? index[0].MasterDirectionIndexId : null);
                    } else {
                        this.frmMasterDirectionIndex.get("SaveAfterIndexId").setValue(null);
                    }
                    this.frmMasterDirectionIndex.updateValueAndValidity();
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_MASTER_DIRECTION_INDEX_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_MASTER_DIRECTION_INDEX_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    EditMasterDirectionIndex(masterDirectionIndexId: number) {
        this.spinnerService.show();

        let getMasterDirectionIndexRequest = new GetMasterDirectionIndexRequest();
        getMasterDirectionIndexRequest.MasterDirectionIndexId = masterDirectionIndexId;
        getMasterDirectionIndexRequest.IsActive = null;

        this._masterDirectionIndexService.getMasterDirectionIndex(getMasterDirectionIndexRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.GetMasterDirectionIndex(data.Response[0]);

                this.frmMasterDirectionIndex.setValue({
                    MasterDirectionIndexId: masterDirectionIndexId,
                    MasterDirectionChapterId: data.Response[0].MasterDirectionChapterId,
                    IndexNo: data.Response[0].IndexNo,
                    IndexName: data.Response[0].IndexName,
                    IndexContent: data.Response[0].IndexContent,
                    SaveAfterIndexId: null
                });

                this.frmMasterDirectionIndex.updateValueAndValidity();
            }, error => this.msg = <any>error);
    }

    SaveMasterDirectionIndex(formData) {
        this.spinnerService.show();

        formData.value.SaveAfterIndexId = (formData.value.SaveAfterIndexId && formData.value.SaveAfterIndexId != "null") ? formData.value.SaveAfterIndexId : null;
        
        if (formData.value.MasterDirectionIndexId) {
            this._masterDirectionIndexService.updateMasterDirectionIndex(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/masterdirections'], {
                                queryParams: {
                                    indexMasterDirection1: params["indexMasterDirection1"], indexMasterDirection2: params["indexMasterDirection2"], indexMasterDirection3: params["indexMasterDirection3"], indexChapter: params["indexChapter"], indexIndex: params["indexIndex"], sortingMasterDirectionField: params["sortingMasterDirectionField"], sortingMasterDirectionDirection: params["sortingMasterDirectionDirection"], sortingFAQField: params["sortingFAQField"], sortingFAQDirection: params["sortingFAQDirection"], sortingMasterChapterField: params["sortingMasterChapterField"], sortingMasterChapterDirection: params["sortingMasterChapterDirection"], sortingMasterDirectionIndexField: params["sortingMasterDirectionIndexField"], sortingMasterDirectionIndexDirection: params["sortingMasterDirectionIndexDirection"], sortingMasterDirectionSubIndexField: params["sortingMasterDirectionSubIndexField"], sortingMasterDirectionSubIndexDirection: params["sortingMasterDirectionSubIndexDirection"], sortingMasterDirectionIndexAmendmentField: params["sortingMasterDirectionIndexAmendmentField"], sortingMasterDirectionIndexAmendmentDirection: params["sortingMasterDirectionIndexAmendmentDirection"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_MASTER_DIRECTION_INDEX_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_MASTER_DIRECTION_INDEX_TITLE);
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_MASTER_DIRECTION_INDEX_TITLE, { enableHtml: true });
                    });
        } else {
            this._masterDirectionIndexService.addMasterDirectionIndex(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/masterdirections'], {
                                queryParams: {
                                    indexMasterDirection1: params["indexMasterDirection1"], indexMasterDirection2: params["indexMasterDirection2"], indexMasterDirection3: params["indexMasterDirection3"], indexChapter: params["indexChapter"], indexIndex: params["indexIndex"], sortingMasterDirectionField: params["sortingMasterDirectionField"], sortingMasterDirectionDirection: params["sortingMasterDirectionDirection"], sortingFAQField: params["sortingFAQField"], sortingFAQDirection: params["sortingFAQDirection"], sortingMasterChapterField: params["sortingMasterChapterField"], sortingMasterChapterDirection: params["sortingMasterChapterDirection"], sortingMasterDirectionIndexField: params["sortingMasterDirectionIndexField"], sortingMasterDirectionIndexDirection: params["sortingMasterDirectionIndexDirection"], sortingMasterDirectionSubIndexField: params["sortingMasterDirectionSubIndexField"], sortingMasterDirectionSubIndexDirection: params["sortingMasterDirectionSubIndexDirection"], sortingMasterDirectionIndexAmendmentField: params["sortingMasterDirectionIndexAmendmentField"], sortingMasterDirectionIndexAmendmentDirection: params["sortingMasterDirectionIndexAmendmentDirection"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_MASTER_DIRECTION_INDEX_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_MASTER_DIRECTION_INDEX_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_MASTER_DIRECTION_INDEX_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    OnSubmitMasterDirectionIndex(formData: any) {
        this.isSubmited = true;

        if (this.frmMasterDirectionIndex.valid) {
            this.SaveMasterDirectionIndex(formData);
        }
    }

    CancelMasterDirectionIndex() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.router.navigate(['/admin/secure/masterdirections'], {
                queryParams: {
                    indexMasterDirection1: params["indexMasterDirection1"], indexMasterDirection2: params["indexMasterDirection2"], indexMasterDirection3: params["indexMasterDirection3"], indexChapter: params["indexChapter"], indexIndex: params["indexIndex"], sortingMasterDirectionField: params["sortingMasterDirectionField"], sortingMasterDirectionDirection: params["sortingMasterDirectionDirection"], sortingFAQField: params["sortingFAQField"], sortingFAQDirection: params["sortingFAQDirection"], sortingMasterChapterField: params["sortingMasterChapterField"], sortingMasterChapterDirection: params["sortingMasterChapterDirection"], sortingMasterDirectionIndexField: params["sortingMasterDirectionIndexField"], sortingMasterDirectionIndexDirection: params["sortingMasterDirectionIndexDirection"], sortingMasterDirectionSubIndexField: params["sortingMasterDirectionSubIndexField"], sortingMasterDirectionSubIndexDirection: params["sortingMasterDirectionSubIndexDirection"], sortingMasterDirectionIndexAmendmentField: params["sortingMasterDirectionIndexAmendmentField"], sortingMasterDirectionIndexAmendmentDirection: params["sortingMasterDirectionIndexAmendmentDirection"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                }
            });
        });
    }
}
