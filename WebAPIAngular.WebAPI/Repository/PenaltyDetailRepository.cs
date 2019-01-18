using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class PenaltyDetailRepository : IPenaltyDetail
    {
        #region Get PenaltyDetail data
        public IEnumerable<PenaltyDetail> GetPenaltyDetail(PenaltyDetail penaltyDetail)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var penaltyDetails = dataContext.PenaltyDetailGet(penaltyDetail.PenaltyDetailId,penaltyDetail.CalculatorID,penaltyDetail.CalculatorSubTopicID, Utility.TrimString(penaltyDetail.SearchText), penaltyDetail.IsActive, penaltyDetail.PageNumber, penaltyDetail.PageSize, penaltyDetail.IsPagingRequired, Utility.TrimString(penaltyDetail.OrderBy), Utility.TrimString(penaltyDetail.OrderByDirection), totalPageCount, totalRecord).ToList();

                var penaltyDetailList = new List<PenaltyDetail>();
                foreach (var penaltyDetailItem in penaltyDetails)
                {
                    penaltyDetailList.Add(new PenaltyDetail()
                    {
                        PenaltyDetailId = penaltyDetailItem.PenaltyDetailID,
                        FEMAModuleId = penaltyDetailItem.FEMAModuleId,
                        CalculatorID = penaltyDetailItem.CalculatorID,
                        CalculatorName= penaltyDetailItem.CalculatorName,
                        CalculatorSubTopicID = penaltyDetailItem.CalculatorSubTopicId,
                        CalculatorSubTopicName = penaltyDetailItem.CalculatorSubTopicName,
                        IsFixedPenalty = (penaltyDetailItem.IsFixedPenalty),
                        Range = penaltyDetailItem.Range,
                        Amount = penaltyDetailItem.Amount,
                        RangeAfter07November2017 = penaltyDetailItem.RangeAfter07November2017,
                        AmountAfter07November2017 = penaltyDetailItem.AmountAfter07November2017,
                        ExtraPenaltyRange = penaltyDetailItem.ExtraPenaltyRange,
                        IsActive = penaltyDetailItem.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return penaltyDetailList;
            }
        }
        #endregion

    }
}