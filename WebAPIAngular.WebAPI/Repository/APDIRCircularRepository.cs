using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class APDIRCircularRepository : IAPDIRCircular
    {
        #region Add APDIRCircular
        public int AddAPDIRCircular(APDIRCircular aPDIRCircular)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.APDIRCircularAdd(aPDIRCircular.MasterDirectionId,Utility.TrimString(aPDIRCircular.APDIRCircularNo), Utility.TrimString(aPDIRCircular.APDIRCircularName), aPDIRCircular.APDIRCircularDate, aPDIRCircular.APDIRCircularEffectiveDate, Utility.TrimString(aPDIRCircular.Year), Utility.TrimString(aPDIRCircular.APDIRCircularPDF), aPDIRCircular.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update APDIRCircular data
        public int UpdateAPDIRCircular(APDIRCircular aPDIRCircular)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.APDIRCircularUpdate(aPDIRCircular.APDIRCircularId,aPDIRCircular.MasterDirectionId, Utility.TrimString(aPDIRCircular.APDIRCircularNo), Utility.TrimString(aPDIRCircular.APDIRCircularName), aPDIRCircular.APDIRCircularDate, aPDIRCircular.APDIRCircularEffectiveDate, Utility.TrimString(aPDIRCircular.Year), Utility.TrimString(aPDIRCircular.APDIRCircularPDF), aPDIRCircular.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get APDIRCircular data
        public IEnumerable<APDIRCircular> GetAPDIRCircular(APDIRCircular aPDIRCircular)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var aPDIRCirculars = dataContext.APDIRCircularGet(aPDIRCircular.APDIRCircularId,aPDIRCircular.MasterDirectionId,aPDIRCircular.Year,Utility.TrimString(aPDIRCircular.SearchText), aPDIRCircular.IsActive, aPDIRCircular.PageNumber, aPDIRCircular.PageSize, aPDIRCircular.IsPagingRequired, Utility.TrimString(aPDIRCircular.OrderBy), Utility.TrimString(aPDIRCircular.OrderByDirection), totalPageCount, totalRecord).ToList();

                var aPDIRCircularList = new List<APDIRCircular>();
                foreach (var aPDIRCircularDetail in aPDIRCirculars)
                {
                    aPDIRCircularList.Add(new APDIRCircular()
                    {
                        APDIRCircularId = aPDIRCircularDetail.APDIRCircularId,
                        MasterDirectionId = aPDIRCircularDetail.MasterDirectionId,
                        MasterDirectionName = aPDIRCircularDetail.MasterDIrectionName,
                        APDIRCircularNo = aPDIRCircularDetail.APDIRCircularNo,
                        APDIRCircularName = aPDIRCircularDetail.APDIRCircularName,
                        APDIRCircularDate = aPDIRCircularDetail.APDIRCircularDate,
                        APDIRCircularEffectiveDate = aPDIRCircularDetail.APDIRCircularEffectiveDate,
                        Year = aPDIRCircularDetail.Year,
                        APDIRCircularPDF = aPDIRCircularDetail.PDF,
                        IsActive = aPDIRCircularDetail.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return aPDIRCircularList;
            }
        }
        #endregion

        #region Delete APDIRCircular
        public int DeleteAPDIRCircular(APDIRCircular aPDIRCircular)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.APDIRCircularDelete(aPDIRCircular.APDIRCircularId, aPDIRCircular.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion
    }
}