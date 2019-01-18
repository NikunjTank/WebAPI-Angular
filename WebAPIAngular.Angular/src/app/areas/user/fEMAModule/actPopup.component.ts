import { Component, ComponentRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SpinnerService } from '../../../service/common/spinner.service';
import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { ModalDialogService, IModalDialogButton, IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';

import { ActName,GetActNameRequest } from '../../../model/actName';
import { ActNameUserService } from '../../../service/user/actName.service';

@Component({
    selector: 'my-app',
    templateUrl: './actPopup.component.html'
})

export class ActPopupUserComponent {

    actNames: ActName[];
    actPDFServerPath: string = Global.ACT_PDF_FILEPATH;
    actId: number = 1;

    _global: Global = new Global();

    actPDFUrl: any;

    dialogInit(refernce: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
        this.GetActName();
    }

    constructor(private _spinnerService: SpinnerService, private _toastrService: ToastrService, private _actNameUserService: ActNameUserService, public sanitizer: DomSanitizer) {

    }

    GetActName(): void {
        this._spinnerService.show();

        let getActNameRequest = new GetActNameRequest();
        getActNameRequest.IsPagingRequired = false;

        this._actNameUserService.getActName(getActNameRequest)
            .subscribe(data => {
                this._spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.actNames = data.Response;
                    if (this.actNames.length > 0) {
                        this.GetSelectedActId(this.actId);
                    }                    
                } else {
                    this._toastrService.error(data.Description, Global.TOASTR_ADMIN_ACTNAME_TITLE, { closeButton: true });
                }
            },
            error => {
                this._spinnerService.hide();
                this._toastrService.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_ACTNAME_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    GetSelectedActId(actId: number) {
        let actDetail = this.actNames.filter(el => el.ActId == actId)[0];
        this.actPDFUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this._global.getPDFPath(this.actPDFServerPath + actDetail.ActPDF));

        let interval = setInterval(function () {
            let minusHeight = (document.querySelector('body').clientWidth > 480) ? 115 : 80;

            document.getElementById("iframe").style.height = (document.querySelector('.modal-body').clientHeight - minusHeight) + "px";
            clearInterval(interval);
        }, 100);
    }
}