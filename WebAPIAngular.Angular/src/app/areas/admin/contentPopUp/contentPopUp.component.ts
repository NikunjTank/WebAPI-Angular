import { Component, ComponentRef } from '@angular/core';
import { ModalDialogService, IModalDialogButton, IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';

@Component({
    selector: 'my-app',
    templateUrl: './contentPopUp.component.html'
})

export class ContentPopUpAdminComponent {

    content: string;

    dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
        this.content = (options.data) ? options.data : "No content available.";
    }

    constructor() { }    
}
