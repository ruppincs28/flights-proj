using System;
using System.Data;
using System.Data.SqlClient;

namespace demo.Models.DataBaseServices
{
    public class AdminsDBService : DBservices
    {
        public Admin getAdmin(string username)
        {
            SqlConnection con = null;

            try
            {
                con = connect("DBConnectionString"); // create a connection to the database using the connection String defined in the web config file

                String selectSTR = "SELECT * FROM admins_final_cs where username = '" + username + "'";
                SqlCommand cmd = new SqlCommand(selectSTR, con);

                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end

                // init Admin instance
                Admin a = new Admin();

                while (dr.Read())
                {   // Read till the end of the data into a row
                    a.Username = (string)dr["username"];
                    a.Password = (string)dr["password"];
                }

                return a.Username == username ? a : null;
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
    }
}