import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { GetCommonFieldRequest } from '../../../model/commonField';
import { GetFEMASubModuleOfModuleRequest, FEMASubModuleOfModule } from '../../../model/fEMASubModuleOfModule';
import { CommonFieldService } from '../../../service/common/commonField.service';
import { FEMASubModuleOfModuleAdminService } from '../../../service/admin/fEMASubModuleOfModule.service';

import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


@Component({
    selector: 'my-app',
    templateUrl: './fEMAModules.component.html'
})

export class FEMAModulesAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private _commonFieldService: CommonFieldService, private _fEMASubModuleOfModuleService: FEMASubModuleOfModuleAdminService, private toastr: ToastrService, private vcr: ViewContainerRef, private spinnerService: SpinnerService, private router: Router) { }

    _global: Global = new Global();

    fEMAModules: any;
    fEMASubModuleOfModules: FEMASubModuleOfModule;

    frmFEMAModule: FormGroup;

    searchText: string;
    totalRecords: number;

    itemDetailFEMAModule = { index: -1 };

    indexFEMAModule: number = -1;

    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe(params => {
            this.indexFEMAModule = (params["indexFEMAModule"]) ? parseInt(params["indexFEMAModule"]) : -1;

            this.searchText = (params["searchText"]) ? params["searchText"] : null;
        });

        this.frmFEMAModule = this.formBuilder.group({
            SearchText: [this.searchText]
        });

        this.GetFEMAModule(this.searchText);
    }

    GetFEMAModule(searchText?: string): void {
        this.spinnerService.show();

        let getCommonFieldRequest = new GetCommonFieldRequest();
        getCommonFieldRequest.FieldTypeName = Global.COMMON_FIELD_FEMA_MODULE;
        getCommonFieldRequest.SearchText = searchText;

        this._commonFieldService.getCommonField(getCommonFieldRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.fEMAModules = data.Response;
                    this.totalRecords = data.Response.length;

                    if (this.indexFEMAModule != -1 && this.fEMAModules.length > 0) {
                        this.itemDetailFEMAModule.index = this.indexFEMAModule;
                        this.GetFEMASubModuleOfModule(this.itemDetailFEMAModule.index, this.fEMAModules[this.itemDetailFEMAModule.index].FieldId, true);
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_FEMA_SUBMODULE_OF_MODULE_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FEMA_SUBMODULE_OF_MODULE_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    SearchFEMAModule(formData) {
        this.indexFEMAModule = -1;
        this.itemDetailFEMAModule.index = this.indexFEMAModule;

        this.ReloadPage(false);
        this.searchText = formData.value.SearchText;
        this.GetFEMAModule(this.searchText);
    }

    AddFEMASubModuleOfModule(fEMAModuleId) {
        this.router.navigate(['/admin/secure/femamodule/' + this._global.encryptValue(fEMAModuleId)], {
            queryParams: {
                indexFEMAModule: this.indexFEMAModule, searchText: this.searchText
            }
        });
    }

    EditFEMASubModuleOfModule(fEMAModuleId, fEMASubModuleOfModuleId) {
        this.router.navigate(['/admin/secure/femamodule/' + this._global.encryptValue(fEMAModuleId) + '/' + this._global.encryptValue(fEMASubModuleOfModuleId)], {
            queryParams: {
                indexFEMAModule: this.indexFEMAModule, searchText: this.searchText
            }
        });
    }

    DeleteFEMASubModuleOfModule(fEMAModuleId, fEMASubModuleOfModuleId) {
        let confirmBox = confirm("Are you sure, You want to delete?");
        if (confirmBox) {
            this.spinnerService.show();

            let deleteFEMASubModuleOfModule = {
                "FEMASubModuleOfModuleId": fEMASubModuleOfModuleId
            };

            this._fEMASubModuleOfModuleService.deleteFEMASubModuleOfModule(deleteFEMASubModuleOfModule)
                .subscribe(data => {
                    if (data.Status == Global.API_SUCCESS) {
                        this.toastr.success(data.Description, Global.TOASTR_ADMIN_FEMA_SUBMODULE_OF_MODULE_TITLE, { closeButton: true });
                        this.GetFEMASubModuleOfModule(this.itemDetailFEMAModule.index, fEMAModuleId, true);
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_FEMA_SUBMODULE_OF_MODULE_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FEMA_SUBMODULE_OF_MODULE_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    UpDownFEMAModuleArrow(index) {
        if (index === this.itemDetailFEMAModule.index) {
            this.itemDetailFEMAModule.index = null;
        } else {
            this.itemDetailFEMAModule.index = index;
        }
    }

    GetFEMASubModuleOfModule(index, fEMAModuleId, isDeleted): void {
        this.spinnerService.show();

        let getFEMASubModuleOfModuleRequest = new GetFEMASubModuleOfModuleRequest();
        getFEMASubModuleOfModuleRequest.FEMAModuleId = fEMAModuleId;

        this._fEMASubModuleOfModuleService.getFEMASubModuleOfModule(getFEMASubModuleOfModuleRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.fEMASubModuleOfModules = data.Response;

                    if (isDeleted != true) {
                        this.UpDownFEMAModuleArrow(index);
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_FEMA_SUBMODULE_OF_MODULE_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FEMA_SUBMODULE_OF_MODULE_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    ShowFEMASubModuleOfModule(index, fEMAModuleId) {
        this.indexFEMAModule = -1;

        if (this.itemDetailFEMAModule.index !== index) {
            if (fEMAModuleId) {
                this.indexFEMAModule = index;
                this.GetFEMASubModuleOfModule(index, fEMAModuleId, false);
            }
        } else {
            this.UpDownFEMAModuleArrow(index);
        }
        this.ReloadPage(false);
    }

    ReloadPage(isPageChange) {
        if (isPageChange == true) {
            this.indexFEMAModule = -1;
            this.itemDetailFEMAModule.index = this.indexFEMAModule;
        }

        this.router.navigate(['/admin/secure/femamodules'], {
            queryParams: {
                indexFEMAModule: this.indexFEMAModule, searchText: this.searchText
            }
        });
    }
}
