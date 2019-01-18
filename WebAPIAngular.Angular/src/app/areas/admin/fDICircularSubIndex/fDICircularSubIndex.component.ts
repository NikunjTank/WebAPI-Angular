import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FDICircularSubIndex, GetFDICircularSubIndexRequest } from '../../../model/fDICircularSubIndex';
import { FDICircularIndex, GetFDICircularIndexRequest } from '../../../model/fDICircularIndex';
import { FDICircular, GetFDICircularRequest } from '../../../model/fDICircular';
import { FDIChapter, GetFDIChapterRequest } from '../../../model/fDIChapter';
import { FDICircularSubIndexAdminService } from '../../../service/admin/fDICircularSubIndex.service';
import { FDICircularIndexAdminService } from '../../../service/admin/fDICircularIndex.service';
import { FDICircularAdminService } from '../../../service/admin/fDICircular.service';
import { FDIChapterAdminService } from '../../../service/admin/fDIChapter.service';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


import { ModalDialogService } from 'ngx-modal-dialog';
import { ContentPopUpAdminComponent } from '../../../areas/admin/contentPopUp/contentPopUp.component';

@Component({
    selector: 'my-app',
    templateUrl: './fDICircularSubIndex.component.html'
})

export class FDICircularSubIndexAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _fDICircularSubIndexService: FDICircularSubIndexAdminService, private _fDICircularService: FDICircularAdminService, private _fDICircularIndexService: FDICircularIndexAdminService, private _fDIChapterService: FDIChapterAdminService, private vcr: ViewContainerRef, private spinnerService: SpinnerService, private modalService: ModalDialogService) { }

    _global: Global = new Global();

    fDICircularSubIndex: FDICircularSubIndex;
    fDICircular: FDICircular = new FDICircular();
    fDIChapter: FDIChapter = new FDIChapter();
    fDICircularIndex: FDICircularIndex = new FDICircularIndex();
    fDICircularSubIndexes: FDICircularSubIndex[] = [];

    fDICircularSubIndexId: number = 0;
    fDICircularIndexId: number;
    fDICircularId: number;
    fDIChapterId: number;

    frmFDICircularSubIndex: FormGroup;
    msg: string;

    addUpdateText: string;

    isSubmited: boolean = false;

    pdfServerPath: string = Global.FDICIRCULAR_PDF_FILEPATH;

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params: Params) => {
            let fDICircularId = this._global.decryptValue(params['fDICircularId']);
            let fDIChapterId = this._global.decryptValue(params['fDIChapterId']);
            let fDICircularIndexId = this._global.decryptValue(params['fDICircularIndexId']);
            let fDICircularSubIndexId = this._global.decryptValue(params['fDICircularSubIndexId']);
            
            this.fDICircularId = parseInt(fDICircularId);
            this.fDIChapterId = parseInt(fDIChapterId);
            this.fDICircularIndexId = parseInt(fDICircularIndexId);
            
            if (fDICircularId && fDICircularIndexId) {
                this.GetFDICircular(this.fDICircularId);
                this.GetFDIChapter(this.fDIChapterId);
                this.GetFDICircularIndex(this.fDICircularIndexId);

                if (fDICircularSubIndexId) {
                    this.addUpdateText = "Update";

                    this.fDICircularSubIndexId = parseInt(fDICircularSubIndexId);
                    this.EditFDICircularSubIndex(parseInt(fDICircularSubIndexId));
                } else {
                    this.GetFDICircularSubIndex(null);
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

        this.frmFDICircularSubIndex = this.formBuilder.group({
            FDICircularSubIndexId: [''],
            FDICircularIndexId: [this.fDICircularIndexId],
            SubIndexNo: ['', Validators.required],
            SubIndexName: ['', Validators.required],
            SubIndexContent: ['', Validators.required],
            SaveAfterSubIndexId: ['']
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

    GetFDICircularIndex(fDICircularIndexId: number) {
        this.spinnerService.show();

        let getFDICircularIndexRequest = new GetFDICircularIndexRequest();
        getFDICircularIndexRequest.FDICircularIndexId = fDICircularIndexId;
        getFDICircularIndexRequest.IsActive = null;

        this._fDICircularIndexService.getFDICircularIndex(getFDICircularIndexRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.fDICircularIndex = data.Response[0];
            }, error => this.msg = <any>error);
    }

    GetFDICircularSubIndex(subIndexData): void {
        this.spinnerService.show();

        let getFDICircularSubIndexRequest = new GetFDICircularSubIndexRequest();
        getFDICircularSubIndexRequest.FDICircularIndexId = this.fDICircularIndexId;

        this._fDICircularSubIndexService.getFDICircularSubIndex(getFDICircularSubIndexRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.fDICircularSubIndexes = [];

                if (data.Status == Global.API_SUCCESS) {

                    this.fDICircularSubIndexes.push({ FDICircularSubIndexId: null, SubIndexNo: null, CreatedDate: null, SubIndexContent: null, SubIndexName: "--Select SubIndex--", SortId: null, IsActive: null, IsDeleted: null, ModifiedDate: null, FDICircularIndexId: null });

                    data.Response.forEach(item => {
                        //if (data.Response.length != this.fDICircularSubIndexes.length)
                        this.fDICircularSubIndexes.push({ FDICircularSubIndexId: item.FDICircularSubIndexId, SubIndexNo: item.SubIndexNo, CreatedDate: null, SubIndexContent: null, SubIndexName: item.SubIndexName, SortId: item.SortId, IsActive: null, IsDeleted: null, ModifiedDate: null, FDICircularIndexId: null });
                    });

                    if (subIndexData) {
                        let index = this.fDICircularSubIndexes.filter(x => x.SortId == (subIndexData.SortId - 1));

                        this.frmFDICircularSubIndex.get("SaveAfterSubIndexId").setValue((index.length > 0) ? index[0].FDICircularSubIndexId : null);
                    } else {
                        this.frmFDICircularSubIndex.get("SaveAfterSubIndexId").setValue(null);
                    }
                    this.frmFDICircularSubIndex.updateValueAndValidity();
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_FDI_CIRCULAR_SUBINDEX_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FDI_CIRCULAR_SUBINDEX_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    EditFDICircularSubIndex(fDICircularSubIndexId: number) {
        this.spinnerService.show();

        let getFDICircularSubIndexRequest = new GetFDICircularSubIndexRequest();
        getFDICircularSubIndexRequest.FDICircularSubIndexId = fDICircularSubIndexId;
        getFDICircularSubIndexRequest.IsActive = null;

        this._fDICircularSubIndexService.getFDICircularSubIndex(getFDICircularSubIndexRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.GetFDICircularSubIndex(data.Response[0]);

                this.frmFDICircularSubIndex.setValue({
                    FDICircularSubIndexId: fDICircularSubIndexId,
                    FDICircularIndexId: data.Response[0].FDICircularIndexId,
                    SubIndexNo: data.Response[0].SubIndexNo,
                    SubIndexName: data.Response[0].SubIndexName,
                    SubIndexContent: data.Response[0].SubIndexContent,
                    SaveAfterSubIndexId: null
                });

                this.frmFDICircularSubIndex.updateValueAndValidity();
            }, error => this.msg = <any>error);
    }

    SaveFDICircularSubIndex(formData) {
        this.spinnerService.show();

        if (formData.value.FDICircularSubIndexId) {
            this._fDICircularSubIndexService.updateFDICircularSubIndex(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/fdicirculars'], {
                                queryParams: {
                                    indexFDICircular1: params["indexFDICircular1"], indexFDICircular2: params["indexFDICircular2"], indexChapter: params["indexChapter"], indexIndex: params["indexIndex"], sortingFDICircularField: params["sortingFDICircularField"], sortingFDICircularDirection: params["sortingFDICircularDirection"], sortingFDIChapterField: params["sortingFDIChapterField"], sortingFDIChapterDirection: params["sortingFDIChapterDirection"], sortingFDICircularIndexField: params["sortingFDICircularIndexField"], sortingFDICircularIndexDirection: params["sortingFDICircularIndexDirection"], sortingFDICircularSubIndexField: params["sortingFDICircularSubIndexField"], sortingFDICircularSubIndexDirection: params["sortingFDICircularSubIndexDirection"], sortingFDICircularIndexAmendmentField: params["sortingFDICircularIndexAmendmentField"], sortingFDICircularIndexAmendmentDirection: params["sortingFDICircularIndexAmendmentDirection"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_FDI_CIRCULAR_SUBINDEX_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_FDI_CIRCULAR_SUBINDEX_TITLE);
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FDI_CIRCULAR_SUBINDEX_TITLE, { enableHtml: true });
                    });
        } else {
            this._fDICircularSubIndexService.addFDICircularSubIndex(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/fdicirculars'], {
                                queryParams: {
                                    indexFDICircular1: params["indexFDICircular1"], indexFDICircular2: params["indexFDICircular2"], indexChapter: params["indexChapter"], indexIndex: params["indexIndex"], sortingFDICircularField: params["sortingFDICircularField"], sortingFDICircularDirection: params["sortingFDICircularDirection"], sortingFDIChapterField: params["sortingFDIChapterField"], sortingFDIChapterDirection: params["sortingFDIChapterDirection"], sortingFDICircularIndexField: params["sortingFDICircularIndexField"], sortingFDICircularIndexDirection: params["sortingFDICircularIndexDirection"], sortingFDICircularSubIndexField: params["sortingFDICircularSubIndexField"], sortingFDICircularSubIndexDirection: params["sortingFDICircularSubIndexDirection"], sortingFDICircularIndexAmendmentField: params["sortingFDICircularIndexAmendmentField"], sortingFDICircularIndexAmendmentDirection: params["sortingFDICircularIndexAmendmentDirection"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_FDI_CIRCULAR_SUBINDEX_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_FDI_CIRCULAR_SUBINDEX_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FDI_CIRCULAR_SUBINDEX_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    OnSubmitFDICircularSubIndex(formData: any) {
        this.isSubmited = true;

        if (this.frmFDICircularSubIndex.valid) {
            formData.value.FDICircularIndexId = this.fDICircularIndexId;
            this.SaveFDICircularSubIndex(formData);
        }
    }

    CancelFDICircularSubIndex() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.router.navigate(['/admin/secure/fdicirculars'], {
                queryParams: {
                    indexFDICircular1: params["indexFDICircular1"], indexFDICircular2: params["indexFDICircular2"], indexChapter: params["indexChapter"], indexIndex: params["indexIndex"], sortingFDICircularField: params["sortingFDICircularField"], sortingFDICircularDirection: params["sortingFDICircularDirection"], sortingFDIChapterField: params["sortingFDIChapterField"], sortingFDIChapterDirection: params["sortingFDIChapterDirection"], sortingFDICircularIndexField: params["sortingFDICircularIndexField"], sortingFDICircularIndexDirection: params["sortingFDICircularIndexDirection"], sortingFDICircularSubIndexField: params["sortingFDICircularSubIndexField"], sortingFDICircularSubIndexDirection: params["sortingFDICircularSubIndexDirection"], sortingFDICircularIndexAmendmentField: params["sortingFDICircularIndexAmendmentField"], sortingFDICircularIndexAmendmentDirection: params["sortingFDICircularIndexAmendmentDirection"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
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
