import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActName, GetActNameRequest } from '../../../model/actName';
import { ActNameAdminService } from '../../../service/admin/actName.service';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


@Component({
    selector: 'my-app',
    templateUrl: './actName.component.html'
})

export class ActNameAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _actNameService: ActNameAdminService, vcr: ViewContainerRef, private spinnerService: SpinnerService) { }

    _global: Global = new Global();

    actName: ActName;
    actId: number = 0;
    searchText: string = '';
    frmAct: FormGroup;
    msg: string;
    files: any;

    addUpdateText: string;

    pdfServerPath: string = Global.ACT_PDF_FILEPATH;
    actPDFName: string;

    isSubmited: boolean = false;

    ngOnInit(): void {
        this.frmAct = this.formBuilder.group({
            ActId: [''],
            LongTitle: ['', Validators.required],
            ActPDF: ['', Validators.required]
        });

        this.activatedRoute.params.subscribe((params: Params) => {
            let actId = this._global.decryptValue(params['actId']);

            if (actId) {
                this.addUpdateText = "Update";
                this.actId = parseInt(actId);
                this.EditAct(parseInt(actId));
            } else {
                this.addUpdateText = "Add";
            }
        });
    }

    fileChange(event: any) {
        this.files = event.target.files;

        if (this.files[0].type == "application/pdf") {
            this.frmAct.get('ActPDF').setValue(this.files[0].name);
            this.frmAct.updateValueAndValidity();
        } else {
            this.frmAct.get('ActPDF').setValue(null);
            this.frmAct.updateValueAndValidity();
            this.toastr.error("Please upload proper pdf file.", Global.TOASTR_ADMIN_ACTNAME_TITLE, { closeButton: true });
        }
    }

    EditAct(actId: number) {
        this.spinnerService.show();

        let getActNameRequest = new GetActNameRequest();
        getActNameRequest.ActId = actId;
        getActNameRequest.IsActive = null;

        this._actNameService.getActName(getActNameRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.actPDFName = data.Response[0].ActPDF;

                this.frmAct.setValue({
                    ActId: actId,
                    LongTitle: data.Response[0].LongTitle,
                    ActPDF: data.Response[0].ActPDF
                });

                this.frmAct.updateValueAndValidity();
            }, error => this.msg = <any>error);
    }

    SaveAct(formData) {
        this.spinnerService.show();
        
        if (formData.value.ActId) {
            this._actNameService.updateActName(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/actnames'], {
                                queryParams: {
                                    indexAct: params["indexAct"], sortingActNameField: params["sortingActNameField"], sortingActNameDirection: params["sortingActNameDirection"], sortingDefinitionField: params["sortingDefinitionField"], sortingDefinitionDirection: params["sortingDefinitionDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_ACTNAME_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_ACTNAME_TITLE);
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_ACTNAME_TITLE, { enableHtml: true });
                    });
        } else {
            this._actNameService.addActName(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/actnames'], {
                                queryParams: {
                                    indexAct: params["indexAct"], sortingActNameField: params["sortingActNameField"], sortingActNameDirection: params["sortingActNameDirection"], sortingDefinitionField: params["sortingDefinitionField"], sortingDefinitionDirection: params["sortingDefinitionDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_ACTNAME_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_ACTNAME_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_ACTNAME_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    OnSubmitAct(formData: any) {
        this.isSubmited = true;

        if (this.frmAct.valid) {
            this.spinnerService.show();

            if (this.files != null && this.files.length > 0) {
                let fileFormData: FormData = new FormData();
                for (var i = 0; i < this.files.length; i++) {
                    fileFormData.append(this.files[i].name, this.files[i]);
                }

                this._actNameService.fileUpload(fileFormData)
                    .subscribe(response => {
                        if (response.Status == "Success") {
                            this.frmAct.get('ActPDF').setValue(response.Response);
                            this.frmAct.updateValueAndValidity();
                            formData.value.ActPDF = response.Response;
                            this.files = null;

                            this.SaveAct(formData);
                        } else {
                            this.spinnerService.hide();
                            this.toastr.error(response.Description, Global.TOASTR_ADMIN_ACTNAME_TITLE, { enableHtml: true, closeButton: true });
                        }
                    },
                        error => {
                            this.spinnerService.hide();
                            this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_ACTNAME_TITLE, { enableHtml: true, closeButton: true });
                        });
            } else {
                if (formData.value.ActPDF) {
                    this.SaveAct(formData);
                } else {
                    this.spinnerService.hide();
                }
            }
        }
    }

    CancelAct() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.router.navigate(['/admin/secure/actnames'], {
                queryParams: {
                    indexAct: params["indexAct"], sortingActNameField: params["sortingActNameField"], sortingActNameDirection: params["sortingActNameDirection"], sortingDefinitionField: params["sortingDefinitionField"], sortingDefinitionDirection: params["sortingDefinitionDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                }
            });
        });
    }
}
