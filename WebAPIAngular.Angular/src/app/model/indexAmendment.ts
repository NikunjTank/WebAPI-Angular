export class IndexAmendment {
    IndexAmendmentId: number;
    RegulationId: number;
    NotificationId: number;
    NotificationDate: string;
    IndexId: number;
    SubIndexId: number;
    IndexAmendmentContent: string;
    IsDeleted: boolean;
    IsActive: boolean;
    CreatedDate: string;
    ModifiedDate: string;
}

export class GetIndexAmendmentRequest {
    IndexAmendmentId: number;
    RegulationId: number;
    NotificationId: number;
    SearchText: string;
    IsActive: boolean;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    OrderByDirection: string;
}