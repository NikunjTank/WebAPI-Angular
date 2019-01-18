export class Regulation {
    RegulationId: number;
    RegulationName: string;
    RegulationNumber: string;
    Year: string;
    PublicationDate: string;
    IsDeleted: boolean;
    IsActive: boolean;
    CreatedDate: string;
    ModifiedDate: string;
}

export class GetRegulationRequest {
    RegulationId: number;
    SearchText: string;
    IsActive: boolean;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    OrderByDirection: string;
}