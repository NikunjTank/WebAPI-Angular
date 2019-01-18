import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FDICircularIndexAmendment, GetFDICircularIndexAmendmentRequest } from '../../../model/fDICircularIndexAmendment';
import { PressNote, GetPressNoteRequest } from '../../../model/pressNote';
import { FDICircularIndex, GetFDICircularIndexRequest } from '../../../model/fDICircularIndex';
import { FDICircularSubIndex, GetFDICircularSubIndexRequest } from '../../../model/fDICircularSubIndex';
import { FDICircular, GetFDICircularRequest } from '../../../model/fDICircular';
import { FDIChapter, GetFDIChapterRequest } from '../../../model/fDIChapter';
import { FDICircularIndexAmendmentAdminService } from '../../../service/admin/fDICircularIndexAmendment.service';
import { PressNoteAdminService } from '../../../service/admin/pressNote.service';
import { FDICircularIndexAdminService } from '../../../service/admin/fDICircularIndex.service';
import { FDICircularSubIndexAdminService } from '../../../service/admin/fDICircularSubIndex.service';
import { FDICircularAdminService } from '../../../service/admin/fDICircular.service';
import { FDIChapterAdminService } from '../../../service/admin/fDIChapter.service';
import { DropDown } from '../../../common/dropDown';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


@Component({
    selector: 'my-app',
    templateUrl: './fDICircularIndexAmendment.component.html'
})

export class FDICircularIndexAmendmentAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _fDICircularIndexAmendmentService: FDICircularIndexAmendmentAdminService, private _pressNoteService: PressNoteAdminService, private _fDICircularIndexService: FDICircularIndexAdminService, private _fDICircularSubIndexService: FDICircularSubIndexAdminService, private _fDICircularService: FDICircularAdminService, private _fDIChapterService: FDIChapterAdminService, vcr: ViewContainerRef, private spinnerService: SpinnerService) { }

    _global: Global = new Global();

    pressNotes: DropDown[] = [];
    fDIChapters: DropDown[] = [];
    fDICircularIndexes: DropDown[] = [];
    fDICircularSubIndexes: DropDown[] = [];
    pressNoteDropDownSettings = {};
    selectedPressNotes: any = [];

    fDICircular: FDICircular = new FDICircular();

    fDICircularId: number = 0;
    fDICircularIndexAmendmentId: number = 0;

    frmFDICircularIndexAmendment: FormGroup;
    msg: string;

    addUpdateText: string;

    isSubmited: boolean = false;

    pdfServerPath: string = Global.FDICIRCULAR_PDF_FILEPATH;

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params: Params) => {
            let fDICircularId = this._global.decryptValue(params['fDICircularId']);
            let fDICircularIndexAmendmentId = this._global.decryptValue(params['fDICircularIndexAmendmentId']);

            this.fDICircularId = parseInt(fDICircularId);

            if (fDICircularId) {
                this.GetFDICircular(this.fDICircularId);

                if (fDICircularIndexAmendmentId) {
                    this.addUpdateText = "Update";

                    this.fDICircularIndexAmendmentId = parseInt(fDICircularIndexAmendmentId);
                    this.EditFDICircularIndexAmendment(parseInt(fDICircularIndexAmendmentId));
                } else {
                    this.GetPressNote(null);
                    this.GetFDIChapter(null);
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

        this.frmFDICircularIndexAmendment = this.formBuilder.group({
            FDICircularIndexAmendmentId: [''],
            FDICircularId: [this.fDICircularId],
            PressNoteIds: ['', Validators.required],
            FDIChapterId: ['', Validators.required],
            FDICircularIndexId: ['', Validators.required],
            FDICircularSubIndexId: [''],
            Year: ['', Validators.required],
            IndexAmendmentContent: ['', Validators.required]
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

    GetPressNote(fDICircularIndexAmendmentData): void {
        this.spinnerService.show();

        let getPressNoteRequest = new GetPressNoteRequest();

        this._pressNoteService.getPressNote(getPressNoteRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.pressNotes = [];

                if (data.Status == Global.API_SUCCESS) {

                    //this.pressNotes.push({ Value: "", Text: "--Select--" });

                    data.Response.forEach(item => {
                        this.pressNotes.push({ Value: item.PressNoteId, Text: item.PressNoteNo });
                    });

                    //this.frmFDICircularIndexAmendment.get("PressNoteId").setValue((fDICircularIndexAmendmentData != null) ? fDICircularIndexAmendmentData.PressNoteId : "");
                    //this.frmFDICircularIndexAmendment.updateValueAndValidity();

                    this.pressNoteDropDownSettings = {
                        singleSelection: false,
                        idField: 'Value',
                        textField: 'Text',
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableCheckAll: false,
                        allowSearchFilter: true
                    };

                    let selectedPressNotes = [];

                    if (fDICircularIndexAmendmentData != null) {
                        fDICircularIndexAmendmentData.PressNoteIds.split(',').forEach(item => {
                            if (item)
                                selectedPressNotes.push({ Value: parseInt(item), Text: this.pressNotes.filter(x => x.Value == item)[0].Text });
                        });

                        this.selectedPressNotes = selectedPressNotes;
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_FDI_CIRCULAR_INDEX_AMENDMENT_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FDI_CIRCULAR_INDEX_AMENDMENT_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    GetFDIChapter(fDICircularIndexAmendmentData): void {
        this.spinnerService.show();

        let getFDIChapterRequest = new GetFDIChapterRequest();
        getFDIChapterRequest.FDICircularId = this.fDICircularId;

        this._fDIChapterService.getFDIChapter(getFDIChapterRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.fDIChapters = [];

                if (data.Status == Global.API_SUCCESS) {

                    this.fDIChapters.push({ Value: "", Text: "--Select--" });

                    data.Response.forEach(item => {
                        this.fDIChapters.push({ Value: item.FDIChapterId, Text: item.Chapter });
                    });

                    this.frmFDICircularIndexAmendment.get("FDIChapterId").setValue((fDICircularIndexAmendmentData != null) ? fDICircularIndexAmendmentData.FDIChapterId : "");
                    this.frmFDICircularIndexAmendment.updateValueAndValidity();

                    if (fDICircularIndexAmendmentData != null)
                        this.GetFDICircularIndex(fDICircularIndexAmendmentData.FDIChapterId, fDICircularIndexAmendmentData);
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_FDI_CIRCULAR_INDEX_AMENDMENT_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FDI_CIRCULAR_INDEX_AMENDMENT_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    OnChapterChange(fDIChapterId: string) {
        this.fDICircularIndexes = [];

        if (fDIChapterId) {
            this.GetFDICircularIndex(fDIChapterId, null);
        } else {
            this.frmFDICircularIndexAmendment.get("FDIChapterId").setValue('');
            this.frmFDICircularIndexAmendment.updateValueAndValidity();
        }
    }

    GetFDICircularIndex(fDIChapterId, fDICircularIndexAmendmentData): void {
        this.spinnerService.show();

        let getFDICircularIndexRequest = new GetFDICircularIndexRequest();
        getFDICircularIndexRequest.FDIChapterId = fDIChapterId;

        this._fDICircularIndexService.getFDICircularIndex(getFDICircularIndexRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.fDICircularIndexes = [];

                if (data.Status == Global.API_SUCCESS) {

                    this.fDICircularIndexes.push({ Value: "", Text: "--Select--" });

                    data.Response.forEach(item => {
                        this.fDICircularIndexes.push({ Value: item.FDICircularIndexId, Text: item.IndexNo + ' - ' + item.IndexName });
                    });

                    this.frmFDICircularIndexAmendment.get("FDICircularIndexId").setValue((fDICircularIndexAmendmentData != null) ? fDICircularIndexAmendmentData.FDICircularIndexId : "");
                    this.frmFDICircularIndexAmendment.updateValueAndValidity();

                    if (fDICircularIndexAmendmentData != null)
                        this.GetFDICircularSubIndex(fDICircularIndexAmendmentData.FDICircularIndexId, fDICircularIndexAmendmentData);
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_FDI_CIRCULAR_INDEX_AMENDMENT_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FDI_CIRCULAR_INDEX_AMENDMENT_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    OnIndexChange(fDICircularIndexId: string) {
        this.fDICircularSubIndexes = [];

        if (fDICircularIndexId) {
            this.GetFDICircularSubIndex(fDICircularIndexId, null);
        } else {
            this.frmFDICircularIndexAmendment.get("FDICircularIndexId").setValue('');
            this.frmFDICircularIndexAmendment.updateValueAndValidity();
        }
    }

    GetFDICircularSubIndex(fDICircularIndexId, fDICircularIndexAmendmentData): void {
        this.spinnerService.show();

        let getFDICircularSubIndexRequest = new GetFDICircularSubIndexRequest();
        getFDICircularSubIndexRequest.FDICircularIndexId = fDICircularIndexId;

        this._fDICircularSubIndexService.getFDICircularSubIndex(getFDICircularSubIndexRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.fDICircularSubIndexes = [];

                if (data.Status == Global.API_SUCCESS) {

                    this.fDICircularSubIndexes.push({ Value: "", Text: "--Select--" });

                    data.Response.forEach(item => {
                        this.fDICircularSubIndexes.push({ Value: item.FDICircularSubIndexId, Text: item.SubIndexNo + ' - ' + item.SubIndexName });
                    });

                    this.frmFDICircularIndexAmendment.get("FDICircularSubIndexId").setValue((fDICircularIndexAmendmentData != null) ? (fDICircularIndexAmendmentData.FDICircularSubIndexId) ? fDICircularIndexAmendmentData.FDICircularSubIndexId : "" : "");
                    this.frmFDICircularIndexAmendment.updateValueAndValidity();
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_FDI_CIRCULAR_INDEX_AMENDMENT_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FDI_CIRCULAR_INDEX_AMENDMENT_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    EditFDICircularIndexAmendment(fDICircularIndexAmendmentId: number) {
        this.spinnerService.show();

        let getFDICircularIndexAmendmentRequest = new GetFDICircularIndexAmendmentRequest();
        getFDICircularIndexAmendmentRequest.FDICircularIndexAmendmentId = fDICircularIndexAmendmentId;
        getFDICircularIndexAmendmentRequest.FDICircularId = this.fDICircularId;
        getFDICircularIndexAmendmentRequest.IsActive = null;

        this._fDICircularIndexAmendmentService.getFDICircularIndexAmendment(getFDICircularIndexAmendmentRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.GetPressNote(data.Response[0]);
                this.GetFDIChapter(data.Response[0]);

                this.frmFDICircularIndexAmendment.setValue({
                    FDICircularIndexAmendmentId: fDICircularIndexAmendmentId,
                    FDICircularId: data.Response[0].FDICircularId,
                    PressNoteIds: [],
                    FDIChapterId: data.Response[0].FDIChapterId,
                    FDICircularIndexId: data.Response[0].FDICircularIndexId,
                    FDICircularSubIndexId: data.Response[0].FDICircularSubIndexId,
                    Year: data.Response[0].Year,
                    IndexAmendmentContent: data.Response[0].IndexAmendmentContent
                });

                this.frmFDICircularIndexAmendment.updateValueAndValidity();
            }, error => this.msg = <any>error);
    }

    SaveFDICircularIndexAmendment(formData) {
        this.spinnerService.show();

        if (formData.value.FDICircularSubIndexId == 'null') {
            formData.value.FDICircularSubIndexId = null;
        }

        if (formData.value.FDICircularIndexAmendmentId) {
            this._fDICircularIndexAmendmentService.updateFDICircularIndexAmendment(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/fdicirculars'], {
                                queryParams: {
                                    indexFDICircular1: params["indexFDICircular1"], indexFDICircular2: params["indexFDICircular2"], indexChapter: params["indexChapter"], indexIndex: params["indexIndex"], sortingFDICircularField: params["sortingFDICircularField"], sortingFDICircularDirection: params["sortingFDICircularDirection"], sortingFDIChapterField: params["sortingFDIChapterField"], sortingFDIChapterDirection: params["sortingFDIChapterDirection"], sortingFDICircularIndexField: params["sortingFDICircularIndexField"], sortingFDICircularIndexDirection: params["sortingFDICircularIndexDirection"], sortingFDICircularSubIndexField: params["sortingFDICircularSubIndexField"], sortingFDICircularSubIndexDirection: params["sortingFDICircularSubIndexDirection"], sortingFDICircularIndexAmendmentField: params["sortingFDICircularIndexAmendmentField"], sortingFDICircularIndexAmendmentDirection: params["sortingFDICircularIndexAmendmentDirection"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_FDI_CIRCULAR_INDEX_AMENDMENT_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_FDI_CIRCULAR_INDEX_AMENDMENT_TITLE);
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FDI_CIRCULAR_INDEX_AMENDMENT_TITLE, { enableHtml: true });
                    });
        } else {
            this._fDICircularIndexAmendmentService.addFDICircularIndexAmendment(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/fdicirculars'], {
                                queryParams: {
                                    indexFDICircular1: params["indexFDICircular1"], indexFDICircular2: params["indexFDICircular2"], indexChapter: params["indexChapter"], indexIndex: params["indexIndex"], sortingFDICircularField: params["sortingFDICircularField"], sortingFDICircularDirection: params["sortingFDICircularDirection"], sortingFDIChapterField: params["sortingFDIChapterField"], sortingFDIChapterDirection: params["sortingFDIChapterDirection"], sortingFDICircularIndexField: params["sortingFDICircularIndexField"], sortingFDICircularIndexDirection: params["sortingFDICircularIndexDirection"], sortingFDICircularSubIndexField: params["sortingFDICircularSubIndexField"], sortingFDICircularSubIndexDirection: params["sortingFDICircularSubIndexDirection"], sortingFDICircularIndexAmendmentField: params["sortingFDICircularIndexAmendmentField"], sortingFDICircularIndexAmendmentDirection: params["sortingFDICircularIndexAmendmentDirection"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_FDI_CIRCULAR_INDEX_AMENDMENT_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_FDI_CIRCULAR_INDEX_AMENDMENT_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FDI_CIRCULAR_INDEX_AMENDMENT_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    OnSubmitFDICircularIndexAmendment(formData: any) {
        this.isSubmited = true;
        
        if (this.frmFDICircularIndexAmendment.valid) {
            formData.value.PressNoteIds = this._global.convertArrayToCommaSeperatedString(formData.value.PressNoteIds);

            this.SaveFDICircularIndexAmendment(formData);
        }
    }

    CancelFDICircularIndexAmendment() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.router.navigate(['/admin/secure/fdicirculars'], {
                queryParams: {
                    indexFDICircular1: params["indexFDICircular1"], indexFDICircular2: params["indexFDICircular2"], indexChapter: params["indexChapter"], indexIndex: params["indexIndex"], sortingFDICircularField: params["sortingFDICircularField"], sortingFDICircularDirection: params["sortingFDICircularDirection"], sortingFDIChapterField: params["sortingFDIChapterField"], sortingFDIChapterDirection: params["sortingFDIChapterDirection"], sortingFDICircularIndexField: params["sortingFDICircularIndexField"], sortingFDICircularIndexDirection: params["sortingFDICircularIndexDirection"], sortingFDICircularSubIndexField: params["sortingFDICircularSubIndexField"], sortingFDICircularSubIndexDirection: params["sortingFDICircularSubIndexDirection"], sortingFDICircularIndexAmendmentField: params["sortingFDICircularIndexAmendmentField"], sortingFDICircularIndexAmendmentDirection: params["sortingFDICircularIndexAmendmentDirection"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                }
            });
        });
    }
}
