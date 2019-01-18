import { Component, ComponentRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SpinnerService } from '../../../service/common/spinner.service';
import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { ModalDialogService, IModalDialogButton, IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';

import { AuthorWriteUp, GetAuthorWriteUpRequest } from '../../../model/authorWriteUp';
import { AuthorWriteUpUserService } from '../../../service/user/authorWriteUp.service';

import { AuthorWriteUpDetail, GetAuthorWriteUpDetailRequest } from '../../../model/authorWriteUpDetail';
import { AuthorWriteUpDetailUserService } from '../../../service/user/authorWriteUpDetail.service';

@Component({
    selector: 'my-app',
    templateUrl: './authorsWriteupPopup.component.html'
})

export class AuthorsWriteupPopupUserComponent {

    fEMAModuleId: number;
    authorWriteUp: AuthorWriteUp;
    authorWriteUpPDFServerPath: string = Global.AUTHOR_WRITE_UP_PDF_FILEPATH;
    authorWriteUpDetailPDFServerPath: string = Global.AUTHOR_WRITE_UP_DETAIL_PDF_FILEPATH;

    authorWriteUpDetails: AuthorWriteUpDetail[];
    subTopicPDFUrl: any;

    _global: Global = new Global();

    dialogInit(refernce: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
        this.fEMAModuleId = options.data;

        this.GetAuthorWriteUp(this.fEMAModuleId);
    }

    constructor(private _spinnerService: SpinnerService,
        private _toastrService: ToastrService,
        private _authorWriteUpUserService: AuthorWriteUpUserService,
        private _authorWriteUpDetailUserService: AuthorWriteUpDetailUserService,
        public sanitizer: DomSanitizer) { }

    GetAuthorWriteUp(fEMAModuleId: number) {
        this._spinnerService.show();

        let getAuthorWriteUpRequest = new GetAuthorWriteUpRequest();
        getAuthorWriteUpRequest.TopicId = this.fEMAModuleId;
        getAuthorWriteUpRequest.IsPagingRequired = false;

        this._authorWriteUpUserService.getAuthorWriteUp(getAuthorWriteUpRequest)
            .subscribe(data => {
                this._spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.authorWriteUp = new AuthorWriteUp();

                    if (data.Response.length > 0) {
                        this.authorWriteUp = data.Response[0];

                        let getAuthorWriteUpDetailRequest = new GetAuthorWriteUpDetailRequest();
                        getAuthorWriteUpDetailRequest.AuthorWriteUpId = this.authorWriteUp.AuthorWriteUpId;
                        getAuthorWriteUpDetailRequest.IsPagingRequired = false;
                        this.GetAuthorWriteUpDetail(getAuthorWriteUpDetailRequest);
                    }
                }
                else {
                    this._toastrService.error(data.Description, Global.TOASTR_ADMIN_AUTHOR_WRITE_UP_TITLE, { closeButton: true });
                }

            },
                error => {
                    this._spinnerService.hide();
                    this._toastrService.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_AUTHOR_WRITE_UP_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    GetAuthorWriteUpDetail(getAuthorWriteUpDetailRequest: GetAuthorWriteUpDetailRequest) {
        this._spinnerService.show();

        this._authorWriteUpDetailUserService.getAuthorWriteUpDetail(getAuthorWriteUpDetailRequest)
            .subscribe(data => {
                this._spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.authorWriteUpDetails = data.Response;

                    if (this.authorWriteUpDetails.length > 0) {
                        this.GetSelectedSubTopicId(this.authorWriteUpDetails[0].SubTopicId);
                    }
                }
                else {
                    this._toastrService.error(data.Description, Global.TOASTR_ADMIN_AUTHOR_WRITE_UP_DETAIL_TITLE, { closeButton: true });
                }
            },
                error => {
                    this._spinnerService.hide();
                    this._toastrService.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_AUTHOR_WRITE_UP_DETAIL_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    GetSelectedSubTopicId(subTopicId: number) {
        let authorWriteUpDetail = this.authorWriteUpDetails.filter(el => el.SubTopicId == subTopicId)[0];

        this.subTopicPDFUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this._global.getPDFPath(this.authorWriteUpDetailPDFServerPath + authorWriteUpDetail.PDF));

        let interval = setInterval(function () {
            let minusHeight = (document.querySelector('body').clientWidth > 480) ? 115 : 80;

            document.getElementById("iframe").style.height = (document.querySelector('.modal-body').clientHeight - minusHeight) + "px";
            clearInterval(interval);
        }, 100);
    }
}