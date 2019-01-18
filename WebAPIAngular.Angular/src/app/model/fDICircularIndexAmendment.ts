export class FDICircularIndexAmendment {
    FDICircularIndexAmendmentId: number;
    FDICircularId: number;
    PressNoteId: number;
    FDIChapterId: number;
    FDICircularIndexId: number;
    FDICircularSubIndexId: number;
    IndexAmendmentContent: string;
    PressNoteDate: string;
    IsDeleted: boolean;
    IsActive: boolean;
    CreatedDate: string;
    ModifiedDate: string;
}

export class GetFDICircularIndexAmendmentRequest {
    FDICircularIndexAmendmentId: number;
    FDICircularId: number;
    SearchText: string;
    IsActive: boolean;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    OrderByDirection: string;
}