import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { APDIRCircularBefore, GetAPDIRCircularBeforeRequest } from '../../../model/aPDIRCircularBefore';
import { APDIRCircular, GetAPDIRCircularRequest } from '../../../model/aPDIRCircular';
import { APDIRCircularBeforeAdminService } from '../../../service/admin/aPDIRCircularBefore.service';
import { APDIRCircularAdminService } from '../../../service/admin/aPDIRCircular.service';
import { DropDown } from '../../../common/dropDown';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


@Component({
    selector: 'my-app',
    templateUrl: './aPDIRCircularBefore.component.html'
})

export class APDIRCircularBeforeAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _aPDIRCircularService: APDIRCircularAdminService, private _aPDIRCircularBeforeService: APDIRCircularBeforeAdminService, vcr: ViewContainerRef, private spinnerService: SpinnerService) { }

    _global: Global = new Global();

    aPDIRCirculars: DropDown[] = [];
    aPDIRCircular: APDIRCircular = new APDIRCircular();

    aPDIRCircularParentId: number = 0;
    aPDIRCircularBeforeId: number = 0;

    frmAPDIRCircularBefore: FormGroup;
    msg: string;

    addUpdateText: string;

    isSubmited: boolean = false;

    pdfServerPath: string = Global.APDIRCIRCULAR_PDF_FILEPATH;

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params: Params) => {
            let aPDIRCircularParentId = this._global.decryptValue(params['aPDIRCircularParentId']);
            let aPDIRCircularBeforeId = this._global.decryptValue(params['aPDIRCircularBeforeId']);

            this.aPDIRCircularParentId = parseInt(aPDIRCircularParentId);

            if (aPDIRCircularParentId) {
                this.GetAPDIRCircularParent(this.aPDIRCircularParentId);

                if (aPDIRCircularBeforeId) {
                    this.addUpdateText = "Update";

                    this.aPDIRCircularBeforeId = parseInt(aPDIRCircularBeforeId);
                    this.EditAPDIRCircularBefore(parseInt(aPDIRCircularBeforeId));
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

        this.frmAPDIRCircularBefore = this.formBuilder.group({
            APDIRCircularBeforeId: [''],
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

    GetAPDIRCircular(aPDIRCircularBeforeData): void {
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

                    this.frmAPDIRCircularBefore.get("APDIRCircularId").setValue((aPDIRCircularBeforeData != null) ? aPDIRCircularBeforeData.APDIRCircularId : "");
                    this.frmAPDIRCircularBefore.updateValueAndValidity();
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_APDIR_CIRCULAR_BEFORE_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_APDIR_CIRCULAR_BEFORE_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    EditAPDIRCircularBefore(aPDIRCircularBeforeId: number) {
        this.spinnerService.show();

        let getAPDIRCircularBeforeRequest = new GetAPDIRCircularBeforeRequest();
        getAPDIRCircularBeforeRequest.APDIRCircularBeforeId = aPDIRCircularBeforeId;
        getAPDIRCircularBeforeRequest.IsActive = null;

        this._aPDIRCircularBeforeService.getAPDIRCircularBefore(getAPDIRCircularBeforeRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.GetAPDIRCircular(data.Response[0]);

                this.frmAPDIRCircularBefore.setValue({
                    APDIRCircularBeforeId: aPDIRCircularBeforeId,
                    APDIRCircularParentId: data.Response[0].APDIRCircularParentId,
                    APDIRCircularId: data.Response[0].APDIRCircularId
                });

                this.frmAPDIRCircularBefore.updateValueAndValidity();
            }, error => this.msg = <any>error);
    }

    SaveAPDIRCircularBefore(formData) {
        this.spinnerService.show();

        if (formData.value.APDIRCircularBeforeId) {
            this._aPDIRCircularBeforeService.updateAPDIRCircularBefore(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/apdircirculars'], {
                                queryParams: {
                                    indexAPDIRCircular1: params["indexAPDIRCircular1"], indexAPDIRCircular2: params["indexAPDIRCircular2"], sortingAPDIRCircularField: params["sortingAPDIRCircularField"], sortingAPDIRCircularDirection: params["sortingAPDIRCircularDirection"], sortingAPDIRCircularBeforeField: params["sortingAPDIRCircularBeforeField"], sortingAPDIRCircularBeforeDirection: params["sortingAPDIRCircularBeforeDirection"], sortingAPDIRCircularAfterField: params["sortingAPDIRCircularAfterField"], sortingAPDIRCircularAfterDirection: params["sortingAPDIRCircularAfterDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_APDIR_CIRCULAR_BEFORE_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_APDIR_CIRCULAR_BEFORE_TITLE);
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_APDIR_CIRCULAR_BEFORE_TITLE, { enableHtml: true });
                    });
        } else {
            this._aPDIRCircularBeforeService.addAPDIRCircularBefore(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/apdircirculars'], {
                                queryParams: {
                                    indexAPDIRCircular1: params["indexAPDIRCircular1"], indexAPDIRCircular2: params["indexAPDIRCircular2"], sortingAPDIRCircularField: params["sortingAPDIRCircularField"], sortingAPDIRCircularDirection: params["sortingAPDIRCircularDirection"], sortingAPDIRCircularBeforeField: params["sortingAPDIRCircularBeforeField"], sortingAPDIRCircularBeforeDirection: params["sortingAPDIRCircularBeforeDirection"], sortingAPDIRCircularAfterField: params["sortingAPDIRCircularAfterField"], sortingAPDIRCircularAfterDirection: params["sortingAPDIRCircularAfterDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_APDIR_CIRCULAR_BEFORE_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_APDIR_CIRCULAR_BEFORE_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_APDIR_CIRCULAR_BEFORE_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    OnSubmitAPDIRCircularBefore(formData: any) {
        this.isSubmited = true;

        if (this.frmAPDIRCircularBefore.valid) {
            this.SaveAPDIRCircularBefore(formData);
        }
    }

    CancelAPDIRCircularBefore() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.router.navigate(['/admin/secure/apdircirculars'], {
                queryParams: {
                    indexAPDIRCircular1: params["indexAPDIRCircular1"], indexAPDIRCircular2: params["indexAPDIRCircular2"], sortingAPDIRCircularField: params["sortingAPDIRCircularField"], sortingAPDIRCircularDirection: params["sortingAPDIRCircularDirection"], sortingAPDIRCircularBeforeField: params["sortingAPDIRCircularBeforeField"], sortingAPDIRCircularBeforeDirection: params["sortingAPDIRCircularBeforeDirection"], sortingAPDIRCircularAfterField: params["sortingAPDIRCircularAfterField"], sortingAPDIRCircularAfterDirection: params["sortingAPDIRCircularAfterDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                }
            });
        });
    }
}
