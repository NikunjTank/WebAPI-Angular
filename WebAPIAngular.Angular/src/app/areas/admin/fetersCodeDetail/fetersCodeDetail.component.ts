import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FetersCodeDetail, GetFetersCodeDetailRequest } from '../../../model/fetersCodeDetail';
import { FetersCode, GetFetersCodeRequest } from '../../../model/fetersCode';
import { FetersCodeDetailAdminService } from '../../../service/admin/fetersCodeDetail.service';
import { FetersCodeAdminService } from '../../../service/admin/fetersCode.service';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


@Component({
    selector: 'my-app',
    templateUrl: './fetersCodeDetail.component.html'
})

export class FetersCodeDetailAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _fetersCodeDetailService: FetersCodeDetailAdminService, private _fetersCodeService: FetersCodeAdminService, vcr: ViewContainerRef, private spinnerService: SpinnerService) { }

    _global: Global = new Global();

    fetersCodeDetail: FetersCodeDetail;
    fetersCode: FetersCode = new FetersCode();
    fetersCodeDetailId: number = 0;
    fetersCodeId: number;

    frmFetersCodeDetailGroup: FormGroup;
    frmFetersCodeDetailLRS: FormGroup;
    msg: string;

    addUpdateText: string;

    isSubmited: boolean = false;

    pdfServerPath: string = Global.FETERSCODE_PDF_FILEPATH;

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params: Params) => {
            let fetersCodeId = this._global.decryptValue(params['fetersCodeId']);
            let fetersCodeDetailId = this._global.decryptValue(params['fetersCodeDetailId']);

            this.fetersCodeId = parseInt(fetersCodeId);

            if (fetersCodeId) {
                this.GetFetersCode(this.fetersCodeId);

                if (fetersCodeDetailId) {
                    this.addUpdateText = "Update";

                    this.fetersCodeDetailId = parseInt(fetersCodeDetailId);
                    this.EditFetersCodeDetail(parseInt(fetersCodeDetailId));
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

        this.frmFetersCodeDetailGroup = this.formBuilder.group({
            FetersCodeDetailId: [''],
            FetersCodeId: [this.fetersCodeId],
            GroupNo: ['', Validators.required],
            PurposeGroupName: ['', Validators.required]
        });

        this.frmFetersCodeDetailLRS = this.formBuilder.group({
            FetersCodeDetailId: [''],
            FetersCodeId: [this.fetersCodeId],
            LRSItem: ['', Validators.required],
            LRSFetersCode: ['', Validators.required]
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

    EditFetersCodeDetail(fetersCodeDetailId: number) {
        this.spinnerService.show();

        let getFetersCodeDetailRequest = new GetFetersCodeDetailRequest();
        getFetersCodeDetailRequest.FetersCodeDetailId = fetersCodeDetailId;
        getFetersCodeDetailRequest.IsActive = null;

        this._fetersCodeDetailService.getFetersCodeDetail(getFetersCodeDetailRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.frmFetersCodeDetailGroup.setValue({
                    FetersCodeDetailId: fetersCodeDetailId,
                    FetersCodeId: data.Response[0].FetersCodeId,
                    GroupNo: data.Response[0].GroupNo,
                    PurposeGroupName: data.Response[0].PurposeGroupName
                });

                this.frmFetersCodeDetailLRS.setValue({
                    FetersCodeDetailId: fetersCodeDetailId,
                    FetersCodeId: data.Response[0].FetersCodeId,
                    LRSItem: data.Response[0].LRSItem,
                    LRSFetersCode: data.Response[0].LRSFetersCode
                });

                this.frmFetersCodeDetailGroup.updateValueAndValidity();
                this.frmFetersCodeDetailLRS.updateValueAndValidity();
            }, error => this.msg = <any>error);
    }

    SaveFetersCodeDetail(formData) {
        this.spinnerService.show();

        if (formData.value.FetersCodeDetailId) {
            this._fetersCodeDetailService.updateFetersCodeDetail(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/feterscodes'], {
                                queryParams: {
                                    indexFetersCode: params["indexFetersCode"], indexFetersCodeDetail: params["indexFetersCodeDetail"], sortingFetersCodeField: params["sortingFetersCodeField"], sortingFetersCodeDirection: params["sortingFetersCodeDirection"], sortingFetersCodeDetailField: params["sortingFetersCodeDetailField"], sortingFetersCodeDetailDirection: params["sortingFetersCodeDetailDirection"], sortingFetersCodeGroupDetailField: params["sortingFetersCodeGroupDetailField"], sortingFetersCodeGroupDetailDirection: params["sortingFetersCodeGroupDetailDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_FETERSCODE_DETAIL_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_FETERSCODE_DETAIL_TITLE);
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FETERSCODE_DETAIL_TITLE, { enableHtml: true });
                    });
        } else {
            this._fetersCodeDetailService.addFetersCodeDetail(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/feterscodes'], {
                                queryParams: {
                                    indexFetersCode: params["indexFetersCode"], indexFetersCodeDetail: params["indexFetersCodeDetail"], sortingFetersCodeField: params["sortingFetersCodeField"], sortingFetersCodeDirection: params["sortingFetersCodeDirection"], sortingFetersCodeDetailField: params["sortingFetersCodeDetailField"], sortingFetersCodeDetailDirection: params["sortingFetersCodeDetailDirection"], sortingFetersCodeGroupDetailField: params["sortingFetersCodeGroupDetailField"], sortingFetersCodeGroupDetailDirection: params["sortingFetersCodeGroupDetailDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_FETERSCODE_DETAIL_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_FETERSCODE_DETAIL_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FETERSCODE_DETAIL_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    OnSubmitFetersCodeDetailGroup(formData: any) {
        this.isSubmited = true;

        if (this.frmFetersCodeDetailGroup.valid) {
            this.SaveFetersCodeDetail(formData);
        }
    }

    OnSubmitFetersCodeDetailLRS(formData: any) {
        this.isSubmited = true;

        if (this.frmFetersCodeDetailLRS.valid) {
            this.SaveFetersCodeDetail(formData);
        }
    }

    CancelFetersCodeDetail() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.router.navigate(['/admin/secure/feterscodes'], {
                queryParams: {
                    indexFetersCode: params["indexFetersCode"], indexFetersCodeDetail: params["indexFetersCodeDetail"], sortingFetersCodeField: params["sortingFetersCodeField"], sortingFetersCodeDirection: params["sortingFetersCodeDirection"], sortingFetersCodeDetailField: params["sortingFetersCodeDetailField"], sortingFetersCodeDetailDirection: params["sortingFetersCodeDetailDirection"], sortingFetersCodeGroupDetailField: params["sortingFetersCodeGroupDetailField"], sortingFetersCodeGroupDetailDirection: params["sortingFetersCodeGroupDetailDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                }
            });
        });
    }
}
