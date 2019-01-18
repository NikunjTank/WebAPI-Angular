using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.OleDb;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Security.Cryptography;
using System.Text;
using System.Web;

namespace DemystifyFema.Service.Common
{
    public class Utility
    {
        public const string SUCCESS_STATUS_RESPONSE = "Success";
        public const string ERROR_STATUS_RESPONSE = "Fail";
        public const string INVALID_USER = "Invalid user";
        public const string INVALID_PASSWORD = "Invalid password";
        public const string NO_DETAIL_FOUND = "No detail found";
        public const string INVALID_REQUEST = "Invalid request";
        public const string FILE_NOT_AVAILABLE = "File not available";
        public static int UserId { get; set; }
        public static string UserName { get; set; }
        public static int RoleId { get; set; }
        public static string RoleName { get; set; }

        #region Encrypt/Decrypt string with KEY
        public static string EncryptStringUsingKey(string sourceString)
        {
            RijndaelManaged rijndaelCipher = new RijndaelManaged();
            rijndaelCipher.Mode = CipherMode.CBC;
            rijndaelCipher.Padding = PaddingMode.PKCS7;

            rijndaelCipher.KeySize = 0x80;
            rijndaelCipher.BlockSize = 0x80;
            byte[] pwdBytes = System.Text.Encoding.UTF8.GetBytes(ConfigurationManager.AppSettings["EncryptDecryptKeyForString"]);
            byte[] keyBytes = new byte[0x10];
            int len = pwdBytes.Length;
            if (len > keyBytes.Length)
            {
                len = keyBytes.Length;
            }
            Array.Copy(pwdBytes, keyBytes, len);
            rijndaelCipher.Key = keyBytes;
            rijndaelCipher.IV = keyBytes;
            ICryptoTransform transform = rijndaelCipher.CreateEncryptor();
            byte[] plainText = System.Text.Encoding.UTF8.GetBytes(sourceString);
            return Convert.ToBase64String(transform.TransformFinalBlock(plainText, 0, plainText.Length));
        }
        public static string DecryptStringUsingKey(string sourceString)
        {
            RijndaelManaged rijndaelCipher = new RijndaelManaged();
            rijndaelCipher.Mode = CipherMode.CBC;
            rijndaelCipher.Padding = PaddingMode.PKCS7;

            rijndaelCipher.KeySize = 0x80;
            rijndaelCipher.BlockSize = 0x80;
            sourceString = sourceString.Replace(" ", "+");
            byte[] encryptedData = Convert.FromBase64String(sourceString);

            byte[] pwdBytes = System.Text.Encoding.UTF8.GetBytes(ConfigurationManager.AppSettings["EncryptDecryptKeyForString"]);
            byte[] keyBytes = new byte[0x10];
            int len = pwdBytes.Length;
            if (len > keyBytes.Length)
            {
                len = keyBytes.Length;
            }
            Array.Copy(pwdBytes, keyBytes, len);
            rijndaelCipher.Key = keyBytes;
            rijndaelCipher.IV = keyBytes;
            byte[] plainText = rijndaelCipher.CreateDecryptor().TransformFinalBlock(encryptedData, 0, encryptedData.Length);
            return System.Text.Encoding.UTF8.GetString(plainText);
        }
        #endregion

        #region Write Error Log in database and file

        #region Write Error Log in Database
        public static void WriteLog(string serviceName, object requestParameters, string errorLogMessage, string errorLogDescription)
        {
            try
            {
                string userId = Utility.UserId.ToString();
                string parameters = string.Empty;
                if (requestParameters != null)
                {
                    var properties = requestParameters.GetType().GetProperties().ToList();
                    foreach (var item in properties)
                    {
                        var value = item.GetValue(requestParameters, null);
                        parameters += string.Format(" \n\t {0} : {1}", item.Name, value);
                    }
                }
                string logMessage = string.Format(" ServiceName : {0} \n Parameters : {1} \n UserId : {2} \n Message : {3} \n Description : {4}", serviceName, parameters, userId, errorLogMessage, errorLogDescription);

                WriteLogInFile(logMessage);
            }
            catch (Exception ex)
            {
                WriteLogInFile(string.Format("Error in WriteLog function \n Error : {0}", ex.ToString()));
            }
        }
        #endregion

