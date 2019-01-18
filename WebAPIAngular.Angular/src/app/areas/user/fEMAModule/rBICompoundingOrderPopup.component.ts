import { Component, ComponentRef, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RBICompoundingOrder, GetRBICompoundingOrderRequest } from '../../../model/rBICompoundingOrder';
import { RBICompoundingOrderUserService } from '../../../service/user/rBICompoundingOrder.service';
import { SpinnerService } from '../../../service/common/spinner.service';
import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';

import { ModalDialogService, IModalDialogButton, IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';

@Component({
    selector: 'my-app',
    templateUrl: './rBICompoundingOrderPopup.component.html'
})

export class RBICompoundingOrderPopupUserComponent {

    dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
        this.frmRBICompoundingOrder = this.formBuilder.group({
            SearchText: [this.searchText]
        });

        this.GetRBICompoundingOrder();
    }

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private vcr: ViewContainerRef, private _rBICompoundingOrderService: RBICompoundingOrderUserService, private spinnerService: SpinnerService, private modalService: ModalDialogService) { }

    rBICompoundingOrders: RBICompoundingOrder[];

    frmRBICompoundingOrder: FormGroup;

    searchText: string;
    totalRecords: number;
    currentPage: number = 1;
    pageSize: number = Global.USER_PAGE_SIZE;

    content: string;

    sortingRBICompoundingOrderField: string = "OrderDate";
    sortingRBICompoundingOrderDirection: string = "D";

    rBICompoundingOrderPDFServerPath: string = Global.RBI_COMPOUNDING_ORDER_PDF_FILEPATH;
    
    GetRBICompoundingOrder(searchText?: string, pageNumber?: number): void {
        this.spinnerService.show();

        let getRBICompoundingOrderRequest = new GetRBICompoundingOrderRequest();
        getRBICompoundingOrderRequest.SearchText = searchText;
        getRBICompoundingOrderRequest.IsActive = null;
        getRBICompoundingOrderRequest.OrderBy = this.sortingRBICompoundingOrderField
        getRBICompoundingOrderRequest.OrderByDirection = this.sortingRBICompoundingOrderDirection;
        getRBICompoundingOrderRequest.PageNumber = (pageNumber != null) ? pageNumber : this.currentPage;
        getRBICompoundingOrderRequest.PageSize = this.pageSize;

        this._rBICompoundingOrderService.getRBICompoundingOrder(getRBICompoundingOrderRequest)
            .subscribe(data => {
                this.spinnerService.hide();

                if (data.Status == Global.API_SUCCESS) {
                    this.rBICompoundingOrders = data.Response;

                    this.pageSize = getRBICompoundingOrderRequest.PageSize;
                    this.totalRecords = (data.Response.length != 0) ? data.Response[0].TotalRecord : 0;
                } else {
                    this.toastr.error(data.Description, Global.TOASTR_ADMIN_RBI_COMPOUNDING_ORDER_TITLE, { closeButton: true });
                }
            },
                error => {
                    this.spinnerService.hide();
                    this.toastr.error(Global.ERROR_MESSAGE, Global.TOASTR_ADMIN_RBI_COMPOUNDING_ORDER_TITLE, { enableHtml: true, closeButton: true });
                });
    }

    SearchRBICompoundingOrder(formData) {
        this.currentPage = 1;
        this.searchText = formData.value.SearchText;

        this.GetRBICompoundingOrder(this.searchText, this.currentPage);
    }

    OnPageChange(pageNumber: number) {
        this.currentPage = pageNumber;
        this.GetRBICompoundingOrder(this.searchText, pageNumber);
    }

    OnPageSizeChange() {
        this.currentPage = 1;
        this.GetRBICompoundingOrder(this.searchText, null);
    }
    
    OnRBICompoundingOrderSort(fieldName) {
        this.sortingRBICompoundingOrderDirection = (this.sortingRBICompoundingOrderField == fieldName) ? (this.sortingRBICompoundingOrderDirection == "A") ? "D" : "A" : "A";
        this.sortingRBICompoundingOrderField = fieldName;
        this.GetRBICompoundingOrder(this.searchText, this.currentPage);
    }

    ShowContent(content) {
        this.content = content;
    }
}
