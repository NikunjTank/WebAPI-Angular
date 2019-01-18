import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './auth/token.interceptor';

import { AuthGuardAdmin, AuthGuardUser } from './common/auth.guard';
import { CKEditorModule } from 'ng2-ckeditor';

import { GuestComponent } from './areas/guest/layout/guest.component';
import { LoginRegisterPopupGuestComponent } from './areas/guest/layout/loginRegisterPopup.component';

import { HomeGuestComponent } from './areas/guest/home/home.component';
import { AboutUsGuestComponent } from './areas/guest/aboutus/aboutus.component';
import { ContactUsGuestComponent } from './areas/guest/contactus/contactus.component';
import { SearchedPDFPopupUserComponent } from './areas/guest/home/searchedPDFPopup.component';

import { UserComponent } from './areas/user/layout/user.component';
import { DashboardUserComponent } from './areas/user/dashboard/dashboard.component';
import { FEMAModulesUserComponent } from './areas/user/fEMAModule/fEMAModules.component';
import { SupportTicketUserComponent } from './areas/user/supportTicket/supportTicket.component';
import { SupportTicketReplyUserComponent } from './areas/user/supportTicketReply/supportTicketReply.component';

import { RegulationPopupUserComponent } from './areas/user/fEMAModule/regulationPopup.component';
import { AuthorsWriteupPopupUserComponent } from './areas/user/fEMAModule/authorsWriteupPopup.component';
import { ActPopupUserComponent } from './areas/user/fEMAModule/actPopup.component';
import { MasterDirectionPopupUserComponent } from './areas/user/fEMAModule/masterDirectionPopup.component';
import { FDICircularPopupUserComponent } from './areas/user/fEMAModule/fDICircularPopup.component';
import { NICCodePopupUserComponent } from './areas/user/fEMAModule/nICCodePopup.component';
import { FetersCodePopupUserComponent } from './areas/user/fEMAModule/fetersCodePopup.component';
import { FormSummaryDocumentationPopupUserComponent } from './areas/user/fEMAModule/formSummaryDocumentationPopup.component';
import { FIPBReviewPopupUserComponent } from './areas/user/fEMAModule/fIPBReviewPopup.component';
import { ManualPopupUserComponent } from './areas/user/fEMAModule/manualPopup.component';
import { RBIDIPPFAQPopupUserComponent } from './areas/user/fEMAModule/rBIDIPPFAQPopup.component';
import { RBIECBPopupUserComponent } from './areas/user/fEMAModule/rBIECBPopup.component';
import { RBIODIPopupUserComponent } from './areas/user/fEMAModule/rBIODIPopup.component';
import { RBICompoundingOrderPopupUserComponent } from './areas/user/fEMAModule/rBICompoundingOrderPopup.component';
import { KeyDefinitionPopupUserComponent } from './areas/user/fEMAModule/keyDefinitionPopup.component';
import { KeyEventPopupUserComponent } from './areas/user/fEMAModule/keyEventPopup.component';
import { SectorSnapshotPopupUserComponent } from './areas/user/fEMAModule/sectorSnapshotPopup.component';
import { FDIPenaltyCalculatorPopupUserComponent } from './areas/user/fEMAModule/fDIPenaltyCalculatorPopup.component';
import { ECBAverageMaturityCalculatorPopupUserComponent } from './areas/user/fEMAModule/eCBAverageMaturityCalculatorPopup.component';
import { CompoundingPenaltyCalculatorPopupUserComponent } from './areas/user/fEMAModule/compoundingPenaltyCalculatorPopup.component';
import { LOBOPOEligibilityCalculatorPopupUserComponent } from './areas/user/fEMAModule/lOBOPOEligibilityCalculatorPopup.component';
import { SubscriptionUserComponent } from './areas/user/subscription/subscription.component';
import { SubscriptionPopupUserComponent } from './areas/user/subscription/subscriptionPopup.component';
import { UserProfileUserComponent } from './areas/user/userProfile/userProfile.component';
import { OTPConfirmationForProfileUserComponent } from './areas/user/userProfile/otpConfirmationForProfile.component';

import { AdminComponent } from './areas/admin/layout/admin.component';
import { PublicAdminComponent } from './areas/admin/layout/public_admin.component';
import { LoginAdminComponent } from './areas/admin/login/login.component';

