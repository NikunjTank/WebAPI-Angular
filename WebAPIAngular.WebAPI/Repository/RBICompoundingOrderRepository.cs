using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class RBICompoundingOrderRepository : IRBICompoundingOrder
    {
        #region Add RBICompoundingOrder
        public int AddRBICompoundingOrder(RBICompoundingOrder rBICompoundingOrder)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.RBICompoundingOrderAdd(Utility.TrimString(rBICompoundingOrder.ApplicantName), Utility.TrimString(rBICompoundingOrder.OrderGist), Utility.TrimString(rBICompoundingOrder.Topic), Utility.TrimString(rBICompoundingOrder.FEMRegulationRuleNo), rBICompoundingOrder.OrderDate, rBICompoundingOrder.PenaltyAmount, Utility.TrimString(rBICompoundingOrder.Regional_CentralOfficeOfRBI), Utility.TrimString(rBICompoundingOrder.PDF), rBICompoundingOrder.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update RBICompoundingOrder data
        public int UpdateRBICompoundingOrder(RBICompoundingOrder rBICompoundingOrder)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.RBICompoundingOrderUpdate(rBICompoundingOrder.RBICompoundingOrderId, Utility.TrimString(rBICompoundingOrder.ApplicantName), Utility.TrimString(rBICompoundingOrder.OrderGist), Utility.TrimString(rBICompoundingOrder.Topic), Utility.TrimString(rBICompoundingOrder.FEMRegulationRuleNo), rBICompoundingOrder.OrderDate, rBICompoundingOrder.PenaltyAmount, Utility.TrimString(rBICompoundingOrder.Regional_CentralOfficeOfRBI), Utility.TrimString(rBICompoundingOrder.PDF), rBICompoundingOrder.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get RBICompoundingOrder data
        public IEnumerable<RBICompoundingOrder> GetRBICompoundingOrder(RBICompoundingOrder rBICompoundingOrder)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var rBICompoundingOrders = dataContext.RBICompoundingOrderGet(rBICompoundingOrder.RBICompoundingOrderId, Utility.TrimString(rBICompoundingOrder.SearchText), rBICompoundingOrder.IsActive, rBICompoundingOrder.PageNumber, rBICompoundingOrder.PageSize, rBICompoundingOrder.IsPagingRequired, Utility.TrimString(rBICompoundingOrder.OrderBy), Utility.TrimString(rBICompoundingOrder.OrderByDirection), totalPageCount, totalRecord).ToList();

                var rBICompoundingOrderList = new List<RBICompoundingOrder>();
                foreach (var rBICompoundingOrderDetail in rBICompoundingOrders)
                {
                    rBICompoundingOrderList.Add(new RBICompoundingOrder()
                    {
                        RBICompoundingOrderId = rBICompoundingOrderDetail.RBICompoundingOrderId,
                        ApplicantName = rBICompoundingOrderDetail.ApplicantName,
                        OrderGist = rBICompoundingOrderDetail.OrderGist,
                        Topic = rBICompoundingOrderDetail.Topic,
                        FEMRegulationRuleNo = rBICompoundingOrderDetail.FEMRegulationRuleNo,
                        OrderDate = rBICompoundingOrderDetail.OrderDate,
                        PenaltyAmount = rBICompoundingOrderDetail.PenaltyAmount,
                        Regional_CentralOfficeOfRBI = rBICompoundingOrderDetail.Regional_CentralOfficeOfRBI,
                        PDF = rBICompoundingOrderDetail.PDF,
                        IsActive = rBICompoundingOrderDetail.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return rBICompoundingOrderList;
            }
        }
        #endregion

        #region Delete RBICompoundingOrder
        public int DeleteRBICompoundingOrder(RBICompoundingOrder rBICompoundingOrder)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.RBICompoundingOrderDelete(rBICompoundingOrder.RBICompoundingOrderId, rBICompoundingOrder.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion
    }
}