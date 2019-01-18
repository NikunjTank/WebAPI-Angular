import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthorWriteUpDetail, GetAuthorWriteUpDetailRequest, GetSubTopicRequest, SubTopic } from '../../../model/authorWriteUpDetail';
import { AuthorWriteUp, GetAuthorWriteUpRequest } from '../../../model/authorWriteUp';
import { AuthorWriteUpDetailAdminService } from '../../../service/admin/authorWriteUpDetail.service';
import { AuthorWriteUpAdminService } from '../../../service/admin/authorWriteUp.service';
import { DropDown } from '../../../common/dropDown';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


@Component({
    selector: 'my-app',
    templateUrl: './authorWriteUpDetail.component.html'
})

export class AuthorWriteUpDetailAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _authorWriteUpService: AuthorWriteUpAdminService, private _authorWriteUpDetailService: AuthorWriteUpDetailAdminService, vcr: ViewContainerRef, private spinnerService: SpinnerService) { }

    _global: Global = new Global();

    authorWriteUpDetail: AuthorWriteUpDetail;
    subTopics: DropDown[] = [];

    authorWriteUpDetailId: number = 0;
    authorWriteUpId: number;
    searchText: string = '';
    frmAuthorWriteUpDetail: FormGroup;
    msg: string;
    files: any;

    authorWriteUp: AuthorWriteUp = new AuthorWriteUp();

    addUpdateText: string;

    authorWriteUpDetailPDFServerPath: string = Global.AUTHOR_WRITE_UP_DETAIL_PDF_FILEPATH;
    authorWriteUpPDFServerPath: string = Global.AUTHOR_WRITE_UP_PDF_FILEPATH;
    authorWriteUpDetailPDFName: string;

    isSubmited: boolean = false;

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params: Params) => {
            let authorWriteUpDetailId = this._global.decryptValue(params['authorWriteUpDetailId']);
            let authorWriteUpId = this._global.decryptValue(params['authorWriteUpId']);

            if (authorWriteUpId) {
                this.authorWriteUpId = parseInt(authorWriteUpId);
                this.GetAuthorWriteUp(this.authorWriteUpId);

                if (authorWriteUpDetailId) {
                    this.addUpdateText = "Update";
                    this.authorWriteUpDetailId = parseInt(authorWriteUpDetailId);
                    this.EditAuthorWriteUpDetail(parseInt(authorWriteUpDetailId));
                } else {
                    this.GetSubTopic(null);
                    this.addUpdateText = "Add";
                }
            } else {
                this.router.navigate(['/admin/secure/authorwriteupdetails'], {
                    queryParams: {
                        indexAuthorWriteUp: params["indexAuthorWriteUp"], sortingAuthorWriteUpField: params["sortingAuthorWriteUpField"], sortingAuthorWriteUpDirection: params["sortingAuthorWriteUpDirection"], sortingAuthorWriteUpDetailField: params["sortingAuthorWriteUpDetailField"], sortingAuthorWriteUpDetailDirection: params["sortingAuthorWriteUpDetailDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                    }
                });
            }
        });

        this.frmAuthorWriteUpDetail = this.formBuilder.group({
            AuthorWriteUpDetailId: [''],
            AuthorWriteUpId: [this.authorWriteUpId],
            SubTopicId: ['', Validators.required],
            PDF: ['', Validators.required]
        });
    }

    GetAuthorWriteUp(authorWriteUpId: number) {
        this.spinnerService.show();

        let getAuthorWriteUpRequest = new GetAuthorWriteUpRequest();
        getAuthorWriteUpRequest.AuthorWriteUpId = authorWriteUpId;
        getAuthorWriteUpRequest.IsActive = null;

        this._authorWriteUpService.getAuthorWriteUp(getAuthorWriteUpRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.authorWriteUp = data.Response[0];
            }, error => this.msg = <any>error);
    }

    fileChange(event: any) {
        this.files = event.target.files;

        if (this.files[0].type == "application/pdf") {
            this.frmAuthorWriteUpDetail.get('PDF').setValue(this.files[0].name);
            this.frmAuthorWriteUpDetail.updateValueAndValidity();
        } else {
            this.frmAuthorWriteUpDetail.get('PDF').setValue(null);
            this.frmAuthorWriteUpDetail.updateValueAndValidity();
            this.toastr.error("Please upload proper pdf file.", Global.TOASTR_ADMIN_AUTHOR_WRITE_UP_DETAIL_TITLE, { closeButton: true });
        }
    }

    GetSubTopic(authorWriteUpDetailData): void {
        this.spinnerService.show();

        let getSubTopicRequest = new GetSubTopicRequest();

        this._authorWriteUpDetailService.getSubTopic(getSubTopicRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.subTopics = [];

                if (data.Status == Global.API_SUCCESS) {

                    this.subTopics.push({ Value: "", Text: "--Select--" });

                    data.Response.forEach(item => {
                        this.subTopics.push({ Value: item.SubTopicId, Text: item.SubTopicName });
                    });

                    this.frmAuthorWriteUpDetail.get("SubTopicId").setValue((authorWriteUpDetailData != null) ? authorWriteUpDetailData.SubTopicId : "");
                    this.frmAuthorWriteUpDetail.updateValueAndValidity();
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_AUTHOR_WRITE_UP_DETAIL_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_AUTHOR_WRITE_UP_DETAIL_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    EditAuthorWriteUpDetail(authorWriteUpDetailId: number) {
        this.spinnerService.show();

        let getAuthorWriteUpDetailRequest = new GetAuthorWriteUpDetailRequest();
        getAuthorWriteUpDetailRequest.AuthorWriteUpDetailId = authorWriteUpDetailId;
        getAuthorWriteUpDetailRequest.IsActive = null;

        this._authorWriteUpDetailService.getAuthorWriteUpDetail(getAuthorWriteUpDetailRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.authorWriteUpDetailPDFName = data.Response[0].PDF;

                this.GetSubTopic(data.Response[0]);

                this.frmAuthorWriteUpDetail.setValue({
                    AuthorWriteUpDetailId: authorWriteUpDetailId,
                    AuthorWriteUpId: data.Response[0].AuthorWriteUpId,
                    SubTopicId: data.Response[0].SubTopicId,
                    PDF: data.Response[0].PDF
                });

                this.frmAuthorWriteUpDetail.updateValueAndValidity();
            }, error => this.msg = <any>error);
    }

    SaveAuthorWriteUpDetail(formData) {
        this.spinnerService.show();

        if (formData.value.AuthorWriteUpDetailId) {
            this._authorWriteUpDetailService.updateAuthorWriteUpDetail(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/authorwriteups'], {
                                queryParams: {
                                    indexAuthorWriteUp: params["indexAuthorWriteUp"], sortingAuthorWriteUpField: params["sortingAuthorWriteUpField"], sortingAuthorWriteUpDirection: params["sortingAuthorWriteUpDirection"], sortingAuthorWriteUpDetailField: params["sortingAuthorWriteUpDetailField"], sortingAuthorWriteUpDetailDirection: params["sortingAuthorWriteUpDetailDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_AUTHOR_WRITE_UP_DETAIL_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_AUTHOR_WRITE_UP_DETAIL_TITLE);
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_AUTHOR_WRITE_UP_DETAIL_TITLE, { enableHtml: true });
                    });
        } else {
            this._authorWriteUpDetailService.addAuthorWriteUpDetail(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/authorwriteups'], {
                                queryParams: {
                                    indexAuthorWriteUp: params["indexAuthorWriteUp"], sortingAuthorWriteUpField: params["sortingAuthorWriteUpField"], sortingAuthorWriteUpDirection: params["sortingAuthorWriteUpDirection"], sortingAuthorWriteUpDetailField: params["sortingAuthorWriteUpDetailField"], sortingAuthorWriteUpDetailDirection: params["sortingAuthorWriteUpDetailDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_AUTHOR_WRITE_UP_DETAIL_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_AUTHOR_WRITE_UP_DETAIL_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_AUTHOR_WRITE_UP_DETAIL_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    OnSubmitAuthorWriteUpDetail(formData: any) {
        this.isSubmited = true;

        formData.value.AuthorWriteUpId = this.authorWriteUpId;

        if (this.frmAuthorWriteUpDetail.valid) {
            this.spinnerService.show();

            if (this.files != null && this.files.length > 0) {
                let fileFormData: FormData = new FormData();
                for (var i = 0; i < this.files.length; i++) {
                    fileFormData.append(this.files[i].name, this.files[i]);
                }

                this._authorWriteUpDetailService.fileUpload(fileFormData)
                    .subscribe(response => {
                        if (response.Status == "Success") {
                            this.frmAuthorWriteUpDetail.get('PDF').setValue(response.Response);
                            this.frmAuthorWriteUpDetail.updateValueAndValidity();
                            formData.value.PDF = response.Response;
                            this.files = null;

                            this.SaveAuthorWriteUpDetail(formData);
                        } else {
                            this.spinnerService.hide();
                            this.toastr.error(response.Description, Global.TOASTR_ADMIN_AUTHOR_WRITE_UP_DETAIL_TITLE, { enableHtml: true, closeButton: true });
                        }
                    },
                        error => {
                            this.spinnerService.hide();
                            this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_AUTHOR_WRITE_UP_DETAIL_TITLE, { enableHtml: true, closeButton: true });
                        });
            } else {
                if (formData.value.PDF) {
                    this.SaveAuthorWriteUpDetail(formData);
                } else {
                    this.spinnerService.hide();
                }
            }
        }
    }

    CancelAuthorWriteUpDetail() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.router.navigate(['/admin/secure/authorwriteups'], {
                queryParams: {
                    indexAuthorWriteUp: params["indexAuthorWriteUp"], sortingAuthorWriteUpField: params["sortingAuthorWriteUpField"], sortingAuthorWriteUpDirection: params["sortingAuthorWriteUpDirection"], sortingAuthorWriteUpDetailField: params["sortingAuthorWriteUpDetailField"], sortingAuthorWriteUpDetailDirection: params["sortingAuthorWriteUpDetailDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                }
            });
        });
    }
}
