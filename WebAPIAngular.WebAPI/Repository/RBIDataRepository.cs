using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class RBIDataRepository : IRBIData
    {
        #region Add RBIData
        public int AddRBIData(RBIData rBIData)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.RBIDataAdd(Utility.TrimString(rBIData.RBIDataName), Utility.TrimString(rBIData.Excel), rBIData.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update RBIData data
        public int UpdateRBIData(RBIData rBIData)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.RBIDataUpdate(rBIData.RBIDataId, Utility.TrimString(rBIData.RBIDataName), Utility.TrimString(rBIData.Excel), rBIData.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get RBIData data
        public IEnumerable<RBIData> GetRBIData(RBIData rBIData)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var rBIDatas = dataContext.RBIDataGet(rBIData.RBIDataId, Utility.TrimString(rBIData.SearchText), rBIData.IsActive, rBIData.PageNumber, rBIData.PageSize, rBIData.IsPagingRequired, Utility.TrimString(rBIData.OrderBy), Utility.TrimString(rBIData.OrderByDirection), totalPageCount, totalRecord).ToList();

                var rBIDataList = new List<RBIData>();
                foreach (var rBIDataDetail in rBIDatas)
                {
                    rBIDataList.Add(new RBIData()
                    {
                        RBIDataId = rBIDataDetail.RBIDataId,
                        RBIDataName = rBIDataDetail.RBIDataName,
                        Excel = rBIDataDetail.Excel,
                        IsActive = rBIDataDetail.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return rBIDataList;
            }
        }
        #endregion

        #region Delete RBIData
        public int DeleteRBIData(RBIData rBIData)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.RBIDataDelete(rBIData.RBIDataId, rBIData.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion
    }
}