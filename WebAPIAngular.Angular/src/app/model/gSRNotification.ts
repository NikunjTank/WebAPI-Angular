export class GSRNotification {
    GSRNotificationId: number;
    RulesId: number;
    RulesName: string;
    GSRNotificationNo: string;
    GSRNotificationName: string;
    GSRNotificationDate: string;
    GSRNotificationEffectiveDate: string;
    GSRNotificationTypeId: number;
    GSRNotificationTypeName: string;
    IsDeleted: boolean;
    IsActive: boolean;
    CreatedDate: string;
    ModifiedDate: string;
}

export class GetGSRNotificationRequest {
    GSRNotificationId: number;
    RulesId: number;
    SearchText: string;
    IsActive: boolean;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    OrderByDirection: string;
}

export class GSRNotificationType {
    GSRNotificationTypeId: number;
    GSRNotificationTypeName: string;
}

export class GetGSRNotificationTypeRequest {
    GSRNotificationTypeId: number;
}