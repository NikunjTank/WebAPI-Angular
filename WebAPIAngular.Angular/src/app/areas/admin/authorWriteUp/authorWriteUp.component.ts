import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//import { AuthorWriteUp, GetAuthorWriteUpRequest, GetTopicRequest, Topic } from '../../../model/authorWriteUp';
import { AuthorWriteUp, GetAuthorWriteUpRequest} from '../../../model/authorWriteUp';
import { AuthorWriteUpAdminService } from '../../../service/admin/authorWriteUp.service';
import { DropDown } from '../../../common/dropDown';
import { GetCommonFieldRequest } from '../../../model/commonField';
import { CommonFieldService } from '../../../service/common/commonField.service';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


@Component({
    selector: 'my-app',
    templateUrl: './authorWriteUp.component.html'
})

export class AuthorWriteUpAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _authorWriteUpService: AuthorWriteUpAdminService, vcr: ViewContainerRef, private spinnerService: SpinnerService, private _commonFieldService : CommonFieldService) { }

    _global: Global = new Global();

    authorWriteUp: AuthorWriteUp;
    topics: DropDown[] = [];

    authorWriteUpId: number = 0;
    searchText: string = '';
    frmAuthorWriteUp: FormGroup;
    msg: string;
    files: any;

    addUpdateText: string;

    pdfServerPath: string = Global.AUTHOR_WRITE_UP_PDF_FILEPATH;
    authorWriteUpPDFName: string;

    isSubmited: boolean = false;

    ngOnInit(): void {
        this.frmAuthorWriteUp = this.formBuilder.group({
            AuthorWriteUpId: [''],
            TopicId: ['', Validators.required],
            PDF: ['', Validators.required]
        });

        this.activatedRoute.params.subscribe((params: Params) => {
            let authorWriteUpId = this._global.decryptValue(params['authorWriteUpId']);

            if (authorWriteUpId) {
                this.addUpdateText = "Update";
                this.authorWriteUpId = parseInt(authorWriteUpId);
                this.EditAuthorWriteUp(parseInt(authorWriteUpId));
            } else {
                this.GetTopic(null);
                this.addUpdateText = "Add";
            }
        });
    }

    fileChange(event: any) {
        this.files = event.target.files;

        if (this.files[0].type == "application/pdf") {
            this.frmAuthorWriteUp.get('PDF').setValue(this.files[0].name);
            this.frmAuthorWriteUp.updateValueAndValidity();
        } else {
            this.frmAuthorWriteUp.get('PDF').setValue(null);
            this.frmAuthorWriteUp.updateValueAndValidity();
            this.toastr.error("Please upload proper pdf file.", Global.TOASTR_ADMIN_AUTHOR_WRITE_UP_TITLE, { closeButton: true });
        }
    }

    GetTopic(authorWriteUpData): void {
        this.spinnerService.show();

        //let getTopicRequest = new GetTopicRequest();
        let getCommonFieldRequest = new GetCommonFieldRequest();        
        getCommonFieldRequest.FieldTypeName = Global.COMMON_FIELD_FEMA_MODULE;        

        //this._authorWriteUpService.getTopic(getTopicRequest)
        this._commonFieldService.getCommonField(getCommonFieldRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                
                this.topics = [];

                if (data.Status == Global.API_SUCCESS) {

                    this.topics.push({ Value: "", Text: "--Select--" });

                    data.Response.forEach(item => {
                        this.topics.push({ Value: item.FieldId, Text: item.FieldName });
                    });

                    this.frmAuthorWriteUp.get("TopicId").setValue((authorWriteUpData != null) ? authorWriteUpData.TopicId : "");
                    this.frmAuthorWriteUp.updateValueAndValidity();
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_AUTHOR_WRITE_UP_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_AUTHOR_WRITE_UP_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    EditAuthorWriteUp(authorWriteUpId: number) {
        this.spinnerService.show();

        let getAuthorWriteUpRequest = new GetAuthorWriteUpRequest();
        getAuthorWriteUpRequest.AuthorWriteUpId = authorWriteUpId;
        getAuthorWriteUpRequest.IsActive = null;

        this._authorWriteUpService.getAuthorWriteUp(getAuthorWriteUpRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.authorWriteUpPDFName = data.Response[0].PDF;

                this.GetTopic(data.Response[0]);

                this.frmAuthorWriteUp.setValue({
                    AuthorWriteUpId: authorWriteUpId,
                    TopicId: data.Response[0].TopicId,
                    PDF: data.Response[0].PDF
                });

                this.frmAuthorWriteUp.updateValueAndValidity();
            }, error => this.msg = <any>error);
    }

    SaveAuthorWriteUp(formData) {
        this.spinnerService.show();
        
        if (formData.value.AuthorWriteUpId) {
            this._authorWriteUpService.updateAuthorWriteUp(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/authorwriteups'], {
                                queryParams: {
                                    indexAuthorWriteUp: params["indexAuthorWriteUp"], sortingAuthorWriteUpField: params["sortingAuthorWriteUpField"], sortingAuthorWriteUpDirection: params["sortingAuthorWriteUpDirection"], sortingAuthorWriteUpDetailField: params["sortingAuthorWriteUpDetailField"], sortingAuthorWriteUpDetailDirection: params["sortingAuthorWriteUpDetailDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_AUTHOR_WRITE_UP_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_AUTHOR_WRITE_UP_TITLE);
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_AUTHOR_WRITE_UP_TITLE, { enableHtml: true });
                    });
        } else {
            this._authorWriteUpService.addAuthorWriteUp(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/authorwriteups'], {
                                queryParams: {
                                    indexAuthorWriteUp: params["indexAuthorWriteUp"], sortingAuthorWriteUpField: params["sortingAuthorWriteUpField"], sortingAuthorWriteUpDirection: params["sortingAuthorWriteUpDirection"], sortingAuthorWriteUpDetailField: params["sortingAuthorWriteUpDetailField"], sortingAuthorWriteUpDetailDirection: params["sortingAuthorWriteUpDetailDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_AUTHOR_WRITE_UP_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_AUTHOR_WRITE_UP_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_AUTHOR_WRITE_UP_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    OnSubmitAuthorWriteUp(formData: any) {
        this.isSubmited = true;

        if (this.frmAuthorWriteUp.valid) {
            this.spinnerService.show();

            if (this.files != null && this.files.length > 0) {
                let fileFormData: FormData = new FormData();
                for (var i = 0; i < this.files.length; i++) {
                    fileFormData.append(this.files[i].name, this.files[i]);
                }

                this._authorWriteUpService.fileUpload(fileFormData)
                    .subscribe(response => {
                        if (response.Status == "Success") {
                            this.frmAuthorWriteUp.get('PDF').setValue(response.Response);
                            this.frmAuthorWriteUp.updateValueAndValidity();
                            formData.value.PDF = response.Response;
                            this.files = null;

                            this.SaveAuthorWriteUp(formData);
                        } else {
                            this.spinnerService.hide();
                            this.toastr.error(response.Description, Global.TOASTR_ADMIN_AUTHOR_WRITE_UP_TITLE, { enableHtml: true, closeButton: true });
                        }
                    },
                        error => {
                            this.spinnerService.hide();
                            this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_AUTHOR_WRITE_UP_TITLE, { enableHtml: true, closeButton: true });
                        });
            } else {
                if (formData.value.PDF) {
                    this.SaveAuthorWriteUp(formData);
                } else {
                    this.spinnerService.hide();
                }
            }
        }
    }

    CancelAuthorWriteUp() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.router.navigate(['/admin/secure/authorwriteups'], {
                queryParams: {
                    indexAuthorWriteUp: params["indexAuthorWriteUp"], sortingAuthorWriteUpField: params["sortingAuthorWriteUpField"], sortingAuthorWriteUpDirection: params["sortingAuthorWriteUpDirection"], sortingAuthorWriteUpDetailField: params["sortingAuthorWriteUpDetailField"], sortingAuthorWriteUpDetailDirection: params["sortingAuthorWriteUpDetailDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                }
            });
        });
    }
}
