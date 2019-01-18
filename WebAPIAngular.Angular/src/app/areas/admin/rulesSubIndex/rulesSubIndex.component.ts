import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RulesSubIndex, GetRulesSubIndexRequest } from '../../../model/rulesSubIndex';
import { RulesIndex, GetRulesIndexRequest } from '../../../model/rulesIndex';
import { Rules, GetRulesRequest } from '../../../model/rules';
import { RulesSubIndexAdminService } from '../../../service/admin/rulesSubIndex.service';
import { RulesIndexAdminService } from '../../../service/admin/rulesIndex.service';
import { RulesAdminService } from '../../../service/admin/rules.service';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


import { ModalDialogService } from 'ngx-modal-dialog';
import { ContentPopUpAdminComponent } from '../../../areas/admin/contentPopUp/contentPopUp.component';

@Component({
    selector: 'my-app',
    templateUrl: './rulesSubIndex.component.html'
})

export class RulesSubIndexAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _rulesSubIndexService: RulesSubIndexAdminService, private _rulesService: RulesAdminService, private _rulesIndexService: RulesIndexAdminService, private vcr: ViewContainerRef, private spinnerService: SpinnerService, private modalService: ModalDialogService) { }

    _global: Global = new Global();

    rulesSubIndex: RulesSubIndex;
    rules: Rules = new Rules();
    rulesIndex: RulesIndex = new RulesIndex();
    rulesSubIndexes: RulesSubIndex[] = [];

    subIndexId: number = 0;
    indexId: number;
    rulesId: number;

    frmRulesSubIndex: FormGroup;
    msg: string;

    addUpdateText: string;

    isSubmited: boolean = false;

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params: Params) => {
            let rulesId = this._global.decryptValue(params['rulesId']);
            let indexId = this._global.decryptValue(params['indexId']);
            let subIndexId = this._global.decryptValue(params['subIndexId']);

            this.rulesId = parseInt(rulesId);
            this.indexId = parseInt(indexId);

            if (rulesId && indexId) {
                this.GetRules(this.rulesId);
                this.GetRulesIndex(this.indexId);

                if (subIndexId) {
                    this.addUpdateText = "Update";

                    this.subIndexId = parseInt(subIndexId);
                    this.EditRulesSubIndex(parseInt(subIndexId));
                } else {
                    this.GetSubIndex(null);
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

        this.frmRulesSubIndex = this.formBuilder.group({
            SubIndexId: [''],
            IndexId: [this.indexId],
            SubIndexNo: ['', Validators.required],
            SubIndexName: ['', Validators.required],
            SubIndexContent: ['', Validators.required],
            SaveAfterSubIndexId: ['']
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

    GetRulesIndex(indexId: number) {
        this.spinnerService.show();

        let getRulesIndexRequest = new GetRulesIndexRequest();
        getRulesIndexRequest.IndexId = indexId;
        getRulesIndexRequest.IsActive = null;

        this._rulesIndexService.getRulesIndex(getRulesIndexRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.rulesIndex = data.Response[0];
            }, error => this.msg = <any>error);
    }

    GetSubIndex(subIndexData): void {
        this.spinnerService.show();

        let getRulesSubIndexRequest = new GetRulesSubIndexRequest();
        getRulesSubIndexRequest.IndexId = this.indexId;
        
        this._rulesSubIndexService.getRulesSubIndex(getRulesSubIndexRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.rulesSubIndexes = [];

                if (data.Status == Global.API_SUCCESS) {
                    this.rulesSubIndexes.push({ SubIndexId: null, SubIndexNo: null, CreatedDate: null, SubIndexContent: null, SubIndexName: "--Select SubIndex--", SortId: null, IsActive: null, IsDeleted: null, ModifiedDate: null, IndexId: null });

                    data.Response.forEach(item => {
                        //if (data.Response.length != this.rulesSubIndexes.length)
                        this.rulesSubIndexes.push({ SubIndexId: item.SubIndexId, SubIndexNo: item.SubIndexNo, CreatedDate: null, SubIndexContent: null, SubIndexName: item.SubIndexName, SortId: item.SortId, IsActive: null, IsDeleted: null, ModifiedDate: null, IndexId: null });
                    });

                    if (subIndexData) {
                        let index = this.rulesSubIndexes.filter(x => x.SortId == (subIndexData.SortId - 1));

                        this.frmRulesSubIndex.get("SaveAfterSubIndexId").setValue((index.length > 0) ? index[0].SubIndexId : null);
                    } else {
                        this.frmRulesSubIndex.get("SaveAfterSubIndexId").setValue(null);
                    }
                    this.frmRulesSubIndex.updateValueAndValidity();
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_SUBINDEX_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_SUBINDEX_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    EditRulesSubIndex(subIndexId: number) {
        this.spinnerService.show();

        let getRulesSubIndexRequest = new GetRulesSubIndexRequest();
        getRulesSubIndexRequest.SubIndexId = subIndexId;
        getRulesSubIndexRequest.IsActive = null;

        this._rulesSubIndexService.getRulesSubIndex(getRulesSubIndexRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.GetSubIndex(data.Response[0]);

                this.frmRulesSubIndex.setValue({
                    SubIndexId: subIndexId,
                    IndexId: data.Response[0].IndexId,
                    SubIndexNo: data.Response[0].SubIndexNo,
                    SubIndexName: data.Response[0].SubIndexName,
                    SubIndexContent: data.Response[0].SubIndexContent,
                    SaveAfterSubIndexId: null
                });

                this.frmRulesSubIndex.updateValueAndValidity();
            }, error => this.msg = <any>error);
    }

    SaveRulesSubIndex(formData) {
        this.spinnerService.show();

        formData.value.SaveAfterSubIndexId = (formData.value.SaveAfterSubIndexId && formData.value.SaveAfterSubIndexId != "null") ? formData.value.SaveAfterSubIndexId : null;

        if (formData.value.SubIndexId) {
            this._rulesSubIndexService.updateRulesSubIndex(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/rules'], {
                                queryParams: {
                                    indexRules1: params["indexRules1"], indexRules2: params["indexRules2"], indexIndex: params["indexIndex"], sortingRulesField: params["sortingRulesField"], sortingRulesDirection: params["sortingRulesDirection"], sortingIndexField: params["sortingIndexField"], sortingIndexDirection: params["sortingIndexDirection"], sortingSubIndexField: params["sortingSubIndexField"], sortingSubIndexDirection: params["sortingSubIndexDirection"], sortingIndexAmendmentField: params["sortingIndexAmendmentField"], sortingIndexAmendmentDirection: params["sortingIndexAmendmentDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_SUBINDEX_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_SUBINDEX_TITLE);
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_SUBINDEX_TITLE, { enableHtml: true });
                    });
        } else {
            this._rulesSubIndexService.addRulesSubIndex(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/rules'], {
                                queryParams: {
                                    indexRules1: params["indexRules1"], indexRules2: params["indexRules2"], indexIndex: params["indexIndex"], sortingRulesField: params["sortingRulesField"], sortingRulesDirection: params["sortingRulesDirection"], sortingIndexField: params["sortingIndexField"], sortingIndexDirection: params["sortingIndexDirection"], sortingSubIndexField: params["sortingSubIndexField"], sortingSubIndexDirection: params["sortingSubIndexDirection"], sortingIndexAmendmentField: params["sortingIndexAmendmentField"], sortingIndexAmendmentDirection: params["sortingIndexAmendmentDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_SUBINDEX_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_SUBINDEX_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_SUBINDEX_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    OnSubmitRulesSubIndex(formData: any) {
        this.isSubmited = true;

        if (this.frmRulesSubIndex.valid) {
            formData.value.IndexId = this.indexId;
            this.SaveRulesSubIndex(formData);
        }
    }

    CancelRulesSubIndex() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.router.navigate(['/admin/secure/rules'], {
                queryParams: {
                    indexRules1: params["indexRules1"], indexRules2: params["indexRules2"], indexIndex: params["indexIndex"], sortingRulesField: params["sortingRulesField"], sortingRulesDirection: params["sortingRulesDirection"], sortingIndexField: params["sortingIndexField"], sortingIndexDirection: params["sortingIndexDirection"], sortingSubIndexField: params["sortingSubIndexField"], sortingSubIndexDirection: params["sortingSubIndexDirection"], sortingIndexAmendmentField: params["sortingIndexAmendmentField"], sortingIndexAmendmentDirection: params["sortingIndexAmendmentDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                }
            });
        });
    }

    ShowContent(title, content) {
        this.modalService.openDialog(this.vcr, {
            title: title,
            childComponent: ContentPopUpAdminComponent,
            data: content
        });
    }
}