import { DashboardAdminComponent } from './areas/admin/dashboard/dashboard.component';
import { ActNamesAdminComponent } from './areas/admin/actName/actNames.component';
import { ActNameAdminComponent } from './areas/admin/actName/actName.component';
import { AllDefinitionAdminComponent } from './areas/admin/allDefinition/allDefinition.component';
import { RegulationsAdminComponent } from './areas/admin/regulation/regulations.component';
import { RegulationAdminComponent } from './areas/admin/regulation/regulation.component';
import { FemaIndexAdminComponent } from './areas/admin/femaIndex/femaIndex.component';
import { IndexAmendmentAdminComponent } from './areas/admin/indexAmendment/indexAmendment.component';
import { FemaSubIndexAdminComponent } from './areas/admin/femaSubIndex/femaSubIndex.component';
import { NotificationAdminComponent } from './areas/admin/notification/notification.component';
import { NotificationsAdminComponent } from './areas/admin/notification/notifications.component';
import { APDIRCircularAdminComponent } from './areas/admin/aPDIRCircular/aPDIRCircular.component';
import { APDIRCircularsAdminComponent } from './areas/admin/aPDIRCircular/aPDIRCirculars.component';
import { APDIRCircularBeforeAdminComponent } from './areas/admin/aPDIRCircularBefore/aPDIRCircularBefore.component';
import { APDIRCircularAfterAdminComponent } from './areas/admin/aPDIRCircularAfter/aPDIRCircularAfter.component';
import { PressNoteAdminComponent } from './areas/admin/pressNote/pressNote.component';
import { PressNotesAdminComponent } from './areas/admin/pressNote/pressNotes.component';
import { PressNoteNotificationAdminComponent } from './areas/admin/pressNoteNotification/pressNoteNotification.component';
import { PressNoteAPDIRCircularAdminComponent } from './areas/admin/pressNoteAPDIRCircular/pressNoteAPDIRCircular.component';
import { FDICircularAdminComponent } from './areas/admin/fDICircular/fDICircular.component';
import { FDICircularsAdminComponent } from './areas/admin/fDICircular/fDICirculars.component';
import { FDIChapterAdminComponent } from './areas/admin/fDIChapter/fDIChapter.component';
import { FDICircularIndexAdminComponent } from './areas/admin/fDICircularIndex/fDICircularIndex.component';
import { FDICircularIndexAmendmentAdminComponent } from './areas/admin/fDICircularIndexAmendment/fDICircularIndexAmendment.component';
import { FDICircularSubIndexAdminComponent } from './areas/admin/fDICircularSubIndex/fDICircularSubIndex.component';
import { SectorAdminComponent } from './areas/admin/sector/sector.component';
import { SectorsAdminComponent } from './areas/admin/sector/sectors.component';
import { SectorDetailAdminComponent } from './areas/admin/sectorDetail/sectorDetail.component';
import { SubSectorAdminComponent } from './areas/admin/subSector/subSector.component';
import { MasterCircularAdminComponent } from './areas/admin/masterCircular/masterCircular.component';
import { MasterCircularDetailAdminComponent } from './areas/admin/masterCircularDetail/masterCircularDetail.component';
import { MasterCircularsAdminComponent } from './areas/admin/masterCircular/masterCirculars.component';
import { FAQAdminComponent } from './areas/admin/fAQ/fAQ.component';
import { FAQsAdminComponent } from './areas/admin/fAQ/fAQs.component';
import { FAQCategoryAdminComponent } from './areas/admin/fAQCategory/fAQCategory.component';
import { FAQCategoriesAdminComponent } from './areas/admin/fAQCategory/fAQCategories.component';
import { MasterDirectionAdminComponent } from './areas/admin/masterDirection/masterDirection.component';
import { MasterDirectionsAdminComponent } from './areas/admin/masterDirection/masterDirections.component';
import { MasterDirectionFAQAdminComponent } from './areas/admin/masterDirectionFAQ/masterDirectionFAQ.component';
import { MasterDirectionChapterAdminComponent } from './areas/admin/masterDirectionChapter/masterDirectionChapter.component';
import { MasterDirectionIndexAdminComponent } from './areas/admin/masterDirectionIndex/masterDirectionIndex.component';
import { MasterDirectionSubIndexAdminComponent } from './areas/admin/masterDirectionSubIndex/masterDirectionSubIndex.component';
import { MasterDirectionIndexAmendmentAdminComponent } from './areas/admin/masterDirectionIndexAmendment/masterDirectionIndexAmendment.component';
import { NICCodesAdminComponent } from './areas/admin/nICCode/nICCodes.component';
import { NICCodeAdminComponent } from './areas/admin/nICCode/nICCode.component';
import { ManualsAdminComponent } from './areas/admin/manual/manuals.component';
import { ManualAdminComponent } from './areas/admin/manual/manual.component';
import { FetersCodesAdminComponent } from './areas/admin/fetersCode/fetersCodes.component';
import { FetersCodeAdminComponent } from './areas/admin/fetersCode/fetersCode.component';
import { FetersCodeDetailAdminComponent } from './areas/admin/fetersCodeDetail/fetersCodeDetail.component';
import { FetersCodeGroupDetailAdminComponent } from './areas/admin/fetersCodeGroupDetail/fetersCodeGroupDetail.component';
import { FIPBReviewAdminComponent } from './areas/admin/fIPBReview/fIPBReview.component';
import { FIPBReviewsAdminComponent } from './areas/admin/fIPBReview/fIPBReviews.component';
import { DIPPClarificationAdminComponent } from './areas/admin/dIPPClarification/dIPPClarification.component';
import { DIPPClarificationsAdminComponent } from './areas/admin/dIPPClarification/dIPPClarifications.component';
import { FIPBPressReleaseCaseAdminComponent } from './areas/admin/fIPBPressReleaseCase/fIPBPressReleaseCase.component';
import { FIPBPressReleaseCasesAdminComponent } from './areas/admin/fIPBPressReleaseCase/fIPBPressReleaseCases.component';
import { FormAdminComponent } from './areas/admin/form/form.component';
import { FormsAdminComponent } from './areas/admin/form/forms.component';
import { FormDetailAdminComponent } from './areas/admin/formDetail/formDetail.component';
import { SummariesAdminComponent } from './areas/admin/summary/summaries.component';
import { SummaryAdminComponent } from './areas/admin/summary/summary.component';
import { SummaryDetailAdminComponent } from './areas/admin/summaryDetail/summaryDetail.component';
import { DocumentationAdminComponent } from './areas/admin/documentation/documentation.component';
import { DocumentationsAdminComponent } from './areas/admin/documentation/documentations.component';
import { DocumentationDetailAdminComponent } from './areas/admin/documentationDetail/documentationDetail.component';
import { RBILiaisonOfficeAdminComponent } from './areas/admin/rBILiaisonOffice/rBILiaisonOffice.component';
import { RBILiaisonOfficesAdminComponent } from './areas/admin/rBILiaisonOffice/rBILiaisonOffices.component';
import { RBICompoundingOrderAdminComponent } from './areas/admin/rBICompoundingOrder/rBICompoundingOrder.component';
import { RBICompoundingOrdersAdminComponent } from './areas/admin/rBICompoundingOrder/rBICompoundingOrders.component';
import { RBIDataAdminComponent } from './areas/admin/rBIData/rBIData.component';
import { RBIDatasAdminComponent } from './areas/admin/rBIData/rBIDatas.component';
import { RBIDataDetailAdminComponent } from './areas/admin/rBIDataDetail/rBIDataDetail.component';
import { RulesAdminComponent } from './areas/admin/rules/rules.component';
import { RulessAdminComponent } from './areas/admin/rules/ruless.component';
import { RulesIndexAdminComponent } from './areas/admin/rulesIndex/rulesIndex.component';
import { RulesSubIndexAdminComponent } from './areas/admin/rulesSubIndex/rulesSubIndex.component';
import { GSRNotificationAdminComponent } from './areas/admin/gSRNotification/gSRNotification.component';
import { GSRNotificationsAdminComponent } from './areas/admin/gSRNotification/gSRNotifications.component';
import { RulesIndexAmendmentAdminComponent } from './areas/admin/rulesIndexAmendment/rulesIndexAmendment.component';
import { AuthorWriteUpAdminComponent } from './areas/admin/authorWriteUp/authorWriteUp.component';
import { AuthorWriteUpsAdminComponent } from './areas/admin/authorWriteUp/authorWriteUps.component';
import { AuthorWriteUpDetailAdminComponent } from './areas/admin/authorWriteUpDetail/authorWriteUpDetail.component';
import { AuthorFAQAdminComponent } from './areas/admin/authorFAQ/authorFAQ.component';
import { AuthorFAQsAdminComponent } from './areas/admin/authorFAQ/authorFAQs.component';
import { AuthorFAQDetailAdminComponent } from './areas/admin/authorFAQDetail/authorFAQDetail.component';
import { AuthorFAQQuestionReplyAdminComponent } from './areas/admin/authorFAQQuestionReply/authorFAQQuestionReply.component';
import { KeyDefinitionAdminComponent } from './areas/admin/keyDefinition/keyDefinition.component';
import { KeyDefinitionsAdminComponent } from './areas/admin/keyDefinition/keyDefinitions.component';
import { KeyEventAdminComponent } from './areas/admin/keyEvent/keyEvent.component';
import { KeyEventsAdminComponent } from './areas/admin/keyEvent/keyEvents.component';
import { FEMAModuleAdminComponent } from './areas/admin/fEMAModule/fEMAModule.component';
import { FEMAModulesAdminComponent } from './areas/admin/fEMAModule/fEMAModules.component';
import { SupportTicketAdminComponent } from './areas/admin/supportTicket/supportTicket.component';
import { SupportTicketReplyAdminComponent } from './areas/admin/supportTicketReply/supportTicketReply.component';
import { PostQueryAdminComponent } from './areas/admin/postQuery/postQuery.component';
import { PostQueryReplyAdminComponent } from './areas/admin/postQueryReply/postQueryReply.component';
import { UserProfilesAdminComponent } from './areas/admin/userProfile/userProfiles.component';
import { UserProfileAdminComponent } from './areas/admin/userProfile/userProfile.component';
import { OTPConfirmationForProfileAdminComponent } from './areas/admin/userProfile/otpConfirmationForProfile.component';

