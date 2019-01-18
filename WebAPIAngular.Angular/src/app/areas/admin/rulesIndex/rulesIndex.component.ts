import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RulesIndex, GetRulesIndexRequest } from '../../../model/rulesIndex';
import { Rules, GetRulesRequest } from '../../../model/rules';
import { RulesIndexAdminService } from '../../../service/admin/rulesIndex.service';
import { RulesAdminService } from '../../../service/admin/rules.service';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


@Component({
    selector: 'my-app',
    templateUrl: './rulesIndex.component.html'
})

export class RulesIndexAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _rulesIndexService: RulesIndexAdminService, private _rulesService: RulesAdminService, vcr: ViewContainerRef, private spinnerService: SpinnerService) { }

    _global: Global = new Global();

    rulesIndex: RulesIndex;
    rules: Rules = new Rules();
    rulesIndexes: RulesIndex[] = [];

    indexId: number = 0;
    rulesId: number;

    frmRulesIndex: FormGroup;
    msg: string;

    addUpdateText: string;

    isSubmited: boolean = false;

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params: Params) => {
            let rulesId = this._global.decryptValue(params['rulesId']);
            let indexId = this._global.decryptValue(params['indexId']);

            this.rulesId = parseInt(rulesId);

            if (rulesId) {
                this.GetRules(this.rulesId);

                if (indexId) {
                    this.addUpdateText = "Update";

                    this.indexId = parseInt(indexId);
                    this.EditRulesIndex(parseInt(indexId));
                } else {
                    this.GetIndex(null);
                    this.addUpdateText = "Add";
                }
            } else {
                this.activatedRoute.queryParams.subscribe(params => {
                    this.router.navigate(['/admin/secure/rules'], {
                        queryParams: {
                            indexRules1: params["indexRules1"], indexRules2: params["indexRules2"], indexIndex: params["indexIndex"], sortingRulesField: params["sortingRulesField"], sortingRulesDirection: params["sortingRulesDirection"], sortingIndexField: params["sortingIndexField"], sortingIndexDirection: params["sortingIndexDirection"], sortingSubIndexField: params["sortingSubIndexField"], sortingSubIndexDirection: params["sortingSubIndexDirection"], sortingIndexAmendmentField: params["sortingIndexAmendmentField"], sortingIndexAmendmentDirection: params["sortingIndexAmendmentDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                        }
                    });
                });
            }
        });

        this.frmRulesIndex = this.formBuilder.group({
            IndexId: [''],
            RulesId: [this.rulesId],
            IndexNo: ['', Validators.required],
            IndexName: ['', Validators.required],
            IndexContent: ['', Validators.required],
            SaveAfterIndexId: ['']
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

    GetIndex(indexData): void {
        this.spinnerService.show();

        let getRulesIndexRequest = new GetRulesIndexRequest();
        getRulesIndexRequest.RulesId = this.rulesId;

        this._rulesIndexService.getRulesIndex(getRulesIndexRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.rulesIndexes = [];

                if (data.Status == Global.API_SUCCESS) {

                    this.rulesIndexes.push({ IndexId: null, IndexNo: null, CreatedDate: null, IndexContent: null, IndexName: "--Select Index--", SortId: null, IsActive: null, IsDeleted: null, ModifiedDate: null, RulesId: null });

                    data.Response.forEach(item => {
                        //if (data.Response.length != this.rulesIndexes.length)
                            this.rulesIndexes.push({ IndexId: item.IndexId, IndexNo: item.IndexNo, CreatedDate: null, IndexContent: null, IndexName: item.IndexName, SortId: item.SortId, IsActive: null, IsDeleted: null, ModifiedDate: null, RulesId: null });
                    });

                    if (indexData) {
                        let index = this.rulesIndexes.filter(x => x.SortId == (indexData.SortId - 1));

                        this.frmRulesIndex.get("SaveAfterIndexId").setValue((index.length > 0) ? index[0].IndexId : null);
                    } else {
                        this.frmRulesIndex.get("SaveAfterIndexId").setValue(null);
                    }
                    this.frmRulesIndex.updateValueAndValidity();
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_RULES_INDEX_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_RULES_INDEX_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    EditRulesIndex(indexId: number) {
        this.spinnerService.show();

        let getRulesIndexRequest = new GetRulesIndexRequest();
        getRulesIndexRequest.IndexId = indexId;
        getRulesIndexRequest.IsActive = null;

        this._rulesIndexService.getRulesIndex(getRulesIndexRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.GetIndex(data.Response[0]);

                this.frmRulesIndex.setValue({
                    IndexId: indexId,
                    RulesId: data.Response[0].RulesId,
                    IndexNo: data.Response[0].IndexNo,
                    IndexName: data.Response[0].IndexName,
                    IndexContent: data.Response[0].IndexContent,
                    SaveAfterIndexId: null
                });

                this.frmRulesIndex.updateValueAndValidity();
            }, error => this.msg = <any>error);
    }

    SaveRulesIndex(formData) {
        this.spinnerService.show();

        formData.value.SaveAfterIndexId = (formData.value.SaveAfterIndexId && formData.value.SaveAfterIndexId != "null") ? formData.value.SaveAfterIndexId : null;

        if (formData.value.IndexId) {
            this._rulesIndexService.updateRulesIndex(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/rules'], {
                                queryParams: {
                                    indexRules1: params["indexRules1"], indexRules2: params["indexRules2"], indexIndex: params["indexIndex"], sortingRulesField: params["sortingRulesField"], sortingRulesDirection: params["sortingRulesDirection"], sortingIndexField: params["sortingIndexField"], sortingIndexDirection: params["sortingIndexDirection"], sortingSubIndexField: params["sortingSubIndexField"], sortingSubIndexDirection: params["sortingSubIndexDirection"], sortingIndexAmendmentField: params["sortingIndexAmendmentField"], sortingIndexAmendmentDirection: params["sortingIndexAmendmentDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_RULES_INDEX_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_RULES_INDEX_TITLE);
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_RULES_INDEX_TITLE, { enableHtml: true });
                    });
        } else {
            this._rulesIndexService.addRulesIndex(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/rules'], {
                                queryParams: {
                                    indexRules1: params["indexRules1"], indexRules2: params["indexRules2"], indexIndex: params["indexIndex"], sortingRulesField: params["sortingRulesField"], sortingRulesDirection: params["sortingRulesDirection"], sortingIndexField: params["sortingIndexField"], sortingIndexDirection: params["sortingIndexDirection"], sortingSubIndexField: params["sortingSubIndexField"], sortingSubIndexDirection: params["sortingSubIndexDirection"], sortingIndexAmendmentField: params["sortingIndexAmendmentField"], sortingIndexAmendmentDirection: params["sortingIndexAmendmentDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_RULES_INDEX_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_RULES_INDEX_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_RULES_INDEX_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    OnSubmitRulesIndex(formData: any) {
        this.isSubmited = true;

        if (this.frmRulesIndex.valid) {
            this.SaveRulesIndex(formData);
        }
    }

    CancelRulesIndex() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.router.navigate(['/admin/secure/rules'], {
                queryParams: {
                    indexRules1: params["indexRules1"], indexRules2: params["indexRules2"], indexIndex: params["indexIndex"], sortingRulesField: params["sortingRulesField"], sortingRulesDirection: params["sortingRulesDirection"], sortingIndexField: params["sortingIndexField"], sortingIndexDirection: params["sortingIndexDirection"], sortingSubIndexField: params["sortingSubIndexField"], sortingSubIndexDirection: params["sortingSubIndexDirection"], sortingIndexAmendmentField: params["sortingIndexAmendmentField"], sortingIndexAmendmentDirection: params["sortingIndexAmendmentDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                }
            });
        });
    }
}
