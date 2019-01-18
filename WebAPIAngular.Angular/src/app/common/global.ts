import * as CryptoJS from 'crypto-js';

export class Global {    
    public static API_SITE = 'http://demystifyfemaservice/';
    //public static API_SITE = 'http://servicebeta.demystifyfema.com/';
    //public static API_SITE = 'http://service.demystifyfema.com/';
    public static ERROR_MESSAGE = "Error on page, please reload page. <br/>If error persists, contact administrator for support.";
    public static API_SUCCESS = "Success";

    public static IS_SUBSCRIBED = "IsSubscribed";
    public static LOGIN_TOKEN = "LoginToken";
    public static USER_LOGIN_TOKEN = "UserLoginToken";
    public static USER_ID = "UserId";
    public static ROLEID = "RoleId";
    public static USERROLEID = "UserRoleId";

    public static ADMIN_ROLEID = 1;
    public static USER_ROLEID = 2;

    public static ADMINID = 1;

    public static FORM_TYPE = 'Form';
    public static SUMMARY_TYPE = 'Summary';
    public static DOCUMENTATION_TYPE = 'Documentation';

    public static TOASTR_LOGIN_TITLE = "Login";
    public static TOASTR_REGISTER_TITLE = "Register";
    public static TOASTR_VERIFYACCOUNT_TITLE = "Verify Account";
    public static TOASTR_LOGOUT_TITLE = "Logout";

    public static LOGIN_FROM_WEB = "WEB";

    public static USER_PAGE_SIZE = 20;

    public static MASTER_DIRECTION_ALL_CHAPTER = "all chapter";
    public static KEY_EVENT_FIELDNAME = "Event";
    public static KEY_DEFINITION_FIELDNAME = "Definition";
    public static COMMON_FIELD_MODULE_NAME = "ModuleName";
    public static COMMON_FIELD_FEMA_MODULE = "FEMAModule";
    public static COMMON_FIELD_FEMA_SUBMODULE = "FEMASubModule";
    public static COMMON_FIELD_CALCULATOR_TOPIC = "CalculatorTopicName";
    public static COMMON_FIELD_PROFESSIONAL_QUALIFICATION = "ProfessionalQualification";
    public static COMMON_FIELD_PLACE_OF_ESTABLISHMENT_OF_BO = "PlaceOfEstablishmentOfBranchOffice";
    public static COMMON_FIELD_SUPPORT_TICKET_DEPARTMENT = "SupportTicketDepartment";
    public static COMMON_FIELD_SEARCH_CATEGORY = "SearchCategory";

    public static RBIDATA_LO_NAME = "RBI Liaison Office Data";
    public static RBIDATA_BO_NAME = "RBI Branch Office Data";
    public static RBIDATA_ECB_NAME = "RBI External Commercial Borrowings Data";
    public static RBIDATA_ODI_NAME = "RBI Overseas Direct Investment Data";

    public static SEARCH_CATEGORY_ID_NOTIFICATION = 1;
    public static SEARCH_CATEGORY_ID_AP_DIR_CIRCULAR = 2;
    public static SEARCH_CATEGORY_ID_MASTER_DIRECTION = 3;
    public static SEARCH_CATEGORY_ID_FDI_CIRCULAR = 4;
    public static SEARCH_CATEGORY_ID_COMPOUNDING_ORDER = 5;
    public static SEARCH_CATEGORY_ID_PRESS_NOTE = 6;
    public static SEARCH_CATEGORY_ID_ACT = 7;
    public static SEARCH_CATEGORY_ID_FORM = 8;
    public static SEARCH_CATEGORY_ID_SUMMARY = 9;
    public static SEARCH_CATEGORY_ID_DOCUMENTATION = 10;
    public static SEARCH_CATEGORY_ID_MASTER_CIRCULAR = 11;
    public static SEARCH_CATEGORY_ID_RULES_GSR = 12;
    public static SEARCH_CATEGORY_ID_FIPB_REVIEW = 13;
    public static SEARCH_CATEGORY_ID_DIPP_CLARIFICATION = 14;
    public static SEARCH_CATEGORY_ID_FIPB_PRESS_RELEASE_CASE = 15;
    public static SEARCH_CATEGORY_ID_REGULATION_INDEX = 16;

