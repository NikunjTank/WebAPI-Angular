export class RBILiaisonOffice {
    RBILiaisonOfficeId: number;
    SerialNo: number;
    NameAndAddressOfTheCompany: string;
    PlaceOfTheLiaisonOffice: string;
    DateOfApprovalGrantedOrUINAlloted: string;
    UIN: string;
    IsDeleted: boolean;
    IsActive: boolean;
    CreatedDate: string;
    ModifiedDate: string;
}

export class GetRBILiaisonOfficeRequest {
    RBILiaisonOfficeId: number;
    SearchText: string;
    IsActive: boolean;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    OrderByDirection: string;
}

export class AddRBILiaisonOfficeFromFileResponse {
    SuccessRow: number;
    SkippedRow: number;
    ErrorRow: number;
    NotProcessedRow: NotProcessedRow[];
}

export class NotProcessedRow {
    SerialNo: number;
    NameAndAddressOfTheCompany: string;
    PlaceOfTheLiaisonOffice: string;
    DateOfApprovalGrantedOrUINAlloted: string;
    UIN: string;
    Status: string;
    LineNumber: string;
}