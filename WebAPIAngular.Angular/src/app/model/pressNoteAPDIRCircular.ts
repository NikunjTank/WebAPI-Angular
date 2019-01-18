export class PressNoteAPDIRCircular {
    PressNoteAPDIRCircularId: number;
    PressNoteId: number;
    APDIRCircularId: number;
    APDIRCircularNo: string;
    APDIRCircularName: string;
    APDIRCircularDate: string;
    APDIRCircularEffectiveDate: string;
    Year: string;
    APDIRCircularPDF: string;
    IsDeleted: boolean;
    IsActive: boolean;
    CreatedDate: string;
    ModifiedDate: string;
}

export class GetPressNoteAPDIRCircularRequest {
    PressNoteAPDIRCircularId: number;
    PressNoteId: number;
    SearchText: string;
    IsActive: boolean;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    OrderByDirection: string;
}