    public static LATEST_NEWS_ID_NOTIFICATION = 1;
    public static LATEST_NEWS_ID_AP_DIR_CIRCULAR = 2;
    public static LATEST_NEWS_ID_PRESS_NOTE = 3;
    public static LATEST_NEWS_ID_MASTER_DIRECTION = 4;
    public static LATEST_NEWS_ID_COMPOUNDING_ORDER = 5;

    public static SEARCH_CATEGORY_NAME_NOTIFICATION = "Notification";
    public static SEARCH_CATEGORY_NAME_AP_DIR_CIRCULAR = "AP DIR Circular";
    public static SEARCH_CATEGORY_NAME_MASTER_DIRECTION = "Master Direction";
    public static SEARCH_CATEGORY_NAME_FDI_CIRCULAR = "FDI Circular";
    public static SEARCH_CATEGORY_NAME_COMPOUNDING_ORDER = "Compounding Order";
    public static SEARCH_CATEGORY_NAME_PRESS_NOTE = "Press Note";
    public static SEARCH_CATEGORY_NAME_ACT = "Act";
    public static SEARCH_CATEGORY_NAME_FORM = "Form";
    public static SEARCH_CATEGORY_NAME_SUMMARY = "Summary";
    public static SEARCH_CATEGORY_NAME_DOCUMENTATION = "Documentation";
    public static SEARCH_CATEGORY_NAME_MASTER_CIRCULAR = "Master Circular";
    public static SEARCH_CATEGORY_NAME_RULES_GSR = "Rules-GSR";
    public static SEARCH_CATEGORY_NAME_FIPB_REVIEW = "FIPB Review";
    public static SEARCH_CATEGORY_NAME_DIPP_CLARIFICATION = "DIPP Clarification";
    public static SEARCH_CATEGORY_NAME_FIPB_PRESS_RELEASE_CASE = "FIPB Press Release Case";
    public static SEARCH_CATEGORY_NAME_REGULATION_INDEX = "Regulation Index / Sub-index";

    public static COMMON_FIELD_MODULE_AUTHORSWRITEUP = 1;
    public static COMMON_FIELD_MODULE_FOREIGNEXCHANGEMANAGEMENTACT = 2;
    public static COMMON_FIELD_MODULE_FEMA_REGULATIONS_FEMA_NOTIFICATIONS_GSR = 3;
    public static COMMON_FIELD_MODULE_MASTERDIRECTION_MASTERCIRCULAR_APDIRCIRCULAR = 4;
    public static COMMON_FIELD_MODULE_FDICIRCULAR_PRESSNOTE = 5;
    public static COMMON_FIELD_MODULE_SECTOR_SNAPSHOT = 6;
    public static COMMON_FIELD_MODULE_NICCODE = 7;
    public static COMMON_FIELD_MODULE_FIPBREVIEW_CLARIFICATION_FIBCPRESSRELEASECASE = 8;
    public static COMMON_FIELD_MODULE_FDI_PENALTY_CALCULATOR = 9;
    public static COMMON_FIELD_MODULE_RBI_ECB_DATA = 11;
    public static COMMON_FIELD_MODULE_ECB_AVERAGE_MATURITY_CALCULATOR = 12;
    public static COMMON_FIELD_MODULE_RBI_ODI_DATA = 13;
    public static COMMON_FIELD_MODULE_RBI_LO_DATA = 14;
    public static COMMON_FIELD_MODULE_RBI_BO_DATA = 15;
    public static COMMON_FIELD_MODULE_LO_BO_PO_ELIGIBILITY_CALCULATOR = 16;
    public static COMMON_FIELD_MODULE_FORM_SUMMARY_DOCUMENTATION = 17;
    public static COMMON_FIELD_MODULE_FETERSCODE = 18;
    public static COMMON_FIELD_MODULE_KEYDEFINITION = 19;
    public static COMMON_FIELD_MODULE_RBI_COMPOUNDING_ORDER = 20;
    public static COMMON_FIELD_MODULE_RBI_DIPP_FAQ = 22;
    public static COMMON_FIELD_MODULE_COMPOUNDING_CALCULATOR = 25;
    public static COMMON_FIELD_MODULE_MANUAL = 27;
    public static COMMON_FIELD_MODULE_KEYEVENT = 28;
    //public static COMMON_FIELD_MODULE_ACT = 5;

