using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using DemystifyFema.Service.Repository;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;
using System.Xml.Linq;

namespace DemystifyFema.Service.Controllers.Admin
{
    [Authorize(Roles = "Admin")]
    [RoutePrefix("admin/api")]
    public class RBILiaisonOfficeAdminController : ApiController
    {
        private IRBILiaisonOffice iRBILiaisonOffice;
        public RBILiaisonOfficeAdminController()
        {
            try
            {
                iRBILiaisonOffice = new RBILiaisonOfficeRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("RBILiaisonOfficeAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("rbiliaisonoffices")]
        [ResponseType(typeof(List<GetRBILiaisonOfficeResponse>))]
        public IHttpActionResult GetRBILiaisonOffice([FromUri]GetRBILiaisonOfficeRequest getRBILiaisonOfficeRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getRBILiaisonOfficeRequest == null)
                    getRBILiaisonOfficeRequest = new GetRBILiaisonOfficeRequest();

                if (getRBILiaisonOfficeRequest.PageSize == null)
                    getRBILiaisonOfficeRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var rBILiaisonOffice = new RBILiaisonOffice()
                {
                    RBILiaisonOfficeId = getRBILiaisonOfficeRequest.RBILiaisonOfficeId,
                    SearchText = getRBILiaisonOfficeRequest.SearchText,
                    IsActive = getRBILiaisonOfficeRequest.IsActive,
                    PageNumber = getRBILiaisonOfficeRequest.PageNumber,
                    PageSize = Convert.ToInt32(getRBILiaisonOfficeRequest.PageSize),
                    IsPagingRequired = (getRBILiaisonOfficeRequest.PageNumber != null) ? true : false,
                    OrderBy = getRBILiaisonOfficeRequest.OrderBy,
                    OrderByDirection = getRBILiaisonOfficeRequest.OrderByDirection
                };
                var rBILiaisonOffices = iRBILiaisonOffice.GetRBILiaisonOffice(rBILiaisonOffice);

                var rBILiaisonOfficeList = new List<GetRBILiaisonOfficeResponse>();
                foreach (var rBILiaisonOfficeDetail in rBILiaisonOffices)
                {
                    rBILiaisonOfficeList.Add(new GetRBILiaisonOfficeResponse()
                    {
                        RBILiaisonOfficeId = Convert.ToInt32(rBILiaisonOfficeDetail.RBILiaisonOfficeId),
                        SerialNo = rBILiaisonOfficeDetail.SerialNo,
                        NameAndAddressOfTheCompany = rBILiaisonOfficeDetail.NameAndAddressOfTheCompany,
                        PlaceOfTheLiaisonOffice = rBILiaisonOfficeDetail.PlaceOfTheLiaisonOffice,
                        DateOfApprovalGrantedOrUINAlloted = rBILiaisonOfficeDetail.DateOfApprovalGrantedOrUINAlloted,
                        UIN = rBILiaisonOfficeDetail.UIN,
                        IsActive = rBILiaisonOfficeDetail.IsActive,
                        CreatedBy = rBILiaisonOfficeDetail.CreatedBy,
                        TotalPageCount = rBILiaisonOfficeDetail.TotalPageCount,
                        TotalRecord = rBILiaisonOfficeDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "RBILiaisonOffice retrieved successfully";
                responses.Response = rBILiaisonOfficeList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving RBILiaisonOffice.";

                Utility.WriteLog("GetRBILiaisonOffice", getRBILiaisonOfficeRequest, "Error while retrieving RBILiaisonOffice. (RBILiaisonOfficeAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        #region Add RBILiaisonOffice from file
        [HttpPost]
        [Route("rbiliaisonoffices/addfromexcel")]
        [ResponseType(typeof(GetRBILiaisonOfficeResponse))]
        public IHttpActionResult AddRBILiaisonOfficeFromExcel()
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var httpRequest = HttpContext.Current.Request;
                if (httpRequest.Files.Count == 0)
                    return BadRequest("File not found");

                var file = httpRequest.Files[0];
                string filename = DateTime.Now.ToString("ddMMyyyyhhmmssfff") + "_" + file.FileName;
                string destinationPath = HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["RBILiaisonOfficeExcelPath"]);
                destinationPath = Path.Combine(destinationPath, filename);
                file.SaveAs(destinationPath);

                XElement xRBILiaisonOffices = new XElement("RBILiaisonOffices");
                XElement xSkippedRBILiaisonOffices = new XElement("SkippedRBILiaisonOffices");

                if (!File.Exists(destinationPath))
                    return BadRequest("File not found");

                string extension = System.IO.Path.GetExtension(filename).ToLower();
                string connString = (extension.Trim() == ".xls") ? "Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" + destinationPath + ";Extended Properties=\"Excel 8.0;HDR=Yes;IMEX=1\"" : (extension.Trim() == ".xlsx") ? "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + destinationPath + ";Extended Properties=\"Excel 12.0;HDR=Yes;IMEX=2\"" : null;

                if (string.IsNullOrEmpty(connString))
                    return BadRequest("File must be extension with .xls or .xlsx");

                DataTable dt = Utility.ConvertXSLXtoDataTable(destinationPath, connString);

                int count = 0, lineNumber = 0;

                foreach (DataRow dr in dt.Rows)
                {
                    if (count != 0)
                    {
                        lineNumber = count;

                        try
                        {
                            xRBILiaisonOffices.Add(new XElement("RBILiaisonOffice", new XAttribute("SerialNo", dr[0].ToString().Trim())
                                                                                    , new XAttribute("NameAndAddressOfTheCompany", dr[1].ToString().Trim())
                                                                                    , new XAttribute("PlaceOfTheLiaisonOffice", dr[2].ToString().Trim())
                                                                                    , new XAttribute("DateOfApprovalGrantedOrUINAlloted", DateTime.ParseExact(dr[3].ToString().Trim(), "dd-MM-yyyy", CultureInfo.InvariantCulture))
                                                                                    , new XAttribute("UIN", dr[4].ToString().Trim())
                                                                                    , new XAttribute("Status", lineNumber + 3)
                                                                                    , new XAttribute("LineNumber", lineNumber)));
                        }
                        catch (Exception ex)
                        {
                            Utility.WriteLog("AddRBILiaisonOfficeFromFile", null, "Error while reading RBILiaisonOffice file and storing in xml (Admin)", string.Format("LineNumber : {0} \n Error : {1}", lineNumber, ex.ToString()));

                            try
                            {
                                xSkippedRBILiaisonOffices.Add(new XElement("RBILiaisonOffice", new XAttribute("SerialNo", dr[0].ToString().Trim())
                                                                                    , new XAttribute("NameAndAddressOfTheCompany", dr[1].ToString().Trim())
                                                                                    , new XAttribute("PlaceOfTheLiaisonOffice", dr[2].ToString().Trim())
                                                                                    , new XAttribute("DateOfApprovalGrantedOrUINAlloted", dr[3].ToString().Trim())
                                                                                    , new XAttribute("UIN", dr[4].ToString().Trim())
                                                                                    , new XAttribute("Status", "SKIPPED")
                                                                                    , new XAttribute("LineNumber", lineNumber + 3)));
                            }
                            catch (Exception exCatch)
                            {
                                Utility.WriteLog("AddRBILiaisonOfficeFromFile", null, "Error while reading RBILiaisonOffice file and storing in skipped xml (Admin)", string.Format("LineNumber : {0} \n Error : {1}", lineNumber, exCatch.ToString()));
                            }
                        }
                    }
                    count++;
                }

                var rBILiaisonOffice = new RBILiaisonOffice()
                {
                    RBILiaisonOffices = xRBILiaisonOffices,
                    CreatedBy = Utility.UserId
                };
                iRBILiaisonOffice.AddRBILiaisonOfficeFromXML(rBILiaisonOffice);
                if (rBILiaisonOffice.Result > 0)
                {
                    var rBILiaisonOfficeData = rBILiaisonOffice.RBILiaisonOffices.Descendants("RBILiaisonOffice").Select(x => new
                    {
                        SerialNo = x.Attribute("SerialNo").Value,
                        NameAndAddressOfTheCompany = x.Attribute("NameAndAddressOfTheCompany").Value,
                        PlaceOfTheLiaisonOffice = x.Attribute("PlaceOfTheLiaisonOffice").Value,
                        DateOfApprovalGrantedOrUINAlloted = x.Attribute("DateOfApprovalGrantedOrUINAlloted").Value,
                        UIN = x.Attribute("UIN").Value,
                        Status = x.Attribute("Status").Value,
                        LineNumber = x.Attribute("LineNumber").Value
                    }).ToList();

                    var skippedRBILiaisonOffices = xSkippedRBILiaisonOffices.Descendants("RBILiaisonOffice").Select(x => new
                    {
                        SerialNo = x.Attribute("SerialNo").Value,
                        NameAndAddressOfTheCompany = x.Attribute("NameAndAddressOfTheCompany").Value,
                        PlaceOfTheLiaisonOffice = x.Attribute("PlaceOfTheLiaisonOffice").Value,
                        DateOfApprovalGrantedOrUINAlloted = x.Attribute("DateOfApprovalGrantedOrUINAlloted").Value,
                        UIN = x.Attribute("UIN").Value,
                        Status = x.Attribute("Status").Value,
                        LineNumber = x.Attribute("LineNumber").Value
                    }).ToList();

                    rBILiaisonOfficeData.AddRange(skippedRBILiaisonOffices);

                    List<NotProcessedRow> notProcessedRowList = rBILiaisonOfficeData.Where(x => x.Status != "SUCCESS").Select(x => new NotProcessedRow() { SerialNo = Convert.ToInt32(x.SerialNo), NameAndAddressOfTheCompany = x.NameAndAddressOfTheCompany, PlaceOfTheLiaisonOffice = x.PlaceOfTheLiaisonOffice, DateOfApprovalGrantedOrUINAlloted = x.DateOfApprovalGrantedOrUINAlloted, UIN = x.UIN, Status = x.Status, LineNumber = x.LineNumber }).ToList();

                    var addRBILiaisonOfficeFromFileResponse = new AddRBILiaisonOfficeFromFileResponse()
                    {
                        SuccessRow = rBILiaisonOfficeData.Where(x => x.Status == "SUCCESS").Count(),
                        SkippedRow = rBILiaisonOfficeData.Where(x => x.Status == "SKIPPED").Count(),
                        ErrorRow = rBILiaisonOfficeData.Where(x => x.Status == "ERROR").Count(),
                        NotProcessedRow = notProcessedRowList
                    };

                    responses.Response = addRBILiaisonOfficeFromFileResponse;
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "RBILiaisonOffice added successfully.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding RBILiaisonOffice";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding RBILiaisonOffice";

                Utility.WriteLog("AddRBILiaisonOfficeFromFile", null, "Error while adding RBILiaisonOffice list.", ex.ToString());
            }
            return Ok(responses);
        }
        #endregion
    }
}
