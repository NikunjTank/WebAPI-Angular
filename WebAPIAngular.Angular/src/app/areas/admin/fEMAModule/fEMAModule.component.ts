import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GetCommonFieldRequest } from '../../../model/commonField';
import { FEMASubModuleOfModule, GetFEMASubModuleOfModuleRequest } from '../../../model/fEMASubModuleOfModule';
import { Regulation, GetRegulationRequest } from '../../../model/regulation';
import { Rules, GetRulesRequest } from '../../../model/rules';
import { MasterDirection, GetMasterDirectionRequest } from '../../../model/masterDirection';
import { MasterCircular, GetMasterCircularRequest } from '../../../model/masterCircular';
import { FAQ, GetFAQRequest } from '../../../model/fAQ';

import { CommonFieldService } from '../../../service/common/commonField.service';
import { FEMASubModuleOfModuleAdminService } from '../../../service/admin/fEMASubModuleOfModule.service';
import { RegulationAdminService } from '../../../service/admin/regulation.service';
import { RulesAdminService } from '../../../service/admin/rules.service';
import { MasterDirectionAdminService } from '../../../service/admin/masterDirection.service';
import { MasterCircularAdminService } from '../../../service/admin/masterCircular.service';
import { FAQAdminService } from '../../../service/admin/fAQ.service';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


import { DropDown } from '../../../common/dropDown';

@Component({
    selector: 'my-app',
    templateUrl: './fEMAModule.component.html'
})

