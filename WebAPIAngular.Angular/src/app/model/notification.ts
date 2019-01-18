export class Notification {
    NotificationId: number;
    RegulationId: number;
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

export class GetNotificationRequest {
    NotificationId: number;
    RegulationId: number;
    SearchText: string;
    IsActive: boolean;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    OrderByDirection: string;
}

export class NotificationType {
    NotificationTypeId: number;
    NotificationTypeName: string;
}

export class GetNotificationTypeRequest {
    NotificationTypeId: number;
}