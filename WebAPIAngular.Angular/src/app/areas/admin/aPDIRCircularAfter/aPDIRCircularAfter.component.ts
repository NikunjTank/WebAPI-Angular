import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { APDIRCircularAfter, GetAPDIRCircularAfterRequest } from '../../../model/aPDIRCircularAfter';
import { APDIRCircular, GetAPDIRCircularRequest } from '../../../model/aPDIRCircular';
import { APDIRCircularAfterAdminService } from '../../../service/admin/aPDIRCircularAfter.service';
import { APDIRCircularAdminService } from '../../../service/admin/aPDIRCircular.service';
import { DropDown } from '../../../common/dropDown';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


@Component({
    selector: 'my-app',
    templateUrl: './aPDIRCircularAfter.component.html'
})

export class APDIRCircularAfterAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _aPDIRCircularService: APDIRCircularAdminService, private _aPDIRCircularAfterService: APDIRCircularAfterAdminService, vcr: ViewContainerRef, private spinnerService: SpinnerService) { }

    _global: Global = new Global();

    aPDIRCirculars: DropDown[] = [];
    aPDIRCircular: APDIRCircular = new APDIRCircular();

    aPDIRCircularParentId: number = 0;
    aPDIRCircularAfterId: number = 0;

    frmAPDIRCircularAfter: FormGroup;
    msg: string;

    addUpdateText: string;

    isSubmited: boolean = false;

    pdfServerPath: string = Global.APDIRCIRCULAR_PDF_FILEPATH;

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params: Params) => {
            let aPDIRCircularParentId = this._global.decryptValue(params['aPDIRCircularParentId']);
            let aPDIRCircularAfterId = this._global.decryptValue(params['aPDIRCircularAfterId']);

            this.aPDIRCircularParentId = parseInt(aPDIRCircularParentId);

            if (aPDIRCircularParentId) {
                this.GetAPDIRCircularParent(this.aPDIRCircularParentId);

                if (aPDIRCircularAfterId) {
                    this.addUpdateText = "Update";

                    this.aPDIRCircularAfterId = parseInt(aPDIRCircularAfterId);
                    this.EditAPDIRCircularAfter(parseInt(aPDIRCircularAfterId));
                } else {
                    this.GetAPDIRCircular(null);
                    this.addUpdateText = "Add";
                }
            } else {
                this.activatedRoute.queryParams.subscribe(params => {
                    this.router.navigate(['/admin/secure/apdircirculars'], {
                        queryParams: {
                            indexAPDIRCircular1: params["indexAPDIRCircular1"], indexAPDIRCircular2: params["indexAPDIRCircular2"], sortingAPDIRCircularField: params["sortingAPDIRCircularField"], sortingAPDIRCircularDirection: params["sortingAPDIRCircularDirection"], sortingAPDIRCircularBeforeField: params["sortingAPDIRCircularBeforeField"], sortingAPDIRCircularBeforeDirection: params["sortingAPDIRCircularBeforeDirection"], sortingAPDIRCircularAfterField: params["sortingAPDIRCircularAfterField"], sortingAPDIRCircularAfterDirection: params["sortingAPDIRCircularAfterDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                        }
                    });
                });
            }
        });

        this.frmAPDIRCircularAfter = this.formBuilder.group({
            APDIRCircularAfterId: [''],
            APDIRCircularParentId: [this.aPDIRCircularParentId],
            APDIRCircularId: ['', Validators.required]
        });
    }

    GetAPDIRCircularParent(aPDIRCircularParentId: number) {
        this.spinnerService.show();

        let getAPDIRCircularRequest = new GetAPDIRCircularRequest();
        getAPDIRCircularRequest.APDIRCircularId = aPDIRCircularParentId;
        getAPDIRCircularRequest.IsActive = null;

        this._aPDIRCircularService.getAPDIRCircular(getAPDIRCircularRequest)
            .subscribe(data => {
                //this.spinnerService.hide();
                this.aPDIRCircular = data.Response[0];
            }, error => this.msg = <any>error);
    }

    GetAPDIRCircular(aPDIRCircularAfterData): void {
        this.spinnerService.show();

        let getAPDIRCircularRequest = new GetAPDIRCircularRequest();

        this._aPDIRCircularService.getAPDIRCircular(getAPDIRCircularRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.aPDIRCirculars = [];

                if (data.Status == Global.API_SUCCESS) {

                    this.aPDIRCirculars.push({ Value: "", Text: "--Select--" });

                    data.Response.forEach(item => {
                        if (item.APDIRCircularId != this.aPDIRCircularParentId)
                            this.aPDIRCirculars.push({ Value: item.APDIRCircularId, Text: item.APDIRCircularNo + (item.APDIRCircularDate ? (' (' + (new DatePipe('en-US').transform(item.APDIRCircularDate, 'dd-MM-yyyy')) + ')') : '') });
                    });

                    this.frmAPDIRCircularAfter.get("APDIRCircularId").setValue((aPDIRCircularAfterData != null) ? aPDIRCircularAfterData.APDIRCircularId : "");
                    this.frmAPDIRCircularAfter.updateValueAndValidity();
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_APDIR_CIRCULAR_AFTER_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_APDIR_CIRCULAR_AFTER_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    EditAPDIRCircularAfter(aPDIRCircularAfterId: number) {
        this.spinnerService.show();

        let getAPDIRCircularAfterRequest = new GetAPDIRCircularAfterRequest();
        getAPDIRCircularAfterRequest.APDIRCircularAfterId = aPDIRCircularAfterId;
        getAPDIRCircularAfterRequest.IsActive = null;

        this._aPDIRCircularAfterService.getAPDIRCircularAfter(getAPDIRCircularAfterRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.GetAPDIRCircular(data.Response[0]);

                this.frmAPDIRCircularAfter.setValue({
                    APDIRCircularAfterId: aPDIRCircularAfterId,
                    APDIRCircularParentId: data.Response[0].APDIRCircularParentId,
                    APDIRCircularId: data.Response[0].APDIRCircularId
                });

                this.frmAPDIRCircularAfter.updateValueAndValidity();
            }, error => this.msg = <any>error);
    }

    SaveAPDIRCircularAfter(formData) {
        this.spinnerService.show();

        if (formData.value.APDIRCircularAfterId) {
            this._aPDIRCircularAfterService.updateAPDIRCircularAfter(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/apdircirculars'], {
                                queryParams: {
                                    indexAPDIRCircular1: params["indexAPDIRCircular1"], indexAPDIRCircular2: params["indexAPDIRCircular2"], sortingAPDIRCircularField: params["sortingAPDIRCircularField"], sortingAPDIRCircularDirection: params["sortingAPDIRCircularDirection"], sortingAPDIRCircularBeforeField: params["sortingAPDIRCircularBeforeField"], sortingAPDIRCircularBeforeDirection: params["sortingAPDIRCircularBeforeDirection"], sortingAPDIRCircularAfterField: params["sortingAPDIRCircularAfterField"], sortingAPDIRCircularAfterDirection: params["sortingAPDIRCircularAfterDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_APDIR_CIRCULAR_AFTER_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_APDIR_CIRCULAR_AFTER_TITLE);
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_APDIR_CIRCULAR_AFTER_TITLE, { enableHtml: true });
                    });
        } else {
            this._aPDIRCircularAfterService.addAPDIRCircularAfter(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/apdircirculars'], {
                                queryParams: {
                                    indexAPDIRCircular1: params["indexAPDIRCircular1"], indexAPDIRCircular2: params["indexAPDIRCircular2"], sortingAPDIRCircularField: params["sortingAPDIRCircularField"], sortingAPDIRCircularDirection: params["sortingAPDIRCircularDirection"], sortingAPDIRCircularBeforeField: params["sortingAPDIRCircularBeforeField"], sortingAPDIRCircularBeforeDirection: params["sortingAPDIRCircularBeforeDirection"], sortingAPDIRCircularAfterField: params["sortingAPDIRCircularAfterField"], sortingAPDIRCircularAfterDirection: params["sortingAPDIRCircularAfterDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_APDIR_CIRCULAR_AFTER_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_APDIR_CIRCULAR_AFTER_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_APDIR_CIRCULAR_AFTER_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    OnSubmitAPDIRCircularAfter(formData: any) {
        this.isSubmited = true;

        if (this.frmAPDIRCircularAfter.valid) {
            this.SaveAPDIRCircularAfter(formData);
        }
    }

    CancelAPDIRCircularAfter() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.router.navigate(['/admin/secure/apdircirculars'], {
                queryParams: {
                    indexAPDIRCircular1: params["indexAPDIRCircular1"], indexAPDIRCircular2: params["indexAPDIRCircular2"], sortingAPDIRCircularField: params["sortingAPDIRCircularField"], sortingAPDIRCircularDirection: params["sortingAPDIRCircularDirection"], sortingAPDIRCircularBeforeField: params["sortingAPDIRCircularBeforeField"], sortingAPDIRCircularBeforeDirection: params["sortingAPDIRCircularBeforeDirection"], sortingAPDIRCircularAfterField: params["sortingAPDIRCircularAfterField"], sortingAPDIRCircularAfterDirection: params["sortingAPDIRCircularAfterDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                }
            });
        });
    }
}
