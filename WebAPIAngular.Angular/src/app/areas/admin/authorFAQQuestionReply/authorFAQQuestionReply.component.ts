import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthorFAQ, GetAuthorFAQRequest } from '../../../model/authorFAQ';
import { AuthorFAQDetail, GetAuthorFAQDetailRequest } from '../../../model/authorFAQDetail';
import { AuthorFAQQuestionReply, GetAuthorFAQQuestionReplyRequest } from '../../../model/authorFAQQuestionReply';
import { AuthorFAQQuestionReplyAdminService } from '../../../service/admin/authorFAQQuestionReply.service';
import { AuthorFAQAdminService } from '../../../service/admin/authorFAQ.service';
import { AuthorFAQDetailAdminService } from '../../../service/admin/authorFAQDetail.service';

import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


@Component({
    selector: 'my-app',
    templateUrl: './authorFAQQuestionReply.component.html'
})

export class AuthorFAQQuestionReplyAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _authorFAQService: AuthorFAQAdminService, private _authorFAQDetailService: AuthorFAQDetailAdminService, private _authorFAQQuestionReplyService: AuthorFAQQuestionReplyAdminService, vcr: ViewContainerRef, private spinnerService: SpinnerService) { }

    _global: Global = new Global();

    authorFAQQuestionReply: AuthorFAQQuestionReply;

    authorFAQQuestionReplyId: number = 0;
    authorFAQDetailId: number;
    searchText: string = '';
    frmAuthorFAQQuestionReply: FormGroup;
    msg: string;

    authorFAQ: AuthorFAQ = new AuthorFAQ();
    authorFAQDetail: AuthorFAQDetail = new AuthorFAQDetail();

    addUpdateText: string;

    isSubmited: boolean = false;

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params: Params) => {
            let authorFAQQuestionReplyId = this._global.decryptValue(params['authorFAQQuestionReplyId']);
            let authorFAQDetailId = this._global.decryptValue(params['authorFAQDetailId']);
            let authorFAQId = this._global.decryptValue(params['authorFAQId']);

            if (authorFAQDetailId) {
                this.authorFAQDetailId = parseInt(authorFAQDetailId);

                this.GetAuthorFAQ(parseInt(authorFAQId));
                this.GetAuthorFAQDetail(this.authorFAQDetailId);

                if (authorFAQQuestionReplyId) {
                    this.addUpdateText = "Update";
                    this.authorFAQQuestionReplyId = parseInt(authorFAQQuestionReplyId);
                    this.EditAuthorFAQQuestionReply(parseInt(authorFAQQuestionReplyId));
                } else {
                    this.addUpdateText = "Add";
                }
            } else {
                this.router.navigate(['/admin/secure/authorfaqs'], {
                    queryParams: {
                        indexAuthorFAQ: params["indexAuthorFAQ"], indexAuthorFAQDetail: params["indexAuthorFAQDetail"], sortingAuthorFAQField: params["sortingAuthorFAQField"], sortingAuthorFAQDirection: params["sortingAuthorFAQDirection"], sortingAuthorFAQDetailField: params["sortingAuthorFAQDetailField"], sortingAuthorFAQDetailDirection: params["sortingAuthorFAQDetailDirection"], sortingAuthorFAQQuestionReplyField: params["sortingAuthorFAQQuestionReplyField"], sortingAuthorFAQQuestionReplyDirection: params["sortingAuthorFAQQuestionReplyDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                    }
                });
            }
        });

        this.frmAuthorFAQQuestionReply = this.formBuilder.group({
            AuthorFAQQuestionReplyId: [''],
            AuthorFAQDetailId: [this.authorFAQDetailId],
            Question: ['', Validators.required],
            Reply: ['', Validators.required]
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

    GetAuthorFAQDetail(authorFAQDetailId: number) {
        this.spinnerService.show();

        let getAuthorFAQDetailRequest = new GetAuthorFAQDetailRequest();
        getAuthorFAQDetailRequest.AuthorFAQDetailId = authorFAQDetailId;
        getAuthorFAQDetailRequest.IsActive = null;

        this._authorFAQDetailService.getAuthorFAQDetail(getAuthorFAQDetailRequest)
            .subscribe(data => {
                this.spinnerService.hide();
                this.authorFAQDetail = data.Response[0];
            }, error => this.msg = <any>error);
    }

    EditAuthorFAQQuestionReply(authorFAQQuestionReplyId: number) {
        this.spinnerService.show();

        let getAuthorFAQQuestionReplyRequest = new GetAuthorFAQQuestionReplyRequest();
        getAuthorFAQQuestionReplyRequest.AuthorFAQQuestionReplyId = authorFAQQuestionReplyId;
        getAuthorFAQQuestionReplyRequest.IsActive = null;

        this._authorFAQQuestionReplyService.getAuthorFAQQuestionReply(getAuthorFAQQuestionReplyRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.frmAuthorFAQQuestionReply.setValue({
                    AuthorFAQQuestionReplyId: authorFAQQuestionReplyId,
                    AuthorFAQDetailId: data.Response[0].AuthorFAQDetailId,
                    Question: data.Response[0].Question,
                    Reply: data.Response[0].Reply
                });

                this.frmAuthorFAQQuestionReply.updateValueAndValidity();
            }, error => this.msg = <any>error);
    }

    SaveAuthorFAQQuestionReply(formData) {
        this.spinnerService.show();

        if (formData.value.AuthorFAQQuestionReplyId) {
            this._authorFAQQuestionReplyService.updateAuthorFAQQuestionReply(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/authorfaqs'], {
                                queryParams: {
                                    indexAuthorFAQ: params["indexAuthorFAQ"], indexAuthorFAQDetail: params["indexAuthorFAQDetail"], sortingAuthorFAQField: params["sortingAuthorFAQField"], sortingAuthorFAQDirection: params["sortingAuthorFAQDirection"], sortingAuthorFAQDetailField: params["sortingAuthorFAQDetailField"], sortingAuthorFAQDetailDirection: params["sortingAuthorFAQDetailDirection"], sortingAuthorFAQQuestionReplyField: params["sortingAuthorFAQQuestionReplyField"], sortingAuthorFAQQuestionReplyDirection: params["sortingAuthorFAQQuestionReplyDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_AUTHOR_FAQ_QUESTION_REPLY_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_AUTHOR_FAQ_QUESTION_REPLY_TITLE);
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_AUTHOR_FAQ_QUESTION_REPLY_TITLE, { enableHtml: true });
                    });
        } else {
            this._authorFAQQuestionReplyService.addAuthorFAQQuestionReply(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/authorfaqs'], {
                                queryParams: {
                                    indexAuthorFAQ: params["indexAuthorFAQ"], indexAuthorFAQDetail: params["indexAuthorFAQDetail"], sortingAuthorFAQField: params["sortingAuthorFAQField"], sortingAuthorFAQDirection: params["sortingAuthorFAQDirection"], sortingAuthorFAQDetailField: params["sortingAuthorFAQDetailField"], sortingAuthorFAQDetailDirection: params["sortingAuthorFAQDetailDirection"], sortingAuthorFAQQuestionReplyField: params["sortingAuthorFAQQuestionReplyField"], sortingAuthorFAQQuestionReplyDirection: params["sortingAuthorFAQQuestionReplyDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_AUTHOR_FAQ_QUESTION_REPLY_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_AUTHOR_FAQ_QUESTION_REPLY_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_AUTHOR_FAQ_QUESTION_REPLY_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    OnSubmitAuthorFAQQuestionReply(formData: any) {
        this.isSubmited = true;

        formData.value.AuthorFAQId = this.authorFAQDetailId;

        if (this.frmAuthorFAQQuestionReply.valid) {
            this.SaveAuthorFAQQuestionReply(formData);
        }
    }

    CancelAuthorFAQQuestionReply() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.router.navigate(['/admin/secure/authorfaqs'], {
                queryParams: {
                    indexAuthorFAQ: params["indexAuthorFAQ"], indexAuthorFAQDetail: params["indexAuthorFAQDetail"], sortingAuthorFAQField: params["sortingAuthorFAQField"], sortingAuthorFAQDirection: params["sortingAuthorFAQDirection"], sortingAuthorFAQDetailField: params["sortingAuthorFAQDetailField"], sortingAuthorFAQDetailDirection: params["sortingAuthorFAQDetailDirection"], sortingAuthorFAQQuestionReplyField: params["sortingAuthorFAQQuestionReplyField"], sortingAuthorFAQQuestionReplyDirection: params["sortingAuthorFAQQuestionReplyDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                }
            });
        });
    }
}
