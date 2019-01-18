export class SubSector {
    SubSectorId: number;
    SectorId: number;
    Name: string;
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

export class GetSubSectorRequest {
    SubSectorId: number;
    SectorId: number;
    SearchText: string;
    IsActive: boolean;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    OrderByDirection: string;
}