import { SpinnerComponent } from './common/spinner.component';
import { SpinnerService } from './service/common/spinner.service';
import { SidebarPanelComponent } from './common/sidebarPanel.component';
import { CommonFieldService } from './service/common/commonField.service';
import { LatesNewsService } from './service/common/latesNews.service';
import { SearchService } from './service/common/search.service';

import { FEMASubModuleOfModuleUserService } from './service/user/fEMASubModuleOfModule.service';
import { UserProfileUserService } from './service/user/userProfile.service';
import { RegulationOfFEMASubModuleDetailUserService } from './service/user/regulationOfFEMASubModuleDetail.service';
import { AuthorWriteUpUserService } from './service/user/authorWriteUp.service';
import { AuthorWriteUpDetailUserService } from './service/user/authorWriteUpDetail.service';
import { ActNameUserService } from './service/user/actName.service';
import { NotificationUserService } from './service/user/notification.service';
import { RulesOfFEMASubModuleDetailUserService } from './service/user/rulesOfFEMASubModuleDetail.service';
import { GSRNotificationUserService } from './service/user/gSRNotification.service';
import { MasterCircularOfFEMASubModuleDetailUserService } from './service/user/masterCircularOfFEMASubModuleDetail.service';
import { APDIRCircularOfFEMASubModuleDetailUserService } from './service/user/aPDIRCircularOfFEMASubModuleDetail.service';
import { PressNoteOfFEMASubModuleDetailUserService } from './service/user/pressNoteOfFEMASubModuleDetail.service';
import { MasterDirectionOfFEMASubModuleDetailUserService } from './service/user/masterDirectionOfFEMASubModuleDetail.service';
import { FDICircularOfFEMASubModuleDetailUserService } from './service/user/fDICircularOfFEMASubModuleDetail.service';
import { NICCodeUserService } from './service/user/nICCode.service';
import { FetersCodeUserService } from './service/user/fetersCode.service';
import { FormSummaryDocumentationUserService } from './service/user/formSummaryDocumentation.service';
import { FIPBReviewUserService } from './service/user/fIPBReview.service';
import { ManualUserService } from './service/user/manual.service';
import { DIPPClarificationUserService } from './service/user/dIPPClarification.service';
import { FIPBPressReleaseCaseUserService } from './service/user/fIPBPressReleaseCase.service';
import { RBIDataUserService } from './service/user/rBIData.service';
import { FAQUserService } from './service/user/fAQ.service';
import { RBIFAQOfFEMASubModuleDetailUserService } from './service/user/rBIFAQOfFEMASubModuleDetail.service';
import { RBICompoundingOrderUserService } from './service/user/rBICompoundingOrder.service';
import { KeyDefinitionEventUserService } from './service/user/keyDefinitionEvent.service';
import { SectorUserService } from './service/user/sector.service';
import { SupportTicketUserService } from './service/user/supportTicket.service';
import { SupportTicketReplyUserService } from './service/user/supportTicketReply.service';
import { PenaltyDetailUserService } from './service/user/penaltyDetail.service';
import { CalculatorSubTopicUserService } from './service/user/calculatorSubTopic.service';
import { CalculatorAnswerUserService } from './service/user/calculatorAnswer.service';
import { SupportTicketSubTopicUserService } from './service/user/supportTicketSubTopic.service';
import { PackageUserService } from './service/user/package.service';
import { SubscriptionUserService } from './service/user/subscription.service';

