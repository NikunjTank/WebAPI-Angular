export class SectorDetail {
    SectorDetailId: number;
    SectorId: number;
    Year: number;
    PressNoteId: number;
    PressNoteNo: string;
    NotificationId: number;
    NotificationNo: string;
    APDIRCircularId: number;
    APDIRCircularNo: string;
    IsDeleted: boolean;
    IsActive: boolean;
    CreatedDate: string;
    ModifiedDate: string;
}

export class GetSectorDetailRequest {
    SectorDetailId: number;
    SectorId: number;
    SubSectorId: number;
    SearchText: string;
    IsActive: boolean;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    OrderByDirection: string;
}