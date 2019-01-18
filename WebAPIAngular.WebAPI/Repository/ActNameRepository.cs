using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class ActNameRepository : IActName
    {
        #region Add actname
        public int AddActName(ActName actName)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.ActNameAdd(Utility.TrimString(actName.LongTitle), Utility.TrimString(actName.ActPDF), actName.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update actname data
        public int UpdateActName(ActName actName)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.ActNameUpdate(actName.ActId, Utility.TrimString(actName.LongTitle), Utility.TrimString(actName.ActPDF), actName.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get actname data
        public IEnumerable<ActName> GetActName(ActName actName)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var actNames = dataContext.ActNameGet(actName.ActId, Utility.TrimString(actName.SearchText), actName.IsActive, actName.PageNumber, actName.PageSize, actName.IsPagingRequired, Utility.TrimString(actName.OrderBy), Utility.TrimString(actName.OrderByDirection), totalPageCount, totalRecord).ToList();

                var actNameList = new List<ActName>();
                foreach (var actNameDetail in actNames)
                {
                    actNameList.Add(new ActName()
                    {
                        ActId = actNameDetail.ActID,
                        LongTitle = actNameDetail.LongTitle,
                        ActPDF = actNameDetail.ActPDF,
                        IsActive = actNameDetail.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return actNameList;
            }
        }
        #endregion

        #region Delete actname
        public int DeleteActName(ActName actName)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.ActNameDelete(actName.ActId, actName.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion
    }
}