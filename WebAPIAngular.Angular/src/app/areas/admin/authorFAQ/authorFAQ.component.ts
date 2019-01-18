import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthorFAQ, GetAuthorFAQRequest} from '../../../model/authorFAQ';
import { AuthorFAQAdminService } from '../../../service/admin/authorFAQ.service';
import { DropDown } from '../../../common/dropDown';
import { GetCommonFieldRequest } from '../../../model/commonField';
import { CommonFieldService } from '../../../service/common/commonField.service';


import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { SpinnerService } from '../../../service/common/spinner.service';


@Component({
    selector: 'my-app',
    templateUrl: './authorFAQ.component.html'
})

export class AuthorFAQAdminComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private _authorFAQService: AuthorFAQAdminService, vcr: ViewContainerRef, private spinnerService: SpinnerService, private _commonFieldService: CommonFieldService) { }

    _global: Global = new Global();

    authorFAQ: AuthorFAQ;
    topics: DropDown[] = [];

    authorFAQId: number = 0;
    searchText: string = '';
    frmAuthorFAQ: FormGroup;
    msg: string;

    addUpdateText: string;

    isSubmited: boolean = false;

    ngOnInit(): void {
        this.frmAuthorFAQ = this.formBuilder.group({
            AuthorFAQId: [''],
            TopicId: ['', Validators.required]
        });

        this.activatedRoute.params.subscribe((params: Params) => {
            let authorFAQId = this._global.decryptValue(params['authorFAQId']);

            if (authorFAQId) {
                this.addUpdateText = "Update";
                this.authorFAQId = parseInt(authorFAQId);
                this.EditAuthorFAQ(parseInt(authorFAQId));
            } else {
                this.GetTopic(null);
                this.addUpdateText = "Add";
            }
        });
    }

    GetTopic(authorFAQData): void {
        this.spinnerService.show();

        //let getTopicRequest = new GetTopicRequest();
        let getCommonFieldRequest = new GetCommonFieldRequest();
        getCommonFieldRequest.FieldTypeName = Global.COMMON_FIELD_FEMA_MODULE;

        //this._authorFAQService.getTopic(getTopicRequest)
        this._commonFieldService.getCommonField(getCommonFieldRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.topics = [];

                if (data.Status == Global.API_SUCCESS) {

                    this.topics.push({ Value: "", Text: "--Select--" });

                    data.Response.forEach(item => {
                        this.topics.push({ Value: item.FieldId, Text: item.FieldName });
                    });

                    this.frmAuthorFAQ.get("TopicId").setValue((authorFAQData != null) ? authorFAQData.TopicId : "");
                    this.frmAuthorFAQ.updateValueAndValidity();
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_AUTHOR_FAQ_TITLE, { closeButton: true });
                }
            }, error => {
                this.spinnerService.hide();
                this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_AUTHOR_FAQ_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    EditAuthorFAQ(authorFAQId: number) {
        this.spinnerService.show();

        let getAuthorFAQRequest = new GetAuthorFAQRequest();
        getAuthorFAQRequest.AuthorFAQId = authorFAQId;
        getAuthorFAQRequest.IsActive = null;

        this._authorFAQService.getAuthorFAQ(getAuthorFAQRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                this.GetTopic(data.Response[0]);

                this.frmAuthorFAQ.setValue({
                    AuthorFAQId: authorFAQId,
                    TopicId: data.Response[0].TopicId
                });

                this.frmAuthorFAQ.updateValueAndValidity();
            }, error => this.msg = <any>error);
    }

    SaveAuthorFAQ(formData) {
        this.spinnerService.show();

        if (formData.value.AuthorFAQId) {
            this._authorFAQService.updateAuthorFAQ(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/authorfaqs'], {
                                queryParams: {
                                    indexAuthorFAQ: params["indexAuthorFAQ"], indexAuthorFAQDetail: params["indexAuthorFAQDetail"], sortingAuthorFAQField: params["sortingAuthorFAQField"], sortingAuthorFAQDirection: params["sortingAuthorFAQDirection"], sortingAuthorFAQDetailField: params["sortingAuthorFAQDetailField"], sortingAuthorFAQDetailDirection: params["sortingAuthorFAQDetailDirection"], sortingAuthorFAQQuestionReplyField: params["sortingAuthorFAQQuestionReplyField"], sortingAuthorFAQQuestionReplyDirection: params["sortingAuthorFAQQuestionReplyDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_AUTHOR_FAQ_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_AUTHOR_FAQ_TITLE);
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_AUTHOR_FAQ_TITLE, { enableHtml: true });
                    });
        } else {
            this._authorFAQService.addAuthorFAQ(formData.value)
                .subscribe(data => {
                    this.spinnerService.hide();

                    if (data.Status == Global.API_SUCCESS) {
                        this.activatedRoute.queryParams.subscribe(params => {
                            this.router.navigate(['/admin/secure/authorfaqs'], {
                                queryParams: {
                                    indexAuthorFAQ: params["indexAuthorFAQ"], indexAuthorFAQDetail: params["indexAuthorFAQDetail"], sortingAuthorFAQField: params["sortingAuthorFAQField"], sortingAuthorFAQDirection: params["sortingAuthorFAQDirection"], sortingAuthorFAQDetailField: params["sortingAuthorFAQDetailField"], sortingAuthorFAQDetailDirection: params["sortingAuthorFAQDetailDirection"], sortingAuthorFAQQuestionReplyField: params["sortingAuthorFAQQuestionReplyField"], sortingAuthorFAQQuestionReplyDirection: params["sortingAuthorFAQQuestionReplyDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                                }
                            }).then(() => {
                                this.toastr.success(data.Description, Global.TOASTR_ADMIN_AUTHOR_FAQ_TITLE, { closeButton: true });
                            });
                        });
                    } else {
                        this.toastr.error(data.Description, Global.TOASTR_ADMIN_AUTHOR_FAQ_TITLE, { closeButton: true });
                    }
                },
                    error => {
                        this.spinnerService.hide();
                        this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_AUTHOR_FAQ_TITLE, { enableHtml: true, closeButton: true });
                    });
        }
    }

    OnSubmitAuthorFAQ(formData: any) {
        this.isSubmited = true;

        if (this.frmAuthorFAQ.valid) {
            this.SaveAuthorFAQ(formData);
        }
    }

    CancelAuthorFAQ() {
        this.activatedRoute.queryParams.subscribe(params => {
            this.router.navigate(['/admin/secure/authorfaqs'], {
                queryParams: {
                    indexAuthorFAQ: params["indexAuthorFAQ"], indexAuthorFAQDetail: params["indexAuthorFAQDetail"], sortingAuthorFAQField: params["sortingAuthorFAQField"], sortingAuthorFAQDirection: params["sortingAuthorFAQDirection"], sortingAuthorFAQDetailField: params["sortingAuthorFAQDetailField"], sortingAuthorFAQDetailDirection: params["sortingAuthorFAQDetailDirection"], sortingAuthorFAQQuestionReplyField: params["sortingAuthorFAQQuestionReplyField"], sortingAuthorFAQQuestionReplyDirection: params["sortingAuthorFAQQuestionReplyDirection"], searchText: params["searchText"], pageNumber: params["pageNumber"], pageSize: params["pageSize"]
                }
            });
        });
    }
}
