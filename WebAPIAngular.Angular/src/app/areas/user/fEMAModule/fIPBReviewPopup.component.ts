import { Component, ComponentRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SpinnerService } from '../../../service/common/spinner.service';
import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { ModalDialogService, IModalDialogButton, IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { DropDown } from '../../../common/dropDown';

import { FIPBReview, GetFIPBReviewRequest } from '../../../model/fIPBReview';
import { Manual, GetManualRequest } from '../../../model/manual';
import { DIPPClarification, GetDIPPClarificationRequest } from '../../../model/dIPPClarification';
import { FIPBPressReleaseCase, GetFIPBPressReleaseCaseRequest } from '../../../model/fIPBPressReleaseCase';

import { FIPBReviewUserService } from '../../../service/user/fIPBReview.service';
import { DIPPClarificationUserService } from '../../../service/user/dIPPClarification.service';
import { FIPBPressReleaseCaseUserService } from '../../../service/user/fIPBPressReleaseCase.service';

@Component({
    selector: 'my-app',
    templateUrl: './fIPBReviewPopup.component.html'
})

export class FIPBReviewPopupUserComponent {

    fIPBReviews: FIPBReview[] = [];
    dIPPClarifications: DIPPClarification[] = [];
    fIPBPressReleaseCases: FIPBPressReleaseCase[] = [];

    fIPBReviewPDFServerPath: string = Global.FIPBREVIEW_PDF_FILEPATH;
    dIPPClarificationPDFServerPath: string = Global.DIPPCLARIFICATION_PDF_FILEPATH;
    fIPBPressReleaseCasePDFServerPath: string = Global.FIPB_PRESS_RELEASE_CASE_PDF_FILEPATH;

    moduleTab: string;

    dialogInit(refernce: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
        this.OnClickModuleTab('fipbReview');
    }

    _global: Global = new Global();

    fIPBReviewPDFUrl: any;
    dIPPClarificationPDFUrl: any;
    fIPBPressReleaseCasePDFUrl: any;

    constructor(
        private formBuilder: FormBuilder,
        private _spinnerService: SpinnerService,
        private _toastrService: ToastrService,
        private _fIPBReviewService: FIPBReviewUserService,
        private _dIPPClarificationService: DIPPClarificationUserService,
        private _fIPBPressReleaseCaseService: FIPBPressReleaseCaseUserService,
        public sanitizer: DomSanitizer) { }

    GetFIPBReview() {
        this._spinnerService.show();

        let getFIPBReviewRequest = new GetFIPBReviewRequest();

        this._fIPBReviewService.getFIPBReview(getFIPBReviewRequest)
            .subscribe(data => {
                this._spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.fIPBReviews = data.Response;
                    if (this.fIPBReviews.length > 0)
                        this.OnChangeFIPBReview(data.Response[0].FIPBReviewId);
                }
                else {
                    this._toastrService.error(data.Description, Global.TOASTR_ADMIN_FIPBREVIEW_TITLE, { closeButton: true });
                }
            },
                error => {
                    this._spinnerService.hide();
                    this._toastrService.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FIPBREVIEW_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    OnChangeFIPBReview(fIPBReviewId) {
        let fIPBReviewDetail = this.fIPBReviews.filter(el => el.FIPBReviewId == fIPBReviewId)[0];
        this.fIPBReviewPDFUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this._global.getPDFPath(this.fIPBReviewPDFServerPath + fIPBReviewDetail.PDF));
        
        let interval = setInterval(function () {
            let minusHeight = (document.querySelector('body').clientWidth > 766) ? 170 : (document.querySelector('body').clientWidth > 480) ? 255 : 220;

            document.getElementById("iframe1").style.height = (document.querySelector('.modal-body').clientHeight - minusHeight) + "px";
            clearInterval(interval);
        }, 100);
    }

    GetDIPPClarification() {
        this._spinnerService.show();

        let getDIPPClarificationRequest = new GetDIPPClarificationRequest();

        this._dIPPClarificationService.getDIPPClarification(getDIPPClarificationRequest)
            .subscribe(data => {
                this._spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.dIPPClarifications = data.Response;
                    if (this.dIPPClarifications.length > 0)
                        this.OnChangeDIPPClarification(data.Response[0].DIPPClarificationId);
                }
                else {
                    this._toastrService.error(data.Description, Global.TOASTR_ADMIN_DIPPCLARIFICATION_TITLE, { closeButton: true });
                }
            },
                error => {
                    this._spinnerService.hide();
                    this._toastrService.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_DIPPCLARIFICATION_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    OnChangeDIPPClarification(dIPPClarificationId) {
        let dIPPClarificationDetail = this.dIPPClarifications.filter(el => el.DIPPClarificationId == dIPPClarificationId)[0];
        this.dIPPClarificationPDFUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this._global.getPDFPath(this.dIPPClarificationPDFServerPath + dIPPClarificationDetail.PDF));
        
        let interval = setInterval(function () {
            let minusHeight = (document.querySelector('body').clientWidth > 766) ? 170 : (document.querySelector('body').clientWidth > 480) ? 255 : 220;

            document.getElementById("iframe2").style.height = (document.querySelector('.modal-body').clientHeight - minusHeight) + "px";
            clearInterval(interval);
        }, 100);
    }

    GetFIPBPressReleaseCase() {
        this._spinnerService.show();

        let getFIPBPressReleaseCaseRequest = new GetFIPBPressReleaseCaseRequest();

        this._fIPBPressReleaseCaseService.getFIPBPressReleaseCase(getFIPBPressReleaseCaseRequest)
            .subscribe(data => {
                this._spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.fIPBPressReleaseCases = data.Response;
                    if (this.fIPBPressReleaseCases.length > 0)
                        this.OnChangeFIPBPressReleaseCase(data.Response[0].FIPBPressReleaseCaseId);
                }
                else {
                    this._toastrService.error(data.Description, Global.TOASTR_ADMIN_FIPB_PRESS_RELEASE_CASE_TITLE, { closeButton: true });
                }
            },
                error => {
                    this._spinnerService.hide();
                    this._toastrService.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FIPB_PRESS_RELEASE_CASE_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    OnChangeFIPBPressReleaseCase(fIPBPressReleaseCaseId) {
        let fIPBPressReleaseCaseDetail = this.fIPBPressReleaseCases.filter(el => el.FIPBPressReleaseCaseId == fIPBPressReleaseCaseId)[0];
        this.fIPBPressReleaseCasePDFUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this._global.getPDFPath(this.fIPBPressReleaseCasePDFServerPath + fIPBPressReleaseCaseDetail.PDF));

        let interval = setInterval(function () {
            let minusHeight = (document.querySelector('body').clientWidth > 766) ? 170 : (document.querySelector('body').clientWidth > 480) ? 255 : 220;

            document.getElementById("iframe3").style.height = (document.querySelector('.modal-body').clientHeight - minusHeight) + "px";
            clearInterval(interval);
        }, 100);
    }

    OnClickModuleTab(moduleTab) {
        this.moduleTab = moduleTab;

        if (moduleTab == "fipbReview") {
            this.GetFIPBReview();
        } else if (moduleTab == "clarifications") {
            this.GetDIPPClarification();
        } else if (moduleTab == "fipbPressReleaseCase") {
            this.GetFIPBPressReleaseCase();
        }
    }

}