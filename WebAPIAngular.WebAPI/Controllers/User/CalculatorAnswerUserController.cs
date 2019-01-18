using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using DemystifyFema.Service.Repository;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;

namespace DemystifyFema.Service.Controllers.User
{
    [Authorize(Roles = "User")]
    [RoutePrefix("user/api")]
    public class CalculatorAnswerUserController : ApiController
    {
        private ICalculatorAnswer iCalculatorAnswer;
        public CalculatorAnswerUserController()
        {
            try
            {
                iCalculatorAnswer = new CalculatorAnswerRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("CalculatorAnswerUserController (User)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("calculatoranswers")]
        [ResponseType(typeof(List<GetCalculatorAnswerResponse>))]
        public IHttpActionResult GetCalculatorAnswer([FromUri]GetCalculatorAnswerRequest getCalculatorAnswerRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getCalculatorAnswerRequest == null)
                    getCalculatorAnswerRequest = new GetCalculatorAnswerRequest();

                if (getCalculatorAnswerRequest.PageSize == null)
                    getCalculatorAnswerRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var calculatorAnswer = new CalculatorAnswer()
                {
                    CalculatorQuestionId = getCalculatorAnswerRequest.CalculatorQuestionId,
                    CalculatorAnswerId = getCalculatorAnswerRequest.CalculatorAnswerId,
                    FEMAModuleId = getCalculatorAnswerRequest.FEMAModuleId,
                    SearchText = getCalculatorAnswerRequest.SearchText,
                    IsActive = getCalculatorAnswerRequest.IsActive,
                    PageNumber = getCalculatorAnswerRequest.PageNumber,
                    PageSize = Convert.ToInt32(getCalculatorAnswerRequest.PageSize),
                    IsPagingRequired = (getCalculatorAnswerRequest.PageNumber != null) ? true : false,
                    OrderBy = getCalculatorAnswerRequest.OrderBy,
                    OrderByDirection = getCalculatorAnswerRequest.OrderByDirection
                };
                var calculatorAnswers = iCalculatorAnswer.GetCalculatorAnswer(calculatorAnswer);

                var calculatorAnswerList = new List<GetCalculatorAnswerResponse>();
                foreach (var calculatorAnswerDetail in calculatorAnswers)
                {
                    calculatorAnswerList.Add(new GetCalculatorAnswerResponse()
                    {
                        CalculatorQuestionId = calculatorAnswerDetail.CalculatorQuestionId,
                        CalculatorAnswerId = calculatorAnswerDetail.CalculatorAnswerId,
                        FEMAModuleId = calculatorAnswerDetail.FEMAModuleId,
                        QuestionText = calculatorAnswerDetail.QuestionText,
                        Answer = calculatorAnswerDetail.Answer,
                        OutcomeId = calculatorAnswerDetail.OutcomeId,
                        OutcomeName = calculatorAnswerDetail.OutcomeName,
                        IsActive = Convert.ToBoolean(calculatorAnswerDetail.IsActive),
                        TotalPageCount = calculatorAnswerDetail.TotalPageCount,
                        TotalRecord = calculatorAnswerDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "CalculatorAnswer retrieved successfully";
                responses.Response = calculatorAnswerList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving calculatoranswer.";

                Utility.WriteLog("GetCalculatorAnswer", getCalculatorAnswerRequest, "Error while retrieving calculatoranswer. (CalculatorAnswerUserController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
