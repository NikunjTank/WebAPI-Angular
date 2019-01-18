import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Regulation, GetRegulationRequest } from '../../../model/regulation';
import { RegulationAdminService } from '../../../service/admin/regulation.service';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


@Component({
    selector: 'my-app',
    templateUrl: './regulation.component.html'
})

export class RegulationAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _regulationService: RegulationAdminService, vcr: ViewContainerRef, private spinnerService: SpinnerService) { }

    _global: Global = new Global();

    regulation: Regulation;
    regulationId: number = 0;

    searchText: string = '';
    frmRegulation: FormGroup;
    msg: string;

    addUpdateText: string;

    isSubmited: boolean = false;

    minDate: any = { year: 1970, month: 1, day: 1 };

    ngOnInit(): void {
        this.frmRegulation = this.formBuilder.group({
            RegulationId: [''],
            RegulationNumber: ['', Validators.required],
            RegulationName: ['', Validators.required],
            Year: ['', Validators.required],
            PublicationDate: ['', Validators.required],
        });

        this.activatedRoute.params.subscribe((params: Params) => {
            let regulationId = this._global.decryptValue(params['regulationId']);

            if (regulationId) {
                this.addUpdateText = "Update";
                this.regulationId = parseInt(regulationId);
                this.EditRegulation(parseInt(regulationId));
            } else {
                this.addUpdateText = "Add";
            }
        });
    }

    EditRegulation(regulationId: number) {
        this.spinnerService.show();

        let getRegulationRequest = new GetRegulationRequest();
        getRegulationRequest.RegulationId = regulationId;
        getRegulationRequest.IsActive = null;

        this._regulationService.getRegulation(getRegulationRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                let publicationDate = new Date(data.Response[0].PublicationDate);

                this.frmRegulation.setValue({
                    RegulationId: regulationId,
                    RegulationNumber: data.Response[0].RegulationNumber,
                    RegulationName: data.Response[0].RegulationName,
                    Year: data.Response[0].Year,
                    PublicationDate: { year: publicationDate.getFullYear(), month: publicationDate.getMonth() + 1, day: publicationDate.getDate() }
                });

                this.frmRegulation.updateValueAndValidity();
            }, error => this.msg = <any>error);
    }

    SaveRegulation(formData) {
        this.spinnerService.show();

        formData.value.PublicationDate = (formData.value.PublicationDate != null) ? formData.value.PublicationDate.year + "/" + formData.value.PublicationDate.month + "/" + formData.value.PublicationDate.day : null;

        if (formData.value.RegulationId) {
            this._regulationService.updateRegulation(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/regulations'], {
                                queryParams: {
                                    indexRegulation1: params["indexRegulation1"], indexRegulation2: params["indexRegulation2"], indexIndex: params["indexIndex"], sortingRegulationField: params["sortingRegulationField"], sortingRegulationDirection: params["sortingRegulationDirection"], sortingFemaIndexField: params["sortingFemaIndexField"], sortingFemaIndexDirection: params["sortingFemaIndexDirection"], sortingFemaSubIndexField: params["sortingFemaSubIndexField"], sortingFemaSubIndexDirection: params["sortingFemaSubIndexDirection"], sortingIndexAmendmentField: params["sortingIndexAmendmentField"], sortingIndexAmendmentDirection: params["sortingIndexAmendmentDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_REGULATION_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_REGULATION_TITLE);
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_REGULATION_TITLE, { enableHtml: true });
                    });
        } else {
            this._regulationService.addRegulation(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/regulations'], {
                                queryParams: {
                                    indexRegulation1: params["indexRegulation1"], indexRegulation2: params["indexRegulation2"], indexIndex: params["indexIndex"], sortingRegulationField: params["sortingRegulationField"], sortingRegulationDirection: params["sortingRegulationDirection"], sortingFemaIndexField: params["sortingFemaIndexField"], sortingFemaIndexDirection: params["sortingFemaIndexDirection"], sortingFemaSubIndexField: params["sortingFemaSubIndexField"], sortingFemaSubIndexDirection: params["sortingFemaSubIndexDirection"], sortingIndexAmendmentField: params["sortingIndexAmendmentField"], sortingIndexAmendmentDirection: params["sortingIndexAmendmentDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_REGULATION_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_REGULATION_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_REGULATION_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    ClearDate() {
        this.frmRegulation.get("PublicationDate").setValue("");
        this.frmRegulation.updateValueAndValidity();
    }

    OnSubmitRegulation(formData: any) {
        this.isSubmited = true;

        if (this.frmRegulation.valid) {
            this.SaveRegulation(formData);
        }
    }

    CancelRegulation() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.router.navigate(['/admin/secure/regulations'], {
                queryParams: {
                    indexRegulation1: params["indexRegulation1"], indexRegulation2: params["indexRegulation2"], indexIndex: params["indexIndex"], sortingRegulationField: params["sortingRegulationField"], sortingRegulationDirection: params["sortingRegulationDirection"], sortingFemaIndexField: params["sortingFemaIndexField"], sortingFemaIndexDirection: params["sortingFemaIndexDirection"], sortingFemaSubIndexField: params["sortingFemaSubIndexField"], sortingFemaSubIndexDirection: params["sortingFemaSubIndexDirection"], sortingIndexAmendmentField: params["sortingIndexAmendmentField"], sortingIndexAmendmentDirection: params["sortingIndexAmendmentDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                }
            });
        });
    }
}
