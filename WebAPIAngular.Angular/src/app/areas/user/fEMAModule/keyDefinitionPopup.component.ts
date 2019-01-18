import { Component, ComponentRef, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KeyDefinitionEvent, GetKeyDefinitionEventRequest } from '../../../model/keyDefinitionEvent';
import { KeyDefinitionEventUserService } from '../../../service/user/keyDefinitionEvent.service';
import { SpinnerService } from '../../../service/common/spinner.service';
import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';

import { ModalDialogService, IModalDialogButton, IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';

@Component({
    selector: 'my-app',
    templateUrl: './keyDefinitionPopup.component.html'
})

export class KeyDefinitionPopupUserComponent {

    dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
        this.frmKeyDefinitionEvent = this.formBuilder.group({
            SearchText: [this.searchText]
        });

        this.GetKeyDefinitionEvent();
    }

    constructor(private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private vcr: ViewContainerRef,
        private _keyDefinitionEventService: KeyDefinitionEventUserService,
        private spinnerService: SpinnerService,
        private modalService: ModalDialogService) { }

    keyDefinitionEvents: KeyDefinitionEvent[];

    frmKeyDefinitionEvent: FormGroup;

    searchText: string;
    totalRecords: number;
    currentPage: number = 1;
    pageSize: number = Global.USER_PAGE_SIZE;

    content: string;

    sortingKeyDefinitionEventField: string;
    sortingKeyDefinitionEventDirection: string;
    
    notificationPDFServerPath: string = Global.NOTIFICATION_PDF_FILEPATH;
    gSRNotificationPDFServerPath: string = Global.GSR_NOTIFICATION_PDF_FILEPATH;
    fDICircularPDFServerPath: string = Global.FDICIRCULAR_PDF_FILEPATH;
    pressNotePDFServerPath: string = Global.PRESSNOTE_PDF_FILEPATH;
    actPDFServerPath: string = Global.ACT_PDF_FILEPATH;
    masterDirectionPDFServerPath: string = Global.MASTERDIRECTION_PDF_FILEPATH;
    aPDIRCircularPDFServerPath: string = Global.APDIRCIRCULAR_PDF_FILEPATH;
    
    GetKeyDefinitionEvent(searchText?: string, pageNumber?: number): void {
        this.spinnerService.show();

        let getKeyDefinitionEventRequest = new GetKeyDefinitionEventRequest();
        getKeyDefinitionEventRequest.DefinitionEventName = Global.KEY_DEFINITION_FIELDNAME;
        getKeyDefinitionEventRequest.SearchText = searchText;
        getKeyDefinitionEventRequest.IsActive = null;
        getKeyDefinitionEventRequest.OrderBy = this.sortingKeyDefinitionEventField
        getKeyDefinitionEventRequest.OrderByDirection = this.sortingKeyDefinitionEventDirection;
        getKeyDefinitionEventRequest.PageNumber = (pageNumber != null) ? pageNumber : this.currentPage;
        getKeyDefinitionEventRequest.PageSize = this.pageSize;

        this._keyDefinitionEventService.getKeyDefinitionEvent(getKeyDefinitionEventRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.keyDefinitionEvents = data.Response;

                    this.pageSize = getKeyDefinitionEventRequest.PageSize;
                    this.totalRecords = (data.Response.length != 0) ? data.Response[0].TotalRecord : 0;
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_KEY_DEFINITION_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_KEY_DEFINITION_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    SearchKeyDefinitionEvent(formData) {
        this.currentPage = 1;
        this.searchText = formData.value.SearchText;

        this.GetKeyDefinitionEvent(this.searchText, this.currentPage);
    }

    OnPageChange(pageNumber: number) {
        this.currentPage = pageNumber;
        this.GetKeyDefinitionEvent(this.searchText, pageNumber);
    }

    OnPageSizeChange() {
        this.currentPage = 1;
        this.GetKeyDefinitionEvent(this.searchText, null);
    }
    
    OnKeyDefinitionEventSort(fieldName) {
        this.sortingKeyDefinitionEventDirection = (this.sortingKeyDefinitionEventField == fieldName) ? (this.sortingKeyDefinitionEventDirection == "A") ? "D" : "A" : "A";
        this.sortingKeyDefinitionEventField = fieldName;
        this.GetKeyDefinitionEvent(this.searchText, this.currentPage);
    }

    ShowContent(content) {
        this.content = content;
    }
}