export class FEMAModuleAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private _commonFieldService: CommonFieldService,
        private _fEMASubModuleOfModuleService: FEMASubModuleOfModuleAdminService,
        private _regulationService: RegulationAdminService,
        private _rulesService: RulesAdminService,
        private _masterDirectionService: MasterDirectionAdminService,
        private _masterCircularService: MasterCircularAdminService,
        private _fAQService: FAQAdminService,
        vcr: ViewContainerRef,
        private spinnerService: SpinnerService) { }

    _global: Global = new Global();

    fEMAModules: DropDown[] = [];
    fEMASubModules: DropDown[] = [];

    regulations: DropDown[] = [];
    ruless: DropDown[] = [];
    masterDirections: DropDown[] = [];
    masterCirculars: DropDown[] = [];
    rBIFAQs: DropDown[] = [];

    fEMAModuleId: number;
    fEMASubModuleOfModuleId: number;
    frmFEMASubModuleOfModule: FormGroup;
    msg: string;

    isRegulationRulesModuleDetailDisplay: boolean = false;
    isMasterDirectionCircularModuleDetailDisplay: boolean = false;
    isRBIFAQModuleDetailDisplay: boolean = false;

    regulationDropDownSettings = {};
    rulesDropDownSettings = {};
    masterDirectionDropDownSettings = {};
    masterCircularDropDownSettings = {};
    rBIFAQDropDownSettings = {};

    selectedRegulations: any = [];
    selectedRuless: any = [];
    selectedMasterDirections: any = [];
    selectedMasterCirculars: any = [];
    selectedRBIFAQs: any = [];

    addUpdateText: string;

    isSubmited: boolean = false;

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params: Params) => {
            let fEMASubModuleOfModuleId = this._global.decryptValue(params['fEMASubModuleOfModuleId']);
            let fEMAModuleId = this._global.decryptValue(params['fEMAModuleId']);

            if (fEMAModuleId) {
                this.fEMAModuleId = parseInt(fEMAModuleId);

                if (fEMASubModuleOfModuleId) {
                    this.addUpdateText = "Update";
                    this.fEMASubModuleOfModuleId = parseInt(fEMASubModuleOfModuleId);
                    this.EditFEMASubModuleOfModule(parseInt(fEMASubModuleOfModuleId));
                } else {
                    this.GetFEMASubModule(null);
                    this.addUpdateText = "Add";
                }
            } else {
                this.activatedRoute.queryParams.subscribe(params => {
                    this.router.navigate(['/admin/secure/femamodules'], {
                        queryParams: {
                            indexFEMAModule: params["indexFEMAModule"], searchText: params["searchText"]
                        }
                    });
                });
            }
        });

        this.frmFEMASubModuleOfModule = this.formBuilder.group({
            FEMASubModuleOfModuleId: [''],
            FEMAModuleId: [this.fEMAModuleId],
            FEMASubModuleId: ['', Validators.required],
            RegulationKeyModuleDetail: [''],
            RulesKeyModuleDetail: [''],
            MasterDirectionKeyModuleDetail: [''],
            MasterCircularKeyModuleDetail: [''],
            RBIFAQKeyModuleDetail: ['']
        });
    }

    GetFEMASubModule(fEMASubModuleOfModuleData): void {
        this.spinnerService.show();

        let getCommonFieldRequest = new GetCommonFieldRequest();
        getCommonFieldRequest.FieldTypeName = Global.COMMON_FIELD_FEMA_SUBMODULE;

        this._commonFieldService.getCommonField(getCommonFieldRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.fEMASubModules = [];

                if (data.Status == Global.API_SUCCESS) {
                    this.fEMASubModules.push({ Value: "", Text: "--Select--" });

                    data.Response.forEach(item => {
                        this.fEMASubModules.push({ Value: item.FieldId, Text: item.FieldName });
                    });

                    this.frmFEMASubModuleOfModule.get("FEMASubModuleId").setValue((fEMASubModuleOfModuleData != null) ? fEMASubModuleOfModuleData.FEMASubModuleId : "");
                    this.frmFEMASubModuleOfModule.updateValueAndValidity();
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_FEMA_SUBMODULE_OF_MODULE_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FEMA_SUBMODULE_OF_MODULE_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    EditFEMASubModuleOfModule(fEMASubModuleOfModuleId: number) {
        this.spinnerService.show();

        let getFEMASubModuleOfModuleRequest = new GetFEMASubModuleOfModuleRequest();
        getFEMASubModuleOfModuleRequest.FEMASubModuleOfModuleId = fEMASubModuleOfModuleId;

        this._fEMASubModuleOfModuleService.getFEMASubModuleOfModule(getFEMASubModuleOfModuleRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.GetFEMASubModule(data.Response[0]);

                let regulationKeyModuleDetailName = data.Response.filter(x => x.FEMAKeyModuleId == Global.COMMON_FIELD_REGULATION_FIELDID);
                let rulesKeyModuleDetailName = data.Response.filter(x => x.FEMAKeyModuleId == Global.COMMON_FIELD_RULES_FIELDID);
                let masterDirectionKeyModuleDetailName = data.Response.filter(x => x.FEMAKeyModuleId == Global.COMMON_FIELD_MASTERDIRECTION_FIELDID);
                let masterCircularKeyModuleDetailName = data.Response.filter(x => x.FEMAKeyModuleId == Global.COMMON_FIELD_MASTERCIRCULAR_FIELDID);
                let rBIFAQKeyModuleDetailName = data.Response.filter(x => x.FEMAKeyModuleId == Global.COMMON_FIELD_RBIFAQ_FIELDID);

                if (data.Response[0].FEMASubModuleId == Global.COMMON_FIELD_MODULE_FEMA_REGULATIONS_FEMA_NOTIFICATIONS_GSR) {
                    this.isRegulationRulesModuleDetailDisplay = true;
                    this.GetRegulation((regulationKeyModuleDetailName.length > 0) ? regulationKeyModuleDetailName[0] : null);
                    this.GetRules((rulesKeyModuleDetailName.length > 0) ? rulesKeyModuleDetailName[0] : null);
                }

                if (data.Response[0].FEMASubModuleId == Global.COMMON_FIELD_MODULE_MASTERDIRECTION_MASTERCIRCULAR_APDIRCIRCULAR) {
                    this.isMasterDirectionCircularModuleDetailDisplay = true;
                    this.GetMasterDirection((masterDirectionKeyModuleDetailName.length > 0) ? masterDirectionKeyModuleDetailName[0] : null);
                    this.GetMasterCircular((masterCircularKeyModuleDetailName.length > 0) ? masterCircularKeyModuleDetailName[0] : null);
                    this.GetRBIFAQ((masterCircularKeyModuleDetailName.length > 0) ? rBIFAQKeyModuleDetailName[0] : null);
                }

                //if (data.Response[0].FEMASubModuleId == Global.COMMON_FIELD_MODULE_RBI_DIPP_FAQ) {
                //    this.isRBIFAQModuleDetailDisplay = true;
                //    this.GetRBIFAQ((rBIFAQKeyModuleDetailName.length > 0) ? rBIFAQKeyModuleDetailName[0] : null);
                //}

                this.frmFEMASubModuleOfModule.setValue({
                    FEMASubModuleOfModuleId: fEMASubModuleOfModuleId,
                    FEMAModuleId: this.fEMAModuleId,
                    FEMASubModuleId: data.Response[0].FEMASubModuleId,
                    RegulationKeyModuleDetail: [],
                    RulesKeyModuleDetail: [],
                    MasterDirectionKeyModuleDetail: [],
                    MasterCircularKeyModuleDetail: [],
                    RBIFAQKeyModuleDetail: []
                });

                this.frmFEMASubModuleOfModule.updateValueAndValidity();
            }, error => this.msg = <any>error);
    }

    SaveFEMASubModuleOfModule(formData) {
        this.spinnerService.show();

        if (formData.value.FEMASubModuleOfModuleId) {
            this._fEMASubModuleOfModuleService.updateFEMASubModuleOfModule(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/femamodules'], {
                                queryParams: {
                                    indexFEMAModule: params["indexFEMAModule"], searchText: params["searchText"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_FEMA_SUBMODULE_OF_MODULE_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_FEMA_SUBMODULE_OF_MODULE_TITLE);
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FEMA_SUBMODULE_OF_MODULE_TITLE, { enableHtml: true });
                    });
        } else {
            this._fEMASubModuleOfModuleService.addFEMASubModuleOfModule(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/femamodules'], {
                                queryParams: {
                                    indexFEMAModule: params["indexFEMAModule"], searchText: params["searchText"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_FEMA_SUBMODULE_OF_MODULE_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_FEMA_SUBMODULE_OF_MODULE_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FEMA_SUBMODULE_OF_MODULE_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    OnSubmitFEMASubModuleOfModule(formData: any) {
        this.isSubmited = true;

        if (formData.value.FEMASubModuleId == Global.COMMON_FIELD_MODULE_FEMA_REGULATIONS_FEMA_NOTIFICATIONS_GSR) {
            formData.value.RegulationKeyModuleDetail = (formData.value.RegulationKeyModuleDetail.map(x => x.Value).join(',')) ? formData.value.RegulationKeyModuleDetail.map(x => x.Value).join(',') : null;
            formData.value.RulesKeyModuleDetail = (formData.value.RulesKeyModuleDetail.map(x => x.Value).join(',')) ? formData.value.RulesKeyModuleDetail.map(x => x.Value).join(',') : null;
        } else {
            formData.value.RegulationKeyModuleDetail = null;
            formData.value.RulesKeyModuleDetail = null;
        }

        if (formData.value.FEMASubModuleId == Global.COMMON_FIELD_MODULE_MASTERDIRECTION_MASTERCIRCULAR_APDIRCIRCULAR) {
            formData.value.MasterDirectionKeyModuleDetail = (formData.value.MasterDirectionKeyModuleDetail.map(x => x.Value).join(',')) ? formData.value.MasterDirectionKeyModuleDetail.map(x => x.Value).join(',') : null;
            formData.value.MasterCircularKeyModuleDetail = (formData.value.MasterCircularKeyModuleDetail.map(x => x.Value).join(',')) ? formData.value.MasterCircularKeyModuleDetail.map(x => x.Value).join(',') : null;
            formData.value.RBIFAQKeyModuleDetail = (formData.value.RBIFAQKeyModuleDetail.map(x => x.Value).join(',')) ? formData.value.RBIFAQKeyModuleDetail.map(x => x.Value).join(',') : null;
        } else {
            formData.value.MasterDirectionKeyModuleDetail = null;
            formData.value.MasterCircularKeyModuleDetail = null;
            formData.value.RBIFAQKeyModuleDetail = null;
        }

        //if (formData.value.FEMASubModuleId == Global.COMMON_FIELD_MODULE_RBI_DIPP_FAQ) {
        //    formData.value.RBIFAQKeyModuleDetail = (formData.value.RBIFAQKeyModuleDetail.map(x => x.Value).join(',')) ? formData.value.RBIFAQKeyModuleDetail.map(x => x.Value).join(',') : null;
        //} else {
        //    formData.value.RBIFAQKeyModuleDetail = null;
        //}

        if (this.frmFEMASubModuleOfModule.valid) {
            this.SaveFEMASubModuleOfModule(formData);
        }
    }

    OnChangeFEMASubModule(fEMASubModuleId) {
        this.isRegulationRulesModuleDetailDisplay = false;
        this.isMasterDirectionCircularModuleDetailDisplay = false;
        this.isRBIFAQModuleDetailDisplay = false;

        if (fEMASubModuleId == Global.COMMON_FIELD_MODULE_FEMA_REGULATIONS_FEMA_NOTIFICATIONS_GSR) {
            this.isRegulationRulesModuleDetailDisplay = true;

            this.GetRegulation(null);
            this.GetRules(null);
        } else if (fEMASubModuleId == Global.COMMON_FIELD_MODULE_MASTERDIRECTION_MASTERCIRCULAR_APDIRCIRCULAR) {
            this.isMasterDirectionCircularModuleDetailDisplay = true;

            this.GetMasterDirection(null);
            this.GetMasterCircular(null);
            this.GetRBIFAQ(null);
        } else if (fEMASubModuleId == Global.COMMON_FIELD_MODULE_RBI_DIPP_FAQ) {
            this.isRBIFAQModuleDetailDisplay = true;

            this.GetRBIFAQ(null);
        }
    }

    GetRegulation(fEMASubModuleOfModuleData): void {
        this.spinnerService.show();

        let getRegulationRequest = new GetRegulationRequest();
        getRegulationRequest.IsActive = true;

        this._regulationService.getRegulation(getRegulationRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.regulations = [];

                if (data.Status == Global.API_SUCCESS) {
                    data.Response.forEach(item => {
                        this.regulations.push({ Value: item.RegulationId, Text: item.RegulationNumber });
                    });

                    this.regulationDropDownSettings = {
                        singleSelection: false,
                        idField: 'Value',
                        textField: 'Text',
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableCheckAll: true,
                        allowSearchFilter: true
                    };

                    let selectedRegulations = [];

                    if (fEMASubModuleOfModuleData != null) {
                        fEMASubModuleOfModuleData.FEMAKeyModuleDetail.split(',').forEach(item => {
                            if (this.regulations.filter(x => x.Value == item)[0])
                                selectedRegulations.push({ Value: parseInt(item), Text: this.regulations.filter(x => x.Value == item)[0].Text });
                        });

                        this.selectedRegulations = selectedRegulations;
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_FEMA_SUBMODULE_OF_MODULE_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FEMA_SUBMODULE_OF_MODULE_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    GetRules(fEMASubModuleOfModuleData): void {
        this.spinnerService.show();

        let getRulesRequest = new GetRulesRequest();
        getRulesRequest.IsActive = true;

        this._rulesService.getRules(getRulesRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.ruless = [];

                if (data.Status == Global.API_SUCCESS) {
                    data.Response.forEach(item => {
                        this.ruless.push({ Value: item.RulesId, Text: item.RulesName });
                    });

                    this.rulesDropDownSettings = {
                        singleSelection: false,
                        idField: 'Value',
                        textField: 'Text',
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableCheckAll: true,
                        allowSearchFilter: true
                    };

                    let selectedRuless = [];

                    if (fEMASubModuleOfModuleData != null) {
                        fEMASubModuleOfModuleData.FEMAKeyModuleDetail.split(',').forEach(item => {
                            if (this.ruless.filter(x => x.Value == item)[0])
                                selectedRuless.push({ Value: parseInt(item), Text: this.ruless.filter(x => x.Value == item)[0].Text });
                        });

                        this.selectedRuless = selectedRuless;
                    } else {
                        this.selectedRuless = this.ruless;
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_FEMA_SUBMODULE_OF_MODULE_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FEMA_SUBMODULE_OF_MODULE_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    GetMasterDirection(fEMASubModuleOfModuleData): void {
        this.spinnerService.show();

        let getMasterDirectionRequest = new GetMasterDirectionRequest();
        getMasterDirectionRequest.IsActive = true;

        this._masterDirectionService.getMasterDirection(getMasterDirectionRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.masterDirections = [];

                if (data.Status == Global.API_SUCCESS) {
                    data.Response.forEach(item => {
                        this.masterDirections.push({ Value: item.MasterDirectionId, Text: item.MasterDirectionName });
                    });

                    this.masterDirectionDropDownSettings = {
                        singleSelection: false,
                        idField: 'Value',
                        textField: 'Text',
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableCheckAll: true,
                        allowSearchFilter: true
                    };

                    let selectedMasterDirections = [];

                    if (fEMASubModuleOfModuleData != null) {
                        fEMASubModuleOfModuleData.FEMAKeyModuleDetail.split(',').forEach(item => {
                            if (this.masterDirections.filter(x => x.Value == item)[0])
                                selectedMasterDirections.push({ Value: parseInt(item), Text: this.masterDirections.filter(x => x.Value == item)[0].Text });
                        });

                        this.selectedMasterDirections = selectedMasterDirections;
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_FEMA_SUBMODULE_OF_MODULE_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FEMA_SUBMODULE_OF_MODULE_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    GetMasterCircular(fEMASubModuleOfModuleData): void {
        this.spinnerService.show();

        let getMasterCircularRequest = new GetMasterCircularRequest();
        getMasterCircularRequest.IsActive = true;

        this._masterCircularService.getMasterCircular(getMasterCircularRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.masterCirculars = [];

                if (data.Status == Global.API_SUCCESS) {
                    data.Response.forEach(item => {
                        this.masterCirculars.push({ Value: item.MasterCircularId, Text: item.MasterCircularName });
                    });

                    this.masterCircularDropDownSettings = {
                        singleSelection: false,
                        idField: 'Value',
                        textField: 'Text',
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableCheckAll: true,
                        allowSearchFilter: true
                    };

                    let selectedMasterCirculars = [];

                    if (fEMASubModuleOfModuleData != null) {
                        fEMASubModuleOfModuleData.FEMAKeyModuleDetail.split(',').forEach(item => {
                            if (this.masterCirculars.filter(x => x.Value == item)[0])
                                selectedMasterCirculars.push({ Value: parseInt(item), Text: this.masterCirculars.filter(x => x.Value == item)[0].Text });
                        });

                        this.selectedMasterCirculars = selectedMasterCirculars;
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_FEMA_SUBMODULE_OF_MODULE_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FEMA_SUBMODULE_OF_MODULE_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    GetRBIFAQ(fEMASubModuleOfModuleData): void {
        this.spinnerService.show();

        let getFAQRequest = new GetFAQRequest();
        getFAQRequest.IsActive = true;

        this._fAQService.getFAQ(getFAQRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.rBIFAQs = [];

                if (data.Status == Global.API_SUCCESS) {
                    data.Response.filter(x => x.CategoryName == "RBI FAQs").forEach(item => {
                        this.rBIFAQs.push({ Value: item.FAQId, Text: item.TopicName });
                    });

                    this.rBIFAQDropDownSettings = {
                        singleSelection: false,
                        idField: 'Value',
                        textField: 'Text',
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableCheckAll: true,
                        allowSearchFilter: true
                    };

                    let selectedRBIFAQs = [];
                    if (fEMASubModuleOfModuleData != null) {
                        fEMASubModuleOfModuleData.FEMAKeyModuleDetail.split(',').forEach(item => {
                            if (this.rBIFAQs.filter(x => x.Value == item)[0])
                                selectedRBIFAQs.push({ Value: parseInt(item), Text: this.rBIFAQs.filter(x => x.Value == item)[0].Text });
                        });

                        this.selectedRBIFAQs = selectedRBIFAQs;
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_FEMA_SUBMODULE_OF_MODULE_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FEMA_SUBMODULE_OF_MODULE_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    CancelFEMASubModuleOfModule() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.router.navigate(['/admin/secure/femamodules'], {
                queryParams: {
                    indexFEMAModule: params["indexFEMAModule"], searchText: params["searchText"]
                }
            });
        });
    }
}