    public static COMMON_FIELD_FDI_PENALTY_CALCULATOR = 1;
    public static COMMON_FIELD_COMPOUNDING_PENALTY_CALCULATOR = 2;
    public static FDI_PENALTY_CALCULATOR_FIXED_DATE = new Date(2017, 10, 7);
    public static FDI_PENALTY_CALCULATOR_RANGE_UPTO_10_LAKHS = "upto 10 Lakhs";
    public static FDI_PENALTY_CALCULATOR_RANGE_10_TO_40_LAKHS = "10-40 Lakhs";
    public static FDI_PENALTY_CALCULATOR_RANGE_40_TO_100_LAKHS = "40-100 Lakhs";
    public static FDI_PENALTY_CALCULATOR_RANGE_1_TO_10_CRORE = "1-10 Crore";
    public static FDI_PENALTY_CALCULATOR_RANGE_10_TO_100_CRORE = "10-100 Crore";
    public static FDI_PENALTY_CALCULATOR_RANGE_ABOVE_100_CRORE = "Above 100 Crore";

    public static FDI_PENALTY_CALCULATOR_RANGE_1ST_YEAR = "1st Year";
    public static FDI_PENALTY_CALCULATOR_RANGE_1_TO_2_YEARS = "1-2 Years";
    public static FDI_PENALTY_CALCULATOR_RANGE_2_TO_3_YEARS = "2-3 Years";
    public static FDI_PENALTY_CALCULATOR_RANGE_3_TO_4_YEARS = "3-4 Years";
    public static FDI_PENALTY_CALCULATOR_RANGE_4_TO_5_YEARS = "4-5 Years";
    public static FDI_PENALTY_CALCULATOR_RANGE_GRATER_THAN_5_YEARS = ">5 Years";

    //public static COMMON_FIELD_MODULE_APDIRCIRCULAR = 7;

    public static CALCULATOR_OUTCOME_AUTOMATIC_ROUTE = "Automatic Route";
    public static CALCULATOR_OUTCOME_RBI_APPROVAL_ROUTE = "RBI Approval Route";

    public static QUESTION_TEXT_APPLICANT_ENTITY_LO = 1;
    public static QUESTION_TEXT_SECTORAL_CAP_LO = 2;
    public static QUESTION_TEXT_SECTOR_LO = 3;
    public static QUESTION_TEXT_APPLICANT_COUNTRY_LO = 4;
    public static QUESTION_TEXT_STATE_OF_INDIA_LO = 5;
    public static QUESTION_TEXT_PROFIT_MAKING_TRACK_RECORD_YEAR_LO = 6;
    public static QUESTION_TEXT_NET_WORTH_YEAR_LO = 7;
    public static QUESTION_TEXT_WHETHER_SUBSIDIARY_OF_ANOTHER_COMPANY_LO = 8;
    public static QUESTION_TEXT_WHETHER_LETTER_OF_COMFORT_AVAILABLE_LO = 9;

