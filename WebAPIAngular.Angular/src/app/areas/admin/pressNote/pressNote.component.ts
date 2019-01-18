import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PressNote, GetPressNoteRequest } from '../../../model/pressNote';
import { PressNoteAdminService } from '../../../service/admin/pressNote.service';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


@Component({
    selector: 'my-app',
    templateUrl: './pressNote.component.html'
})

export class PressNoteAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _pressNoteService: PressNoteAdminService, vcr: ViewContainerRef, private spinnerService: SpinnerService) { }

    _global: Global = new Global();

    pressNote: PressNote;
    pressNoteId: number = 0;
    searchText: string = '';
    frmPressNote: FormGroup;
    msg: string;
    files: any;

    addUpdateText: string;

    pdfServerPath: string = Global.PRESSNOTE_PDF_FILEPATH;
    pressNotePDFName: string;

    minDate: any = { year: 1970, month: 1, day: 1 };

    isSubmited: boolean = false;

    ngOnInit(): void {
        this.frmPressNote = this.formBuilder.group({
            PressNoteId: [''],
            PressNoteNo: ['', Validators.required],
            PressNoteName: ['', Validators.required],
            PressNoteDate: ['', Validators.required],
            PressNoteEffectiveDate: ['', Validators.required],
            Year: ['', Validators.required],
            PressNotePDF: ['', Validators.required]
        });

        this.activatedRoute.params.subscribe((params: Params) => {
            let pressNoteId = this._global.decryptValue(params['pressNoteId']);

            if (pressNoteId) {
                this.addUpdateText = "Update";
                this.pressNoteId = parseInt(pressNoteId);
                this.EditPressNote(parseInt(pressNoteId));
            } else {
                this.addUpdateText = "Add";
            }
        });
    }

    fileChange(event: any) {
        this.files = event.target.files;

        if (this.files[0].type == "application/pdf") {
            this.frmPressNote.get('PressNotePDF').setValue(this.files[0].name);
            this.frmPressNote.updateValueAndValidity();
        } else {
            this.frmPressNote.get('PressNotePDF').setValue(null);
            this.frmPressNote.updateValueAndValidity();
            this.toastr.error("Please upload proper pdf file.", Global.TOASTR_ADMIN_PRESSNOTE_TITLE, { closeButton: true });
        }
    }

    EditPressNote(pressNoteId: number) {
        this.spinnerService.show();

        let getPressNoteRequest = new GetPressNoteRequest();
        getPressNoteRequest.PressNoteId = pressNoteId;
        getPressNoteRequest.IsActive = null;

        this._pressNoteService.getPressNote(getPressNoteRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.pressNotePDFName = data.Response[0].PressNotePDF;

                let pressNoteDate = new Date(data.Response[0].PressNoteDate);
                let pressNoteEffectiveDate = new Date(data.Response[0].PressNoteEffectiveDate);

                this.frmPressNote.setValue({
                    PressNoteId: pressNoteId,
                    PressNoteNo: data.Response[0].PressNoteNo,
                    PressNoteName: data.Response[0].PressNoteName,
                    PressNoteDate: { year: pressNoteDate.getFullYear(), month: pressNoteDate.getMonth() + 1, day: pressNoteDate.getDate() },
                    PressNoteEffectiveDate: { year: pressNoteEffectiveDate.getFullYear(), month: pressNoteEffectiveDate.getMonth() + 1, day: pressNoteEffectiveDate.getDate() },
                    Year: data.Response[0].Year,
                    PressNotePDF: data.Response[0].PressNotePDF
                });

                this.frmPressNote.updateValueAndValidity();
            }, error => this.msg = <any>error);
    }

    SavePressNote(formData) {
        this.spinnerService.show();

        formData.value.PressNoteDate = (formData.value.PressNoteDate != null) ? formData.value.PressNoteDate.year + "/" + formData.value.PressNoteDate.month + "/" + formData.value.PressNoteDate.day : null;
        formData.value.PressNoteEffectiveDate = (formData.value.PressNoteEffectiveDate != null) ? formData.value.PressNoteEffectiveDate.year + "/" + formData.value.PressNoteEffectiveDate.month + "/" + formData.value.PressNoteEffectiveDate.day : null;

        if (formData.value.PressNoteId) {
            this._pressNoteService.updatePressNote(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/pressnotes'], {
                                queryParams: {
                                    indexPressNote1: params["indexPressNote1"], indexPressNote2: params["indexPressNote2"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_PRESSNOTE_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_PRESSNOTE_TITLE);
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_PRESSNOTE_TITLE, { enableHtml: true });
                    });
        } else {
            this._pressNoteService.addPressNote(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/pressnotes'], {
                                queryParams: {
                                    indexPressNote1: params["indexPressNote1"], indexPressNote2: params["indexPressNote2"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_PRESSNOTE_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_PRESSNOTE_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_PRESSNOTE_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    OnSubmitPressNote(formData: any) {
        this.isSubmited = true;

        if (this.frmPressNote.valid) {
            this.spinnerService.show();

            if (this.files != null && this.files.length > 0) {
                let fileFormData: FormData = new FormData();
                for (var i = 0; i < this.files.length; i++) {
                    fileFormData.append(this.files[i].name, this.files[i]);
                }

                this._pressNoteService.fileUpload(fileFormData)
                    .subscribe(response => {
                        if (response.Status == "Success") {
                            this.frmPressNote.get('PressNotePDF').setValue(response.Response);
                            this.frmPressNote.updateValueAndValidity();
                            formData.value.PressNotePDF = response.Response;

                            this.files = null;

                            this.SavePressNote(formData);
                        } else {
                            this.spinnerService.hide();
                            this.toastr.error(response.Description, Global.TOASTR_ADMIN_PRESSNOTE_TITLE, { enableHtml: true, closeButton: true });
                        }
                    },
                        error => {
                            this.spinnerService.hide();
                            this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_PRESSNOTE_TITLE, { enableHtml: true, closeButton: true });
                        });
            } else {
                if (formData.value.PressNotePDF) {
                    this.SavePressNote(formData);
                } else {
                    this.spinnerService.hide();
                }
            }
        }
    }

    ClearPressNoteDate() {
        this.frmPressNote.get("PressNoteDate").setValue("");
        this.frmPressNote.updateValueAndValidity();
    }

    ClearPressNoteEffectiveDate() {
        this.frmPressNote.get("PressNoteEffectiveDate").setValue("");
        this.frmPressNote.updateValueAndValidity();
    }

    CancelPressNote() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.router.navigate(['/admin/secure/pressnotes'], {
                queryParams: {
                    indexPressNote1: params["indexPressNote1"], indexPressNote2: params["indexPressNote2"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                }
            });
        });
    }
}
