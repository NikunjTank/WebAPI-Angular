import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RulesIndexAmendment, GetRulesIndexAmendmentRequest } from '../../../model/rulesIndexAmendment';
import { GSRNotification, GetGSRNotificationRequest } from '../../../model/gSRNotification';
import { RulesIndex, GetRulesIndexRequest } from '../../../model/rulesIndex';
import { RulesSubIndex, GetRulesSubIndexRequest } from '../../../model/rulesSubIndex';
import { Rules, GetRulesRequest } from '../../../model/rules';
import { RulesIndexAmendmentAdminService } from '../../../service/admin/rulesIndexAmendment.service';
import { GSRNotificationAdminService } from '../../../service/admin/gSRNotification.service';
import { RulesIndexAdminService } from '../../../service/admin/rulesIndex.service';
import { RulesSubIndexAdminService } from '../../../service/admin/rulesSubIndex.service';
import { RulesAdminService } from '../../../service/admin/rules.service';
import { DropDown } from '../../../common/dropDown';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


@Component({
    selector: 'my-app',
    templateUrl: './rulesIndexAmendment.component.html'
})

export class RulesIndexAmendmentAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _rulesIndexAmendmentService: RulesIndexAmendmentAdminService, private _gSRNotificationService: GSRNotificationAdminService, private _rulesIndexService: RulesIndexAdminService, private _rulesSubIndexService: RulesSubIndexAdminService, private _rulesService: RulesAdminService, vcr: ViewContainerRef, private spinnerService: SpinnerService) { }

    _global: Global = new Global();

    gSRNotifications: DropDown[] = [];
    rulesIndexes: DropDown[] = [];
    rulesSubIndexes: DropDown[] = [];
    gSRNotificationDropDownSettings = {};
    selectedGSRNotifications: any = [];

    rules: Rules = new Rules();

    rulesId: number = 0;
    rulesIndexAmendmentId: number = 0;

    frmRulesIndexAmendment: FormGroup;
    msg: string;

    addUpdateText: string;

    isSubmited: boolean = false;

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params: Params) => {
            let rulesId = this._global.decryptValue(params['rulesId']);
            let rulesIndexAmendmentId = this._global.decryptValue(params['rulesIndexAmendmentId']);

            this.rulesId = parseInt(rulesId);

            if (rulesId) {
                this.GetRules(this.rulesId);

                if (rulesIndexAmendmentId) {
                    this.addUpdateText = "Update";

                    this.rulesIndexAmendmentId = parseInt(rulesIndexAmendmentId);
                    this.EditRulesIndexAmendment(parseInt(rulesIndexAmendmentId));
                } else {
                    this.GetGSRNotification(null);

                    this.addUpdateText = "Add";
                }
            } else {
                this.activatedRoute.queryParams.subscribe(params => {
                    this.router.navigate(['/admin/secure/ruless'], {
                        queryParams: {
                            indexRules1: params["indexRules1"], indexRules2: params["indexRules2"], indexIndex: params["indexIndex"], sortingRulesField: params["sortingRulesField"], sortingRulesDirection: params["sortingRulesDirection"], sortingIndexField: params["sortingIndexField"], sortingIndexDirection: params["sortingIndexDirection"], sortingSubIndexField: params["sortingSubIndexField"], sortingSubIndexDirection: params["sortingSubIndexDirection"], sortingIndexAmendmentField: params["sortingIndexAmendmentField"], sortingIndexAmendmentDirection: params["sortingIndexAmendmentDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                        }
                    });
                });
            }
        });

        this.frmRulesIndexAmendment = this.formBuilder.group({
            RulesIndexAmendmentId: [''],
            RulesId: [this.rulesId],
            GSRNotificationIds: ['', Validators.required],
            IndexId: ['', Validators.required],
            SubIndexId: [''],
            IndexAmendmentContent: ['', Validators.required]
        });
    }

    GetRules(rulesId: number) {
        this.spinnerService.show();

        let getRulesRequest = new GetRulesRequest();
        getRulesRequest.RulesId = rulesId;
        getRulesRequest.IsActive = null;

        this._rulesService.getRules(getRulesRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.rules = data.Response[0];
            }, error => this.msg = <any>error);
    }

    GetGSRNotification(rulesIndexAmendmentData): void {
        this.spinnerService.show();

        let getGSRNotificationRequest = new GetGSRNotificationRequest();
        getGSRNotificationRequest.RulesId = this.rulesId;

        this._gSRNotificationService.getGSRNotification(getGSRNotificationRequest)
            .subscribe(data => {
                //this.spinnerService.hide();

                this.GetIndex(rulesIndexAmendmentData);

                this.gSRNotifications = [];

                if (data.Status == Global.API_SUCCESS) {

                    //this.gSRNotifications.push({ Value: "", Text: "--Select--" });

                    data.Response.forEach(item => {
                        this.gSRNotifications.push({ Value: item.GSRNotificationId, Text: item.GSRNotificationNo });
                    });

                    //this.frmRulesIndexAmendment.get("GSRNotificationId").setValue((rulesIndexAmendmentData != null) ? rulesIndexAmendmentData.GSRNotificationId : "");
                    //this.frmRulesIndexAmendment.updateValueAndValidity();

                    this.gSRNotificationDropDownSettings = {
                        singleSelection: false,
                        idField: 'Value',
                        textField: 'Text',
                        selectAllText: 'Select All',
                        unSelectAllText: 'UnSelect All',
                        enableCheckAll: false,
                        allowSearchFilter: true
                    };

                    let selectedGSRNotifications = [];

                    if (rulesIndexAmendmentData != null) {
                        rulesIndexAmendmentData.GSRNotificationIds.split(',').forEach(item => {
                            if (item)
                                selectedGSRNotifications.push({ Value: parseInt(item), Text: this.gSRNotifications.filter(x => x.Value == item)[0].Text });
                        });

                        this.selectedGSRNotifications = selectedGSRNotifications;
                    }
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_RULES_INDEXAMENDMENT_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_RULES_INDEXAMENDMENT_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    GetIndex(rulesIndexAmendmentData): void {
        this.spinnerService.show();

        let getRulesIndexRequest = new GetRulesIndexRequest();
        getRulesIndexRequest.RulesId = this.rulesId;

        this._rulesIndexService.getRulesIndex(getRulesIndexRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.rulesIndexes = [];

                if (data.Status == Global.API_SUCCESS) {

                    this.rulesIndexes.push({ Value: "", Text: "--Select--" });

                    data.Response.forEach(item => {
                        this.rulesIndexes.push({ Value: item.IndexId, Text: item.IndexNo + ' - ' + item.IndexName });
                    });

                    this.frmRulesIndexAmendment.get("IndexId").setValue((rulesIndexAmendmentData != null) ? rulesIndexAmendmentData.IndexId : "");
                    this.frmRulesIndexAmendment.updateValueAndValidity();

                    if (rulesIndexAmendmentData != null)
                        this.GetSubIndex(rulesIndexAmendmentData.IndexId, rulesIndexAmendmentData);
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_RULES_INDEXAMENDMENT_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_RULES_INDEXAMENDMENT_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    OnIndexChange(indexId: number) {
        this.rulesSubIndexes = [];

        if (indexId.toString() != 'null') {
            this.GetSubIndex(indexId, null);
        } else {
            this.frmRulesIndexAmendment.get("IndexId").setValue('');
            this.frmRulesIndexAmendment.updateValueAndValidity();
        }
    }

    GetSubIndex(indexId, rulesIndexAmendmentData): void {
        this.spinnerService.show();

        let getRulesSubIndexRequest = new GetRulesSubIndexRequest();
        getRulesSubIndexRequest.IndexId = indexId;

        this._rulesSubIndexService.getRulesSubIndex(getRulesSubIndexRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.rulesSubIndexes = [];

                if (data.Status == Global.API_SUCCESS) {

                    this.rulesSubIndexes.push({ Value: "", Text: "--Select--" });

                    data.Response.forEach(item => {
                        this.rulesSubIndexes.push({ Value: item.SubIndexId, Text: item.SubIndexNo + ' - ' + item.SubIndexName });
                    });

                    this.frmRulesIndexAmendment.get("SubIndexId").setValue((rulesIndexAmendmentData != null) ? rulesIndexAmendmentData.SubIndexId : "");
                    this.frmRulesIndexAmendment.updateValueAndValidity();
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_RULES_INDEXAMENDMENT_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_RULES_INDEXAMENDMENT_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    EditRulesIndexAmendment(rulesIndexAmendmentId: number) {
        this.spinnerService.show();

        let getRulesIndexAmendmentRequest = new GetRulesIndexAmendmentRequest();
        getRulesIndexAmendmentRequest.RulesIndexAmendmentId = rulesIndexAmendmentId;
        getRulesIndexAmendmentRequest.RulesId = this.rulesId;
        getRulesIndexAmendmentRequest.IsActive = null;

        this._rulesIndexAmendmentService.getRulesIndexAmendment(getRulesIndexAmendmentRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.GetGSRNotification(data.Response[0]);
                this.GetIndex(data.Response[0]);

                this.frmRulesIndexAmendment.setValue({
                    RulesIndexAmendmentId: rulesIndexAmendmentId,
                    RulesId: data.Response[0].RulesId,
                    GSRNotificationIds: [],
                    IndexId: data.Response[0].IndexId,
                    SubIndexId: data.Response[0].SubIndexId,
                    IndexAmendmentContent: data.Response[0].IndexAmendmentContent
                });

                this.frmRulesIndexAmendment.updateValueAndValidity();
            }, error => this.msg = <any>error);
    }

    SaveRulesIndexAmendment(formData) {
        this.spinnerService.show();

        if (formData.value.SubIndexId == 'null') {
            formData.value.SubIndexId = null;
        }

        if (formData.value.RulesIndexAmendmentId) {
            this._rulesIndexAmendmentService.updateRulesIndexAmendment(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/rules'], {
                                queryParams: {
                                    indexRules1: params["indexRules1"], indexRules2: params["indexRules2"], indexIndex: params["indexIndex"], sortingRulesField: params["sortingRulesField"], sortingRulesDirection: params["sortingRulesDirection"], sortingIndexField: params["sortingIndexField"], sortingIndexDirection: params["sortingIndexDirection"], sortingSubIndexField: params["sortingSubIndexField"], sortingSubIndexDirection: params["sortingSubIndexDirection"], sortingIndexAmendmentField: params["sortingIndexAmendmentField"], sortingIndexAmendmentDirection: params["sortingIndexAmendmentDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_RULES_INDEXAMENDMENT_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_RULES_INDEXAMENDMENT_TITLE);
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_RULES_INDEXAMENDMENT_TITLE, { enableHtml: true });
                    });
        } else {
            this._rulesIndexAmendmentService.addRulesIndexAmendment(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/rules'], {
                                queryParams: {
                                    indexRules1: params["indexRules1"], indexRules2: params["indexRules2"], indexIndex: params["indexIndex"], sortingRulesField: params["sortingRulesField"], sortingRulesDirection: params["sortingRulesDirection"], sortingIndexField: params["sortingIndexField"], sortingIndexDirection: params["sortingIndexDirection"], sortingSubIndexField: params["sortingSubIndexField"], sortingSubIndexDirection: params["sortingSubIndexDirection"], sortingIndexAmendmentField: params["sortingIndexAmendmentField"], sortingIndexAmendmentDirection: params["sortingIndexAmendmentDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_RULES_INDEXAMENDMENT_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.spinnerService.hide();
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_RULES_INDEXAMENDMENT_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_RULES_INDEXAMENDMENT_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    OnSubmitRulesIndexAmendment(formData: any) {
        this.isSubmited = true;
        
        if (this.frmRulesIndexAmendment.valid) {
            formData.value.GSRNotificationIds = this._global.convertArrayToCommaSeperatedString(formData.value.GSRNotificationIds);

            this.SaveRulesIndexAmendment(formData);
        }
    }

    CancelRulesIndexAmendment() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.router.navigate(['/admin/secure/rules'], {
                queryParams: {
                    indexRules1: params["indexRules1"], indexRules2: params["indexRules2"], indexIndex: params["indexIndex"], sortingRulesField: params["sortingRulesField"], sortingRulesDirection: params["sortingRulesDirection"], sortingIndexField: params["sortingIndexField"], sortingIndexDirection: params["sortingIndexDirection"], sortingSubIndexField: params["sortingSubIndexField"], sortingSubIndexDirection: params["sortingSubIndexDirection"], sortingIndexAmendmentField: params["sortingIndexAmendmentField"], sortingIndexAmendmentDirection: params["sortingIndexAmendmentDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                }
            });
        });
    }
}
