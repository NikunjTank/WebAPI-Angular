import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterDirectionChapter, GetMasterDirectionChapterRequest } from '../../../model/masterDirectionChapter';
import { MasterDirection, GetMasterDirectionRequest } from '../../../model/masterDirection';
import { MasterDirectionChapterAdminService } from '../../../service/admin/masterDirectionChapter.service';
import { MasterDirectionAdminService } from '../../../service/admin/masterDirection.service';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


@Component({
    selector: 'my-app',
    templateUrl: './masterDirectionChapter.component.html'
})

export class MasterDirectionChapterAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _masterDirectionChapterService: MasterDirectionChapterAdminService, private _masterDirectionService: MasterDirectionAdminService, vcr: ViewContainerRef, private spinnerService: SpinnerService) { }

    _global: Global = new Global();

    masterDirectionChapter: MasterDirectionChapter;
    masterDirection: MasterDirection = new MasterDirection();
    masterDirectionChapters: MasterDirectionChapter[] = [];

    masterDirectionChapterId: number = 0;
    masterDirectionId: number;

    frmMasterDirectionChapter: FormGroup;
    msg: string;

    addUpdateText: string;

    isSubmited: boolean = false;

    masterDirectionPDFPath: string = Global.MASTERDIRECTION_PDF_FILEPATH;

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params: Params) => {
            let masterDirectionId = this._global.decryptValue(params['masterDirectionId']);
            let masterDirectionChapterId = this._global.decryptValue(params['masterDirectionChapterId']);

            this.masterDirectionId = parseInt(masterDirectionId);

            if (masterDirectionId) {
                this.GetMasterDirection(this.masterDirectionId);

                if (masterDirectionChapterId) {
                    this.addUpdateText = "Update";

                    this.masterDirectionChapterId = parseInt(masterDirectionChapterId);
                    this.EditMasterDirectionChapter(parseInt(masterDirectionChapterId));
                } else {
                    this.GetMasterDirectionChapter(null);
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

        this.frmMasterDirectionChapter = this.formBuilder.group({
            MasterDirectionChapterId: [''],
            MasterDirectionId: [this.masterDirectionId],
            Chapter: ['', Validators.required],
            SaveAfterChapterId: ['']
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

    GetMasterDirectionChapter(chapterData): void {
        this.spinnerService.show();

        let getMasterDirectionChapterRequest = new GetMasterDirectionChapterRequest();
        getMasterDirectionChapterRequest.MasterDirectionId = this.masterDirectionId;

        this._masterDirectionChapterService.getMasterDirectionChapter(getMasterDirectionChapterRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.masterDirectionChapters = [];

                if (data.Status == Global.API_SUCCESS) {

                    this.masterDirectionChapters.push({ MasterDirectionChapterId: null, Chapter: "--Select Index--", CreatedDate: null, SortId: null, IsActive: null, IsDeleted: null, ModifiedDate: null, MasterDirectionId: null });

                    data.Response.forEach(item => {
                        this.masterDirectionChapters.push({ MasterDirectionChapterId: item.MasterDirectionChapterId, Chapter: item.Chapter, CreatedDate: null, SortId: item.SortId, IsActive: null, IsDeleted: null, ModifiedDate: null, MasterDirectionId: null });
                    });

                    if (chapterData) {
                        let index = this.masterDirectionChapters.filter(x => x.SortId == (chapterData.SortId - 1));
                        
                        this.frmMasterDirectionChapter.get("SaveAfterChapterId").setValue((index.length > 0) ? index[0].MasterDirectionChapterId : null);
                    } else {
                        this.frmMasterDirectionChapter.get("SaveAfterChapterId").setValue(null);
                    }
                    this.frmMasterDirectionChapter.updateValueAndValidity();
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_MASTER_DIRECTION_CHAPTER_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_MASTER_DIRECTION_CHAPTER_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    EditMasterDirectionChapter(masterDirectionChapterId: number) {
        this.spinnerService.show();

        let getMasterDirectionChapterRequest = new GetMasterDirectionChapterRequest();
        getMasterDirectionChapterRequest.MasterDirectionChapterId = masterDirectionChapterId;
        getMasterDirectionChapterRequest.IsActive = null;

        this._masterDirectionChapterService.getMasterDirectionChapter(getMasterDirectionChapterRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.GetMasterDirectionChapter(data.Response[0]);

                this.frmMasterDirectionChapter.setValue({
                    MasterDirectionChapterId: masterDirectionChapterId,
                    MasterDirectionId: data.Response[0].MasterDirectionId,
                    Chapter: data.Response[0].Chapter,
                    SaveAfterChapterId: null
                });

                this.frmMasterDirectionChapter.updateValueAndValidity();
            }, error => this.msg = <any>error);
    }

    SaveMasterDirectionChapter(formData) {
        this.spinnerService.show();

        formData.value.SaveAfterChapterId = (formData.value.SaveAfterChapterId && formData.value.SaveAfterChapterId != "null") ? formData.value.SaveAfterChapterId : null;

        if (formData.value.MasterDirectionChapterId) {
            this._masterDirectionChapterService.updateMasterDirectionChapter(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/masterdirections'], {
                                queryParams: {
                                    indexMasterDirection1: params["indexMasterDirection1"], indexMasterDirection2: params["indexMasterDirection2"], indexMasterDirection3: params["indexMasterDirection3"], indexChapter: params["indexChapter"], indexIndex: params["indexIndex"], sortingMasterDirectionField: params["sortingMasterDirectionField"], sortingMasterDirectionDirection: params["sortingMasterDirectionDirection"], sortingFAQField: params["sortingFAQField"], sortingFAQDirection: params["sortingFAQDirection"], sortingMasterChapterField: params["sortingMasterChapterField"], sortingMasterChapterDirection: params["sortingMasterChapterDirection"], sortingMasterDirectionIndexField: params["sortingMasterDirectionIndexField"], sortingMasterDirectionIndexDirection: params["sortingMasterDirectionIndexDirection"], sortingMasterDirectionSubIndexField: params["sortingMasterDirectionSubIndexField"], sortingMasterDirectionSubIndexDirection: params["sortingMasterDirectionSubIndexDirection"], sortingMasterDirectionIndexAmendmentField: params["sortingMasterDirectionIndexAmendmentField"], sortingMasterDirectionIndexAmendmentDirection: params["sortingMasterDirectionIndexAmendmentDirection"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_MASTER_DIRECTION_CHAPTER_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_MASTER_DIRECTION_CHAPTER_TITLE);
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_MASTER_DIRECTION_CHAPTER_TITLE, { enableHtml: true });
                    });
        } else {
            this._masterDirectionChapterService.addMasterDirectionChapter(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/masterdirections'], {
                                queryParams: {
                                    indexMasterDirection1: params["indexMasterDirection1"], indexMasterDirection2: params["indexMasterDirection2"], indexMasterDirection3: params["indexMasterDirection3"], indexChapter: params["indexChapter"], indexIndex: params["indexIndex"], sortingMasterDirectionField: params["sortingMasterDirectionField"], sortingMasterDirectionDirection: params["sortingMasterDirectionDirection"], sortingFAQField: params["sortingFAQField"], sortingFAQDirection: params["sortingFAQDirection"], sortingMasterChapterField: params["sortingMasterChapterField"], sortingMasterChapterDirection: params["sortingMasterChapterDirection"], sortingMasterDirectionIndexField: params["sortingMasterDirectionIndexField"], sortingMasterDirectionIndexDirection: params["sortingMasterDirectionIndexDirection"], sortingMasterDirectionSubIndexField: params["sortingMasterDirectionSubIndexField"], sortingMasterDirectionSubIndexDirection: params["sortingMasterDirectionSubIndexDirection"], sortingMasterDirectionIndexAmendmentField: params["sortingMasterDirectionIndexAmendmentField"], sortingMasterDirectionIndexAmendmentDirection: params["sortingMasterDirectionIndexAmendmentDirection"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_MASTER_DIRECTION_CHAPTER_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_MASTER_DIRECTION_CHAPTER_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_MASTER_DIRECTION_CHAPTER_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    OnSubmitMasterDirectionChapter(formData: any) {
        this.isSubmited = true;

        if (this.frmMasterDirectionChapter.valid) {
            this.SaveMasterDirectionChapter(formData);
        }
    }

    CancelMasterDirectionChapter() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.router.navigate(['/admin/secure/masterdirections'], {
                queryParams: {
                    indexMasterDirection1: params["indexMasterDirection1"], indexMasterDirection2: params["indexMasterDirection2"], indexMasterDirection3: params["indexMasterDirection3"], indexChapter: params["indexChapter"], indexIndex: params["indexIndex"], sortingMasterDirectionField: params["sortingMasterDirectionField"], sortingMasterDirectionDirection: params["sortingMasterDirectionDirection"], sortingFAQField: params["sortingFAQField"], sortingFAQDirection: params["sortingFAQDirection"], sortingMasterChapterField: params["sortingMasterChapterField"], sortingMasterChapterDirection: params["sortingMasterChapterDirection"], sortingMasterDirectionIndexField: params["sortingMasterDirectionIndexField"], sortingMasterDirectionIndexDirection: params["sortingMasterDirectionIndexDirection"], sortingMasterDirectionSubIndexField: params["sortingMasterDirectionSubIndexField"], sortingMasterDirectionSubIndexDirection: params["sortingMasterDirectionSubIndexDirection"], sortingMasterDirectionIndexAmendmentField: params["sortingMasterDirectionIndexAmendmentField"], sortingMasterDirectionIndexAmendmentDirection: params["sortingMasterDirectionIndexAmendmentDirection"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                }
            });
        });
    }
}