    public static QUESTION_TEXT_APPLICANT_ENTITY_BO = 10;
    public static QUESTION_TEXT_SECTORAL_CAP_BO = 11;
    public static QUESTION_TEXT_SECTOR_BO = 12;
    public static QUESTION_TEXT_APPLICANT_COUNTRY_BO = 13;
    public static QUESTION_TEXT_STATE_OF_INDIA_BO = 14;
    public static QUESTION_TEXT_PROFIT_MAKING_TRACK_RECORD_YEAR_BO = 15;
    public static QUESTION_TEXT_NET_WORTH_YEAR_BO = 16;
    public static QUESTION_TEXT_WHETHER_SUBSIDIARY_OF_ANOTHER_COMPANY_BO = 17;
    public static QUESTION_TEXT_WHETHER_LETTER_OF_COMFORT_AVAILABLE_BO = 18;
    public static QUESTION_TEXT_WHETHER_BOS_COMPLY_WITH_CHAPTER_XXII_OF_COMPANIES_ACT_2013_BO = 19;
    public static QUESTION_TEXT_WHETHER_BO_FUNTION_ON_STANDALONE_BASIS_BO = 20;

    public static QUESTION_TEXT_APPLICANT_ENTITY_PO = 21;
    public static QUESTION_TEXT_SECTORAL_CAP_PO = 22;
    public static QUESTION_TEXT_SECTOR_PO = 23;
    public static QUESTION_TEXT_APPLICANT_COUNTRY_PO = 24;
    public static QUESTION_TEXT_STATE_OF_INDIA_PO = 25;
    public static QUESTION_TEXT_WHETHER_YOU_HAVE_SECURED_CONTRACT_FROM_AN_INDIAN_COMPANY_FOR_EXECUTING_THECONTRACT_PO = 26;
    public static QUESTION_TEXT_FUNDED_DIRECTLY_BY_INWARD_REMITTANCE_FROM_ABROAD_PO = 27;
    public static QUESTION_TEXT_FUNDED_BY_BILATERAL_OR_MULTILATERAL_INTERNATIONAL_FINANCING_AGENCY_PO = 28;
    public static QUESTION_TEXT_CLEARED_BY_AN_APPROPRIATE_AUTHORITY_PO = 29;
    public static QUESTION_TEXT_PUBLIC_FINANCIAL_INSTITUTION_PO = 30;

    public static COMMON_FIELD_REGULATION_FIELDID = 1;
    public static COMMON_FIELD_RULES_FIELDID = 2;
    public static COMMON_FIELD_FDICIRCULAR_FIELDID = 3;
    public static COMMON_FIELD_PRESSNOTE_FIELDID = 4;
    public static COMMON_FIELD_ACT_FIELDID = 5;
    public static COMMON_FIELD_MASTERDIRECTION_FIELDID = 6;
    public static COMMON_FIELD_APDIRCIRCULAR_FIELDID = 7;
    public static COMMON_FIELD_OTHER_FIELDID = 8;
    public static COMMON_FIELD_MASTERCIRCULAR_FIELDID = 9;
    public static COMMON_FIELD_RBIFAQ_FIELDID = 10;

