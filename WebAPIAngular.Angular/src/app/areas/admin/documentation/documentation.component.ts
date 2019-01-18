import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormSummaryDocumentation, GetFormSummaryDocumentationRequest } from '../../../model/formSummaryDocumentation';
import { FormSummaryDocumentationAdminService } from '../../../service/admin/formSummaryDocumentation.service';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


@Component({
    selector: 'my-app',
    templateUrl: './documentation.component.html'
})

export class DocumentationAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _formSummaryDocumentationService: FormSummaryDocumentationAdminService, vcr: ViewContainerRef, private spinnerService: SpinnerService) { }

    _global: Global = new Global();

    formSummaryDocumentation: FormSummaryDocumentation;
    formSummaryDocumentationId: number = 0;
    searchText: string = '';
    frmDocumentation: FormGroup;
    msg: string;

    addUpdateText: string;

    isSubmited: boolean = false;

    ngOnInit(): void {
        this.frmDocumentation = this.formBuilder.group({
            FormSummaryDocumentationId: [''],
            TopicName: ['', Validators.required],
            SubMenuName: [Global.DOCUMENTATION_TYPE]
        });

        this.activatedRoute.params.subscribe((params: Params) => {
            let formSummaryDocumentationId = this._global.decryptValue(params['formSummaryDocumentationId']);

            if (formSummaryDocumentationId) {
                this.addUpdateText = "Update";
                this.formSummaryDocumentationId = parseInt(formSummaryDocumentationId);
                this.EditFormSummaryDocumentation(parseInt(formSummaryDocumentationId));
            } else {
                this.addUpdateText = "Add";
            }
        });
    }

    EditFormSummaryDocumentation(formSummaryDocumentationId: number) {
        this.spinnerService.show();

        let getFormSummaryDocumentationRequest = new GetFormSummaryDocumentationRequest();
        getFormSummaryDocumentationRequest.FormSummaryDocumentationId = formSummaryDocumentationId;
        getFormSummaryDocumentationRequest.SubMenuName = Global.DOCUMENTATION_TYPE;
        getFormSummaryDocumentationRequest.IsActive = null;

        this._formSummaryDocumentationService.getFormSummaryDocumentation(getFormSummaryDocumentationRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.frmDocumentation.setValue({
                    FormSummaryDocumentationId: formSummaryDocumentationId,
                    TopicName: data.Response[0].TopicName,
                    SubMenuName: Global.DOCUMENTATION_TYPE
                });

                this.frmDocumentation.updateValueAndValidity();
            }, error => this.msg = <any>error);
    }

    SaveDocumentation(formData) {
        this.spinnerService.show();

        if (formData.value.FormSummaryDocumentationId) {
            this._formSummaryDocumentationService.updateFormSummaryDocumentation(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/documentations'], {
                                queryParams: {
                                    indexDocumentation: params["indexDocumentation"], sortingDocumentationField: params["sortingDocumentationField"], sortingDocumentationDirection: params["sortingDocumentationDirection"], sortingDocumentationDetailField: params["sortingDocumentationDetailField"], sortingDocumentationDetailDirection: params["sortingDocumentationDetailDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_DOCUMENTATION_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_DOCUMENTATION_TITLE);
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_DOCUMENTATION_TITLE, { enableHtml: true });
                    });
        } else {
            this._formSummaryDocumentationService.addFormSummaryDocumentation(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/documentations'], {
                                queryParams: {
                                    indexDocumentation: params["indexDocumentation"], sortingDocumentationField: params["sortingDocumentationField"], sortingDocumentationDirection: params["sortingDocumentationDirection"], sortingDocumentationDetailField: params["sortingDocumentationDetailField"], sortingDocumentationDetailDirection: params["sortingDocumentationDetailDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_DOCUMENTATION_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_DOCUMENTATION_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_DOCUMENTATION_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    OnSubmitDocumentation(formData: any) {
        this.isSubmited = true;

        if (this.frmDocumentation.valid) {
            this.SaveDocumentation(formData);
        }
    }

    CancelDocumentation() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.router.navigate(['/admin/secure/documentations'], {
                queryParams: {
                    indexDocumentation: params["indexDocumentation"], sortingDocumentationField: params["sortingDocumentationField"], sortingDocumentationDirection: params["sortingDocumentationDirection"], sortingDocumentationDetailField: params["sortingDocumentationDetailField"], sortingDocumentationDetailDirection: params["sortingDocumentationDetailDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                }
            })
        });
    }
}
