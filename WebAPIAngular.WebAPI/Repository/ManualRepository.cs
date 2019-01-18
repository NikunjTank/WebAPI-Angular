using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class ManualRepository : IManual
    {
        #region Add Manual
        public int AddManual(Manual manual)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.ManualAdd(Utility.TrimString(manual.ManualName), Utility.TrimString(manual.PDF), manual.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update Manual data
        public int UpdateManual(Manual manual)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.ManualUpdate(manual.ManualId, Utility.TrimString(manual.ManualName), Utility.TrimString(manual.PDF), manual.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get Manual data
        public IEnumerable<Manual> GetManual(Manual manual)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var manuals = dataContext.ManualGet(manual.ManualId, Utility.TrimString(manual.SearchText), manual.IsActive, manual.PageNumber, manual.PageSize, manual.IsPagingRequired, Utility.TrimString(manual.OrderBy), Utility.TrimString(manual.OrderByDirection), totalPageCount, totalRecord).ToList();

                var manualList = new List<Manual>();
                foreach (var manualDetail in manuals)
                {
                    manualList.Add(new Manual()
                    {
                        ManualId = manualDetail.ManualId,
                        ManualName = manualDetail.ManualName,
                        PDF = manualDetail.PDF,
                        IsActive = manualDetail.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return manualList;
            }
        }
        #endregion

        #region Delete Manual
        public int DeleteManual(Manual manual)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.ManualDelete(manual.ManualId, manual.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion
    }
}