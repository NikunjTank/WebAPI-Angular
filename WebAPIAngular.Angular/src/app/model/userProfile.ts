export class UserProfile {
    UserId: number;
    FirstName: string;
    LastName: string;
    CompanyName: string;
    SubscriptionStatus: string;
    City: string;
    Gender: string;
    Mobile: string;
    UserName: string;
    IsDeleted: boolean;
    IsActive: boolean;
    CreatedDate: string;
    ModifiedDate: string;
}

export class GetUserProfileRequest {
    UserId: number;
    SearchText: string;
    IsActive: boolean;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    OrderByDirection: string;
}