    public static TOASTR_CONTACT_US_TITLE = "Contact Us";
    public static TOASTR_ADMIN_ACTNAME_TITLE = "Act";
    public static TOASTR_ADMIN_ALLDEFINITION_TITLE = "Definition";
    public static TOASTR_ADMIN_REGULATION_TITLE = "Regulation";
    public static TOASTR_ADMIN_INDEX_TITLE = "Index";
    public static TOASTR_ADMIN_NOTIFICATION_TITLE = "Notification";
    public static TOASTR_ADMIN_SUBINDEX_TITLE = "SubIndex";
    public static TOASTR_ADMIN_INDEXAMENDMENT_TITLE = "Index Amendment";
    public static TOASTR_ADMIN_APDIR_CIRCULAR_TITLE = "AP DIR Circular";
    public static TOASTR_ADMIN_APDIR_CIRCULAR_BEFORE_TITLE = "Before AP DIR Circular";
    public static TOASTR_ADMIN_APDIR_CIRCULAR_AFTER_TITLE = "After AP DIR Circular";
    public static TOASTR_ADMIN_PRESSNOTE_TITLE = "Press Note";
    public static TOASTR_ADMIN_PRESSNOTE_NOTIFICATION_TITLE = "Press Note Notification";
    public static TOASTR_ADMIN_PRESSNOTE_APDIR_CIRCULAR_TITLE = "Press Note AP DIR Circular";
    public static TOASTR_ADMIN_FDI_CIRCULAR_TITLE = "FDI Circular";
    public static TOASTR_ADMIN_FDI_CIRCULAR_CHAPTER_TITLE = "FDI Circular Chapter";
    public static TOASTR_ADMIN_FDI_CIRCULAR_INDEX_TITLE = "FDI Circular Index";
    public static TOASTR_ADMIN_FDI_CIRCULAR_SUBINDEX_TITLE = "FDI Circular SubIndex";
    public static TOASTR_ADMIN_FDI_CIRCULAR_INDEX_AMENDMENT_TITLE = "FDI Circular Index Amendment";
    public static TOASTR_ADMIN_SECTOR_TITLE = "Sector";
    public static TOASTR_ADMIN_SECTOR_DETAIL_TITLE = "Sector Detail";
    public static TOASTR_ADMIN_SUBSECTOR_TITLE = "SubSector";
    public static TOASTR_ADMIN_MASTER_CIRCULAR_TITLE = "Master Circular";
    public static TOASTR_ADMIN_MASTER_CIRCULAR_DETAIL_TITLE = "Master Circular Detail";
    public static TOASTR_ADMIN_FAQ_TITLE = "FAQ";
    public static TOASTR_ADMIN_FAQ_CATEGORY_TITLE = "FAQ Category";
    public static TOASTR_ADMIN_MASTER_DIRECTION_TITLE = "Master Direction";
    public static TOASTR_ADMIN_MASTER_DIRECTION_FAQ_TITLE = "Master Direction FAQ";
    public static TOASTR_ADMIN_MASTER_DIRECTION_CHAPTER_TITLE = "Master Direction Chapter";
    public static TOASTR_ADMIN_MASTER_DIRECTION_INDEX_TITLE = "Master Direction Index";
    public static TOASTR_ADMIN_MASTER_DIRECTION_SUB_INDEX_TITLE = "Master Direction SubIndex";
    public static TOASTR_ADMIN_MASTER_DIRECTION_INDEX_AMENDMENT_TITLE = "Master Direction Index Amendment";
    public static TOASTR_ADMIN_NICCODE_TITLE = "NIC Code";
    public static TOASTR_ADMIN_MANUAL_TITLE = "Manual";
    public static TOASTR_ADMIN_FETERSCODE_TITLE = "Feters Code";
    public static TOASTR_ADMIN_FETERSCODE_DETAIL_TITLE = "Feters Code Detail";
    public static TOASTR_ADMIN_FETERSCODE_GROUP_DETAIL_TITLE = "Feters Code Group Detail";
    public static TOASTR_ADMIN_FIPBREVIEW_TITLE = "FIPB Review";
    public static TOASTR_ADMIN_DIPPCLARIFICATION_TITLE = "DIPP Clarification";
    public static TOASTR_ADMIN_FIPB_PRESS_RELEASE_CASE_TITLE = "FIPB Press Release Case";
    public static TOASTR_ADMIN_FORM_TITLE = "Form";
    public static TOASTR_ADMIN_SUMMARY_TITLE = "Summary";
    public static TOASTR_ADMIN_DOCUMENTATION_TITLE = "Documentation";
    public static TOASTR_ADMIN_FORMDETAIL_TITLE = "Form Detail";
    public static TOASTR_ADMIN_SUMMARYDETAIL_TITLE = "Summary Detail";
    public static TOASTR_ADMIN_DOCUMENTATIONDETAIL_TITLE = "Documentation Detail";
    public static TOASTR_ADMIN_RBI_LIAISON_OFFICE_TITLE = "RBI Liaison Office";
    public static TOASTR_ADMIN_RBI_COMPOUNDING_ORDER_TITLE = "RBI Compounding Order";
    public static TOASTR_ADMIN_RBIDATA_TITLE = "RBI Data";
    public static TOASTR_ADMIN_RBIDATA_DETAIL_TITLE = "RBI Data Detail";
    public static TOASTR_ADMIN_RULES_TITLE = "Rules";
    public static TOASTR_ADMIN_RULES_INDEX_TITLE = "Rules Index";
    public static TOASTR_ADMIN_RULES_SUBINDEX_TITLE = "Rules SubIndex";
    public static TOASTR_ADMIN_GSR_NOTIFICATION_TITLE = "GSR Notification";
    public static TOASTR_ADMIN_RULES_INDEXAMENDMENT_TITLE = "Rules Index Amendment";
    public static TOASTR_ADMIN_AUTHOR_WRITE_UP_TITLE = "Author's Write Up";
    public static TOASTR_ADMIN_AUTHOR_WRITE_UP_DETAIL_TITLE = "Author's Write Up Detail";
    public static TOASTR_ADMIN_AUTHOR_FAQ_TITLE = "Author's FAQ";
    public static TOASTR_ADMIN_AUTHOR_FAQ_DETAIL_TITLE = "Author's FAQ Detail";
    public static TOASTR_ADMIN_AUTHOR_FAQ_QUESTION_REPLY_TITLE = "Author's FAQ Question Reply";
    public static TOASTR_ADMIN_KEY_DEFINITION_TITLE = "Key Definition";
    public static TOASTR_ADMIN_KEY_EVENT_TITLE = "Key Event";
    public static TOASTR_ADMIN_FEMA_MODULE_TITLE = "FEMA Module";
    public static TOASTR_ADMIN_USER_PROFILE_TITLE = "User Profile";
    public static TOASTR_ADMIN_FEMA_SUBMODULE_OF_MODULE_TITLE = "FEMA SubModule of Module";
    public static TOASTR_ADMIN_SUPPORT_TICKET_TITLE = "Post Query";
    public static TOASTR_ADMIN_SUPPORT_TICKET_REPLY_TITLE = "Post Query Reply";
    public static TOASTR_ADMIN_PENALTY_DETAIL_TITLE = "Penalty Detail";
    public static TOASTR_AVERAGE_MATURITY_CALCULATOR_TITLE = "Average Maturity Calculator";
    public static TOASTR_FDI_PENALTY_CALCULATOR_TITLE = "FDI Penalty Calculator";
    public static TOASTR_COMPOUNDING_PENALTY_CALCULATOR_TITLE = "Compounding Penalty Calculator";
    public static TOASTR_LO_BO_PO_ELIGIBILITY_CALCULATOR_TITLE = "LO / BO / PO Eligibility Calculator";
    public static TOASTR_SUBSCRIPTION_TITLE = "Subscription";
    public static TOASTR_ADMIN_SUPPORT_TICKET_CHAT_TITLE = "Support Ticket";
    public static TOASTR_LATEST_NEWS_TITLE = "Latest News";
    public static TOASTR_SEARCH_TITLE = "Search";
    public static TOASTR_PROFILE_TITLE = "Profile Setting";

