using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class MasterCircularRepository : IMasterCircular
    {
        #region Add MasterCircular
        public int AddMasterCircular(MasterCircular masterCircular)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.MasterCircularAdd(Utility.TrimString(masterCircular.MasterCircularName), masterCircular.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update MasterCircular data
        public int UpdateMasterCircular(MasterCircular masterCircular)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.MasterCircularUpdate(masterCircular.MasterCircularId, Utility.TrimString(masterCircular.MasterCircularName), masterCircular.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get MasterCircular data
        public IEnumerable<MasterCircular> GetMasterCircular(MasterCircular masterCircular)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var masterCirculars = dataContext.MasterCircularGet(masterCircular.MasterCircularId, Utility.TrimString(masterCircular.SearchText), masterCircular.IsActive, masterCircular.PageNumber, masterCircular.PageSize, masterCircular.IsPagingRequired, Utility.TrimString(masterCircular.OrderBy), Utility.TrimString(masterCircular.OrderByDirection), totalPageCount, totalRecord).ToList();

                var masterCircularList = new List<MasterCircular>();
                foreach (var masterCircularDetail in masterCirculars)
                {
                    masterCircularList.Add(new MasterCircular()
                    {
                        MasterCircularId = masterCircularDetail.MCID,
                        MasterCircularName = masterCircularDetail.Name,
                        IsActive = masterCircularDetail.Isactive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return masterCircularList;
            }
        }
        #endregion

        #region Delete MasterCircular
        public int DeleteMasterCircular(MasterCircular masterCircular)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.MasterCircularDelete(masterCircular.MasterCircularId, masterCircular.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion
    }
}