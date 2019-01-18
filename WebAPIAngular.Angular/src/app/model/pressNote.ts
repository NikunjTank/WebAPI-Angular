export class PressNote {
    PressNoteId: number;
    PressNoteNo: string;
    PressNoteName: string;
    PressNoteDate: string;
    PressNoteEffectiveDate: string;
    Year: string;
    PressNotePDF: string;
    IsDeleted: boolean;
    IsActive: boolean;
    CreatedDate: string;
    ModifiedDate: string;
}

export class GetPressNoteRequest {
    PressNoteId: number;
    Year: string;
    SearchText: string;
    IsActive: boolean;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    OrderByDirection: string;
}