    public static POPUP_INDEX_HEADER_TITLE = "Index Content";
    public static POPUP_SUBINDEX_HEADER_TITLE = "Sub-index Content";
    public static POPUP_INDEX_AMENDMENT_HEADER_TITLE = "Index Amendment Content";
    public static POPUP_SUBINDEX_AMENDMENT_HEADER_TITLE = "Sub-index Amendment Content";

    public static ACT_PDF_FILEPATH = Global.API_SITE + "Assets/ActPDF/";
    public static APDIRCIRCULAR_PDF_FILEPATH = Global.API_SITE + "Assets/APDIRCircularPDF/";
    public static FDICIRCULAR_PDF_FILEPATH = Global.API_SITE + "Assets/FDICircularPDF/";
    public static NOTIFICATION_PDF_FILEPATH = Global.API_SITE + "Assets/NotificationPDF/";
    public static GSR_PDF_FILEPATH = Global.API_SITE + "Assets/GSRPDF/";
    public static PRESSNOTE_PDF_FILEPATH = Global.API_SITE + "Assets/PressNotePDF/";
    public static MASTERCIRCULAR_PDF_FILEPATH = Global.API_SITE + "Assets/MasterCircularPDF/";
    public static FAQ_PDF_FILEPATH = Global.API_SITE + "Assets/FAQPDF/";
    public static MASTERDIRECTION_PDF_FILEPATH = Global.API_SITE + "Assets/MasterDirectionPDF/";
    public static NICCODE_PDF_FILEPATH = Global.API_SITE + "Assets/NICCodePDF/";
    public static MANUAL_PDF_FILEPATH = Global.API_SITE + "Assets/ManualPDF/";
    public static FETERSCODE_PDF_FILEPATH = Global.API_SITE + "Assets/FetersCodePDF/";
    public static FIPBREVIEW_PDF_FILEPATH = Global.API_SITE + "Assets/FIPBReviewPDF/";
    public static DIPPCLARIFICATION_PDF_FILEPATH = Global.API_SITE + "Assets/DIPPClarificationPDF/";
    public static FIPB_PRESS_RELEASE_CASE_PDF_FILEPATH = Global.API_SITE + "Assets/FIPBPressReleaseCasePDF/";
    public static FORM_SUMMARY_DOCUMENTATION_WORD_FILEPATH = Global.API_SITE + "Assets/FormSummaryDocumentationDetail/Word/";
    public static FORM_SUMMARY_DOCUMENTATION_EXCEL_FILEPATH = Global.API_SITE + "Assets/FormSummaryDocumentationDetail/Excel/";
    public static FORM_SUMMARY_DOCUMENTATION_PDF_FILEPATH = Global.API_SITE + "Assets/FormSummaryDocumentationDetail/PDF/";
    public static RBI_LIAISON_OFFICE_PDF_FILEPATH = Global.API_SITE + "Assets/RBILiaisonOfficeExcel/";
    public static RBI_COMPOUNDING_ORDER_PDF_FILEPATH = Global.API_SITE + "Assets/RBICompoundingOrderPDF/";
    public static RBIDATA_EXCEL_FILEPATH = Global.API_SITE + "Assets/RBIDataExcel/";
    public static RBIDATA_DETAIL_EXCEL_FILEPATH = Global.API_SITE + "Assets/RBIDataDetail/Excel/";
    public static RBIDATA_DETAIL_PDF_FILEPATH = Global.API_SITE + "Assets/RBIDataDetail/PDF/";
    public static AUTHOR_WRITE_UP_PDF_FILEPATH = Global.API_SITE + "Assets/AuthorWriteUpPDF/";
    public static AUTHOR_WRITE_UP_DETAIL_PDF_FILEPATH = Global.API_SITE + "Assets/AuthorWriteUpDetailPDF/";
    public static GSR_NOTIFICATION_PDF_FILEPATH = Global.API_SITE + "Assets/GSRNotificationPDF/";

