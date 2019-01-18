using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class APDIRCircularBeforeRepository : IAPDIRCircularBefore
    {
        #region Add APDIRCircularBefore
        public int AddAPDIRCircularBefore(APDIRCircularBefore aPDIRCircularBefore)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.APDIRCircularBeforeAdd(aPDIRCircularBefore.APDIRCircularParentId, aPDIRCircularBefore.APDIRCircularId, aPDIRCircularBefore.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update APDIRCircularBefore data
        public int UpdateAPDIRCircularBefore(APDIRCircularBefore aPDIRCircularBefore)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.APDIRCircularBeforeUpdate(aPDIRCircularBefore.APDIRCircularBeforeId, aPDIRCircularBefore.APDIRCircularParentId, aPDIRCircularBefore.APDIRCircularId, aPDIRCircularBefore.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get APDIRCircularBefore data
        public IEnumerable<APDIRCircularBefore> GetAPDIRCircularBefore(APDIRCircularBefore aPDIRCircularBefore)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var aPDIRCircularBefores = dataContext.APDIRCircularBeforeGet(aPDIRCircularBefore.APDIRCircularBeforeId, aPDIRCircularBefore.APDIRCircularParentId, Utility.TrimString(aPDIRCircularBefore.SearchText), aPDIRCircularBefore.IsActive, aPDIRCircularBefore.PageNumber, aPDIRCircularBefore.PageSize, aPDIRCircularBefore.IsPagingRequired, Utility.TrimString(aPDIRCircularBefore.OrderBy), Utility.TrimString(aPDIRCircularBefore.OrderByDirection), totalPageCount, totalRecord).ToList();

                var aPDIRCircularBeforeList = new List<APDIRCircularBefore>();
                foreach (var aPDIRCircularBeforeDetail in aPDIRCircularBefores)
                {
                    aPDIRCircularBeforeList.Add(new APDIRCircularBefore()
                    {
                        APDIRCircularBeforeId = aPDIRCircularBeforeDetail.APDIRCircularBeforeId,
                        APDIRCircularParentId = aPDIRCircularBeforeDetail.APDIRCircularParentId,
                        APDIRCircularId = aPDIRCircularBeforeDetail.APDIRCircularId,
                        APDIRCircularNo = aPDIRCircularBeforeDetail.APDIRCircularNo,
                        APDIRCircularName = aPDIRCircularBeforeDetail.APDIRCircularName,
                        APDIRCircularDate = aPDIRCircularBeforeDetail.APDIRCircularDate,
                        APDIRCircularEffectiveDate = aPDIRCircularBeforeDetail.APDIRCircularEffectiveDate,
                        Year = aPDIRCircularBeforeDetail.Year,
                        APDIRCircularPDF = aPDIRCircularBeforeDetail.PDF,
                        IsActive = aPDIRCircularBeforeDetail.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return aPDIRCircularBeforeList;
            }
        }
        #endregion

        #region Delete APDIRCircularBefore
        public int DeleteAPDIRCircularBefore(APDIRCircularBefore aPDIRCircularBefore)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.APDIRCircularBeforeDelete(aPDIRCircularBefore.APDIRCircularBeforeId, aPDIRCircularBefore.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion
    }
}