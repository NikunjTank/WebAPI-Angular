import { Component, ComponentRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SpinnerService } from '../../../service/common/spinner.service';
import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { ModalDialogService, IModalDialogButton, IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { DropDown } from '../../../common/dropDown';

import { FAQ, GetFAQRequest } from '../../../model/fAQ';
import { RBIFAQOfFEMASubModuleDetail,GetRBIFAQOfFEMASubModuleDetailRequest } from '../../../model/rBIFAQOfFEMASubModuleDetail';

import { FAQUserService } from '../../../service/user/fAQ.service';
import { RBIFAQOfFEMASubModuleDetailUserService } from '../../../service/user/rBIFAQOfFEMASubModuleDetail.service';

@Component({
    selector: 'my-app',
    templateUrl: './rBIDIPPFAQPopup.component.html'
})

export class RBIDIPPFAQPopupUserComponent {

    fEMAModuleId: number;
    rBIFAQ: RBIFAQOfFEMASubModuleDetail[] = [];
    dIPPFAQ: FAQ[] = [];

    fAQPDFServerPath: string = Global.FAQ_PDF_FILEPATH;

    rBIFAQPDFUrl: any;
    dIPPFAQPDFUrl: any;

    moduleTab: string = 'rbifaq';

    dialogInit(refernce: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
        this.fEMAModuleId = options.data;

        this.GetRBIFAQ(this.fEMAModuleId);
    }

    constructor(
        private formBuilder: FormBuilder,
        private _spinnerService: SpinnerService,
        private _toastrService: ToastrService,
        private _fAQUserService: FAQUserService,  
        private _rBIFAQOfFEMASubModuleDetailUserService: RBIFAQOfFEMASubModuleDetailUserService,      
        public _sanitizer: DomSanitizer) { }

    OnClickModuleTab(moduleTab) {
        this.moduleTab = moduleTab;

        if (moduleTab == "rbifaq") {
            this.GetRBIFAQ(this.fEMAModuleId);
        }
        else if (moduleTab == "dippfaq") {
            this.GetFAQ();
        }
    }

    GetRBIFAQ(fEMAModuleId: number) {
        this._spinnerService.show();

        let getRBIFAQOfFEMASubModuleDetailRequest = new GetRBIFAQOfFEMASubModuleDetailRequest();
        getRBIFAQOfFEMASubModuleDetailRequest.FEMASubModuleOfModuleId = fEMAModuleId;

        this._rBIFAQOfFEMASubModuleDetailUserService.getRBIFAQOfFEMASubModuleDetail(getRBIFAQOfFEMASubModuleDetailRequest)
            .subscribe(data => {
                this._spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.rBIFAQ = data.Response;

                    if (this.rBIFAQ.length > 0)
                        this.OnChangeRBIFAQ(this.rBIFAQ[0].FAQId);
                } else {
                    this._toastrService.error(data.Description, Global.TOASTR_ADMIN_FAQ_TITLE, { enableHtml: true, closeButton: true });
                }
            },
            error => {
                this._spinnerService.hide();
                this._toastrService.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FAQ_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    OnChangeRBIFAQ(fAQId) {
        let rBIFAQDetail = this.rBIFAQ.filter(el => el.FAQId == fAQId)[0];
        this.rBIFAQPDFUrl = this._sanitizer.bypassSecurityTrustResourceUrl(this.fAQPDFServerPath + rBIFAQDetail.PDF);
    }

    GetFAQ() {
        this._spinnerService.show();

        let getFAQRequest = new GetFAQRequest();

        this._fAQUserService.getFAQ(getFAQRequest)
            .subscribe(data => {
                this._spinnerService.hide();

                this.dIPPFAQ = data.Response.filter(x => x.CategoryName == "DIPP FAQs");

                if (this.dIPPFAQ.length > 0)
                    this.OnChangeDIPPFAQ(this.dIPPFAQ[0].FAQId);

            }, error => {
                this._spinnerService.hide();
                this._toastrService.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_FAQ_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    OnChangeDIPPFAQ(fAQId) {
        let dIPPFAQDetail = this.dIPPFAQ.filter(el => el.FAQId == fAQId)[0];
        this.dIPPFAQPDFUrl = this._sanitizer.bypassSecurityTrustResourceUrl(this.fAQPDFServerPath + dIPPFAQDetail.PDF);
    }
}