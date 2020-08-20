using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Text;

namespace demo.Models.DataBaseServices
{
    public class LegsDBService : DBservices
    {
        public int insert(List<Leg> legArr)
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

            String cStr = BuildInsertCommand(legArr);      // helper method to build the insert string

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

        private String BuildInsertCommand(List<Leg> legArr)
        {
            String command = "";

            String legPrefix = "INSERT INTO Legs_Final_CS " + "(id, tripid, legnum, flightno, [from], [to], airlinecode, departuretime, arrivaltime, flyduration) ";

            // build insert legs command
            foreach (Leg leg in legArr)
            {
                StringBuilder sbLegs = new StringBuilder();
                sbLegs.AppendFormat("Values(N'{0}', N'{1}', N'{2}', N'{3}', N'{4}', N'{5}', N'{6}', N'{7}', N'{8}', N'{9}')",
                    leg.Id.Replace("'", "''"), leg.TripId.Replace("'", "''"), leg.LegNum, leg.FlightNo.Replace("'", "''"),
                    leg.CodeFrom.Replace("'", "''"), leg.CodeTo.Replace("'", "''"), leg.AirlineCode.Replace("'", "''"),
                    leg.DepartureTime, leg.ArrivalTime, leg.FlyDuration.Replace("'", "''"));
                command += " " + legPrefix + sbLegs.ToString();
            }

            return command;
        }
    }
}