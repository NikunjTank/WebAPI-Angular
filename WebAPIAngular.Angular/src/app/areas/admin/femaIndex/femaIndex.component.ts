import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FemaIndex, GetFemaIndexRequest } from '../../../model/femaIndex';
import { Regulation, GetRegulationRequest } from '../../../model/regulation';
import { FemaIndexAdminService } from '../../../service/admin/femaIndex.service';
import { RegulationAdminService } from '../../../service/admin/regulation.service';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


@Component({
    selector: 'my-app',
    templateUrl: './femaIndex.component.html'
})

export class FemaIndexAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _femaIndexService: FemaIndexAdminService, private _regulationService: RegulationAdminService, vcr: ViewContainerRef, private spinnerService: SpinnerService) { }

    _global: Global = new Global();

    femaIndex: FemaIndex;
    regulation: Regulation = new Regulation();
    femaIndexes: FemaIndex[] = [];

    indexId: number = 0;
    regulationId: number;

    frmFemaIndex: FormGroup;
    msg: string;

    addUpdateText: string;

    isSubmited: boolean = false;

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params: Params) => {
            let regulationId = this._global.decryptValue(params['regulationId']);
            let indexId = this._global.decryptValue(params['indexId']);

            this.regulationId = parseInt(regulationId);

            if (regulationId) {
                this.GetRegulation(this.regulationId);

                if (indexId) {
                    this.addUpdateText = "Update";

                    this.indexId = parseInt(indexId);
                    this.EditFemaIndex(parseInt(indexId));
                } else {
                    this.GetIndex(null);
                    this.addUpdateText = "Add";
                }
            } else {
                this.activatedRoute.queryParams.subscribe(params => {
                    this.router.navigate(['/admin/secure/regulations'], {
                        queryParams: {
                            indexRegulation1: params["indexRegulation1"], indexRegulation2: params["indexRegulation2"], indexIndex: params["indexIndex"], sortingRegulationField: params["sortingRegulationField"], sortingRegulationDirection: params["sortingRegulationDirection"], sortingFemaIndexField: params["sortingFemaIndexField"], sortingFemaIndexDirection: params["sortingFemaIndexDirection"], sortingFemaSubIndexField: params["sortingFemaSubIndexField"], sortingFemaSubIndexDirection: params["sortingFemaSubIndexDirection"], sortingIndexAmendmentField: params["sortingIndexAmendmentField"], sortingIndexAmendmentDirection: params["sortingIndexAmendmentDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                        }
                    });
                });
            }
        });

        this.frmFemaIndex = this.formBuilder.group({
            IndexId: [''],
            RegulationId: [this.regulationId],
            IndexNo: ['', Validators.required],
            IndexName: ['', Validators.required],
            IndexContent: ['', Validators.required],
            SaveAfterIndexId: ['']
        });
    }

    GetRegulation(regulationId: number) {
        this.spinnerService.show();

        let getRegulationRequest = new GetRegulationRequest();
        getRegulationRequest.RegulationId = regulationId;
        getRegulationRequest.IsActive = null;

        this._regulationService.getRegulation(getRegulationRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.regulation = data.Response[0];
            }, error => this.msg = <any>error);
    }

    GetIndex(indexData): void {
        this.spinnerService.show();

        let getFemaIndexRequest = new GetFemaIndexRequest();
        getFemaIndexRequest.RegulationId = this.regulationId;

        this._femaIndexService.getFemaIndex(getFemaIndexRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.femaIndexes = [];

                if (data.Status == Global.API_SUCCESS) {

                    this.femaIndexes.push({ IndexId: null, IndexNo: null, CreatedDate: null, IndexContent: null, IndexName: "--Select Index--", SortId: null, IsActive: null, IsDeleted: null, ModifiedDate: null, RegulationId: null });

                    data.Response.forEach(item => {
                        //if (data.Response.length != this.femaIndexes.length)
                        this.femaIndexes.push({ IndexId: item.IndexId, IndexNo: item.IndexNo, CreatedDate: null, IndexContent: null, IndexName: item.IndexName, SortId: item.SortId, IsActive: null, IsDeleted: null, ModifiedDate: null, RegulationId: null });
                    });

                    if (indexData) {
                        let index = this.femaIndexes.filter(x => x.SortId == (indexData.SortId - 1));

                        this.frmFemaIndex.get("SaveAfterIndexId").setValue((index.length > 0) ? index[0].IndexId : null);
                    } else {
                        this.frmFemaIndex.get("SaveAfterIndexId").setValue(null);
                    }
                    this.frmFemaIndex.updateValueAndValidity();
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_INDEX_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_INDEX_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    EditFemaIndex(indexId: number) {
        this.spinnerService.show();

        let getFemaIndexRequest = new GetFemaIndexRequest();
        getFemaIndexRequest.IndexId = indexId;
        getFemaIndexRequest.IsActive = null;

        this._femaIndexService.getFemaIndex(getFemaIndexRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.GetIndex(data.Response[0]);

                this.frmFemaIndex.setValue({
                    IndexId: indexId,
                    RegulationId: data.Response[0].RegulationId,
                    IndexNo: data.Response[0].IndexNo,
                    IndexName: data.Response[0].IndexName,
                    IndexContent: data.Response[0].IndexContent,
                    SaveAfterIndexId: null
                });

                this.frmFemaIndex.updateValueAndValidity();
            }, error => this.msg = <any>error);
    }

    SaveFemaIndex(formData) {
        this.spinnerService.show();

        formData.value.SaveAfterIndexId = (formData.value.SaveAfterIndexId && formData.value.SaveAfterIndexId != "null") ? formData.value.SaveAfterIndexId : null;

        if (formData.value.IndexId) {
            this._femaIndexService.updateFemaIndex(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/regulations'], {
                                queryParams: {
                                    indexRegulation1: params["indexRegulation1"], indexRegulation2: params["indexRegulation2"], indexIndex: params["indexIndex"], sortingRegulationField: params["sortingRegulationField"], sortingRegulationDirection: params["sortingRegulationDirection"], sortingFemaIndexField: params["sortingFemaIndexField"], sortingFemaIndexDirection: params["sortingFemaIndexDirection"], sortingFemaSubIndexField: params["sortingFemaSubIndexField"], sortingFemaSubIndexDirection: params["sortingFemaSubIndexDirection"], sortingIndexAmendmentField: params["sortingIndexAmendmentField"], sortingIndexAmendmentDirection: params["sortingIndexAmendmentDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_INDEX_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_INDEX_TITLE);
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_INDEX_TITLE, { enableHtml: true });
                    });
        } else {
            this._femaIndexService.addFemaIndex(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/regulations'], {
                                queryParams: {
                                    indexRegulation1: params["indexRegulation1"], indexRegulation2: params["indexRegulation2"], indexIndex: params["indexIndex"], sortingRegulationField: params["sortingRegulationField"], sortingRegulationDirection: params["sortingRegulationDirection"], sortingFemaIndexField: params["sortingFemaIndexField"], sortingFemaIndexDirection: params["sortingFemaIndexDirection"], sortingFemaSubIndexField: params["sortingFemaSubIndexField"], sortingFemaSubIndexDirection: params["sortingFemaSubIndexDirection"], sortingIndexAmendmentField: params["sortingIndexAmendmentField"], sortingIndexAmendmentDirection: params["sortingIndexAmendmentDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_INDEX_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_INDEX_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_INDEX_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    OnSubmitFemaIndex(formData: any) {
        this.isSubmited = true;

        if (this.frmFemaIndex.valid) {
            this.SaveFemaIndex(formData);
        }
    }

    CancelFemaIndex() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.router.navigate(['/admin/secure/regulations'], {
                queryParams: {
                    indexRegulation1: params["indexRegulation1"], indexRegulation2: params["indexRegulation2"], indexIndex: params["indexIndex"], sortingRegulationField: params["sortingRegulationField"], sortingRegulationDirection: params["sortingRegulationDirection"], sortingFemaIndexField: params["sortingFemaIndexField"], sortingFemaIndexDirection: params["sortingFemaIndexDirection"], sortingFemaSubIndexField: params["sortingFemaSubIndexField"], sortingFemaSubIndexDirection: params["sortingFemaSubIndexDirection"], sortingIndexAmendmentField: params["sortingIndexAmendmentField"], sortingIndexAmendmentDirection: params["sortingIndexAmendmentDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                }
            });
        });
    }
}
