import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterDirectionSubIndex, GetMasterDirectionSubIndexRequest } from '../../../model/masterDirectionSubIndex';
import { MasterDirectionIndex, GetMasterDirectionIndexRequest } from '../../../model/masterDirectionIndex';
import { MasterDirection, GetMasterDirectionRequest } from '../../../model/masterDirection';
import { MasterDirectionChapter, GetMasterDirectionChapterRequest } from '../../../model/masterDirectionChapter';
import { MasterDirectionSubIndexAdminService } from '../../../service/admin/masterDirectionSubIndex.service';
import { MasterDirectionIndexAdminService } from '../../../service/admin/masterDirectionIndex.service';
import { MasterDirectionAdminService } from '../../../service/admin/masterDirection.service';
import { MasterDirectionChapterAdminService } from '../../../service/admin/masterDirectionChapter.service';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


import { ModalDialogService } from 'ngx-modal-dialog';
import { ContentPopUpAdminComponent } from '../../../areas/admin/contentPopUp/contentPopUp.component';

@Component({
    selector: 'my-app',
    templateUrl: './masterDirectionSubIndex.component.html'
})

export class MasterDirectionSubIndexAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _masterDirectionSubIndexService: MasterDirectionSubIndexAdminService, private _masterDirectionService: MasterDirectionAdminService, private _masterDirectionIndexService: MasterDirectionIndexAdminService, private _masterDirectionChapterService: MasterDirectionChapterAdminService, private vcr: ViewContainerRef, private spinnerService: SpinnerService, private modalService: ModalDialogService) { }

    _global: Global = new Global();

    masterDirectionSubIndex: MasterDirectionSubIndex;
    masterDirection: MasterDirection = new MasterDirection();
    masterDirectionChapter: MasterDirectionChapter = new MasterDirectionChapter();
    masterDirectionIndex: MasterDirectionIndex = new MasterDirectionIndex();

    masterDirectionSubIndexId: number = 0;
    masterDirectionIndexId: number;
    masterDirectionId: number;
    masterDirectionChapterId: number;
    masterDirectionSubIndexes: MasterDirectionSubIndex[] = [];

    frmMasterDirectionSubIndex: FormGroup;
    msg: string;

    addUpdateText: string;

    isSubmited: boolean = false;

    masterDirectionPDFPath: string = Global.MASTERDIRECTION_PDF_FILEPATH;

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params: Params) => {
            let masterDirectionId = this._global.decryptValue(params['masterDirectionId']);
            let masterDirectionChapterId = this._global.decryptValue(params['masterDirectionChapterId']);
            let masterDirectionIndexId = this._global.decryptValue(params['masterDirectionIndexId']);
            let masterDirectionSubIndexId = this._global.decryptValue(params['masterDirectionSubIndexId']);
            
            this.masterDirectionId = parseInt(masterDirectionId);
            this.masterDirectionChapterId = parseInt(masterDirectionChapterId);
            this.masterDirectionIndexId = parseInt(masterDirectionIndexId);
            
            if (masterDirectionId && masterDirectionIndexId) {
                this.GetMasterDirection(this.masterDirectionId);
                this.GetMasterDirectionChapter(this.masterDirectionChapterId);
                this.GetMasterDirectionIndex(this.masterDirectionIndexId);

                if (masterDirectionSubIndexId) {
                    this.addUpdateText = "Update";

                    this.masterDirectionSubIndexId = parseInt(masterDirectionSubIndexId);
                    this.EditMasterDirectionSubIndex(parseInt(masterDirectionSubIndexId));
                } else {
                    this.GetMasterDirectionSubIndex(null);
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

        this.frmMasterDirectionSubIndex = this.formBuilder.group({
            MasterDirectionSubIndexId: [''],
            MasterDirectionIndexId: [this.masterDirectionIndexId],
            SubIndexNo: ['', Validators.required],
            SubIndexName: ['', Validators.required],
            SubIndexContent: ['', Validators.required],
            SaveAfterSubIndexId: ['']
        });
    }

    GetMasterDirection(masterDirectionId: number) {
        this.spinnerService.show();

        let getMasterDirectionRequest = new GetMasterDirectionRequest();
        getMasterDirectionRequest.MasterDirectionId = masterDirectionId;
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

        this._masterDirectionChapterService.getMasterDirectionChapter(getMasterDirectionChapterRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.masterDirectionChapter = data.Response[0];
            }, error => this.msg = <any>error);
    }

    GetMasterDirectionIndex(masterDirectionIndexId: number) {
        this.spinnerService.show();

        let getMasterDirectionIndexRequest = new GetMasterDirectionIndexRequest();
        getMasterDirectionIndexRequest.MasterDirectionIndexId = masterDirectionIndexId;
        getMasterDirectionIndexRequest.IsActive = null;

        this._masterDirectionIndexService.getMasterDirectionIndex(getMasterDirectionIndexRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.masterDirectionIndex = data.Response[0];
            }, error => this.msg = <any>error);
    }

    GetMasterDirectionSubIndex(subIndexData): void {
        this.spinnerService.show();

        let getMasterDirectionSubIndexRequest = new GetMasterDirectionSubIndexRequest();
        getMasterDirectionSubIndexRequest.MasterDirectionIndexId = this.masterDirectionIndexId;

        this._masterDirectionSubIndexService.getMasterDirectionSubIndex(getMasterDirectionSubIndexRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.masterDirectionSubIndexes = [];

                if (data.Status == Global.API_SUCCESS) {

                    this.masterDirectionSubIndexes.push({ MasterDirectionSubIndexId: null, SubIndexNo: null, CreatedDate: null, SubIndexContent: null, SubIndexName: "--Select SubIndex--", SortId: null, IsActive: null, IsDeleted: null, ModifiedDate: null, MasterDirectionIndexId: null });

                    data.Response.forEach(item => {
                        //if (data.Response.length != this.masterDirectionSubIndexes.length)
                            this.masterDirectionSubIndexes.push({ MasterDirectionSubIndexId: item.MasterDirectionSubIndexId, SubIndexNo: item.SubIndexNo, CreatedDate: null, SubIndexContent: null, SubIndexName: item.SubIndexName, SortId: item.SortId, IsActive: null, IsDeleted: null, ModifiedDate: null, MasterDirectionIndexId: null });
                    });

                    if (subIndexData) {
                        let index = this.masterDirectionSubIndexes.filter(x => x.SortId == (subIndexData.SortId - 1));

                        this.frmMasterDirectionSubIndex.get("SaveAfterSubIndexId").setValue((index.length > 0) ? index[0].MasterDirectionSubIndexId : null);
                    } else {
                        this.frmMasterDirectionSubIndex.get("SaveAfterSubIndexId").setValue(null);
                    }
                    this.frmMasterDirectionSubIndex.updateValueAndValidity();
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_MASTER_DIRECTION_SUB_INDEX_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_MASTER_DIRECTION_SUB_INDEX_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    EditMasterDirectionSubIndex(masterDirectionSubIndexId: number) {
        this.spinnerService.show();

        let getMasterDirectionSubIndexRequest = new GetMasterDirectionSubIndexRequest();
        getMasterDirectionSubIndexRequest.MasterDirectionSubIndexId = masterDirectionSubIndexId;
        getMasterDirectionSubIndexRequest.IsActive = null;

        this._masterDirectionSubIndexService.getMasterDirectionSubIndex(getMasterDirectionSubIndexRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.GetMasterDirectionSubIndex(data.Response[0]);

                this.frmMasterDirectionSubIndex.setValue({
                    MasterDirectionSubIndexId: masterDirectionSubIndexId,
                    MasterDirectionIndexId: data.Response[0].MasterDirectionIndexId,
                    SubIndexNo: data.Response[0].SubIndexNo,
                    SubIndexName: data.Response[0].SubIndexName,
                    SubIndexContent: data.Response[0].SubIndexContent,
                    SaveAfterSubIndexId: null
                });

                this.frmMasterDirectionSubIndex.updateValueAndValidity();
            }, error => this.msg = <any>error);
    }

    SaveMasterDirectionSubIndex(formData) {
        this.spinnerService.show();

        formData.value.SaveAfterSubIndexId = (formData.value.SaveAfterSubIndexId && formData.value.SaveAfterSubIndexId != "null") ? formData.value.SaveAfterSubIndexId : null;

        if (formData.value.MasterDirectionSubIndexId) {
            this._masterDirectionSubIndexService.updateMasterDirectionSubIndex(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/masterdirections'], {
                                queryParams: {
                                    indexMasterDirection1: params["indexMasterDirection1"], indexMasterDirection2: params["indexMasterDirection2"], indexMasterDirection3: params["indexMasterDirection3"], indexChapter: params["indexChapter"], indexIndex: params["indexIndex"], sortingMasterDirectionField: params["sortingMasterDirectionField"], sortingMasterDirectionDirection: params["sortingMasterDirectionDirection"], sortingFAQField: params["sortingFAQField"], sortingFAQDirection: params["sortingFAQDirection"], sortingMasterChapterField: params["sortingMasterChapterField"], sortingMasterChapterDirection: params["sortingMasterChapterDirection"], sortingMasterDirectionIndexField: params["sortingMasterDirectionIndexField"], sortingMasterDirectionIndexDirection: params["sortingMasterDirectionIndexDirection"], sortingMasterDirectionSubIndexField: params["sortingMasterDirectionSubIndexField"], sortingMasterDirectionSubIndexDirection: params["sortingMasterDirectionSubIndexDirection"], sortingMasterDirectionIndexAmendmentField: params["sortingMasterDirectionIndexAmendmentField"], sortingMasterDirectionIndexAmendmentDirection: params["sortingMasterDirectionIndexAmendmentDirection"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_MASTER_DIRECTION_SUB_INDEX_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_MASTER_DIRECTION_SUB_INDEX_TITLE);
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_MASTER_DIRECTION_SUB_INDEX_TITLE, { enableHtml: true });
                    });
        } else {
            this._masterDirectionSubIndexService.addMasterDirectionSubIndex(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/masterdirections'], {
                                queryParams: {
                                    indexMasterDirection1: params["indexMasterDirection1"], indexMasterDirection2: params["indexMasterDirection2"], indexMasterDirection3: params["indexMasterDirection3"], indexChapter: params["indexChapter"], indexIndex: params["indexIndex"], sortingMasterDirectionField: params["sortingMasterDirectionField"], sortingMasterDirectionDirection: params["sortingMasterDirectionDirection"], sortingFAQField: params["sortingFAQField"], sortingFAQDirection: params["sortingFAQDirection"], sortingMasterChapterField: params["sortingMasterChapterField"], sortingMasterChapterDirection: params["sortingMasterChapterDirection"], sortingMasterDirectionIndexField: params["sortingMasterDirectionIndexField"], sortingMasterDirectionIndexDirection: params["sortingMasterDirectionIndexDirection"], sortingMasterDirectionSubIndexField: params["sortingMasterDirectionSubIndexField"], sortingMasterDirectionSubIndexDirection: params["sortingMasterDirectionSubIndexDirection"], sortingMasterDirectionIndexAmendmentField: params["sortingMasterDirectionIndexAmendmentField"], sortingMasterDirectionIndexAmendmentDirection: params["sortingMasterDirectionIndexAmendmentDirection"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_MASTER_DIRECTION_SUB_INDEX_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_MASTER_DIRECTION_SUB_INDEX_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_MASTER_DIRECTION_SUB_INDEX_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    OnSubmitMasterDirectionSubIndex(formData: any) {
        this.isSubmited = true;

        if (this.frmMasterDirectionSubIndex.valid) {
            formData.value.MasterDirectionIndexId = this.masterDirectionIndexId;
            this.SaveMasterDirectionSubIndex(formData);
        }
    }

    CancelMasterDirectionSubIndex() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.router.navigate(['/admin/secure/masterdirections'], {
                queryParams: {
                    indexMasterDirection1: params["indexMasterDirection1"], indexMasterDirection2: params["indexMasterDirection2"], indexMasterDirection3: params["indexMasterDirection3"], indexChapter: params["indexChapter"], indexIndex: params["indexIndex"], sortingMasterDirectionField: params["sortingMasterDirectionField"], sortingMasterDirectionDirection: params["sortingMasterDirectionDirection"], sortingFAQField: params["sortingFAQField"], sortingFAQDirection: params["sortingFAQDirection"], sortingMasterChapterField: params["sortingMasterChapterField"], sortingMasterChapterDirection: params["sortingMasterChapterDirection"], sortingMasterDirectionIndexField: params["sortingMasterDirectionIndexField"], sortingMasterDirectionIndexDirection: params["sortingMasterDirectionIndexDirection"], sortingMasterDirectionSubIndexField: params["sortingMasterDirectionSubIndexField"], sortingMasterDirectionSubIndexDirection: params["sortingMasterDirectionSubIndexDirection"], sortingMasterDirectionIndexAmendmentField: params["sortingMasterDirectionIndexAmendmentField"], sortingMasterDirectionIndexAmendmentDirection: params["sortingMasterDirectionIndexAmendmentDirection"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                }
            });
        });
    }

    ShowContent(title, content) {
        this.modalService.openDialog(this.vcr, {
            title: title,
            childComponent: ContentPopUpAdminComponent,
            data: content
        });
    }
}
