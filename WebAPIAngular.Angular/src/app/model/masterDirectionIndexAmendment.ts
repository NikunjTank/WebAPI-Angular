export class MasterDirectionIndexAmendment {
    MasterDirectionIndexAmendmentId: number;
    MasterDirectionId: number;
    APDIRCircularId: number;
    MasterDirectionChapterId: number;
    MasterDirectionIndexId: number;
    MasterDirectionSubIndexId: number;
    IndexAmendmentContent: string;
    APDIRCircularDate: string;
    NotificationDate: string;
    IsDeleted: boolean;
    IsActive: boolean;
    CreatedDate: string;
    ModifiedDate: string;
}

export class GetMasterDirectionIndexAmendmentRequest {
    MasterDirectionIndexAmendmentId: number;
    MasterDirectionId: number;
    SearchText: string;
    IsActive: boolean;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    OrderByDirection: string;
}