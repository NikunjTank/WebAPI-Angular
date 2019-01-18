export class CalculatorSubTopic {
    CalculatorSubTopicId: number;
    FEMAModuleId: number;
    CalculatorSubTopicName: string;
    IsDeleted: boolean;
    IsActive: boolean;
    CreatedDate: string;
    ModifiedDate: string;
}

export class GetCalculatorSubTopicRequest {
    CalculatorSubTopicId: number;
    FEMAModuleId: number;
    SearchText: string;
    IsActive: boolean;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    OrderByDirection: string;
    IsPagingRequired: boolean;
}