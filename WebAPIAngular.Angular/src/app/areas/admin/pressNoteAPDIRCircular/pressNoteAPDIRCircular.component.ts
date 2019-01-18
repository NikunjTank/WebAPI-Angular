import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PressNoteAPDIRCircular, GetPressNoteAPDIRCircularRequest } from '../../../model/pressNoteAPDIRCircular';
import { APDIRCircular, GetAPDIRCircularRequest } from '../../../model/aPDIRCircular';
import { PressNote, GetPressNoteRequest } from '../../../model/pressNote';
import { PressNoteAPDIRCircularAdminService } from '../../../service/admin/pressNoteAPDIRCircular.service';
import { APDIRCircularAdminService } from '../../../service/admin/aPDIRCircular.service';
import { PressNoteAdminService } from '../../../service/admin/pressNote.service';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


@Component({
    selector: 'my-app',
    templateUrl: './pressNoteAPDIRCircular.component.html'
})

export class PressNoteAPDIRCircularAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _pressNoteAPDIRCircularService: PressNoteAPDIRCircularAdminService, private _apdircircularService: APDIRCircularAdminService, private _pressNoteService: PressNoteAdminService, vcr: ViewContainerRef, private spinnerService: SpinnerService) { }

    _global: Global = new Global();

    aPDIRCirculars: APDIRCircular[] = [];
    pressNote: PressNote = new PressNote();

    pressNoteId: number = 0;
    pressNoteAPDIRCircularId: number = 0;

    frmPressNoteAPDIRCircular: FormGroup;
    msg: string;

    addUpdateText: string;

    isSubmited: boolean = false;

    pdfServerPath: string = Global.PRESSNOTE_PDF_FILEPATH;

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params: Params) => {
            let pressNoteId = this._global.decryptValue(params['pressNoteId']);
            let pressNoteAPDIRCircularId = this._global.decryptValue(params['pressNoteAPDIRCircularId']);

            this.pressNoteId = parseInt(pressNoteId);

            if (pressNoteId) {
                this.GetPressNote(this.pressNoteId);

                if (pressNoteAPDIRCircularId) {
                    this.addUpdateText = "Update";

                    this.pressNoteAPDIRCircularId = parseInt(pressNoteAPDIRCircularId);
                    this.EditPressNoteAPDIRCircular(parseInt(pressNoteAPDIRCircularId));
                } else {
                    this.addUpdateText = "Add";
                }
            } else {
                this.activatedRoute.queryParams.subscribe(params => {
                    this.router.navigate(['/admin/secure/pressnotes'], {
                        queryParams: {
                            indexPressNote1: params["indexPressNote1"], indexPressNote2: params["indexPressNote2"], sortingPressNoteField: params["sortingPressNoteField"], sortingPressNoteDirection: params["sortingPressNoteDirection"], sortingPressNoteNotificationField: params["sortingPressNoteNotificationField"], sortingPressNoteNotificationDirection: params["sortingPressNoteNotificationDirection"], sortingPressNoteAPDIRCircularField: params["sortingPressNoteAPDIRCircularField"], sortingPressNoteAPDIRCircularDirection: params["sortingPressNoteAPDIRCircularDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                        }
                    });
                });
            }
        });

        this.frmPressNoteAPDIRCircular = this.formBuilder.group({
            PressNoteAPDIRCircularId: [''],
            PressNoteId: [this.pressNoteId],
            APDIRCircularId: ['', Validators.required]
        });
    }

    GetPressNote(pressNoteId: number) {
        this.spinnerService.show();

        let getPressNoteRequest = new GetPressNoteRequest();
        getPressNoteRequest.PressNoteId = pressNoteId;
        getPressNoteRequest.IsActive = null;

        this._pressNoteService.getPressNote(getPressNoteRequest)
            .subscribe(data => {

                if (this.pressNoteAPDIRCircularId == 0)
                    this.GetAPDIRCircular(null);

                this.pressNote = data.Response[0];
            }, error => this.msg = <any>error);
    }

    GetAPDIRCircular(pressNoteAPDIRCircularData): void {
        //this.spinnerService.show();

        let getAPDIRCircularRequest = new GetAPDIRCircularRequest();

        this._apdircircularService.getAPDIRCircular(getAPDIRCircularRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.aPDIRCirculars = [];

                if (data.Status == Global.API_SUCCESS) {

                    this.aPDIRCirculars.push({ APDIRCircularId: null, APDIRCircularNo: "--Select--", CreatedDate: null, Year: null, IsActive: null, IsDeleted: null, ModifiedDate: null, APDIRCircularDate: null, APDIRCircularEffectiveDate: null, APDIRCircularName: null, APDIRCircularPDF: null, APDIRCircularYearName: null, MasterDirectionName: null });

                    data.Response.forEach(item => {
                        this.aPDIRCirculars.push({ APDIRCircularId: item.APDIRCircularId, APDIRCircularNo: item.APDIRCircularNo, CreatedDate: null, Year: null, IsActive: null, IsDeleted: null, ModifiedDate: null, APDIRCircularDate: item.APDIRCircularDate, APDIRCircularEffectiveDate: null, APDIRCircularName: null, APDIRCircularPDF: null, APDIRCircularYearName: null, MasterDirectionName: null });
                    });

                    this.frmPressNoteAPDIRCircular.get("APDIRCircularId").setValue((pressNoteAPDIRCircularData != null) ? pressNoteAPDIRCircularData.APDIRCircularId : pressNoteAPDIRCircularData);
                    this.frmPressNoteAPDIRCircular.updateValueAndValidity();
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_PRESSNOTE_APDIR_CIRCULAR_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_PRESSNOTE_APDIR_CIRCULAR_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    EditPressNoteAPDIRCircular(pressNoteAPDIRCircularId: number) {
        this.spinnerService.show();

        let getPressNoteAPDIRCircularRequest = new GetPressNoteAPDIRCircularRequest();
        getPressNoteAPDIRCircularRequest.PressNoteAPDIRCircularId = pressNoteAPDIRCircularId;
        getPressNoteAPDIRCircularRequest.IsActive = null;

        this._pressNoteAPDIRCircularService.getPressNoteAPDIRCircular(getPressNoteAPDIRCircularRequest)
            .subscribe(data => {
                //this.spinnerService.hide();

                this.GetAPDIRCircular(data.Response[0]);

                this.frmPressNoteAPDIRCircular.setValue({
                    PressNoteAPDIRCircularId: pressNoteAPDIRCircularId,
                    PressNoteId: data.Response[0].PressNoteId,
                    APDIRCircularId: data.Response[0].APDIRCircularId
                });

                this.frmPressNoteAPDIRCircular.updateValueAndValidity();
            }, error => this.msg = <any>error);
    }

    SavePressNoteAPDIRCircular(formData) {
        this.spinnerService.show();

        if (formData.value.PressNoteAPDIRCircularId) {
            this._pressNoteAPDIRCircularService.updatePressNoteAPDIRCircular(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/pressnotes'], {
                                queryParams: {
                                    indexPressNote1: params["indexPressNote1"], indexPressNote2: params["indexPressNote2"], sortingPressNoteField: params["sortingPressNoteField"], sortingPressNoteDirection: params["sortingPressNoteDirection"], sortingPressNoteNotificationField: params["sortingPressNoteNotificationField"], sortingPressNoteNotificationDirection: params["sortingPressNoteNotificationDirection"], sortingPressNoteAPDIRCircularField: params["sortingPressNoteAPDIRCircularField"], sortingPressNoteAPDIRCircularDirection: params["sortingPressNoteAPDIRCircularDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_PRESSNOTE_APDIR_CIRCULAR_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_PRESSNOTE_APDIR_CIRCULAR_TITLE);
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_PRESSNOTE_APDIR_CIRCULAR_TITLE, { enableHtml: true });
                    });
        } else {
            this._pressNoteAPDIRCircularService.addPressNoteAPDIRCircular(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/pressnotes'], {
                                queryParams: {
                                    indexPressNote1: params["indexPressNote1"], indexPressNote2: params["indexPressNote2"], sortingPressNoteField: params["sortingPressNoteField"], sortingPressNoteDirection: params["sortingPressNoteDirection"], sortingPressNoteNotificationField: params["sortingPressNoteNotificationField"], sortingPressNoteNotificationDirection: params["sortingPressNoteNotificationDirection"], sortingPressNoteAPDIRCircularField: params["sortingPressNoteAPDIRCircularField"], sortingPressNoteAPDIRCircularDirection: params["sortingPressNoteAPDIRCircularDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_PRESSNOTE_APDIR_CIRCULAR_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_PRESSNOTE_APDIR_CIRCULAR_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_PRESSNOTE_APDIR_CIRCULAR_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    OnSubmitPressNoteAPDIRCircular(formData: any) {
        this.isSubmited = true;

        if (this.frmPressNoteAPDIRCircular.valid) {
            this.SavePressNoteAPDIRCircular(formData);
        }
    }

    CancelPressNoteAPDIRCircular() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.router.navigate(['/admin/secure/pressnotes'], {
                queryParams: {
                    indexPressNote1: params["indexPressNote1"], indexPressNote2: params["indexPressNote2"], sortingPressNoteField: params["sortingPressNoteField"], sortingPressNoteDirection: params["sortingPressNoteDirection"], sortingPressNoteNotificationField: params["sortingPressNoteNotificationField"], sortingPressNoteNotificationDirection: params["sortingPressNoteNotificationDirection"], sortingPressNoteAPDIRCircularField: params["sortingPressNoteAPDIRCircularField"], sortingPressNoteAPDIRCircularDirection: params["sortingPressNoteAPDIRCircularDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                }
            });
        });
    }
}