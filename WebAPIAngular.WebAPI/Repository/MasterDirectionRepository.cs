using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class MasterDirectionRepository : IMasterDirection
    {
        #region Add MasterDirection
        public int AddMasterDirection(MasterDirection masterDirection)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.MasterDirectionAdd(Utility.TrimString(masterDirection.MasterDirectionName), Utility.TrimString(masterDirection.PDF), Utility.TrimString(masterDirection.Year), masterDirection.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update MasterDirection data
        public int UpdateMasterDirection(MasterDirection masterDirection)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.MasterDirectionUpdate(masterDirection.MasterDirectionId, Utility.TrimString(masterDirection.MasterDirectionName), Utility.TrimString(masterDirection.Year), Utility.TrimString(masterDirection.PDF), masterDirection.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get MasterDirection data
        public IEnumerable<MasterDirection> GetMasterDirection(MasterDirection masterDirection)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var masterDirections = dataContext.MasterDirectionGet(masterDirection.MasterDirectionId, Utility.TrimString(masterDirection.SearchText), masterDirection.IsActive, masterDirection.PageNumber, masterDirection.PageSize, masterDirection.IsPagingRequired, Utility.TrimString(masterDirection.OrderBy), Utility.TrimString(masterDirection.OrderByDirection), totalPageCount, totalRecord).ToList();

                var masterDirectionList = new List<MasterDirection>();
                foreach (var masterDirectionDetail in masterDirections)
                {
                    masterDirectionList.Add(new MasterDirection()
                    {
                        MasterDirectionId = masterDirectionDetail.MDID,
                        MasterDirectionName = masterDirectionDetail.MasterDIrectionName,
                        Year = masterDirectionDetail.Year,
                        PDF = masterDirectionDetail.PDF,
                        IsActive = masterDirectionDetail.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return masterDirectionList;
            }
        }
        #endregion

        #region Delete MasterDirection
        public int DeleteMasterDirection(MasterDirection masterDirection)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.MasterDirectionDelete(masterDirection.MasterDirectionId, masterDirection.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion
    }
}