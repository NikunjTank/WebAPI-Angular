import { Component, ComponentRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SpinnerService } from '../../../service/common/spinner.service';
import { ToastrService } from 'ngx-toastr';
import { Global } from '../../../common/global';
import { ModalDialogService, IModalDialogButton, IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';

import { ActName, GetActNameRequest } from '../../../model/actName';
import { ActNameUserService } from '../../../service/user/actName.service';

@Component({
    selector: 'my-app',
    templateUrl: './searchedPDFPopup.component.html'
})

export class SearchedPDFPopupUserComponent {

    searchedPDFUrl: any;
    searchedExcelUrl: any;
    searchedWordUrl: any;
    searchedContentTitle: string;
    searchedContent: string;

    _global: Global = new Global();

    constructor(public sanitizer: DomSanitizer) { }

    dialogInit(refernce: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
        let t_this = this;

        let pdfPath = (options.data.CategoryId == Global.SEARCH_CATEGORY_ID_NOTIFICATION) ? Global.NOTIFICATION_PDF_FILEPATH :
            (options.data.CategoryId == Global.SEARCH_CATEGORY_ID_AP_DIR_CIRCULAR) ? Global.APDIRCIRCULAR_PDF_FILEPATH :
                (options.data.CategoryId == Global.SEARCH_CATEGORY_ID_MASTER_DIRECTION) ? Global.MASTERDIRECTION_PDF_FILEPATH :
                    (options.data.CategoryId == Global.SEARCH_CATEGORY_ID_FDI_CIRCULAR) ? Global.FDICIRCULAR_PDF_FILEPATH :
                        (options.data.CategoryId == Global.SEARCH_CATEGORY_ID_COMPOUNDING_ORDER) ? Global.RBI_COMPOUNDING_ORDER_PDF_FILEPATH :
                            (options.data.CategoryId == Global.SEARCH_CATEGORY_ID_PRESS_NOTE) ? Global.PRESSNOTE_PDF_FILEPATH :
                                (options.data.CategoryId == Global.SEARCH_CATEGORY_ID_ACT) ? Global.ACT_PDF_FILEPATH :
                                    (options.data.CategoryId == Global.SEARCH_CATEGORY_ID_FORM) ? Global.FORM_SUMMARY_DOCUMENTATION_PDF_FILEPATH :
                                        (options.data.CategoryId == Global.SEARCH_CATEGORY_ID_SUMMARY) ? Global.FORM_SUMMARY_DOCUMENTATION_PDF_FILEPATH :
                                            (options.data.CategoryId == Global.SEARCH_CATEGORY_ID_DOCUMENTATION) ? Global.FORM_SUMMARY_DOCUMENTATION_PDF_FILEPATH :
                                                (options.data.CategoryId == Global.SEARCH_CATEGORY_ID_MASTER_CIRCULAR) ? Global.MASTERCIRCULAR_PDF_FILEPATH :
                                                    (options.data.CategoryId == Global.SEARCH_CATEGORY_ID_RULES_GSR) ? Global.GSR_NOTIFICATION_PDF_FILEPATH :
                                                        (options.data.CategoryId == Global.SEARCH_CATEGORY_ID_FIPB_REVIEW) ? Global.FIPBREVIEW_PDF_FILEPATH :
                                                            (options.data.CategoryId == Global.SEARCH_CATEGORY_ID_DIPP_CLARIFICATION) ? Global.DIPPCLARIFICATION_PDF_FILEPATH :
                                                                (options.data.CategoryId == Global.SEARCH_CATEGORY_ID_FIPB_PRESS_RELEASE_CASE) ? Global.FIPB_PRESS_RELEASE_CASE_PDF_FILEPATH : '';

        this.searchedPDFUrl = (options.data.PDF) ? this.sanitizer.bypassSecurityTrustResourceUrl(this._global.getPDFPath(pdfPath + options.data.PDF)) : null;
        this.searchedExcelUrl = (options.data.Excel) ? Global.FORM_SUMMARY_DOCUMENTATION_EXCEL_FILEPATH + options.data.Excel : null;
        this.searchedWordUrl = (options.data.Word) ? Global.FORM_SUMMARY_DOCUMENTATION_WORD_FILEPATH + options.data.Word : null;
        this.searchedContentTitle = (options.data.CategoryId == Global.SEARCH_CATEGORY_ID_REGULATION_INDEX) ? Global.POPUP_INDEX_HEADER_TITLE : '';
        this.searchedContent = options.data.Content;

        let interval = setInterval(function () {
            let minusHeight = ((t_this.searchedExcelUrl || t_this.searchedWordUrl) ? (document.querySelector('body').clientWidth > 480) ? 105 : 70 : (document.querySelector('body').clientWidth > 480) ? 60 : 30);

            if (t_this.searchedPDFUrl)
                document.getElementById("iframe").style.height = (document.querySelector('.modal-body').clientHeight - minusHeight + "px";
            clearInterval(interval);
        }, 100);
    }
}