        #region Write Error Log in File
        private static void WriteLogInFile(string logMessage)
        {
            string strDirectoryPath = HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["ErrorFilePath"].ToString());
            string strFilePath = Path.Combine(strDirectoryPath, ConfigurationManager.AppSettings["ErrorFile"].ToString());
            DirectoryInfo directoryInfo = new DirectoryInfo(strDirectoryPath);
            if (!directoryInfo.Exists)
                directoryInfo.Create();
            FileStream objFsAction = new FileStream(strFilePath, FileMode.OpenOrCreate, FileAccess.ReadWrite, FileShare.ReadWrite);
            StreamWriter objSwAction = new StreamWriter(objFsAction);
            objSwAction.BaseStream.Seek(0, SeekOrigin.End);
            objSwAction.Write(Environment.NewLine + DateTime.UtcNow + Environment.NewLine + logMessage + Environment.NewLine);
            objSwAction.Flush();
            objSwAction.Close();
            objFsAction.Close();
        }
        #endregion

        #endregion

        public static List<APDIRCircularYear> GetAPDIRCircularYear(int? yearId)
        {
            var lstAPDIRCircularYear = new List<APDIRCircularYear>();

            DateTime startAPDIRCircularDate = Convert.ToDateTime(ConfigurationManager.AppSettings["StartAPDIRCircularDate"]);
            DateTime endAPDIRCircularDate = Convert.ToDateTime(ConfigurationManager.AppSettings["EndAPDIRCircularDate"]);

            int difference = endAPDIRCircularDate.Year - startAPDIRCircularDate.Year;

            for (int i = 0; i < difference; i++)
            {
                lstAPDIRCircularYear.Add(new APDIRCircularYear()
                {
                    APDIRCircularYearId = startAPDIRCircularDate.AddYears(i).Year,
                    APDIRCircularYearName = startAPDIRCircularDate.AddYears(i).ToString(ConfigurationManager.AppSettings["APDIRCircularDateFormat"]) + " - " + startAPDIRCircularDate.AddMonths(12).AddDays(-1).AddYears(i).ToString(ConfigurationManager.AppSettings["APDIRCircularDateFormat"])
                });
            }

            if (yearId != null)
                lstAPDIRCircularYear = lstAPDIRCircularYear.Where(x => x.APDIRCircularYearId == yearId).ToList();

            return lstAPDIRCircularYear;
        }

        public static List<int> GetYear()
        {
            List<int> lstYear = new List<int>();

            int startYear = Convert.ToInt32(ConfigurationManager.AppSettings["StartYear"]);
            int endYear = Convert.ToInt32(ConfigurationManager.AppSettings["EndYear"]);

            for (int year = startYear; year <= endYear; year++)
                lstYear.Add(year);

            return lstYear;
        }

        public static List<int> GetMonth()
        {
            List<int> lstMonth = new List<int>();

            for (int month = 1; month <= 12; month++)
                lstMonth.Add(month);

            return lstMonth;
        }

        public static DataTable ConvertXSLXtoDataTable(string strFilePath, string connString)
        {
            OleDbConnection oledbConn = new OleDbConnection(connString);
            DataTable dt = new DataTable();
            try
            {
                oledbConn.Open();
                using (OleDbCommand cmd = new OleDbCommand("SELECT * FROM [Liaison Office$]", oledbConn))
                {
                    OleDbDataAdapter oleda = new OleDbDataAdapter();
                    oleda.SelectCommand = cmd;
                    DataSet ds = new DataSet();
                    oleda.Fill(ds);

                    dt = ds.Tables[0];
                }
            }
            catch (Exception ex)
            {
                WriteLogInFile(string.Format("Error in ConvertXSLXtoDataTable function \n Error : {0}", ex.ToString()));
            }
            finally
            {
                oledbConn.Close();
            }
            return dt;
        }

        public static string SendOTPOnSMS(string mobileNo, string name, string message)
        {
            string url = "https://2factor.in/API/V1/230f59ed-0b38-11e8-a895-0200cd936042/SMS/" + mobileNo + "/" + message;

            ASCIIEncoding encoding = new ASCIIEncoding();
            string postData = url + ((name == "Login") ? "/Login OTP" : "/Registration OTP");

            HttpWebRequest httpWReq = (HttpWebRequest)WebRequest.Create(postData);
            byte[] data = encoding.GetBytes(postData);

            httpWReq.Method = "POST";
            httpWReq.ContentType = "application/x-www-form-urlencoded";
            httpWReq.ContentLength = data.Length;

            using (Stream stream = httpWReq.GetRequestStream())
            {
                stream.Write(data, 0, data.Length);
            }

            HttpWebResponse response = (HttpWebResponse)httpWReq.GetResponse();

            string responseString = new StreamReader(response.GetResponseStream()).ReadToEnd();
            return responseString;
        }

