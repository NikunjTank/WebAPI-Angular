export class PressNoteOfFEMASubModuleDetail {
    PressNoteId: number;
    PressNoteNo: string;
    PressNoteName: string;
    PressNoteDate: Date;
    Year: string;
    PressNotePDF: string;
    PressNoteEffectiveDate: Date;
    IsDeleted: boolean;
    IsActive: boolean;
    CreatedDate: string;
    ModifiedDate: string;
}

export class GetPressNoteOfFEMASubModuleDetailRequest {
    PressNoteId: number;
    Year: string;
    SearchText: string;
    IsActive: boolean;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    OrderByDirection: string;
}