import { AccountService } from './service/common/account.service';
import { ContactUsService } from './service/common/contactUs.service';
import { ActNameAdminService } from './service/admin/actName.service';
import { AllDefinitionAdminService } from './service/admin/allDefinition.service';
import { RegulationAdminService } from './service/admin/regulation.service';
import { FemaIndexAdminService } from './service/admin/femaIndex.service';
import { IndexAmendmentAdminService } from './service/admin/indexAmendment.service';
import { FemaSubIndexAdminService } from './service/admin/femaSubIndex.service';
import { NotificationAdminService } from './service/admin/notification.service';
import { APDIRCircularAdminService } from './service/admin/aPDIRCircular.service';
import { APDIRCircularBeforeAdminService } from './service/admin/aPDIRCircularBefore.service';
import { APDIRCircularAfterAdminService } from './service/admin/aPDIRCircularAfter.service';
import { PressNoteAdminService } from './service/admin/pressNote.service';
import { PressNoteNotificationAdminService } from './service/admin/pressNoteNotification.service';
import { PressNoteAPDIRCircularAdminService } from './service/admin/pressNoteAPDIRCircular.service';
import { FDICircularAdminService } from './service/admin/fDICircular.service';
import { FDICircularIndexAdminService } from './service/admin/fDICircularIndex.service';
import { FDIChapterAdminService } from './service/admin/fDIChapter.service';
import { FDICircularSubIndexAdminService } from './service/admin/fDICircularSubIndex.service';
import { FDICircularIndexAmendmentAdminService } from './service/admin/fDICircularIndexAmendment.service';
import { SectorAdminService } from './service/admin/sector.service';
import { SectorDetailAdminService } from './service/admin/sectorDetail.service';
import { SubSectorAdminService } from './service/admin/subSector.service';
import { MasterCircularAdminService } from './service/admin/masterCircular.service';
import { MasterCircularDetailAdminService } from './service/admin/masterCircularDetail.service';
import { FAQAdminService } from './service/admin/fAQ.service';
import { FAQCategoryAdminService } from './service/admin/fAQCategory.service';
import { MasterDirectionAdminService } from './service/admin/masterDirection.service';
import { MasterDirectionFAQAdminService } from './service/admin/masterDirectionFAQ.service';
import { MasterDirectionChapterAdminService } from './service/admin/masterDirectionChapter.service';
import { MasterDirectionIndexAdminService } from './service/admin/masterDirectionIndex.service';
import { MasterDirectionSubIndexAdminService } from './service/admin/masterDirectionSubIndex.service';
import { MasterDirectionIndexAmendmentAdminService } from './service/admin/masterDirectionIndexAmendment.service';
import { NICCodeAdminService } from './service/admin/nICCode.service';
import { ManualAdminService } from './service/admin/manual.service';
import { FetersCodeAdminService } from './service/admin/fetersCode.service';
import { FetersCodeDetailAdminService } from './service/admin/fetersCodeDetail.service';
import { FetersCodeGroupDetailAdminService } from './service/admin/fetersCodeGroupDetail.service';
import { FIPBReviewAdminService } from './service/admin/fIPBReview.service';
import { DIPPClarificationAdminService } from './service/admin/dIPPClarification.service';
import { FIPBPressReleaseCaseAdminService } from './service/admin/fIPBPressReleaseCase.service';
import { FormSummaryDocumentationAdminService } from './service/admin/formSummaryDocumentation.service';
import { FormSummaryDocumentationDetailAdminService } from './service/admin/formSummaryDocumentationDetail.service';
import { RBILiaisonOfficeAdminService } from './service/admin/rBILiaisonOffice.service';
import { RBICompoundingOrderAdminService } from './service/admin/rBICompoundingOrder.service';
import { RBIDataAdminService } from './service/admin/rBIData.service';
import { RBIDataDetailAdminService } from './service/admin/rBIDataDetail.service';
import { RulesAdminService } from './service/admin/rules.service';
import { RulesIndexAdminService } from './service/admin/rulesIndex.service';
import { RulesSubIndexAdminService } from './service/admin/rulesSubIndex.service';
import { GSRNotificationAdminService } from './service/admin/gSRNotification.service';
import { RulesIndexAmendmentAdminService } from './service/admin/rulesIndexAmendment.service';
import { AuthorWriteUpAdminService } from './service/admin/authorWriteUp.service';
import { AuthorWriteUpDetailAdminService } from './service/admin/authorWriteUpDetail.service';
import { AuthorFAQAdminService } from './service/admin/authorFAQ.service';
import { AuthorFAQDetailAdminService } from './service/admin/authorFAQDetail.service';
import { AuthorFAQQuestionReplyAdminService } from './service/admin/authorFAQQuestionReply.service';
import { KeyDefinitionEventAdminService } from './service/admin/keyDefinitionEvent.service';
import { FEMASubModuleOfModuleAdminService } from './service/admin/fEMASubModuleOfModule.service';
import { SupportTicketAdminService } from './service/admin/supportTicket.service';
import { SupportTicketReplyAdminService } from './service/admin/supportTicketReply.service';
import { UserProfileAdminService } from './service/admin/userProfile.service';
import { SubscriptionAdminService } from './service/admin/subscription.service';

