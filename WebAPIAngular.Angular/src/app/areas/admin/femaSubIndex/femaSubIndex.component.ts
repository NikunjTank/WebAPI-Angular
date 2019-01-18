import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FemaSubIndex, GetFemaSubIndexRequest } from '../../../model/femaSubIndex';
import { FemaIndex, GetFemaIndexRequest } from '../../../model/femaIndex';
import { Regulation, GetRegulationRequest } from '../../../model/regulation';
import { FemaSubIndexAdminService } from '../../../service/admin/femaSubIndex.service';
import { FemaIndexAdminService } from '../../../service/admin/femaIndex.service';
import { RegulationAdminService } from '../../../service/admin/regulation.service';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


import { ModalDialogService } from 'ngx-modal-dialog';
import { ContentPopUpAdminComponent } from '../../../areas/admin/contentPopUp/contentPopUp.component';

@Component({
    selector: 'my-app',
    templateUrl: './femaSubIndex.component.html'
})

export class FemaSubIndexAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _femaSubIndexService: FemaSubIndexAdminService, private _regulationService: RegulationAdminService, private _femaIndexService: FemaIndexAdminService, private vcr: ViewContainerRef, private spinnerService: SpinnerService, private modalService: ModalDialogService) { }

    _global: Global = new Global();

    femaSubIndex: FemaSubIndex;
    regulation: Regulation = new Regulation();
    femaIndex: FemaIndex = new FemaIndex();
    femaSubIndexes: FemaSubIndex[] = [];

    subIndexId: number = 0;
    indexId: number;
    regulationId: number;

    frmFemaSubIndex: FormGroup;
    msg: string;

    addUpdateText: string;

    isSubmited: boolean = false;

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params: Params) => {
            let regulationId = this._global.decryptValue(params['regulationId']);
            let indexId = this._global.decryptValue(params['indexId']);
            let subIndexId = this._global.decryptValue(params['subIndexId']);

            this.regulationId = parseInt(regulationId);
            this.indexId = parseInt(indexId);

            if (regulationId && indexId) {
                this.GetRegulation(this.regulationId);
                this.GetFemaIndex(this.indexId);

                if (subIndexId) {
                    this.addUpdateText = "Update";

                    this.subIndexId = parseInt(subIndexId);
                    this.EditFemaSubIndex(parseInt(subIndexId));
                } else {
                    this.GetSubIndex(null);
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

        this.frmFemaSubIndex = this.formBuilder.group({
            SubIndexId: [''],
            IndexId: [this.indexId],
            SubIndexNo: ['', Validators.required],
            SubIndexName: ['', Validators.required],
            SubIndexContent: ['', Validators.required],
            SaveAfterSubIndexId: ['']
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

    GetFemaIndex(indexId: number) {
        this.spinnerService.show();

        let getFemaIndexRequest = new GetFemaIndexRequest();
        getFemaIndexRequest.IndexId = indexId;
        getFemaIndexRequest.IsActive = null;

        this._femaIndexService.getFemaIndex(getFemaIndexRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.femaIndex = data.Response[0];
            }, error => this.msg = <any>error);
    }

    GetSubIndex(subIndexData): void {
        this.spinnerService.show();

        let getFemaSubIndexRequest = new GetFemaSubIndexRequest();
        getFemaSubIndexRequest.IndexId = this.indexId;

        this._femaSubIndexService.getFemaSubIndex(getFemaSubIndexRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.femaSubIndexes = [];

                if (data.Status == Global.API_SUCCESS) {

                    this.femaSubIndexes.push({ SubIndexId: null, SubIndexNo: null, CreatedDate: null, SubIndexContent: null, SubIndexName: "--Select SubIndex--", SortId: null, IsActive: null, IsDeleted: null, ModifiedDate: null, IndexId: null });

                    data.Response.forEach(item => {
                        //if (data.Response.length != this.femaSubIndexes.length)
                        this.femaSubIndexes.push({ SubIndexId: item.SubIndexId, SubIndexNo: item.SubIndexNo, CreatedDate: null, SubIndexContent: null, SubIndexName: item.SubIndexName, SortId: item.SortId, IsActive: null, IsDeleted: null, ModifiedDate: null, IndexId: null });
                    });

                    if (subIndexData) {
                        let index = this.femaSubIndexes.filter(x => x.SortId == (subIndexData.SortId - 1));

                        this.frmFemaSubIndex.get("SaveAfterSubIndexId").setValue((index.length > 0) ? index[0].SubIndexId : null);
                    } else {
                        this.frmFemaSubIndex.get("SaveAfterSubIndexId").setValue(null);
                    }
                    this.frmFemaSubIndex.updateValueAndValidity();
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_SUBINDEX_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_SUBINDEX_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    EditFemaSubIndex(subIndexId: number) {
        this.spinnerService.show();

        let getFemaSubIndexRequest = new GetFemaSubIndexRequest();
        getFemaSubIndexRequest.SubIndexId = subIndexId;
        getFemaSubIndexRequest.IsActive = null;

        this._femaSubIndexService.getFemaSubIndex(getFemaSubIndexRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.GetSubIndex(data.Response[0]);

                this.frmFemaSubIndex.setValue({
                    SubIndexId: subIndexId,
                    IndexId: data.Response[0].IndexId,
                    SubIndexNo: data.Response[0].SubIndexNo,
                    SubIndexName: data.Response[0].SubIndexName,
                    SubIndexContent: data.Response[0].SubIndexContent,
                    SaveAfterSubIndexId: null
                });

                this.frmFemaSubIndex.updateValueAndValidity();
            }, error => this.msg = <any>error);
    }

    SaveFemaSubIndex(formData) {
        this.spinnerService.show();

        formData.value.SaveAfterSubIndexId = (formData.value.SaveAfterSubIndexId && formData.value.SaveAfterSubIndexId != "null") ? formData.value.SaveAfterSubIndexId : null;

        if (formData.value.SubIndexId) {
            this._femaSubIndexService.updateFemaSubIndex(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/regulations'], {
                                queryParams: {
                                    indexRegulation1: params["indexRegulation1"], indexRegulation2: params["indexRegulation2"], indexIndex: params["indexIndex"], sortingRegulationField: params["sortingRegulationField"], sortingRegulationDirection: params["sortingRegulationDirection"], sortingFemaIndexField: params["sortingFemaIndexField"], sortingFemaIndexDirection: params["sortingFemaIndexDirection"], sortingFemaSubIndexField: params["sortingFemaSubIndexField"], sortingFemaSubIndexDirection: params["sortingFemaSubIndexDirection"], sortingIndexAmendmentField: params["sortingIndexAmendmentField"], sortingIndexAmendmentDirection: params["sortingIndexAmendmentDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
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
            this._femaSubIndexService.addFemaSubIndex(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/regulations'], {
                                queryParams: {
                                    indexRegulation1: params["indexRegulation1"], indexRegulation2: params["indexRegulation2"], indexIndex: params["indexIndex"], sortingRegulationField: params["sortingRegulationField"], sortingRegulationDirection: params["sortingRegulationDirection"], sortingFemaIndexField: params["sortingFemaIndexField"], sortingFemaIndexDirection: params["sortingFemaIndexDirection"], sortingFemaSubIndexField: params["sortingFemaSubIndexField"], sortingFemaSubIndexDirection: params["sortingFemaSubIndexDirection"], sortingIndexAmendmentField: params["sortingIndexAmendmentField"], sortingIndexAmendmentDirection: params["sortingIndexAmendmentDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
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

    OnSubmitFemaSubIndex(formData: any) {
        this.isSubmited = true;

        if (this.frmFemaSubIndex.valid) {
            formData.value.IndexId = this.indexId;
            this.SaveFemaSubIndex(formData);
        }
    }

    CancelFemaSubIndex() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.router.navigate(['/admin/secure/regulations'], {
                queryParams: {
                    indexRegulation1: params["indexRegulation1"], indexRegulation2: params["indexRegulation2"], indexIndex: params["indexIndex"], sortingRegulationField: params["sortingRegulationField"], sortingRegulationDirection: params["sortingRegulationDirection"], sortingFemaIndexField: params["sortingFemaIndexField"], sortingFemaIndexDirection: params["sortingFemaIndexDirection"], sortingFemaSubIndexField: params["sortingFemaSubIndexField"], sortingFemaSubIndexDirection: params["sortingFemaSubIndexDirection"], sortingIndexAmendmentField: params["sortingIndexAmendmentField"], sortingIndexAmendmentDirection: params["sortingIndexAmendmentDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
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
