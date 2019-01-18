import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FetersCodeGroupDetail, GetFetersCodeGroupDetailRequest } from '../../../model/fetersCodeGroupDetail';
import { FetersCodeDetail, GetFetersCodeDetailRequest } from '../../../model/fetersCodeDetail';
import { FetersCode, GetFetersCodeRequest } from '../../../model/fetersCode';
import { FetersCodeGroupDetailAdminService } from '../../../service/admin/fetersCodeGroupDetail.service';
import { FetersCodeDetailAdminService } from '../../../service/admin/fetersCodeDetail.service';
import { FetersCodeAdminService } from '../../../service/admin/fetersCode.service';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


@Component({
    selector: 'my-app',
    templateUrl: './fetersCodeGroupDetail.component.html'
})

export class FetersCodeGroupDetailAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _fetersCodeGroupDetailService: FetersCodeGroupDetailAdminService, private _fetersCodeDetailService: FetersCodeDetailAdminService, private _fetersCodeService: FetersCodeAdminService, vcr: ViewContainerRef, private spinnerService: SpinnerService) { }

    _global: Global = new Global();

    fetersCodeGroupDetail: FetersCodeGroupDetail;
    fetersCodeDetail: FetersCodeDetail = new FetersCodeDetail();
    fetersCode: FetersCode = new FetersCode();
    fetersCodeGroupDetailId: number = 0;
    fetersCodeDetailId: number;
    fetersCodeId: number;

    frmFetersCodeGroupDetail: FormGroup;
    msg: string;

    addUpdateText: string;

    isSubmited: boolean = false;

    pdfServerPath: string = Global.FETERSCODE_PDF_FILEPATH;

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params: Params) => {
            let fetersCodeId = this._global.decryptValue(params['fetersCodeId']);
            let fetersCodeDetailId = this._global.decryptValue(params['fetersCodeDetailId']);
            let fetersCodeGroupDetailId = this._global.decryptValue(params['fetersCodeGroupDetailId']);

            this.fetersCodeId = parseInt(fetersCodeId);
            this.fetersCodeDetailId = parseInt(fetersCodeDetailId);

            if (fetersCodeId && fetersCodeDetailId) {
                this.GetFetersCode(this.fetersCodeId);
                this.GetFetersCodeDetail(this.fetersCodeDetailId);

                if (fetersCodeGroupDetailId) {
                    this.addUpdateText = "Update";

                    this.fetersCodeGroupDetailId = parseInt(fetersCodeGroupDetailId);
                    this.EditFetersCodeGroupDetail(parseInt(fetersCodeGroupDetailId));
                } else {
                    this.addUpdateText = "Add";
                }
            } else {
                this.activatedRoute.queryParams.subscribe(params => {
                    this.router.navigate(['/admin/secure/feterscodes'], {
                        queryParams: {
                            indexFetersCode: params["indexFetersCode"], indexFetersCodeDetail: params["indexFetersCodeDetail"], sortingFetersCodeField: params["sortingFetersCodeField"], sortingFetersCodeDirection: params["sortingFetersCodeDirection"], sortingFetersCodeDetailField: params["sortingFetersCodeDetailField"], sortingFetersCodeDetailDirection: params["sortingFetersCodeDetailDirection"], sortingFetersCodeGroupDetailField: params["sortingFetersCodeGroupDetailField"], sortingFetersCodeGroupDetailDirection: params["sortingFetersCodeGroupDetailDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                        }
                    });
                });
            }
        });

        this.frmFetersCodeGroupDetail = this.formBuilder.group({
            FetersCodeGroupDetailId: [''],
            FetersCodeDetailId: [this.fetersCodeDetailId],
            PurposeCode: ['', Validators.required],
            Description: ['', Validators.required]
        });
    }

    GetFetersCode(fetersCodeId: number) {
        this.spinnerService.show();

        let getFetersCodeRequest = new GetFetersCodeRequest();
        getFetersCodeRequest.FetersCodeId = fetersCodeId;
        getFetersCodeRequest.IsActive = null;
        
        this._fetersCodeService.getFetersCode(getFetersCodeRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.fetersCode = data.Response[0];
            }, error => this.msg = <any>error);
    }

    GetFetersCodeDetail(fetersCodeDetailId: number) {
        this.spinnerService.show();

        let getFetersCodeDetailRequest = new GetFetersCodeDetailRequest();
        getFetersCodeDetailRequest.FetersCodeDetailId = fetersCodeDetailId;
        getFetersCodeDetailRequest.IsActive = null;

        this._fetersCodeDetailService.getFetersCodeDetail(getFetersCodeDetailRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.fetersCodeDetail = data.Response[0];
            }, error => this.msg = <any>error);
    }

    EditFetersCodeGroupDetail(fetersCodeGroupDetailId: number) {
        this.spinnerService.show();

        let getFetersCodeGroupDetailRequest = new GetFetersCodeGroupDetailRequest();
        getFetersCodeGroupDetailRequest.FetersCodeGroupDetailId = fetersCodeGroupDetailId;
        getFetersCodeGroupDetailRequest.IsActive = null;

        this._fetersCodeGroupDetailService.getFetersCodeGroupDetail(getFetersCodeGroupDetailRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.frmFetersCodeGroupDetail.setValue({
                    FetersCodeGroupDetailId: fetersCodeGroupDetailId,
                    FetersCodeDetailId: data.Response[0].FetersCodeDetailId,
                    PurposeCode: data.Response[0].PurposeCode,
                    Description: data.Response[0].Description
                });
                
                this.frmFetersCodeGroupDetail.updateValueAndValidity();
            }, error => this.msg = <any>error);
    }

    SaveFetersCodeGroupDetail(formData) {
        this.spinnerService.show();

        if (formData.value.FetersCodeGroupDetailId) {
            this._fetersCodeGroupDetailService.updateFetersCodeGroupDetail(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/feterscodes'], {
                                queryParams: {
                                    indexFetersCode: params["indexFetersCode"], indexFetersCodeDetail: params["indexFetersCodeDetail"], sortingFetersCodeField: params["sortingFetersCodeField"], sortingFetersCodeDirection: params["sortingFetersCodeDirection"], sortingFetersCodeDetailField: params["sortingFetersCodeDetailField"], sortingFetersCodeDetailDirection: params["sortingFetersCodeDetailDirection"], sortingFetersCodeGroupDetailField: params["sortingFetersCodeGroupDetailField"], sortingFetersCodeGroupDetailDirection: params["sortingFetersCodeGroupDetailDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_FETERSCODE_GROUP_DETAIL_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_FETERSCODE_GROUP_DETAIL_TITLE);
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FETERSCODE_GROUP_DETAIL_TITLE, { enableHtml: true });
                    });
        } else {
            this._fetersCodeGroupDetailService.addFetersCodeGroupDetail(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/feterscodes'], {
                                queryParams: {
                                    indexFetersCode: params["indexFetersCode"], indexFetersCodeDetail: params["indexFetersCodeDetail"], sortingFetersCodeField: params["sortingFetersCodeField"], sortingFetersCodeDirection: params["sortingFetersCodeDirection"], sortingFetersCodeDetailField: params["sortingFetersCodeDetailField"], sortingFetersCodeDetailDirection: params["sortingFetersCodeDetailDirection"], sortingFetersCodeGroupDetailField: params["sortingFetersCodeGroupDetailField"], sortingFetersCodeGroupDetailDirection: params["sortingFetersCodeGroupDetailDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_FETERSCODE_GROUP_DETAIL_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_FETERSCODE_GROUP_DETAIL_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FETERSCODE_GROUP_DETAIL_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    OnSubmitFetersCodeGroupDetail(formData: any) {
        this.isSubmited = true;

        if (this.frmFetersCodeGroupDetail.valid) {
            this.SaveFetersCodeGroupDetail(formData);
        }
    }
    
    CancelFetersCodeGroupDetail() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.router.navigate(['/admin/secure/feterscodes'], {
                queryParams: {
                    indexFetersCode: params["indexFetersCode"], indexFetersCodeDetail: params["indexFetersCodeDetail"], sortingFetersCodeField: params["sortingFetersCodeField"], sortingFetersCodeDirection: params["sortingFetersCodeDirection"], sortingFetersCodeDetailField: params["sortingFetersCodeDetailField"], sortingFetersCodeDetailDirection: params["sortingFetersCodeDetailDirection"], sortingFetersCodeGroupDetailField: params["sortingFetersCodeGroupDetailField"], sortingFetersCodeGroupDetailDirection: params["sortingFetersCodeGroupDetailDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                }
            });
        });
    }
}
