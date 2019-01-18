export class FIPBPressReleaseCase {
    FIPBPressReleaseCaseId: number;
    MinistryName: string;
    MeetingNo_Detail: string;
    PDF: string;
    IsDeleted: boolean;
    IsActive: boolean;
    CreatedDate: string;
    ModifiedDate: string;
}

export class GetFIPBPressReleaseCaseRequest {
    FIPBPressReleaseCaseId: number;
    SearchText: string;
    IsActive: boolean;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    OrderByDirection: string;
}