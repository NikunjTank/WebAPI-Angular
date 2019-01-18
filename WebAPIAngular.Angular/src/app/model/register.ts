export class Register {
    RoleId: number;
    UserId: number;      
    FirstName: string;
    LastName: string;
    CompanyName: string;
    ProfessionalQualificationId: number;
    UserName: string;
    Mobile: string;  
    City: string;
    Gender: string;    
    IsSendOTPtoMobile: boolean;
    IsSendOTPtoEmail: boolean;
}

export class VerifyAccount {
    UserName: string;
    Mobile: string;
    MobileOTP: string;
    EmailOTP: string;
}