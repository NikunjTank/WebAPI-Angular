import { Component, ComponentRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SpinnerService } from '../../../service/common/spinner.service';
import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { ModalDialogService, IModalDialogButton, IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';

import { NICCode, GetNICCodeRequest } from '../../../model/nICCode';
import { NICCodeUserService } from '../../../service/user/nICCode.service';

@Component({
    selector: 'my-app',
    templateUrl: './nICCodePopup.component.html'
})

export class NICCodePopupUserComponent {
    
    nICCodes: NICCode[] = [];
    nICCodePDFServerPath: string = Global.NICCODE_PDF_FILEPATH;
    nICCodePDFUrl: any;
    moduleTab: string;
    _global: Global = new Global();

    dialogInit(refernce: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
        this.GetNICCode();
    }

    constructor(private _spinnerService: SpinnerService, private _toastrService: ToastrService, private _nICCodeService: NICCodeUserService, public sanitizer: DomSanitizer) {

    }

    GetNICCode() {
        this._spinnerService.show();

        let getNICCodeRequest = new GetNICCodeRequest();

        this._nICCodeService.getNICCode(getNICCodeRequest)
            .subscribe(data => {
                this._spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.nICCodes = data.Response;

                    if (data.Response.length > 0) {
                        this.OnClickNICCode(data.Response[0].NICCodeId)
                    }
                }
                else {
                    this._toastrService.error(data.Description, Global.TOASTR_ADMIN_NICCODE_TITLE, { closeButton: true });
                }
            },
            error => {
                this._spinnerService.hide();
                this._toastrService.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_NICCODE_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    OnClickNICCode(nICCodeId) {
        this.nICCodePDFUrl = "";
        this.moduleTab = nICCodeId;
        
        let nICCode = this.nICCodes.filter(x => x.NICCodeId == nICCodeId);
        
        if (nICCode) {
            this.nICCodePDFUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this._global.getPDFPath(this.nICCodePDFServerPath + nICCode[0].PDF));

            let interval = setInterval(function () {
                let minusHeight = (document.querySelector('body').clientWidth > 766) ? 115 : (document.querySelector('body').clientWidth > 480) ? 200 : 170;

                document.getElementById(nICCode[0].NICCodeName.toString()).style.height = (document.querySelector('.modal-body').clientHeight - minusHeight) + "px";
                clearInterval(interval);
            }, 100);
        }
    }
}