export class PressNoteNotification {
    PressNoteNotificationId: number;
    PressNoteId: number;
    NotificationId: number;
    RegulationId: number;
    RegulationNumber: string;
    NotificationNumber: string;
    NotificationName: string;
    NotificationDate: string;
    NotificationEffectiveDate: string;
    NotificationTypeId: number;
    NotificationTypeName: string;
    GSRNo: string;
    GSRDate: string;
    NotificationPDF: string;
    GSRPDF: string;
    IsDeleted: boolean;
    IsActive: boolean;
    CreatedDate: string;
    ModifiedDate: string;
}

export class GetPressNoteNotificationRequest {
    PressNoteNotificationId: number;
    PressNoteId: number;
    SearchText: string;
    IsActive: boolean;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    OrderByDirection: string;
}