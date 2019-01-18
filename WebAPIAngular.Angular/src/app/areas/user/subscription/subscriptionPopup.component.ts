import { Component, ComponentRef } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { SpinnerService } from '../../../service/common/spinner.service';
import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { ModalDialogService, IModalDialogButton, IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';

@Component({
    selector: 'my-app',
    templateUrl: './subscriptionPopup.component.html'
})

export class SubscriptionPopupUserComponent {
    dialogInit(refernce: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) { }

    constructor(public router: Router) { }

    OpenSubscriptionPage() {
        if (this.router.url.search('userprofile') != -1)
            this.router.navigate(['/user/secure/subscription']);

        let closeButton: any = document.querySelector(".close-button");
        closeButton.click();
    }
}