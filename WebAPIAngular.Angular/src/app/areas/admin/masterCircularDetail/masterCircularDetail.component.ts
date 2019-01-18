import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterCircular, GetMasterCircularRequest } from '../../../model/masterCircular';
import { MasterCircularDetail, GetMasterCircularDetailRequest } from '../../../model/masterCircularDetail';
import { MasterCircularAdminService } from '../../../service/admin/masterCircular.service';
import { MasterCircularDetailAdminService } from '../../../service/admin/masterCircularDetail.service';
import { DropDown } from '../../../common/dropDown';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


@Component({
    selector: 'my-app',
    templateUrl: './masterCircularDetail.component.html'
})

export class MasterCircularDetailAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _masterCircularService: MasterCircularAdminService, private _masterCircularDetailService: MasterCircularDetailAdminService, vcr: ViewContainerRef, private spinnerService: SpinnerService) { }

    _global: Global = new Global();

    masterCircular: MasterCircular = new MasterCircular();
    masterCircularId: number = 0;
    masterCircularDetailId: number = 0;
    searchText: string = '';
    frmMasterCircularDetail: FormGroup;
    msg: string;

    masterCircularDetailYears: DropDown[] = [];

    addUpdateText: string;
    files: any;

    pdfServerPath: string = Global.MASTERCIRCULAR_PDF_FILEPATH;
    masterCircularPDFName: string;

    isSubmited: boolean = false;

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params: Params) => {
            let masterCircularId = this._global.decryptValue(params['masterCircularId']);
            let masterCircularDetailId = this._global.decryptValue(params['masterCircularDetailId']);

            if (masterCircularId) {
                this.masterCircularId = parseInt(masterCircularId);

                this.GetMasterCircular(this.masterCircularId);

                if (masterCircularDetailId) {
                    this.addUpdateText = "Update";
                    this.masterCircularDetailId = parseInt(masterCircularDetailId);
                    this.EditMasterCircularDetail(parseInt(masterCircularDetailId));
                } else {
                    this.GetMasterCircularDetailYear(null);

                    this.addUpdateText = "Add";
                }
            } else {
                this.activatedRoute.queryParams.subscribe(params => {
                    this.router.navigate(['/admin/secure/mastercirculars'], {
                        queryParams: {
                            indexMasterCircular: params["indexMasterCircular"], sortingMasterCircularField: params["sortingMasterCircularField"], sortingMasterCircularDirection: params["sortingMasterCircularDirection"], sortingMasterCircularDetailField: params["sortingMasterCircularDetailField"], sortingMasterCircularDetailDirection: params["sortingMasterCircularDetailDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                        }
                    });
                });
            }
        });

        this.frmMasterCircularDetail = this.formBuilder.group({
            MasterCircularDetailId: [''],
            MasterCircularId: [this.masterCircularId],
            Year: ['', Validators.required],
            PDF: ['', Validators.required]
        });
    }

    GetMasterCircularDetailYear(masterCircularDetailData): void {
        this.spinnerService.show();

        this._masterCircularDetailService.getMasterCircularDetailYear()
            .subscribe(data => {
                this.spinnerService.hide();
                this.masterCircularDetailYears = [];

                if (data.Status == Global.API_SUCCESS) {

                    this.masterCircularDetailYears.push({ Value: "", Text: "--Select--" });

                    data.Response.forEach(item => {
                        this.masterCircularDetailYears.push({ Value: item, Text: item });
                    });

                    this.frmMasterCircularDetail.get("Year").setValue((masterCircularDetailData != null) ? masterCircularDetailData.Year : "");
                    this.frmMasterCircularDetail.updateValueAndValidity();
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_MASTER_CIRCULAR_DETAIL_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_MASTER_CIRCULAR_DETAIL_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    fileChange(event: any) {
        this.files = event.target.files;

        if (this.files[0].type == "application/pdf") {
            this.frmMasterCircularDetail.get('PDF').setValue(this.files[0].name);
            this.frmMasterCircularDetail.updateValueAndValidity();
        } else {
            this.frmMasterCircularDetail.get('PDF').setValue(null);
            this.frmMasterCircularDetail.updateValueAndValidity();
            this.toastr.error("Please upload proper pdf file.", Global.TOASTR_ADMIN_MASTER_CIRCULAR_DETAIL_TITLE, { closeButton: true });
        }
    }

    GetMasterCircular(masterCircularId: number) {
        this.spinnerService.show();

        let getMasterCircularRequest = new GetMasterCircularRequest();
        getMasterCircularRequest.MasterCircularId = masterCircularId;
        getMasterCircularRequest.IsActive = null;

        this._masterCircularService.getMasterCircular(getMasterCircularRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.masterCircular = data.Response[0];
            }, error => this.msg = <any>error);
    }

    EditMasterCircularDetail(masterCircularDetailId: number) {
        this.spinnerService.show();

        let getMasterCircularDetailRequest = new GetMasterCircularDetailRequest();
        getMasterCircularDetailRequest.MasterCircularDetailId = masterCircularDetailId;
        getMasterCircularDetailRequest.IsActive = null;

        this._masterCircularDetailService.getMasterCircularDetail(getMasterCircularDetailRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.GetMasterCircularDetailYear(data.Response[0]);
                this.masterCircularPDFName = data.Response[0].PDF;

                this.frmMasterCircularDetail.setValue({
                    MasterCircularDetailId: masterCircularDetailId,
                    MasterCircularId: data.Response[0].MasterCircularId,
                    Year: data.Response[0].Year,
                    PDF: data.Response[0].PDF
                });

                this.frmMasterCircularDetail.updateValueAndValidity();
            }, error => this.msg = <any>error);
    }

    SaveMasterCircularDetail(formData) {
        this.spinnerService.show();

        if (formData.value.MasterCircularDetailId) {
            this._masterCircularDetailService.updateMasterCircularDetail(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/mastercirculars'], {
                                queryParams: {
                                    indexMasterCircular: params["indexMasterCircular"], sortingMasterCircularField: params["sortingMasterCircularField"], sortingMasterCircularDirection: params["sortingMasterCircularDirection"], sortingMasterCircularDetailField: params["sortingMasterCircularDetailField"], sortingMasterCircularDetailDirection: params["sortingMasterCircularDetailDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_MASTER_CIRCULAR_DETAIL_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_MASTER_CIRCULAR_DETAIL_TITLE);
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_MASTER_CIRCULAR_DETAIL_TITLE, { enableHtml: true });
                    });
        } else {
            this._masterCircularDetailService.addMasterCircularDetail(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/mastercirculars'], {
                                queryParams: {
                                    indexMasterCircular: params["indexMasterCircular"], sortingMasterCircularField: params["sortingMasterCircularField"], sortingMasterCircularDirection: params["sortingMasterCircularDirection"], sortingMasterCircularDetailField: params["sortingMasterCircularDetailField"], sortingMasterCircularDetailDirection: params["sortingMasterCircularDetailDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_MASTER_CIRCULAR_DETAIL_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_MASTER_CIRCULAR_DETAIL_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_MASTER_CIRCULAR_DETAIL_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    OnSubmitMasterCircularDetail(formData: any) {
        this.isSubmited = true;

        if (this.frmMasterCircularDetail.valid) {
            this.spinnerService.show();

            if (this.files != null && this.files.length > 0) {
                let fileFormData: FormData = new FormData();
                for (var i = 0; i < this.files.length; i++) {
                    fileFormData.append(this.files[i].name, this.files[i]);
                }

                this._masterCircularDetailService.fileUpload(fileFormData)
                    .subscribe(response => {
                        if (response.Status == "Success") {
                            this.frmMasterCircularDetail.get('PDF').setValue(response.Response);
                            this.frmMasterCircularDetail.updateValueAndValidity();
                            formData.value.PDF = response.Response;

                            this.files = null;

                            this.SaveMasterCircularDetail(formData);
                        } else {
                            this.spinnerService.hide();
                            this.toastr.error(response.Description, Global.TOASTR_ADMIN_MASTER_CIRCULAR_DETAIL_TITLE, { enableHtml: true, closeButton: true });
                        }
                    },
                        error => {
                            this.spinnerService.hide();
                            this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_MASTER_CIRCULAR_DETAIL_TITLE, { enableHtml: true, closeButton: true });
                        });
            } else {
                if (formData.value.PDF) {
                    this.SaveMasterCircularDetail(formData);
                } else {
                    this.spinnerService.hide();
                }
            }
        }
    }

    CancelMasterCircularDetail() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.router.navigate(['/admin/secure/mastercirculars'], {
                queryParams: {
                    indexMasterCircular: params["indexMasterCircular"], sortingMasterCircularField: params["sortingMasterCircularField"], sortingMasterCircularDirection: params["sortingMasterCircularDirection"], sortingMasterCircularDetailField: params["sortingMasterCircularDetailField"], sortingMasterCircularDetailDirection: params["sortingMasterCircularDetailDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                }
            });
        });
    }
}