using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class MasterCircularDetailRepository : IMasterCircularDetail
    {
        #region Add MasterCircularDetail
        public int AddMasterCircularDetail(MasterCircularDetail masterCircularDetail)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.MasterCircularDetailAdd(masterCircularDetail.MasterCircularId, masterCircularDetail.Year, masterCircularDetail.PDF, masterCircularDetail.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update MasterCircularDetail data
        public int UpdateMasterCircularDetail(MasterCircularDetail masterCircularDetail)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.MasterCircularDetailUpdate(masterCircularDetail.MasterCircularDetailId, masterCircularDetail.MasterCircularId, masterCircularDetail.Year, masterCircularDetail.PDF, masterCircularDetail.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get MasterCircularDetail data
        public IEnumerable<MasterCircularDetail> GetMasterCircularDetail(MasterCircularDetail masterCircularDetail)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var masterCircularDetails = dataContext.MasterCircularDetailGet(masterCircularDetail.MasterCircularDetailId, masterCircularDetail.MasterCircularId,masterCircularDetail.Year, Utility.TrimString(masterCircularDetail.SearchText), masterCircularDetail.IsActive, masterCircularDetail.PageNumber, masterCircularDetail.PageSize, masterCircularDetail.IsPagingRequired, Utility.TrimString(masterCircularDetail.OrderBy), Utility.TrimString(masterCircularDetail.OrderByDirection), totalPageCount, totalRecord).ToList();

                var masterCircularDetailList = new List<MasterCircularDetail>();
                foreach (var masterCircularDetailDetail in masterCircularDetails)
                {
                    masterCircularDetailList.Add(new MasterCircularDetail()
                    {
                        MasterCircularDetailId = masterCircularDetailDetail.MasterCircularDetailId,
                        MasterCircularId = masterCircularDetailDetail.MasterCircularId,
                        Year = masterCircularDetailDetail.Year,
                        PDF = masterCircularDetailDetail.PDF,
                        IsActive = masterCircularDetailDetail.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return masterCircularDetailList;
            }
        }
        #endregion

        #region Delete MasterCircularDetail
        public int DeleteMasterCircularDetail(MasterCircularDetail masterCircularDetail)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.MasterCircularDetailDelete(masterCircularDetail.MasterCircularDetailId, masterCircularDetail.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion
    }
}