    public static PAGE_SIZES = [10, 25, 50, 100];

    public key = CryptoJS.enc.Utf8.parse('7061737323313233');
    public iv = CryptoJS.enc.Utf8.parse('7061737323313233');

    getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    deleteCookie(cname) {
        document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }

    getToken() {
        try {
            return (this.getCookie(Global.LOGIN_TOKEN)) ? "Bearer " + this.getCookie(Global.LOGIN_TOKEN) : this.getCookie(Global.LOGIN_TOKEN);
        } catch (e) {
            return null;
        }
    }

    getUserToken() {
        try {
            return (this.getCookie(Global.USER_LOGIN_TOKEN)) ? "Bearer " + this.getCookie(Global.USER_LOGIN_TOKEN) : this.getCookie(Global.USER_LOGIN_TOKEN);
        } catch (e) {
            return null;
        }
    }

    getRoleId() {
        return this.getCookie((window.location.pathname.indexOf('/admin/') >= 0) ? Global.ROLEID : Global.USERROLEID);
    }

    deleteToken() {
        this.deleteCookie(Global.LOGIN_TOKEN);
        this.deleteCookie(Global.ROLEID);
    }

    deleteUserToken() {
        this.deleteCookie(Global.USER_LOGIN_TOKEN);
        this.deleteCookie(Global.USERROLEID);
        this.deleteCookie(Global.USER_ID);
    }

