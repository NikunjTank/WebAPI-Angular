import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AllDefinition, GetAllDefinitionRequest } from '../../../model/allDefinition';
import { ActName, GetActNameRequest } from '../../../model/actName';
import { AllDefinitionAdminService } from '../../../service/admin/allDefinition.service';
import { ActNameAdminService } from '../../../service/admin/actName.service';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


@Component({
    selector: 'my-app',
    templateUrl: './allDefinition.component.html'
})

export class AllDefinitionAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _allDefinitionService: AllDefinitionAdminService, private _actNameService: ActNameAdminService, vcr: ViewContainerRef, private spinnerService: SpinnerService) { }

    _global: Global = new Global();

    allDefinition: AllDefinition;
    actName: ActName = new ActName();
    id: number = 0;
    actId: number;

    frmAllDefinition: FormGroup;
    msg: string;

    addUpdateText: string;

    isSubmited: boolean = false;

    pdfServerPath: string = Global.ACT_PDF_FILEPATH;

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params: Params) => {
            let actId = this._global.decryptValue(params['actId']);
            let id = this._global.decryptValue(params['id']);

            this.actId = parseInt(actId);

            if (actId) {
                this.GetActName(this.actId);

                if (id) {
                    this.addUpdateText = "Update";

                    this.id = parseInt(id);
                    this.EditAllDefinition(parseInt(id));
                } else {
                    this.addUpdateText = "Add";
                }
            } else {
                this.activatedRoute.queryParams.subscribe(params => {
                    this.router.navigate(['/admin/secure/actnames'], {
                        queryParams: {
                            indexAct: params["indexAct"], sortingActNameField: params["sortingActNameField"], sortingActNameDirection: params["sortingActNameDirection"], sortingDefinitionField: params["sortingDefinitionField"], sortingDefinitionDirection: params["sortingDefinitionDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                        }
                    });
                });
            }
        });

        this.frmAllDefinition = this.formBuilder.group({
            Id: [''],
            ActId: [this.actId],
            DefinitionName: ['', Validators.required],
            FullDInsertion: ['', Validators.required],
            AuthorNote: ['']
        });
    }

    GetActName(actId: number) {
        this.spinnerService.show();

        let getActNameRequest = new GetActNameRequest();
        getActNameRequest.ActId = actId;
        getActNameRequest.IsActive = null;

        this._actNameService.getActName(getActNameRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.actName = data.Response[0];
            }, error => this.msg = <any>error);
    }

    EditAllDefinition(id: number) {
        this.spinnerService.show();

        let getAllDefinitionRequest = new GetAllDefinitionRequest();
        getAllDefinitionRequest.Id = id;
        getAllDefinitionRequest.IsActive = null;

        this._allDefinitionService.getAllDefinition(getAllDefinitionRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.frmAllDefinition.setValue({
                    Id: id,
                    ActId: data.Response[0].ActId,
                    DefinitionName: data.Response[0].DefinitionName,
                    FullDInsertion: data.Response[0].FullDInsertion,
                    AuthorNote: data.Response[0].AuthorNote
                });

                this.frmAllDefinition.updateValueAndValidity();
            }, error => this.msg = <any>error);
    }

    SaveAllDefinition(formData) {
        this.spinnerService.show();

        if (formData.value.Id) {
            this._allDefinitionService.updateAllDefinition(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/actnames'], {
                                queryParams: {
                                    indexAct: params["indexAct"], sortingActNameField: params["sortingActNameField"], sortingActNameDirection: params["sortingActNameDirection"], sortingDefinitionField: params["sortingDefinitionField"], sortingDefinitionDirection: params["sortingDefinitionDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_ALLDEFINITION_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_ALLDEFINITION_TITLE);
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_ALLDEFINITION_TITLE, { enableHtml: true });
                    });
        } else {
            this._allDefinitionService.addAllDefinition(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/actnames'], {
                                queryParams: {
                                    indexAct: params["indexAct"], sortingActNameField: params["sortingActNameField"], sortingActNameDirection: params["sortingActNameDirection"], sortingDefinitionField: params["sortingDefinitionField"], sortingDefinitionDirection: params["sortingDefinitionDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_ALLDEFINITION_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_ALLDEFINITION_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_ALLDEFINITION_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    OnSubmitAllDefinition(formData: any) {
        this.isSubmited = true;

        if (this.frmAllDefinition.valid) {
            this.SaveAllDefinition(formData);
        }
    }

    CancelAllDefinition() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.router.navigate(['/admin/secure/actnames'], {
                queryParams: {
                    indexAct: params["indexAct"], sortingActNameField: params["sortingActNameField"], sortingActNameDirection: params["sortingActNameDirection"], sortingDefinitionField: params["sortingDefinitionField"], sortingDefinitionDirection: params["sortingDefinitionDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                }
            });
        });
    }
}
