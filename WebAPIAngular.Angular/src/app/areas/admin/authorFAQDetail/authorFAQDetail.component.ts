import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthorFAQ, GetAuthorFAQRequest } from '../../../model/authorFAQ';
import { AuthorFAQDetail, GetAuthorFAQDetailRequest, GetSubTopicRequest, SubTopic } from '../../../model/authorFAQDetail';
import { AuthorFAQDetailAdminService } from '../../../service/admin/authorFAQDetail.service';
import { AuthorFAQAdminService } from '../../../service/admin/authorFAQ.service';
import { DropDown } from '../../../common/dropDown';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


@Component({
    selector: 'my-app',
    templateUrl: './authorFAQDetail.component.html'
})

export class AuthorFAQDetailAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _authorFAQService: AuthorFAQAdminService, private _authorFAQDetailService: AuthorFAQDetailAdminService, vcr: ViewContainerRef, private spinnerService: SpinnerService) { }

    _global: Global = new Global();

    authorFAQDetail: AuthorFAQDetail;
    subTopics: DropDown[] = [];

    authorFAQDetailId: number = 0;
    authorFAQId: number;
    searchText: string = '';
    frmAuthorFAQDetail: FormGroup;
    msg: string;

    authorFAQ: AuthorFAQ = new AuthorFAQ();

    addUpdateText: string;

    isSubmited: boolean = false;

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params: Params) => {
            let authorFAQDetailId = this._global.decryptValue(params['authorFAQDetailId']);
            let authorFAQId = this._global.decryptValue(params['authorFAQId']);

            if (authorFAQId) {
                this.authorFAQId = parseInt(authorFAQId);
                this.GetAuthorFAQ(this.authorFAQId);

                if (authorFAQDetailId) {
                    this.addUpdateText = "Update";
                    this.authorFAQDetailId = parseInt(authorFAQDetailId);
                    this.EditAuthorFAQDetail(parseInt(authorFAQDetailId));
                } else {
                    this.GetSubTopic(null);
                    this.addUpdateText = "Add";
                }
            } else {
                this.router.navigate(['/admin/secure/authorfaqdetails'], {
                    queryParams: {
                        indexAuthorFAQ: params["indexAuthorFAQ"], indexAuthorFAQDetail: params["indexAuthorFAQDetail"], sortingAuthorFAQField: params["sortingAuthorFAQField"], sortingAuthorFAQDirection: params["sortingAuthorFAQDirection"], sortingAuthorFAQDetailField: params["sortingAuthorFAQDetailField"], sortingAuthorFAQDetailDirection: params["sortingAuthorFAQDetailDirection"], sortingAuthorFAQQuestionReplyField: params["sortingAuthorFAQQuestionReplyField"], sortingAuthorFAQQuestionReplyDirection: params["sortingAuthorFAQQuestionReplyDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                    }
                });
            }
        });

        this.frmAuthorFAQDetail = this.formBuilder.group({
            AuthorFAQDetailId: [''],
            AuthorFAQId: [this.authorFAQId],
            SubTopicId: ['', Validators.required]
        });
    }

    GetAuthorFAQ(authorFAQId: number) {
        this.spinnerService.show();

        let getAuthorFAQRequest = new GetAuthorFAQRequest();
        getAuthorFAQRequest.AuthorFAQId = authorFAQId;
        getAuthorFAQRequest.IsActive = null;

        this._authorFAQService.getAuthorFAQ(getAuthorFAQRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.authorFAQ = data.Response[0];
            }, error => this.msg = <any>error);
    }

    GetSubTopic(authorFAQDetailData): void {
        this.spinnerService.show();

        let getSubTopicRequest = new GetSubTopicRequest();

        this._authorFAQDetailService.getSubTopic(getSubTopicRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.subTopics = [];

                if (data.Status == Global.API_SUCCESS) {

                    this.subTopics.push({ Value: "", Text: "--Select--" });

                    data.Response.forEach(item => {
                        this.subTopics.push({ Value: item.SubTopicId, Text: item.SubTopicName });
                    });

                    this.frmAuthorFAQDetail.get("SubTopicId").setValue((authorFAQDetailData != null) ? authorFAQDetailData.SubTopicId : "");
                    this.frmAuthorFAQDetail.updateValueAndValidity();
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_AUTHOR_FAQ_DETAIL_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_AUTHOR_FAQ_DETAIL_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    EditAuthorFAQDetail(authorFAQDetailId: number) {
        this.spinnerService.show();

        let getAuthorFAQDetailRequest = new GetAuthorFAQDetailRequest();
        getAuthorFAQDetailRequest.AuthorFAQDetailId = authorFAQDetailId;
        getAuthorFAQDetailRequest.IsActive = null;

        this._authorFAQDetailService.getAuthorFAQDetail(getAuthorFAQDetailRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.GetSubTopic(data.Response[0]);

                this.frmAuthorFAQDetail.setValue({
                    AuthorFAQDetailId: authorFAQDetailId,
                    AuthorFAQId: data.Response[0].AuthorFAQId,
                    SubTopicId: data.Response[0].SubTopicId,
                });

                this.frmAuthorFAQDetail.updateValueAndValidity();
            }, error => this.msg = <any>error);
    }

    SaveAuthorFAQDetail(formData) {
        this.spinnerService.show();

        if (formData.value.AuthorFAQDetailId) {
            this._authorFAQDetailService.updateAuthorFAQDetail(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/authorfaqs'], {
                                queryParams: {
                                    indexAuthorFAQ: params["indexAuthorFAQ"], indexAuthorFAQDetail: params["indexAuthorFAQDetail"], sortingAuthorFAQField: params["sortingAuthorFAQField"], sortingAuthorFAQDirection: params["sortingAuthorFAQDirection"], sortingAuthorFAQDetailField: params["sortingAuthorFAQDetailField"], sortingAuthorFAQDetailDirection: params["sortingAuthorFAQDetailDirection"], sortingAuthorFAQQuestionReplyField: params["sortingAuthorFAQQuestionReplyField"], sortingAuthorFAQQuestionReplyDirection: params["sortingAuthorFAQQuestionReplyDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_AUTHOR_FAQ_DETAIL_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_AUTHOR_FAQ_DETAIL_TITLE);
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_AUTHOR_FAQ_DETAIL_TITLE, { enableHtml: true });
                    });
        } else {
            this._authorFAQDetailService.addAuthorFAQDetail(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/authorfaqs'], {
                                queryParams: {
                                    indexAuthorFAQ: params["indexAuthorFAQ"], indexAuthorFAQDetail: params["indexAuthorFAQDetail"], sortingAuthorFAQField: params["sortingAuthorFAQField"], sortingAuthorFAQDirection: params["sortingAuthorFAQDirection"], sortingAuthorFAQDetailField: params["sortingAuthorFAQDetailField"], sortingAuthorFAQDetailDirection: params["sortingAuthorFAQDetailDirection"], sortingAuthorFAQQuestionReplyField: params["sortingAuthorFAQQuestionReplyField"], sortingAuthorFAQQuestionReplyDirection: params["sortingAuthorFAQQuestionReplyDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_AUTHOR_FAQ_DETAIL_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_AUTHOR_FAQ_DETAIL_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_AUTHOR_FAQ_DETAIL_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    OnSubmitAuthorFAQDetail(formData: any) {
        this.isSubmited = true;

        formData.value.AuthorFAQId = this.authorFAQId;

        if (this.frmAuthorFAQDetail.valid) {
            this.SaveAuthorFAQDetail(formData);
        }
    }

    CancelAuthorFAQDetail() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.router.navigate(['/admin/secure/authorfaqs'], {
                queryParams: {
                    indexAuthorFAQ: params["indexAuthorFAQ"], indexAuthorFAQDetail: params["indexAuthorFAQDetail"], sortingAuthorFAQField: params["sortingAuthorFAQField"], sortingAuthorFAQDirection: params["sortingAuthorFAQDirection"], sortingAuthorFAQDetailField: params["sortingAuthorFAQDetailField"], sortingAuthorFAQDetailDirection: params["sortingAuthorFAQDetailDirection"], sortingAuthorFAQQuestionReplyField: params["sortingAuthorFAQQuestionReplyField"], sortingAuthorFAQQuestionReplyDirection: params["sortingAuthorFAQQuestionReplyDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                }
            });
        });
    }
}
