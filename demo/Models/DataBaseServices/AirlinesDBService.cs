using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Text;

namespace demo.Models.DataBaseServices
{
    public class AirlinesDBService : DBservices
    {
        public int insert(List<Airline> airlines)
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

            String cStr = BuildInsertCommand(airlines);      // helper method to build the insert string

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

        private String BuildInsertCommand(List<Airline> airlines)
        {
            String command = "";

            String prefix = "INSERT INTO Airlines_Final_CS " + "(id, name) ";

            foreach (Airline airline in airlines)
            {
                StringBuilder sb = new StringBuilder();
                // use a string builder to create the dynamic string
                sb.AppendFormat("Values(N'{0}', N'{1}')",
                    airline.Id.Replace("'", "''"), airline.Name.Replace("'", "''"));
                command += " " + prefix + sb.ToString();
            }

            return command;
        }
    }
}