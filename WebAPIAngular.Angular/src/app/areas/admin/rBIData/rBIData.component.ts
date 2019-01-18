import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RBIData, GetRBIDataRequest } from '../../../model/rBIData';
import { RBIDataAdminService } from '../../../service/admin/rBIData.service';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


@Component({
    selector: 'my-app',
    templateUrl: './rBIData.component.html'
})

export class RBIDataAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _rBIDataService: RBIDataAdminService, vcr: ViewContainerRef, private spinnerService: SpinnerService) { }

    _global: Global = new Global();

    rBIData: RBIData;
    rBIDataId: number = 0;
    searchText: string = '';
    frmRBIData: FormGroup;
    msg: string;
    files: any;
    rBIDataNames: any[] = [];

    addUpdateText: string;

    excelServerPath: string = Global.RBIDATA_EXCEL_FILEPATH;
    rBIDataExcelName: string;

    isSubmited: boolean = false;

    ngOnInit(): void {
        this.frmRBIData = this.formBuilder.group({
            RBIDataId: [''],
            RBIDataName: ['', Validators.required],
            Excel: ['', Validators.required]
        });

        this.activatedRoute.params.subscribe((params: Params) => {
            let rBIDataId = this._global.decryptValue(params['rBIDataId']);

            if (rBIDataId) {
                this.addUpdateText = "Update";
                this.rBIDataId = parseInt(rBIDataId);
                this.EditRBIData(parseInt(rBIDataId));
            } else {
                this.GetRBIDataName(null);
                this.addUpdateText = "Add";
            }
        });
    }

    GetRBIDataName(rBIData): void {
        this.rBIDataNames.push({ Value: null, Text: "--Select--" });

        this._global.getRBIDataName().forEach(item => {
            this.rBIDataNames.push({ Value: item, Text: item });
        });

        this.frmRBIData.get("RBIDataName").setValue((rBIData != null) ? rBIData.RBIDataName : rBIData);
        this.frmRBIData.updateValueAndValidity();
    }

    fileChange(event: any) {
        this.files = event.target.files;

        if (this.files[0].type == "application/vnd.ms-excel" || this.files[0].type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            this.frmRBIData.get('Excel').setValue(this.files[0].name);
            this.frmRBIData.updateValueAndValidity();
        } else {
            this.frmRBIData.get('Excel').setValue(null);
            this.frmRBIData.updateValueAndValidity();
            this.toastr.error("Please upload proper excel file.", Global.TOASTR_ADMIN_RBIDATA_TITLE, { closeButton: true });
        }
    }

    EditRBIData(rBIDataId: number) {
        this.spinnerService.show();

        let getRBIDataRequest = new GetRBIDataRequest();
        getRBIDataRequest.RBIDataId = rBIDataId;
        getRBIDataRequest.IsActive = null;

        this._rBIDataService.getRBIData(getRBIDataRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.rBIDataExcelName = data.Response[0].Excel;
                this.GetRBIDataName(data.Response[0].RBIDataName);

                this.frmRBIData.setValue({
                    RBIDataId: rBIDataId,
                    RBIDataName: data.Response[0].RBIDataName,
                    Excel: data.Response[0].Excel
                });

                this.frmRBIData.updateValueAndValidity();
            }, error => this.msg = <any>error);
    }

    SaveRBIData(formData) {
        this.spinnerService.show();

        if (formData.value.RBIDataId) {
            this._rBIDataService.updateRBIData(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/rbidatas'], {
                                queryParams: {
                                    indexRBIData: params["indexRBIData"], sortingRBIDataField: params["sortingRBIDataField"], sortingRBIDataDirection: params["sortingRBIDataDirection"], sortingRBIDataDetailField: params["sortingRBIDataDetailField"], sortingRBIDataDetailDirection: params["sortingRBIDataDetailDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_RBIDATA_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_RBIDATA_TITLE);
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_RBIDATA_TITLE, { enableHtml: true });
                    });
        } else {
            this._rBIDataService.addRBIData(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/rbidatas'], {
                                queryParams: {
                                    indexRBIData: params["indexRBIData"], sortingRBIDataField: params["sortingRBIDataField"], sortingRBIDataDirection: params["sortingRBIDataDirection"], sortingRBIDataDetailField: params["sortingRBIDataDetailField"], sortingRBIDataDetailDirection: params["sortingRBIDataDetailDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_RBIDATA_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_RBIDATA_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_RBIDATA_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    OnSubmitRBIData(formData: any) {
        this.isSubmited = true;

        if (this.frmRBIData.valid) {
            this.spinnerService.show();

            if (this.files != null && this.files.length > 0) {
                let fileFormData: FormData = new FormData();
                for (var i = 0; i < this.files.length; i++) {
                    fileFormData.append(this.files[i].name, this.files[i]);
                }

                this._rBIDataService.fileUpload(fileFormData)
                    .subscribe(response => {
                        if (response.Status == "Success") {
                            this.frmRBIData.get('Excel').setValue(response.Response);
                            this.frmRBIData.updateValueAndValidity();
                            formData.value.Excel = response.Response;
                            this.files = null;

                            this.SaveRBIData(formData);
                        } else {
                            this.spinnerService.hide();
                            this.toastr.error(response.Description, Global.TOASTR_ADMIN_RBIDATA_TITLE, { enableHtml: true, closeButton: true });
                        }
                    },
                        error => {
                            this.spinnerService.hide();
                            this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_RBIDATA_TITLE, { enableHtml: true, closeButton: true });
                        });
            } else {
                if (formData.value.Excel) {
                    this.SaveRBIData(formData);
                } else {
                    this.spinnerService.hide();
                }
            }
        }
    }

    CancelRBIData() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.router.navigate(['/admin/secure/rbidatas'], {
                queryParams: {
                    indexRBIData: params["indexRBIData"], sortingRBIDataField: params["sortingRBIDataField"], sortingRBIDataDirection: params["sortingRBIDataDirection"], sortingRBIDataDetailField: params["sortingRBIDataDetailField"], sortingRBIDataDetailDirection: params["sortingRBIDataDetailDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                }
            });
        });
    }
}
