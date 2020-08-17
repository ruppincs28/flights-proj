using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Web.Configuration;
using System.Data;
using System.Text;

namespace demo.Models.DataBaseServices
{
    /// <summary>
    /// DBServices is a class created by me to provides some DataBase Services
    /// </summary>
    /// 
    public class DBservices
    {
        public SqlDataAdapter da;
        public DataTable dt;

        public DBservices()
        {
            //
            // TODO: Add constructor logic here
            //
        }

        //--------------------------------------------------------------------------------------------------
        // This method creates a connection to the database according to the connectionString name in the web.config 
        //--------------------------------------------------------------------------------------------------
        public SqlConnection connect(String conString)
        {
            // read the connection string from the configuration file
            string cStr = WebConfigurationManager.ConnectionStrings[conString].ConnectionString;
            SqlConnection con = new SqlConnection(cStr);
            con.Open();
            return con;
        }

        public void update()
        {
            da.Update(dt);
        }

        protected SqlCommand CreateCommand(String CommandSTR, SqlConnection con)
        {

            SqlCommand cmd = new SqlCommand(); // create the command object

            cmd.Connection = con;              // assign the connection to the command object

            cmd.CommandText = CommandSTR;      // can be Select, Insert, Update, Delete 

            cmd.CommandType = System.Data.CommandType.Text; // the type of the command, can also be stored procedure

            return cmd;
        }

        // Insert With List
        //public virtual int insert<T>(List<T> list)
        //{
        //    return 0;
        //}

        //// Build Insert Command Overload With List
        //public virtual String BuildInsertCommand<T>(List<T> list)
        //{
        //    return String.Empty;
        //}

        //// Another Overload For Insert With Object
        //public virtual int insert<T>(T obj)
        //{
        //    return 0;
        //}

        //public virtual String BuildInsertCommand(Object obj)
        //{
        //    return String.Empty;
        //}




        //#endregion

        //// ToDo Remove when project is done
        public int insert(Discount discount)
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

            String cStr = BuildInsertCommand(discount);      // helper method to build the insert string

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



        private String BuildInsertCommand(Discount discount)
        {
            String command;

            StringBuilder sb = new StringBuilder();
            // use a string builder to create the dynamic string
            sb.AppendFormat("Values(N'{0}', N'{1}', N'{2}', N'{3}', N'{4}', N'{5}')",
                discount.Airline.Replace("'", "''"), discount.From.Replace("'", "''"), discount.To.Replace("'", "''"),
                    discount.StartDate, discount.EndDate, discount.DiscountRate);
            String prefix = "INSERT INTO discounts_final_cs " + "(airline, [from], [to], startdate, enddate, discountrate) ";
            command = prefix + sb.ToString();

            return command;
        }

        public List<Discount> getDiscounts()
        {
            List<Discount> discountList = new List<Discount>();
            SqlConnection con = null;

            try
            {
                con = connect("DBConnectionString"); // create a connection to the database using the connection String defined in the web config file

                String selectSTR = "SELECT * FROM discounts_final_cs";
                SqlCommand cmd = new SqlCommand(selectSTR, con);

                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end

                while (dr.Read())
                {   // Read till the end of the data into a row
                    Discount d = new Discount();

                    d.Id = (int)dr["Id"];
                    d.Airline = (string)dr["Airline"];
                    d.From = (string)dr["From"];
                    d.To = (string)dr["To"];
                    d.StartDate = ((DateTime)dr["Startdate"]).Date;
                    d.EndDate = ((DateTime)dr["Enddate"]).Date;
                    d.DiscountRate = (string)dr["Discountrate"];

                    discountList.Add(d);
                }

                return discountList;
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



        //---------------------------------------------------------------------------------
        // Read Discount using a DataSet
        //---------------------------------------------------------------------------------
        public DBservices readDiscount(int id)
        {
            SqlConnection con = null;
            try
            {
                con = connect("DBConnectionString");
                da = new SqlDataAdapter("select * from discounts_final_cs where id='" + id + "'", con);
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


        //---------------------------------------------------------------------------------
        // Create the SqlCommand
        //---------------------------------------------------------------------------------

    }
}

