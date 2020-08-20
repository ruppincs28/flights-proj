using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;

namespace demo.Models.DataBaseServices
{
    public class PacagesDBService : DBservices
    {
        public int insert(Package package)
        {
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect("DBConnectionString"); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            String cStr = BuildInsertCommand(package);      // helper method to build the insert string

            cmd = CreateCommand(cStr, con);             // create the command

            try
            {
                int numEffected = cmd.ExecuteNonQuery(); // execute the command
                return numEffected;
            }
            catch (Exception ex)
            {
                return 0;
                // write to log
                throw (ex);

            }

            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }

        }

        private String BuildInsertCommand(Package package)
        {
            String command;

            StringBuilder sb = new StringBuilder();
            // use a string builder to create the dynamic string
            sb.AppendFormat("Values(N'{0}', N'{1}', N'{2}', N'{3}', N'{4}', N'{5}', N'{6}', N'{7}', N'{8}', N'{9}', N'{10}')",
                package.Id, package.Price, package.Profit, package.Longitude, package.Latitude, package.PackageInfo,
                    package.CompanyName, package.City, package.ArrivalTime, package.DepartureTime, package.Date);
            String prefix = "INSERT INTO packages_final_cs " + "([id], [price], [profit], [longitude], [latitude], [packageinfo], [companyname], [city], [arrivaltime], [departuretime], [date]) ";
            command = prefix + sb.ToString();

            return command;
        }

        public List<Package> getPackages(string companyName)
        {
            List<Package> packageList = new List<Package>();
            SqlConnection con = null;

            try
            {
                con = connect("DBConnectionString"); // create a connection to the database using the connection String defined in the web config file

                String selectSTR = "SELECT * FROM packages_final_cs" + (companyName != "noCompanyName" ? $" where companyname='{companyName}'" : "");
                SqlCommand cmd = new SqlCommand(selectSTR, con);

                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end

                while (dr.Read())
                {   // Read till the end of the data into a row
                    Package p = new Package();

                    p.Id = (string)dr["Id"];
                    p.Price = Convert.ToDouble(dr["Price"]);
                    p.Profit = Convert.ToDouble(dr["Profit"]);
                    p.Longitude = Convert.ToDouble(dr["Longitude"]);
                    p.Latitude = Convert.ToDouble(dr["Latitude"]);
                    p.PackageInfo = (string)dr["Packageinfo"];
                    p.CompanyName = (string)dr["Companyname"];
                    p.City = (string)dr["City"];
                    p.ArrivalTime = dr["Arrivaltime"].ToString();
                    p.DepartureTime = dr["Departuretime"].ToString();
                    p.Date = ((DateTime)dr["Date"]).Date;
                    p.SalesProfit = Convert.ToDouble(dr["Salesprofit"]);

                    packageList.Add(p);
                }

                return packageList;
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }

            }
        }

        public PacagesDBService readPackage(string packageId)
        {
            SqlConnection con = null;
            try
            {
                con = connect("DBConnectionString");
                da = new SqlDataAdapter("select * from packages_final_cs where id='" + packageId + "'", con);
                SqlCommandBuilder builder = new SqlCommandBuilder(da);
                DataSet ds = new DataSet();
                da.Fill(ds);
                dt = ds.Tables[0];
            }

            catch (Exception ex)
            {
                // write errors to log file
                // try to handle the error
                throw ex;
            }

            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
            return this;
        }
    }
}