using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Text;
namespace demo.Models.DataBaseServices
{
    public class AirportsDBService : DBservices
    {
        //--------------------------------------------------------------------
        // Insert airport command 
        //--------------------------------------------------------------------
        public int insert(List<Airport> airports)

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

            String cStr = BuildInsertCommand(airports);      // helper method to build the insert string

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

        //--------------------------------------------------------------------
        // Build the Insert airport command String
        //--------------------------------------------------------------------
        private String BuildInsertCommand(List<Airport> airports)
        {
            String command = "";

            String prefix = "INSERT INTO Airports_Final_CS " + "(id, name, lng, lat, city, country) ";

            foreach (Airport airport in airports)
            {
                StringBuilder sb = new StringBuilder();
                // use a string builder to create the dynamic string
                sb.AppendFormat("Values(N'{0}', N'{1}', N'{2}', N'{3}', N'{4}', N'{5}')",
                    airport.Id.Replace("'", "''"), airport.Name.Replace("'", "''"),
                    airport.Lng, airport.Lat, airport.City.Replace("'", "''"), airport.Country.Replace("'", "''"));
                command += " " + prefix + sb.ToString();
            }

            return command;
        }
    }
}