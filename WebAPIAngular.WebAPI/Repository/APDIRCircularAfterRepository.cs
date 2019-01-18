using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class APDIRCircularAfterRepository : IAPDIRCircularAfter
    {
        #region Add APDIRCircularAfter
        public int AddAPDIRCircularAfter(APDIRCircularAfter aPDIRCircularAfter)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.APDIRCircularAfterAdd(aPDIRCircularAfter.APDIRCircularParentId, aPDIRCircularAfter.APDIRCircularId, aPDIRCircularAfter.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update APDIRCircularAfter data
        public int UpdateAPDIRCircularAfter(APDIRCircularAfter aPDIRCircularAfter)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.APDIRCircularAfterUpdate(aPDIRCircularAfter.APDIRCircularAfterId, aPDIRCircularAfter.APDIRCircularParentId, aPDIRCircularAfter.APDIRCircularId, aPDIRCircularAfter.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get APDIRCircularAfter data
        public IEnumerable<APDIRCircularAfter> GetAPDIRCircularAfter(APDIRCircularAfter aPDIRCircularAfter)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var aPDIRCircularAfters = dataContext.APDIRCircularAfterGet(aPDIRCircularAfter.APDIRCircularAfterId, aPDIRCircularAfter.APDIRCircularParentId, Utility.TrimString(aPDIRCircularAfter.SearchText), aPDIRCircularAfter.IsActive, aPDIRCircularAfter.PageNumber, aPDIRCircularAfter.PageSize, aPDIRCircularAfter.IsPagingRequired, Utility.TrimString(aPDIRCircularAfter.OrderBy), Utility.TrimString(aPDIRCircularAfter.OrderByDirection), totalPageCount, totalRecord).ToList();

                var aPDIRCircularAfterList = new List<APDIRCircularAfter>();
                foreach (var aPDIRCircularAfterDetail in aPDIRCircularAfters)
                {
                    aPDIRCircularAfterList.Add(new APDIRCircularAfter()
                    {
                        APDIRCircularAfterId = aPDIRCircularAfterDetail.APDIRCircularAfterId,
                        APDIRCircularParentId = aPDIRCircularAfterDetail.APDIRCircularParentId,
                        APDIRCircularId = aPDIRCircularAfterDetail.APDIRCircularId,
                        APDIRCircularNo = aPDIRCircularAfterDetail.APDIRCircularNo,
                        APDIRCircularName = aPDIRCircularAfterDetail.APDIRCircularName,
                        APDIRCircularDate = aPDIRCircularAfterDetail.APDIRCircularDate,
                        APDIRCircularEffectiveDate = aPDIRCircularAfterDetail.APDIRCircularEffectiveDate,
                        Year = aPDIRCircularAfterDetail.Year,
                        APDIRCircularPDF = aPDIRCircularAfterDetail.PDF,
                        IsActive = aPDIRCircularAfterDetail.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return aPDIRCircularAfterList;
            }
        }
        #endregion

        #region Delete APDIRCircularAfter
        public int DeleteAPDIRCircularAfter(APDIRCircularAfter aPDIRCircularAfter)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.APDIRCircularAfterDelete(aPDIRCircularAfter.APDIRCircularAfterId, aPDIRCircularAfter.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion
    }
}