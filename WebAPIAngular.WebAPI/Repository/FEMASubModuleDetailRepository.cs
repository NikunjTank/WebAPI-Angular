using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class FEMASubModuleDetailRepository : IFEMASubModuleDetail
    {
        #region Get RegulationOfFEMASubModuleDetail data
        public IEnumerable<RegulationOfFEMASubModuleDetail> GetRegulationOfFEMASubModuleDetail(RegulationOfFEMASubModuleDetail regulationOfFEMASubModuleDetail)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var regulationOfFEMASubModuleDetails = dataContext.RegulationOfFEMASubModuleDetailGet(regulationOfFEMASubModuleDetail.FEMASubModuleOfModuleId, Utility.TrimString(regulationOfFEMASubModuleDetail.SearchText), regulationOfFEMASubModuleDetail.IsActive, regulationOfFEMASubModuleDetail.PageNumber, regulationOfFEMASubModuleDetail.PageSize, regulationOfFEMASubModuleDetail.IsPagingRequired, Utility.TrimString(regulationOfFEMASubModuleDetail.OrderBy), Utility.TrimString(regulationOfFEMASubModuleDetail.OrderByDirection), totalPageCount, totalRecord).ToList();

                var regulationOfFEMASubModuleDetailList = new List<RegulationOfFEMASubModuleDetail>();
                foreach (var regulationOfFEMASubModuleDetailDetail in regulationOfFEMASubModuleDetails)
                {
                    regulationOfFEMASubModuleDetailList.Add(new RegulationOfFEMASubModuleDetail()
                    {
                        RegulationId = regulationOfFEMASubModuleDetailDetail.Regulationid,
                        RegulationNumber = regulationOfFEMASubModuleDetailDetail.Regulationnumber,
                        RegulationName = regulationOfFEMASubModuleDetailDetail.Regulationname,
                        Year = regulationOfFEMASubModuleDetailDetail.Year,
                        PublicationDate = regulationOfFEMASubModuleDetailDetail.PublicationDate,
                        IsActive = regulationOfFEMASubModuleDetailDetail.Isactive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return regulationOfFEMASubModuleDetailList;
            }
        }
        #endregion

        #region Get RulesOfFEMASubModuleDetail data
        public IEnumerable<RulesOfFEMASubModuleDetail> GetRulesOfFEMASubModuleDetail(RulesOfFEMASubModuleDetail rulesOfFEMASubModuleDetail)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var rulesOfFEMASubModuleDetails = dataContext.RulesOfFEMASubModuleDetailGet(rulesOfFEMASubModuleDetail.FEMASubModuleOfModuleId, Utility.TrimString(rulesOfFEMASubModuleDetail.SearchText), rulesOfFEMASubModuleDetail.IsActive, rulesOfFEMASubModuleDetail.PageNumber, rulesOfFEMASubModuleDetail.PageSize, rulesOfFEMASubModuleDetail.IsPagingRequired, Utility.TrimString(rulesOfFEMASubModuleDetail.OrderBy), Utility.TrimString(rulesOfFEMASubModuleDetail.OrderByDirection), totalPageCount, totalRecord).ToList();

                var rulesOfFEMASubModuleDetailList = new List<RulesOfFEMASubModuleDetail>();
                foreach (var rulesOfFEMASubModuleDetailItem in rulesOfFEMASubModuleDetails)
                {
                    rulesOfFEMASubModuleDetailList.Add(new RulesOfFEMASubModuleDetail()
                    {
                        RulesId = rulesOfFEMASubModuleDetailItem.Rulesid,
                        RulesNumber = rulesOfFEMASubModuleDetailItem.RulesNo,
                        RulesName = rulesOfFEMASubModuleDetailItem.NameofRules,
                        Year = rulesOfFEMASubModuleDetailItem.Year,
                        PublicationDate = rulesOfFEMASubModuleDetailItem.PublicationDate,
                        IsActive = rulesOfFEMASubModuleDetailItem.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return rulesOfFEMASubModuleDetailList;
            }
        }
        #endregion

        #region Get MasterCircularOfFEMASubModuleDetail data
        public IEnumerable<MasterCircularOfFEMASubModuleDetail> GetMasterCircularOfFEMASubModuleDetail(MasterCircularOfFEMASubModuleDetail masterCircularOfFEMASubModuleDetail)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var masterCircularOfFEMASubModuleDetails = dataContext.MasterCircularOfFEMASubModuleDetailGet(masterCircularOfFEMASubModuleDetail.FEMASubModuleOfModuleId, Utility.TrimString(masterCircularOfFEMASubModuleDetail.SearchText), masterCircularOfFEMASubModuleDetail.IsActive, masterCircularOfFEMASubModuleDetail.PageNumber, masterCircularOfFEMASubModuleDetail.PageSize, masterCircularOfFEMASubModuleDetail.IsPagingRequired, Utility.TrimString(masterCircularOfFEMASubModuleDetail.OrderBy), Utility.TrimString(masterCircularOfFEMASubModuleDetail.OrderByDirection), totalPageCount, totalRecord).ToList();

                var masterCircularOfFEMASubModuleDetailList = new List<MasterCircularOfFEMASubModuleDetail>();
                foreach (var masterCircularOfFEMASubModuleDetailItem in masterCircularOfFEMASubModuleDetails)
                {
                    masterCircularOfFEMASubModuleDetailList.Add(new MasterCircularOfFEMASubModuleDetail()
                    {
                        MasterCircularId = masterCircularOfFEMASubModuleDetailItem.MCID,
                        MasterCircularName = masterCircularOfFEMASubModuleDetailItem.Name,
                        IsActive = masterCircularOfFEMASubModuleDetailItem.Isactive,
                        CreatedBy = masterCircularOfFEMASubModuleDetail.CreatedBy,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return masterCircularOfFEMASubModuleDetailList;
            }
        }
        #endregion

        #region Get MasterDirectionOfFEMASubModuleDetail data
        public IEnumerable<MasterDirectionOfFEMASubModuleDetail> GetMasterDirectionOfFEMASubModuleDetail(MasterDirectionOfFEMASubModuleDetail masterDirectionOfFEMASubModuleDetail)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var masterDirectionOfFEMASubModuleDetails = dataContext.MasterDirectionOfFEMASubModuleDetailGet(masterDirectionOfFEMASubModuleDetail.FEMASubModuleOfModuleId, Utility.TrimString(masterDirectionOfFEMASubModuleDetail.SearchText), masterDirectionOfFEMASubModuleDetail.IsActive, masterDirectionOfFEMASubModuleDetail.PageNumber, masterDirectionOfFEMASubModuleDetail.PageSize, masterDirectionOfFEMASubModuleDetail.IsPagingRequired, Utility.TrimString(masterDirectionOfFEMASubModuleDetail.OrderBy), Utility.TrimString(masterDirectionOfFEMASubModuleDetail.OrderByDirection), totalPageCount, totalRecord).ToList();

                var masterDirectionOfFEMASubModuleDetailList = new List<MasterDirectionOfFEMASubModuleDetail>();
                foreach (var masterDirectionOfFEMASubModuleDetailItem in masterDirectionOfFEMASubModuleDetails)
                {
                    masterDirectionOfFEMASubModuleDetailList.Add(new MasterDirectionOfFEMASubModuleDetail()
                    {
                        MasterDirectionId = masterDirectionOfFEMASubModuleDetailItem.MDID,
                        MasterDirectionName = masterDirectionOfFEMASubModuleDetailItem.MasterDIrectionName,
                        Year = masterDirectionOfFEMASubModuleDetailItem.Year,
                        PDF = masterDirectionOfFEMASubModuleDetailItem.PDF,
                        IsActive = masterDirectionOfFEMASubModuleDetailItem.IsActive,                        
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return masterDirectionOfFEMASubModuleDetailList;
            }
        }
        #endregion

        #region Get RBIFAQOfFEMASubModuleDetail data
        public IEnumerable<RBIFAQOfFEMASubModuleDetail> GetRBIFAQOfFEMASubModuleDetail(RBIFAQOfFEMASubModuleDetail rBIFAQOfFEMASubModuleDetail)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var rBIFAQOfFEMASubModuleDetails = dataContext.RBIFAQOfFEMASubModuleDetailGet(rBIFAQOfFEMASubModuleDetail.FEMASubModuleOfModuleId, Utility.TrimString(rBIFAQOfFEMASubModuleDetail.SearchText), rBIFAQOfFEMASubModuleDetail.IsActive, rBIFAQOfFEMASubModuleDetail.PageNumber, rBIFAQOfFEMASubModuleDetail.PageSize, rBIFAQOfFEMASubModuleDetail.IsPagingRequired, Utility.TrimString(rBIFAQOfFEMASubModuleDetail.OrderBy), Utility.TrimString(rBIFAQOfFEMASubModuleDetail.OrderByDirection), totalPageCount, totalRecord).ToList();

                var rBIFAQOfFEMASubModuleDetailList = new List<RBIFAQOfFEMASubModuleDetail>();
                foreach (var rBIFAQOfFEMASubModuleDetailItem in rBIFAQOfFEMASubModuleDetails)
                {
                    rBIFAQOfFEMASubModuleDetailList.Add(new RBIFAQOfFEMASubModuleDetail()
                    {
                        FAQId = rBIFAQOfFEMASubModuleDetailItem.FAQID,
                        CategoryId = Convert.ToInt32(rBIFAQOfFEMASubModuleDetailItem.CategoryId),
                        CategoryName = rBIFAQOfFEMASubModuleDetailItem.CategoryName,
                        TopicName = rBIFAQOfFEMASubModuleDetailItem.FAQTopicName,
                        PDF = rBIFAQOfFEMASubModuleDetailItem.PDF,
                        IsActive = rBIFAQOfFEMASubModuleDetailItem.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return rBIFAQOfFEMASubModuleDetailList;
            }
        }
        #endregion
    }
}