        public static String RandomOtpMobile()
        {
            String MCode = "";

            try
            {
                string[] A = new string[] { "0", "1", "2", "3", "4", "5", "6", "7", "8", "9" };
                string[] A1 = new string[] { "0", "1", "2", "3", "4", "5", "6", "7", "8", "9" };
                string Text = "";
                Random r = new Random();
                Text = "";
                Text += A[r.Next(1, 9)];
                Text += r.Next(0, 9);
                Text += A[r.Next(5, 9)];
                Text += r.Next(0, 9);
                Text += A1[r.Next(0, 9)];
                Text += r.Next(0, 9);
                MCode = Text;
            }
            catch (Exception ex)
            {
                WriteLogInFile(string.Format("Error in RandomOtpMobile function \n Error : {0}", ex.ToString()));
                RandomOtpMobile();
            }

            return MCode;
        }

        public static String RandomOtpEmail()
        {
            String ECode = "";

            try
            {
                string[] B = new string[] { "0", "1", "2", "3", "4", "5", "6", "7", "8", "9" };
                string[] B1 = new string[] { "0", "1", "2", "3", "4", "5", "6", "7", "8", "9" };
                string Text = "";
                Random r = new Random();
                Text = "";
                Text += B[r.Next(1, 9)];
                Text += r.Next(0, 9);
                Text += B1[r.Next(5, 9)];
                Text += r.Next(0, 9);
                Text += B1[r.Next(0, 9)];
                Text += r.Next(0, 9);
                ECode = Text;
            }
            catch (Exception ex)
            {
                WriteLogInFile(string.Format("Error in RandomOtpEmail function \n Error : {0}", ex.ToString()));

                RandomOtpEmail();
            }

            return ECode;
        }

        public static string TrimString(string value)
        {
            return (value != null) ? value.Trim() : value;
        }

        public enum Roles
        {
            Admin = 1,
            User = 2
        }

        public enum LoginRegister
        {
            Login, Register
        }

        #region SendMail
        public static bool SendMail(string EmailTo, string CC, string BCC, string Subject, string Body, string DisplayName, string Attachments, bool IsBodyHtml)
        {
            bool result = true;
            try
            {
                using (SmtpClient smtpClient = new SmtpClient())
                {
                    string strUserName = ConfigurationManager.AppSettings["EmailUserName"].ToString();
                    string strPassword = ConfigurationManager.AppSettings["EmailPassword"].ToString();
                    string strSmtpHost = ConfigurationManager.AppSettings["EmailSMTPHost"].ToString();
                    int intSmtpPort = Convert.ToInt32(ConfigurationManager.AppSettings["EmailSMTPPort"].ToString());
                    string strMailFrom = ConfigurationManager.AppSettings["EmailMailFrom"].ToString();

                    //Set EnableSsl = false for live site
                    smtpClient.EnableSsl = Convert.ToBoolean(ConfigurationManager.AppSettings["EnableSsl"]);
                    smtpClient.Host = strSmtpHost;
                    smtpClient.Port = intSmtpPort;
                    smtpClient.UseDefaultCredentials = false;
                    smtpClient.Credentials = new NetworkCredential(strUserName, strPassword);

                    using (MailMessage message = new MailMessage())
                    {
                        message.From = (string.IsNullOrEmpty(DisplayName)) ? new MailAddress(strMailFrom) : new MailAddress(strMailFrom, DisplayName);
                        message.Sender = new MailAddress(strMailFrom);
                        message.Subject = Subject;
                        //Set IsBodyHtml to true means you can send HTML email.
                        message.IsBodyHtml = IsBodyHtml;
                        message.Body = Body;
                        message.To.Add(EmailTo);
                        if (!string.IsNullOrEmpty(CC))
                            foreach (string cc in CC.Split(new char[] { ',' }))
                                message.CC.Add(cc);
                        if (!string.IsNullOrEmpty(BCC))
                            foreach (string bcc in BCC.Split(new char[] { ',' }))
                                message.Bcc.Add(bcc);
                        if (!string.IsNullOrEmpty(Attachments))
                        {
                            foreach (string sAttachment in Attachments.Split(",".ToCharArray()))
                                message.Attachments.Add(new Attachment(sAttachment));
                        }
                        try
                        {
                            smtpClient.Send(message);
                        }
                        catch (Exception ex)
                        {
                            result = false;
                            WriteLogInFile(string.Format("Error in SendMail function \n Error : {0}", ex.ToString()));
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                result = false;
                WriteLogInFile(string.Format("Error in WriteLog function \n Error : {0}", ex.ToString()));
            }
            return result;
        }
        #endregion
    }
}