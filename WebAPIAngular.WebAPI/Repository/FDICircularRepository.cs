using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class FDICircularRepository : IFDICircular
    {
        #region Add FDICircular
        public int AddFDICircular(FDICircular fDICircular)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.FDICircularAdd(Utility.TrimString(fDICircular.FDICircularName), Utility.TrimString(fDICircular.PDF), Utility.TrimString(fDICircular.Year), fDICircular.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update FDICircular data
        public int UpdateFDICircular(FDICircular fDICircular)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.FDICircularUpdate(fDICircular.FDICircularId, Utility.TrimString(fDICircular.FDICircularName), Utility.TrimString(fDICircular.Year), Utility.TrimString(fDICircular.PDF), fDICircular.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get FDICircular data
        public IEnumerable<FDICircular> GetFDICircular(FDICircular fDICircular)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var fDICirculars = dataContext.FDICircularGet(fDICircular.FDICircularId, Utility.TrimString(fDICircular.SearchText), fDICircular.IsActive, fDICircular.PageNumber, fDICircular.PageSize, fDICircular.IsPagingRequired, Utility.TrimString(fDICircular.OrderBy), Utility.TrimString(fDICircular.OrderByDirection), totalPageCount, totalRecord).ToList();

                var fDICircularList = new List<FDICircular>();
                foreach (var fDICircularDetail in fDICirculars)
                {
                    fDICircularList.Add(new FDICircular()
                    {
                        FDICircularId = fDICircularDetail.FDICircularId,
                        FDICircularName = fDICircularDetail.FDICircularName,
                        Year = fDICircularDetail.Year,
                        PDF = fDICircularDetail.PDF,
                        IsActive = fDICircularDetail.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return fDICircularList;
            }
        }
        #endregion

        #region Delete FDICircular
        public int DeleteFDICircular(FDICircular fDICircular)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.FDICircularDelete(fDICircular.FDICircularId, fDICircular.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion
    }
}