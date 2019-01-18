import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FDIChapter, GetFDIChapterRequest } from '../../../model/fDIChapter';
import { FDICircular, GetFDICircularRequest } from '../../../model/fDICircular';
import { FDIChapterAdminService } from '../../../service/admin/fDIChapter.service';
import { FDICircularAdminService } from '../../../service/admin/fDICircular.service';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


@Component({
    selector: 'my-app',
    templateUrl: './fDIChapter.component.html'
})

export class FDIChapterAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _fDIChapterService: FDIChapterAdminService, private _fDICircularService: FDICircularAdminService, vcr: ViewContainerRef, private spinnerService: SpinnerService) { }

    _global: Global = new Global();

    fDIChapter: FDIChapter;
    fDICircular: FDICircular = new FDICircular();
    fDICircularChapters: FDIChapter[] = [];

    fDIChapterId: number = 0;
    fDICircularId: number;

    frmFDIChapter: FormGroup;
    msg: string;

    addUpdateText: string;

    isSubmited: boolean = false;

    pdfServerPath: string = Global.FDICIRCULAR_PDF_FILEPATH;

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params: Params) => {
            let fDICircularId = this._global.decryptValue(params['fDICircularId']);
            let fDIChapterId = this._global.decryptValue(params['fDIChapterId']);

            this.fDICircularId = parseInt(fDICircularId);

            if (fDICircularId) {
                this.GetFDICircular(this.fDICircularId);

                if (fDIChapterId) {
                    this.addUpdateText = "Update";

                    this.fDIChapterId = parseInt(fDIChapterId);
                    this.EditFDIChapter(parseInt(fDIChapterId));
                } else {
                    this.GetFDICircularChapter(null);
                    this.addUpdateText = "Add";
                }
            } else {
                this.activatedRoute.queryParams.subscribe(params => {
                    this.router.navigate(['/admin/secure/fdicirculars'], {
                        queryParams: {
                            indexFDICircular1: params["indexFDICircular1"], indexFDICircular2: params["indexFDICircular2"], indexChapter: params["indexChapter"], indexIndex: params["indexIndex"], sortingFDICircularField: params["sortingFDICircularField"], sortingFDICircularDirection: params["sortingFDICircularDirection"], sortingFDICircularIndexField: params["sortingFDICircularIndexField"], sortingFDICircularIndexDirection: params["sortingFDICircularIndexDirection"], sortingFDICircularSubIndexField: params["sortingFDICircularSubIndexField"], sortingFDICircularSubIndexDirection: params["sortingFDICircularSubIndexDirection"], sortingFDICircularIndexAmendmentField: params["sortingFDICircularIndexAmendmentField"], sortingFDICircularIndexAmendmentDirection: params["sortingFDICircularIndexAmendmentDirection"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                        }
                    });
                });
            }
        });

        this.frmFDIChapter = this.formBuilder.group({
            FDIChapterId: [''],
            FDICircularId: [this.fDICircularId],
            Chapter: ['', Validators.required],
            SaveAfterChapterId: ['']
        });
    }

    GetFDICircular(fDICircularId: number) {
        this.spinnerService.show();

        let getFDICircularRequest = new GetFDICircularRequest();
        getFDICircularRequest.FDICircularId = fDICircularId;
        getFDICircularRequest.IsActive = null;

        this._fDICircularService.getFDICircular(getFDICircularRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.fDICircular = data.Response[0];
            }, error => this.msg = <any>error);
    }

    GetFDICircularChapter(chapterData): void {
        this.spinnerService.show();

        let getFDIChapterRequest = new GetFDIChapterRequest();
        getFDIChapterRequest.FDICircularId = this.fDICircularId;

        this._fDIChapterService.getFDIChapter(getFDIChapterRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.fDICircularChapters = [];

                if (data.Status == Global.API_SUCCESS) {

                    this.fDICircularChapters.push({ FDIChapterId: null, Chapter: "--Select Index--", CreatedDate: null, SortId: null, IsActive: null, IsDeleted: null, ModifiedDate: null, FDICircularId: null });

                    data.Response.forEach(item => {
                        this.fDICircularChapters.push({ FDIChapterId: item.FDIChapterId, Chapter: item.Chapter, CreatedDate: null, SortId: item.SortId, IsActive: null, IsDeleted: null, ModifiedDate: null, FDICircularId: null });
                    });

                    if (chapterData) {
                        let index = this.fDICircularChapters.filter(x => x.SortId == (chapterData.SortId - 1));

                        this.frmFDIChapter.get("SaveAfterChapterId").setValue((index.length > 0) ? index[0].FDIChapterId : null);
                    } else {
                        this.frmFDIChapter.get("SaveAfterChapterId").setValue(null);
                    }
                    this.frmFDIChapter.updateValueAndValidity();
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_FDI_CIRCULAR_CHAPTER_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FDI_CIRCULAR_CHAPTER_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    EditFDIChapter(fDIChapterId: number) {
        this.spinnerService.show();

        let getFDIChapterRequest = new GetFDIChapterRequest();
        getFDIChapterRequest.FDIChapterId = fDIChapterId;
        getFDIChapterRequest.IsActive = null;

        this._fDIChapterService.getFDIChapter(getFDIChapterRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.GetFDICircularChapter(data.Response[0]);

                this.frmFDIChapter.setValue({
                    FDIChapterId: fDIChapterId,
                    FDICircularId: data.Response[0].FDICircularId,
                    Chapter: data.Response[0].Chapter,
                    SaveAfterChapterId: null
                });

                this.frmFDIChapter.updateValueAndValidity();
            }, error => this.msg = <any>error);
    }

    SaveFDIChapter(formData) {
        this.spinnerService.show();

        formData.value.SaveAfterChapterId = (formData.value.SaveAfterChapterId && formData.value.SaveAfterChapterId != "null") ? formData.value.SaveAfterChapterId : null;

        if (formData.value.FDIChapterId) {
            this._fDIChapterService.updateFDIChapter(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/fdicirculars'], {
                                queryParams: {
                                    indexFDICircular1: params["indexFDICircular1"], indexFDICircular2: params["indexFDICircular2"], indexChapter: params["indexChapter"], indexIndex: params["indexIndex"], sortingFDICircularField: params["sortingFDICircularField"], sortingFDICircularDirection: params["sortingFDICircularDirection"], sortingFDICircularIndexField: params["sortingFDICircularIndexField"], sortingFDICircularIndexDirection: params["sortingFDICircularIndexDirection"], sortingFDICircularSubIndexField: params["sortingFDICircularSubIndexField"], sortingFDICircularSubIndexDirection: params["sortingFDICircularSubIndexDirection"], sortingFDICircularIndexAmendmentField: params["sortingFDICircularIndexAmendmentField"], sortingFDICircularIndexAmendmentDirection: params["sortingFDICircularIndexAmendmentDirection"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_FDI_CIRCULAR_CHAPTER_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_FDI_CIRCULAR_CHAPTER_TITLE);
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FDI_CIRCULAR_CHAPTER_TITLE, { enableHtml: true });
                    });
        } else {
            this._fDIChapterService.addFDIChapter(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/fdicirculars'], {
                                queryParams: {
                                    indexFDICircular1: params["indexFDICircular1"], indexFDICircular2: params["indexFDICircular2"], indexChapter: params["indexChapter"], indexIndex: params["indexIndex"], sortingFDICircularField: params["sortingFDICircularField"], sortingFDICircularDirection: params["sortingFDICircularDirection"], sortingFDICircularIndexField: params["sortingFDICircularIndexField"], sortingFDICircularIndexDirection: params["sortingFDICircularIndexDirection"], sortingFDICircularSubIndexField: params["sortingFDICircularSubIndexField"], sortingFDICircularSubIndexDirection: params["sortingFDICircularSubIndexDirection"], sortingFDICircularIndexAmendmentField: params["sortingFDICircularIndexAmendmentField"], sortingFDICircularIndexAmendmentDirection: params["sortingFDICircularIndexAmendmentDirection"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_FDI_CIRCULAR_CHAPTER_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_FDI_CIRCULAR_CHAPTER_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FDI_CIRCULAR_CHAPTER_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    OnSubmitFDIChapter(formData: any) {
        this.isSubmited = true;

        if (this.frmFDIChapter.valid) {
            this.SaveFDIChapter(formData);
        }
    }

    CancelFDIChapter() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.router.navigate(['/admin/secure/fdicirculars'], {
                queryParams: {
                    indexFDICircular1: params["indexFDICircular1"], indexFDICircular2: params["indexFDICircular2"], indexChapter: params["indexChapter"], indexIndex: params["indexIndex"], sortingFDICircularField: params["sortingFDICircularField"], sortingFDICircularDirection: params["sortingFDICircularDirection"], sortingFDICircularIndexField: params["sortingFDICircularIndexField"], sortingFDICircularIndexDirection: params["sortingFDICircularIndexDirection"], sortingFDICircularSubIndexField: params["sortingFDICircularSubIndexField"], sortingFDICircularSubIndexDirection: params["sortingFDICircularSubIndexDirection"], sortingFDICircularIndexAmendmentField: params["sortingFDICircularIndexAmendmentField"], sortingFDICircularIndexAmendmentDirection: params["sortingFDICircularIndexAmendmentDirection"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                }
            });
        });
    }
}
