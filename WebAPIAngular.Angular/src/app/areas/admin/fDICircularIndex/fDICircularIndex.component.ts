import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FDICircularIndex, GetFDICircularIndexRequest } from '../../../model/fDICircularIndex';
import { FDICircular, GetFDICircularRequest } from '../../../model/fDICircular';
import { FDIChapter, GetFDIChapterRequest } from '../../../model/fDIChapter';
import { FDICircularIndexAdminService } from '../../../service/admin/fDICircularIndex.service';
import { FDICircularAdminService } from '../../../service/admin/fDICircular.service';
import { FDIChapterAdminService } from '../../../service/admin/fDIChapter.service';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


@Component({
    selector: 'my-app',
    templateUrl: './fDICircularIndex.component.html'
})

export class FDICircularIndexAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _fDICircularIndexService: FDICircularIndexAdminService, private _fDICircularService: FDICircularAdminService, private _fDIChapterService: FDIChapterAdminService, vcr: ViewContainerRef, private spinnerService: SpinnerService) { }

    _global: Global = new Global();

    fDICircularIndex: FDICircularIndex;
    fDICircular: FDICircular = new FDICircular();
    fDIChapter: FDIChapter = new FDIChapter();
    fDICircularIndexes: FDICircularIndex[] = [];

    fDICircularIndexId: number = 0;
    fDICircularId: number;
    fDIChapterId: number;

    frmFDICircularIndex: FormGroup;
    msg: string;

    addUpdateText: string;

    isSubmited: boolean = false;

    pdfServerPath: string = Global.FDICIRCULAR_PDF_FILEPATH;

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params: Params) => {
            let fDICircularId = this._global.decryptValue(params['fDICircularId']);
            let fDIChapterId = this._global.decryptValue(params['fDIChapterId']);
            let fDICircularIndexId = this._global.decryptValue(params['fDICircularIndexId']);

            this.fDICircularId = parseInt(fDICircularId);
            this.fDIChapterId = parseInt(fDIChapterId);

            if (fDICircularId && fDIChapterId) {
                this.GetFDICircular(this.fDICircularId);
                this.GetFDIChapter(this.fDIChapterId);

                if (fDICircularIndexId) {
                    this.addUpdateText = "Update";

                    this.fDICircularIndexId = parseInt(fDICircularIndexId);
                    this.EditFDICircularIndex(parseInt(fDICircularIndexId));
                } else {
                    this.GetFDICircularIndex(null);
                    this.addUpdateText = "Add";
                }
            } else {
                this.activatedRoute.queryParams.subscribe(params => {
                    this.router.navigate(['/admin/secure/fdicirculars'], {
                        queryParams: {
                            indexFDICircular1: params["indexFDICircular1"], indexFDICircular2: params["indexFDICircular2"], indexChapter: params["indexChapter"], indexIndex: params["indexIndex"], sortingFDICircularField: params["sortingFDICircularField"], sortingFDICircularDirection: params["sortingFDICircularDirection"], sortingFDIChapterField: params["sortingFDIChapterField"], sortingFDIChapterDirection: params["sortingFDIChapterDirection"], sortingFDICircularIndexField: params["sortingFDICircularIndexField"], sortingFDICircularIndexDirection: params["sortingFDICircularIndexDirection"], sortingFDICircularSubIndexField: params["sortingFDICircularSubIndexField"], sortingFDICircularSubIndexDirection: params["sortingFDICircularSubIndexDirection"], sortingFDICircularIndexAmendmentField: params["sortingFDICircularIndexAmendmentField"], sortingFDICircularIndexAmendmentDirection: params["sortingFDICircularIndexAmendmentDirection"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                        }
                    });
                });
            }
        });
        
        this.frmFDICircularIndex = this.formBuilder.group({
            FDICircularIndexId: [''],
            FDIChapterId: [this.fDIChapterId],
            IndexNo: ['', Validators.required],
            IndexName: ['', Validators.required],
            IndexContent: ['', Validators.required],
            SaveAfterIndexId: ['']
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

    GetFDIChapter(fDIChapterId: number) {
        this.spinnerService.show();

        let getFDIChapterRequest = new GetFDIChapterRequest();
        getFDIChapterRequest.FDIChapterId = fDIChapterId;
        getFDIChapterRequest.IsActive = null;

        this._fDIChapterService.getFDIChapter(getFDIChapterRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.fDIChapter = data.Response[0];
            }, error => this.msg = <any>error);
    }

    GetFDICircularIndex(indexData): void {
        this.spinnerService.show();

        let getFDICircularIndexRequest = new GetFDICircularIndexRequest();
        getFDICircularIndexRequest.FDIChapterId = this.fDIChapterId;

        this._fDICircularIndexService.getFDICircularIndex(getFDICircularIndexRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.fDICircularIndexes = [];

                if (data.Status == Global.API_SUCCESS) {

                    this.fDICircularIndexes.push({ FDICircularIndexId: null, IndexNo: null, CreatedDate: null, IndexContent: null, IndexName: "--Select Index--", SortId: null, IsActive: null, IsDeleted: null, ModifiedDate: null, FDIChapterId: null });

                    data.Response.forEach(item => {
                        //if (data.Response.length != this.fDICircularIndexes.length)
                        this.fDICircularIndexes.push({ FDICircularIndexId: item.FDICircularIndexId, IndexNo: item.IndexNo, CreatedDate: null, IndexContent: null, IndexName: item.IndexName, SortId: item.SortId, IsActive: null, IsDeleted: null, ModifiedDate: null, FDIChapterId: null });
                    });

                    if (indexData) {
                        let index = this.fDICircularIndexes.filter(x => x.SortId == (indexData.SortId - 1));

                        this.frmFDICircularIndex.get("SaveAfterIndexId").setValue((index.length > 0) ? index[0].FDICircularIndexId : null);
                    } else {
                        this.frmFDICircularIndex.get("SaveAfterIndexId").setValue(null);
                    }
                    this.frmFDICircularIndex.updateValueAndValidity();
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_FDI_CIRCULAR_INDEX_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FDI_CIRCULAR_INDEX_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    EditFDICircularIndex(fDICircularIndexId: number) {
        this.spinnerService.show();

        let getFDICircularIndexRequest = new GetFDICircularIndexRequest();
        getFDICircularIndexRequest.FDICircularIndexId = fDICircularIndexId;
        getFDICircularIndexRequest.IsActive = null;

        this._fDICircularIndexService.getFDICircularIndex(getFDICircularIndexRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.GetFDICircularIndex(data.Response[0]);

                this.frmFDICircularIndex.setValue({
                    FDICircularIndexId: fDICircularIndexId,
                    FDIChapterId: data.Response[0].FDIChapterId,
                    IndexNo: data.Response[0].IndexNo,
                    IndexName: data.Response[0].IndexName,
                    IndexContent: data.Response[0].IndexContent,
                    SaveAfterIndexId: null
                });

                this.frmFDICircularIndex.updateValueAndValidity();
            }, error => this.msg = <any>error);
    }

    SaveFDICircularIndex(formData) {
        this.spinnerService.show();

        formData.value.SaveAfterIndexId = (formData.value.SaveAfterIndexId && formData.value.SaveAfterIndexId != "null") ? formData.value.SaveAfterIndexId : null;
        
        if (formData.value.FDICircularIndexId) {
            this._fDICircularIndexService.updateFDICircularIndex(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/fdicirculars'], {
                                queryParams: {
                                    indexFDICircular1: params["indexFDICircular1"], indexFDICircular2: params["indexFDICircular2"], indexChapter: params["indexChapter"], indexIndex: params["indexIndex"], sortingFDICircularField: params["sortingFDICircularField"], sortingFDICircularDirection: params["sortingFDICircularDirection"], sortingFDIChapterField: params["sortingFDIChapterField"], sortingFDIChapterDirection: params["sortingFDIChapterDirection"], sortingFDICircularIndexField: params["sortingFDICircularIndexField"], sortingFDICircularIndexDirection: params["sortingFDICircularIndexDirection"], sortingFDICircularSubIndexField: params["sortingFDICircularSubIndexField"], sortingFDICircularSubIndexDirection: params["sortingFDICircularSubIndexDirection"], sortingFDICircularIndexAmendmentField: params["sortingFDICircularIndexAmendmentField"], sortingFDICircularIndexAmendmentDirection: params["sortingFDICircularIndexAmendmentDirection"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_FDI_CIRCULAR_INDEX_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_FDI_CIRCULAR_INDEX_TITLE);
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FDI_CIRCULAR_INDEX_TITLE, { enableHtml: true });
                    });
        } else {
            this._fDICircularIndexService.addFDICircularIndex(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/fdicirculars'], {
                                queryParams: {
                                    indexFDICircular1: params["indexFDICircular1"], indexFDICircular2: params["indexFDICircular2"], indexChapter: params["indexChapter"], indexIndex: params["indexIndex"], sortingFDICircularField: params["sortingFDICircularField"], sortingFDICircularDirection: params["sortingFDICircularDirection"], sortingFDIChapterField: params["sortingFDIChapterField"], sortingFDIChapterDirection: params["sortingFDIChapterDirection"], sortingFDICircularIndexField: params["sortingFDICircularIndexField"], sortingFDICircularIndexDirection: params["sortingFDICircularIndexDirection"], sortingFDICircularSubIndexField: params["sortingFDICircularSubIndexField"], sortingFDICircularSubIndexDirection: params["sortingFDICircularSubIndexDirection"], sortingFDICircularIndexAmendmentField: params["sortingFDICircularIndexAmendmentField"], sortingFDICircularIndexAmendmentDirection: params["sortingFDICircularIndexAmendmentDirection"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_FDI_CIRCULAR_INDEX_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_FDI_CIRCULAR_INDEX_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FDI_CIRCULAR_INDEX_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    OnSubmitFDICircularIndex(formData: any) {
        this.isSubmited = true;

        if (this.frmFDICircularIndex.valid) {
            this.SaveFDICircularIndex(formData);
        }
    }

    CancelFDICircularIndex() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.router.navigate(['/admin/secure/fdicirculars'], {
                queryParams: {
                    indexFDICircular1: params["indexFDICircular1"], indexFDICircular2: params["indexFDICircular2"], indexChapter: params["indexChapter"], indexIndex: params["indexIndex"], sortingFDICircularField: params["sortingFDICircularField"], sortingFDICircularDirection: params["sortingFDICircularDirection"], sortingFDIChapterField: params["sortingFDIChapterField"], sortingFDIChapterDirection: params["sortingFDIChapterDirection"], sortingFDICircularIndexField: params["sortingFDICircularIndexField"], sortingFDICircularIndexDirection: params["sortingFDICircularIndexDirection"], sortingFDICircularSubIndexField: params["sortingFDICircularSubIndexField"], sortingFDICircularSubIndexDirection: params["sortingFDICircularSubIndexDirection"], sortingFDICircularIndexAmendmentField: params["sortingFDICircularIndexAmendmentField"], sortingFDICircularIndexAmendmentDirection: params["sortingFDICircularIndexAmendmentDirection"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                }
            });
        });
    }
}
