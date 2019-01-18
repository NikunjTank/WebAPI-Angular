using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class RulesOfFEMASubModuleDetail
    {
        public int? FEMASubModuleOfModuleId { get; set; }
        public int? RulesId { get; set; }
        public string RulesNumber { get; set; }
        public string RulesName { get; set; }
        public int? Year { get; set; }
        public DateTime? PublicationDate { get; set; }
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
    public class GetRulesOfFEMASubModuleDetailRequest
    {
        public int? FEMASubModuleOfModuleId { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsVerified { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
    }

    public class GetRulesOfFEMASubModuleDetailResponse
    {
        public int? RulesId { get; set; }
        public string RulesNumber { get; set; }        
        public string RulesName { get; set; }
        public int? Year { get; set; }
        public DateTime? PublicationDate { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
    }
}