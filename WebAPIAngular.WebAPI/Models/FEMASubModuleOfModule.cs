using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class FEMASubModuleOfModule
    {
        public int? FEMASubModuleOfModuleId { get; set; }
        public int? FEMAModuleId { get; set; }
        public int? FEMASubModuleId { get; set; }        
        public string RegulationKeyModuleDetail { get; set; }
        public string RulesKeyModuleDetail { get; set; }
        public string MasterDirectionKeyModuleDetail { get; set; }
        public string MasterCircularKeyModuleDetail { get; set; }
        public string RBIFAQKeyModuleDetail { get; set; }
        public string FEMASubModuleName { get; set; }
        public int? FEMAKeyModuleId { get; set; }
        public string FEMAKeyModuleName { get; set; }
        public string FEMAKeyModuleDetail { get; set; }
        public string FEMAKeyModuleDetailNames { get; set; }
        public int CreatedBy { get; set; }
        public int ModifiedBy { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
        public bool IsActive { get; set; }
        public bool IsPagingRequired { get; set; }
        public int Result { get; set; }
    }

    public class GetFEMASubModuleOfModuleRequest
    {
        public int? FEMAModuleId { get; set; }
        public int? FEMASubModuleOfModuleId { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
    }

    public class GetFEMASubModuleOfModuleResponse
    {
        public int? FEMASubModuleOfModuleId { get; set; }
        public int? FEMAModuleId { get; set; }
        public int? FEMASubModuleId { get; set; }
        public string FEMASubModuleName { get; set; }
        public int? FEMAKeyModuleId { get; set; }
        public string FEMAKeyModuleName { get; set; }
        public string FEMAKeyModuleDetail { get; set; }
        public string FEMAKeyModuleDetailNames { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
    }

    public class AddFEMASubModuleOfModuleRequest
    {
        [Required]
        public int FEMAModuleId { get; set; }
        [Required]
        public int FEMASubModuleId { get; set; }
        public string RegulationKeyModuleDetail { get; set; }
        public string RulesKeyModuleDetail { get; set; }
        public string MasterDirectionKeyModuleDetail { get; set; }
        public string MasterCircularKeyModuleDetail { get; set; }
        public string RBIFAQKeyModuleDetail { get; set; }
    }

    public class UpdateFEMASubModuleOfModuleRequest
    {
        [Required]
        public int FEMASubModuleOfModuleId { get; set; }
        [Required]
        public int FEMAModuleId { get; set; }
        [Required]
        public int FEMASubModuleId { get; set; }
        public string RegulationKeyModuleDetail { get; set; }
        public string RulesKeyModuleDetail { get; set; }
        public string MasterDirectionKeyModuleDetail { get; set; }
        public string MasterCircularKeyModuleDetail { get; set; }
        public string RBIFAQKeyModuleDetail { get; set; }
    }

    public class DeleteFEMASubModuleOfModuleRequest
    {
        [Required]
        public int FEMASubModuleOfModuleId { get; set; }
    }
}