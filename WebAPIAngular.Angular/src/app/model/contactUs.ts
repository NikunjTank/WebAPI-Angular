export class ContactUs {
    ContactUsId: number;
    Name: string;
    Email: string;
    Mobile: string;
    Comment: string;
    IsDeleted: boolean;
    IsActive: boolean;
    CreatedDate: string;
    ModifiedDate: string;
}

export class GetContactUsRequest {
    ContactUsId: number;
    SearchText: string;
    IsActive: boolean;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    OrderByDirection: string;
    IsPagingRequired: boolean;
}