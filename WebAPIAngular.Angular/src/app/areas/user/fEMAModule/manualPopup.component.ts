import { Component, ComponentRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SpinnerService } from '../../../service/common/spinner.service';
import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { ModalDialogService, IModalDialogButton, IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';

import { Manual,GetManualRequest } from '../../../model/manual';
import { ManualUserService } from '../../../service/user/manual.service';

@Component({
    selector: 'my-app',
    templateUrl: './manualPopup.component.html'
})

export class ManualPopupUserComponent {

    fEMAModuleId: number;
    manuals: Manual[] = [];
    manualPDFServerPath: string = Global.MANUAL_PDF_FILEPATH;
    manualPDFUrl: any;

    moduleTab: string;
    _global: Global = new Global();

    dialogInit(refernce: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {

        this.GetManual();
    }

    constructor(private _spinnerService: SpinnerService, private _toastrService: ToastrService, private _manualUserService: ManualUserService, public sanitizer: DomSanitizer) {

    }

    GetManual() {
        this._spinnerService.show();

        let getManualRequest = new GetManualRequest();

        this._manualUserService.getManual(getManualRequest)
            .subscribe(data => {
                this._spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.manuals = data.Response;
                    if (this.manuals.length > 0) {
                        this.GetSelectedManualId(this.manuals[0].ManualId);
                    }
                }
                else {
                    this._toastrService.error(data.Description, Global.TOASTR_ADMIN_MANUAL_TITLE, { closeButton: true });
                }
            },
            error => {
                this._spinnerService.hide();
                this._toastrService.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_MANUAL_TITLE, { enableHtml: true, closeButton: true });
            });
    }

    GetSelectedManualId(manualId) {
        this.manualPDFUrl = "";
        this.moduleTab = manualId;

        let manualDetail = this.manuals.filter(el => el.ManualId == manualId)[0];
        this.manualPDFUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this._global.getPDFPath(this.manualPDFServerPath + manualDetail.PDF));

        let interval = setInterval(function () {
            let minusHeight = (document.querySelector('body').clientWidth > 766) ? 115 : (document.querySelector('body').clientWidth > 480) ? 200 : (document.querySelector('body').clientWidth > 323) ? 170 : 205;

            document.getElementById(manualDetail.ManualName.toString()).style.height = (document.querySelector('.modal-body').clientHeight - minusHeight) + "px";
            clearInterval(interval);
        }, 100);
    }
}