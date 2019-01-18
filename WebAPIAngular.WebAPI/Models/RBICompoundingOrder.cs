using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class RBICompoundingOrder
    {
        public int? RBICompoundingOrderId { get; set; }
        public string ApplicantName { get; set; }
        public string OrderGist { get; set; }
        public string Topic { get; set; }
        public string FEMRegulationRuleNo { get; set; }
        public DateTime? OrderDate { get; set; }
        public decimal? PenaltyAmount { get; set; }
        public string Regional_CentralOfficeOfRBI { get; set; }
        public string PDF { get; set; }
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

    public class GetRBICompoundingOrderRequest
    {
        public int? RBICompoundingOrderId { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
    }

    public class GetRBICompoundingOrderResponse
    {
        public int? RBICompoundingOrderId { get; set; }
        public string ApplicantName { get; set; }
        public string OrderGist { get; set; }
        public string Topic { get; set; }
        public string FEMRegulationRuleNo { get; set; }
        public DateTime? OrderDate { get; set; }
        public decimal? PenaltyAmount { get; set; }
        public string Regional_CentralOfficeOfRBI { get; set; }
        public string PDF { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
    }

    public class AddRBICompoundingOrderRequest
    {
        [Required]
        public string ApplicantName { get; set; }
        [Required]
        public string OrderGist { get; set; }
        [Required]
        public string Topic { get; set; }
        [Required]
        public string FEMRegulationRuleNo { get; set; }
        [Required]
        public DateTime OrderDate { get; set; }
        [Required]
        public decimal PenaltyAmount { get; set; }
        [Required]
        public string Regional_CentralOfficeOfRBI { get; set; }
        [Required]
        public string PDF { get; set; }
    }

    public class UpdateRBICompoundingOrderRequest
    {
        [Required]
        public int RBICompoundingOrderId { get; set; }
        [Required]
        public string ApplicantName { get; set; }
        [Required]
        public string OrderGist { get; set; }
        [Required]
        public string Topic { get; set; }
        [Required]
        public string FEMRegulationRuleNo { get; set; }
        [Required]
        public DateTime OrderDate { get; set; }
        [Required]
        public decimal PenaltyAmount { get; set; }
        [Required]
        public string Regional_CentralOfficeOfRBI { get; set; }
        [Required]
        public string PDF { get; set; }
    }

    public class DeleteRBICompoundingOrderRequest
    {
        [Required]
        public int RBICompoundingOrderId { get; set; }
    }
}