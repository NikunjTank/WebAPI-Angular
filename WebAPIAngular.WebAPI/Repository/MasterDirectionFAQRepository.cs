using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class MasterDirectionFAQRepository : IMasterDirectionFAQ
    {
        #region Add MasterDirectionFAQ
        public int AddMasterDirectionFAQ(MasterDirectionFAQ masterDirectionFAQ)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.MasterDirectionFAQAdd(masterDirectionFAQ.MasterDirectionId, masterDirectionFAQ.FAQId, masterDirectionFAQ.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update MasterDirectionFAQ data
        public int UpdateMasterDirectionFAQ(MasterDirectionFAQ masterDirectionFAQ)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.MasterDirectionFAQUpdate(masterDirectionFAQ.MasterDirectionFAQId, masterDirectionFAQ.MasterDirectionId, masterDirectionFAQ.FAQId, masterDirectionFAQ.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get MasterDirectionFAQ data
        public IEnumerable<MasterDirectionFAQ> GetMasterDirectionFAQ(MasterDirectionFAQ masterDirectionFAQ)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var masterDirectionFAQs = dataContext.MasterDirectionFAQGet(masterDirectionFAQ.MasterDirectionFAQId, masterDirectionFAQ.MasterDirectionId, Utility.TrimString(masterDirectionFAQ.SearchText), masterDirectionFAQ.IsActive, masterDirectionFAQ.PageNumber, masterDirectionFAQ.PageSize, masterDirectionFAQ.IsPagingRequired, Utility.TrimString(masterDirectionFAQ.OrderBy), Utility.TrimString(masterDirectionFAQ.OrderByDirection), totalPageCount, totalRecord).ToList();

                var masterDirectionFAQList = new List<MasterDirectionFAQ>();
                foreach (var masterDirectionFAQDetail in masterDirectionFAQs)
                {
                    masterDirectionFAQList.Add(new MasterDirectionFAQ()
                    {
                        MasterDirectionFAQId = masterDirectionFAQDetail.FAQMasterDirectionId,
                        MasterDirectionId = masterDirectionFAQDetail.MasterDirectionId,
                        FAQId = masterDirectionFAQDetail.FAQId,
                        TopicName = masterDirectionFAQDetail.FAQTopicName,
                        CategoryName = masterDirectionFAQDetail.CategoryName,
                        PDF = masterDirectionFAQDetail.PDF,
                        IsActive = masterDirectionFAQDetail.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return masterDirectionFAQList;
            }
        }
        #endregion

        #region Delete MasterDirectionFAQ
        public int DeleteMasterDirectionFAQ(MasterDirectionFAQ masterDirectionFAQ)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.MasterDirectionFAQDelete(masterDirectionFAQ.MasterDirectionFAQId, masterDirectionFAQ.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion
    }
}