import { ContentPopUpAdminComponent } from './areas/admin/contentPopUp/contentPopUp.component';

import { ModalDialogModule } from 'ngx-modal-dialog';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { PerfectScrollbarModule, PerfectScrollbarConfigInterface, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';

import { AppComponent } from './app.component';
import { AppRoutes } from './app.routes';

import { SafeHtmlPipe } from './common/safeHtmlPipe';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutes,
        HttpModule,
        CKEditorModule,
        NgbModule.forRoot(),
        ModalDialogModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        ToastrModule.forRoot(),
        NgMultiSelectDropDownModule.forRoot(),
        PerfectScrollbarModule
    ],
    declarations: [
        AppComponent,

        GuestComponent,
        LoginRegisterPopupGuestComponent,

        HomeGuestComponent,
        AboutUsGuestComponent,
        ContactUsGuestComponent,
        SearchedPDFPopupUserComponent,

        UserComponent,
        DashboardUserComponent,
        FEMAModulesUserComponent,
        SupportTicketUserComponent,
        SupportTicketReplyUserComponent,

        RegulationPopupUserComponent,
        AuthorsWriteupPopupUserComponent,
        ActPopupUserComponent,
        MasterDirectionPopupUserComponent,
        FDICircularPopupUserComponent,
        NICCodePopupUserComponent,
        FetersCodePopupUserComponent,
        FormSummaryDocumentationPopupUserComponent,
        FIPBReviewPopupUserComponent,
        ManualPopupUserComponent,
        RBIDIPPFAQPopupUserComponent,
        RBIECBPopupUserComponent,
        RBIODIPopupUserComponent,
        RBICompoundingOrderPopupUserComponent,
        KeyDefinitionPopupUserComponent,
        KeyEventPopupUserComponent,
        SectorSnapshotPopupUserComponent,
        FDIPenaltyCalculatorPopupUserComponent,
        ECBAverageMaturityCalculatorPopupUserComponent,
        CompoundingPenaltyCalculatorPopupUserComponent,
        LOBOPOEligibilityCalculatorPopupUserComponent,
        SubscriptionUserComponent,
        SubscriptionPopupUserComponent,
        UserProfileUserComponent,
        OTPConfirmationForProfileUserComponent,

        AdminComponent,
        PublicAdminComponent,
        LoginAdminComponent,

        DashboardAdminComponent,
        ActNamesAdminComponent,
        ActNameAdminComponent,
        AllDefinitionAdminComponent,
        RegulationsAdminComponent,
        RegulationAdminComponent,
        FemaIndexAdminComponent,
        IndexAmendmentAdminComponent,
        FemaSubIndexAdminComponent,
        NotificationAdminComponent,
        NotificationsAdminComponent,
        ContentPopUpAdminComponent,
        APDIRCircularAdminComponent,
        APDIRCircularsAdminComponent,
        APDIRCircularBeforeAdminComponent,
        APDIRCircularAfterAdminComponent,
        PressNoteAdminComponent,
        PressNotesAdminComponent,
        PressNoteNotificationAdminComponent,
        PressNoteAPDIRCircularAdminComponent,
        FDICircularAdminComponent,
        FDICircularsAdminComponent,
        FDIChapterAdminComponent,
        FDICircularIndexAdminComponent,
        FDICircularIndexAmendmentAdminComponent,
        FDICircularSubIndexAdminComponent,
        SectorAdminComponent,
        SectorsAdminComponent,
        SectorDetailAdminComponent,
        SubSectorAdminComponent,
        MasterCircularAdminComponent,
        MasterCircularDetailAdminComponent,
        MasterCircularsAdminComponent,
        FAQAdminComponent,
        FAQsAdminComponent,
        FAQCategoryAdminComponent,
        FAQCategoriesAdminComponent,
        MasterDirectionsAdminComponent,
        MasterDirectionAdminComponent,
        MasterDirectionFAQAdminComponent,
        MasterDirectionChapterAdminComponent,
        MasterDirectionIndexAdminComponent,
        MasterDirectionSubIndexAdminComponent,
        MasterDirectionIndexAmendmentAdminComponent,
        NICCodesAdminComponent,
        NICCodeAdminComponent,
        ManualAdminComponent,
        ManualsAdminComponent,
        FetersCodeAdminComponent,
        FetersCodesAdminComponent,
        FetersCodeDetailAdminComponent,
        FetersCodeGroupDetailAdminComponent,
        FIPBReviewAdminComponent,
        FIPBReviewsAdminComponent,
        DIPPClarificationAdminComponent,
        DIPPClarificationsAdminComponent,
        FIPBPressReleaseCaseAdminComponent,
        FIPBPressReleaseCasesAdminComponent,
        FormAdminComponent,
        FormsAdminComponent,
        FormDetailAdminComponent,
        SummariesAdminComponent,
        SummaryAdminComponent,
        SummaryDetailAdminComponent,
        DocumentationAdminComponent,
        DocumentationsAdminComponent,
        DocumentationDetailAdminComponent,
        RBILiaisonOfficeAdminComponent,
        RBILiaisonOfficesAdminComponent,
        RBICompoundingOrderAdminComponent,
        RBICompoundingOrdersAdminComponent,
        RBIDataAdminComponent,
        RBIDatasAdminComponent,
        RBIDataDetailAdminComponent,
        RulesAdminComponent,
        RulessAdminComponent,
        RulesIndexAdminComponent,
        RulesSubIndexAdminComponent,
        GSRNotificationAdminComponent,
        GSRNotificationsAdminComponent,
        RulesIndexAmendmentAdminComponent,
        AuthorWriteUpAdminComponent,
        AuthorWriteUpsAdminComponent,
        AuthorWriteUpDetailAdminComponent,
        AuthorFAQAdminComponent,
        AuthorFAQsAdminComponent,
        AuthorFAQDetailAdminComponent,
        AuthorFAQQuestionReplyAdminComponent,
        KeyDefinitionAdminComponent,
        KeyDefinitionsAdminComponent,
        KeyEventAdminComponent,
        KeyEventsAdminComponent,
        FEMAModuleAdminComponent,
        FEMAModulesAdminComponent,
        SupportTicketAdminComponent,
        SupportTicketReplyAdminComponent,
        PostQueryAdminComponent,
        PostQueryReplyAdminComponent,
        UserProfilesAdminComponent,
        UserProfileAdminComponent,
        OTPConfirmationForProfileAdminComponent,

        SafeHtmlPipe,
        SpinnerComponent,
        SidebarPanelComponent
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        },
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        },

        AuthGuardAdmin,
        AuthGuardUser,

        SpinnerService,
        CommonFieldService,
        SearchService,
        LatesNewsService,

        FEMASubModuleOfModuleUserService,
        UserProfileUserService,
        RegulationOfFEMASubModuleDetailUserService,
        AuthorWriteUpUserService,
        AuthorWriteUpDetailUserService,
        ActNameUserService,
        NotificationUserService,
        RulesOfFEMASubModuleDetailUserService,
        GSRNotificationUserService,
        MasterCircularOfFEMASubModuleDetailUserService,
        APDIRCircularOfFEMASubModuleDetailUserService,
        PressNoteOfFEMASubModuleDetailUserService,
        MasterDirectionOfFEMASubModuleDetailUserService,
        FDICircularOfFEMASubModuleDetailUserService,
        NICCodeUserService,
        FetersCodeUserService,
        FormSummaryDocumentationUserService,
        FIPBReviewUserService,
        ManualUserService,
        DIPPClarificationUserService,
        FIPBPressReleaseCaseUserService,
        RBIDataUserService,
        FAQUserService,
        RBIFAQOfFEMASubModuleDetailUserService,
        RBICompoundingOrderUserService,
        KeyDefinitionEventUserService,
        SectorUserService,
        SupportTicketUserService,
        SupportTicketReplyUserService,
        PenaltyDetailUserService,
        CalculatorSubTopicUserService,
        CalculatorAnswerUserService,
        SupportTicketSubTopicUserService,
        PackageUserService,
        SubscriptionUserService,

        AccountService,
        ContactUsService,
        ActNameAdminService,
        AllDefinitionAdminService,
        RegulationAdminService,
        FemaIndexAdminService,
        IndexAmendmentAdminService,
        FemaSubIndexAdminService,
        NotificationAdminService,
        APDIRCircularAdminService,
        APDIRCircularBeforeAdminService,
        APDIRCircularAfterAdminService,
        PressNoteAdminService,
        PressNoteNotificationAdminService,
        PressNoteAPDIRCircularAdminService,
        FDICircularAdminService,
        FDIChapterAdminService,
        FDICircularIndexAdminService,
        FDICircularSubIndexAdminService,
        FDICircularIndexAmendmentAdminService,
        SectorAdminService,
        SectorDetailAdminService,
        SubSectorAdminService,
        MasterCircularAdminService,
        MasterCircularDetailAdminService,
        FAQAdminService,
        FAQCategoryAdminService,
        MasterDirectionAdminService,
        MasterDirectionFAQAdminService,
        MasterDirectionChapterAdminService,
        MasterDirectionIndexAdminService,
        MasterDirectionSubIndexAdminService,
        MasterDirectionIndexAmendmentAdminService,
        NICCodeAdminService,
        ManualAdminService,
        FetersCodeAdminService,
        FetersCodeDetailAdminService,
        FetersCodeGroupDetailAdminService,
        FIPBReviewAdminService,
        DIPPClarificationAdminService,
        FIPBPressReleaseCaseAdminService,
        FormSummaryDocumentationAdminService,
        FormSummaryDocumentationDetailAdminService,
        RBILiaisonOfficeAdminService,
        RBICompoundingOrderAdminService,
        RBIDataAdminService,
        RBIDataDetailAdminService,
        RulesAdminService,
        RulesIndexAdminService,
        RulesSubIndexAdminService,
        GSRNotificationAdminService,
        RulesIndexAmendmentAdminService,
        AuthorWriteUpAdminService,
        AuthorWriteUpDetailAdminService,
        AuthorFAQAdminService,
        AuthorFAQDetailAdminService,
        AuthorFAQQuestionReplyAdminService,
        KeyDefinitionEventAdminService,
        FEMASubModuleOfModuleAdminService,
        SupportTicketAdminService,
        SupportTicketReplyAdminService,
        UserProfileAdminService,
        SubscriptionAdminService
    ],
    entryComponents: [
        ContentPopUpAdminComponent,
        OTPConfirmationForProfileAdminComponent,
        LoginRegisterPopupGuestComponent,
        SearchedPDFPopupUserComponent,
        RegulationPopupUserComponent,
        AuthorsWriteupPopupUserComponent,
        ActPopupUserComponent,
        MasterDirectionPopupUserComponent,
        FDICircularPopupUserComponent,
        NICCodePopupUserComponent,
        FetersCodePopupUserComponent,
        FormSummaryDocumentationPopupUserComponent,
        FIPBReviewPopupUserComponent,
        ManualPopupUserComponent,
        RBIECBPopupUserComponent,
        RBIODIPopupUserComponent,
        RBIDIPPFAQPopupUserComponent,
        RBICompoundingOrderPopupUserComponent,
        KeyDefinitionPopupUserComponent,
        KeyEventPopupUserComponent,
        SectorSnapshotPopupUserComponent,
        FDIPenaltyCalculatorPopupUserComponent,
        ECBAverageMaturityCalculatorPopupUserComponent,
        CompoundingPenaltyCalculatorPopupUserComponent,
        LOBOPOEligibilityCalculatorPopupUserComponent,
        SubscriptionPopupUserComponent,
        OTPConfirmationForProfileUserComponent
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
