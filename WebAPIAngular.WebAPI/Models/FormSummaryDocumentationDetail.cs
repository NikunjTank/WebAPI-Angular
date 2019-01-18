using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class FormSummaryDocumentationDetail
    {
        public int? FormSummaryDocumentationDetailId { get; set; }
        public int? FormSummaryDocumentationId { get; set; }
        public string FormName { get; set; }
        public string WordFileName { get; set; }
        public string ExcelFileName { get; set; }
        public string PDFFileName { get; set; }
        public string SubMenuName { get; set; }
        public int ModifiedBy { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
        public bool IsPagingRequired { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
        public int Result { get; set; }
    }

    public class GetFormSummaryDocumentationDetailRequest
    {
        public int? FormSummaryDocumentationDetailId { get; set; }
        public int? FormSummaryDocumentationId { get; set; }
        public string SubMenuName { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsVerified { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
    }

    public class GetFormSummaryDocumentationDetailResponse
    {
        public int? FormSummaryDocumentationDetailId { get; set; }
        public int? FormSummaryDocumentationId { get; set; }
        public string FormName { get; set; }
        public string WordFileName { get; set; }
        public string ExcelFileName { get; set; }
        public string PDFFileName { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
    }

    public class AddFormSummaryDocumentationDetailRequest
    {
        [Required]
        public int FormSummaryDocumentationId { get; set; }
        [Required]
        public string FormName { get; set; }
        public string WordFileName { get; set; }
        public string ExcelFileName { get; set; }
        public string PDFFileName { get; set; }
        [Required]
        public string SubMenuName { get; set; }
    }

    public class UpdateFormSummaryDocumentationDetailRequest
    {
        [Required]
        public int FormSummaryDocumentationDetailId { get; set; }
        [Required]
        public int FormSummaryDocumentationId { get; set; }
        [Required]
        public string FormName { get; set; }
        public string WordFileName { get; set; }
        public string ExcelFileName { get; set; }
        public string PDFFileName { get; set; }
        [Required]
        public string SubMenuName { get; set; }
    }

    public class DeleteFormSummaryDocumentationDetailRequest
    {
        [Required]
        public int FormSummaryDocumentationDetailId { get; set; }
        [Required]
        public string SubMenuName { get; set; }
    }
}