    setToken(tokenValue: string, roleId: string) {
        this.deleteToken();
        this.setCookie(Global.LOGIN_TOKEN, tokenValue, 365);
        this.setCookie(Global.ROLEID, roleId, 365);
    }

    setUserToken(userId: string, tokenValue: string, roleId: string) {
        this.deleteUserToken();
        this.setCookie(Global.USER_LOGIN_TOKEN, tokenValue, 365);
        this.setCookie(Global.USERROLEID, roleId, 365);
        this.setCookie(Global.USER_ID, userId, 365);
    }

    convertArrayToCommaSeperatedString(arrayData) {
        return (arrayData) ? (Array.isArray(arrayData)) ? arrayData.map(x => x.Value).join(',') : arrayData.split(",").map(x => x.Value).join(',') : null;
    }

    getPDFPath(pdfPath) {
        return (navigator.userAgent.match(/iPhone|iPad|iPod/i) || navigator.userAgent.match(/Android/i)) ? 'https://docs.google.com/viewer?url=' + pdfPath + '&embedded=true' : pdfPath;
    }

    //getToken() {
    //    try {
    //        return (this._cookieService.get(Global.LOGIN_TOKEN)) ? "Bearer " + this._cookieService.get(Global.LOGIN_TOKEN) : this._cookieService.get(Global.LOGIN_TOKEN);
    //    } catch (e) {
    //        return null;
    //    }
    //}

    //getUserToken() {
    //    try {
    //        return (this._cookieService.get(Global.USER_LOGIN_TOKEN)) ? "Bearer " + this._cookieService.get(Global.USER_LOGIN_TOKEN) : this._cookieService.get(Global.USER_LOGIN_TOKEN);
    //    } catch (e) {
    //        return null;
    //    }
    //}

    //getRoleId() {
    //    return this._cookieService.get(Global.ROLEID);
    //}

    //deleteToken() {
    //    this._cookieService.set(Global.LOGIN_TOKEN, '', new Date().getDate() - 365);
    //    this._cookieService.set(Global.ROLEID, '', new Date().getDate() - 365);
    //}

    //deleteUserToken() {
    //    this._cookieService.set(Global.USER_LOGIN_TOKEN, '', new Date().getDate() - 365);
    //    this._cookieService.set(Global.ROLEID, '', new Date().getDate() - 365);
    //}

    //setToken(tokenValue: string, roleId: string) {
    //    this.deleteToken();
    //    this._cookieService.set(Global.LOGIN_TOKEN, tokenValue, new Date().getDate() + 365);
    //    this._cookieService.set(Global.ROLEID, roleId, new Date().getDate() + 365);
    //}

    //setUserToken(tokenValue: string, roleId: string) {
    //    this.deleteUserToken();
    //    this._cookieService.set(Global.USER_LOGIN_TOKEN, tokenValue, new Date().getDate() + 365);
    //    this._cookieService.set(Global.ROLEID, roleId, new Date().getDate() + 365);
    //}

    getRBIDataName() {
        return ["RBI Liaison Office Data", "RBI Branch Office Data", "RBI External Commercial Borrowings Data", "RBI Overseas Direct Investment Data"];
    }

    encryptValue(value) {
        var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value), this.key,
            {
                keySize: 128 / 8,
                iv: this.iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });

        var encryptedValue = (encrypted.toString()) ? encrypted.toString().replace(/\+/g, '-aFaFa-').replace(/\//g, '-bFbFb-').replace(/=+$/, '-cFcFc-') : encrypted.toString();
        return encryptedValue;
    }

    decryptValue(value) {
        if (value) {
            var decrypted = CryptoJS.AES.decrypt(value.replace(/-aFaFa-/g, '+').replace(/-bFbFb-/g, '/').replace(/-cFcFc-/g, '='), this.key, {
                keySize: 128 / 8,
                iv: this.iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
            return decrypted.toString(CryptoJS.enc.Utf8);
        } else {
            return '';
        }
    }
}