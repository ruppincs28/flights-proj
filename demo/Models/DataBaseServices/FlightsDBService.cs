using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;

namespace demo.Models.DataBaseServices
{
    public class FlightsDBService : DBservices
    {
        public int insert(Flight flight)
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

            String cStr = BuildInsertCommand(flight);      // helper method to build the insert string

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

        private String BuildInsertCommand(Flight flight)
        {
            String command;

            StringBuilder sb = new StringBuilder();
            var packageId = flight.PackageId != "" ? flight.PackageId : "noPackage";
            // use a string builder to create the dynamic string
            sb.AppendFormat("Values(N'{0}', N'{1}', N'{2}', N'{3}', N'{4}', N'{5}', N'{6}', N'{7}', N'{8}', N'{9}', N'{10}', N'{11}', N'{12}')",
                flight.Id.Replace("'", "''"), flight.CodeFrom.Replace("'", "''"), flight.CodeTo.Replace("'", "''"), flight.DepartureTime,
                flight.ArrivalTime, flight.FlyDuration.Replace("'", "''"), flight.Price, flight.NumStops.Replace("'", "''"),
                flight.OrderDate, flight.Passengers, flight.Email, flight.Stops, packageId);
            String prefix = "INSERT INTO Flights_Final_CS " + "(id, [from], [to], departuretime, arrivaltime, flyduration, price, numstops, orderdate, passengers, email, stops, packageId) ";
            command = prefix + sb.ToString();

            return command;
        }

        public List<Flight> getFlights()
        {
            List<Flight> flightList = new List<Flight>();
            SqlConnection con = null;

            try
            {
                con = connect("DBConnectionString"); // create a connection to the database using the connection String defined in the web config file

                String selectSTR = "SELECT * FROM Flights_Final_CS";
                SqlCommand cmd = new SqlCommand(selectSTR, con);

                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end

                while (dr.Read())
                {   // Read till the end of the data into a row
                    Flight f = new Flight();

                    f.Id = (string)dr["Id"];
                    f.Email = (string)dr["Email"];
                    f.Price = Convert.ToDouble(dr["Price"]);
                    f.CodeFrom = (string)dr["From"];
                    f.CodeTo = (string)dr["To"];
                    f.DepartureTime = (DateTime)dr["Departuretime"];
                    f.ArrivalTime = (DateTime)dr["Arrivaltime"];
                    f.Stops = (string)dr["Stops"];
                    f.FlyDuration = (string)dr["Flyduration"];
                    f.OrderDate = (DateTime)dr["Orderdate"];
                    f.Passengers = (string)dr["Passengers"];
                    f.PackageId = (string)dr["PackageId"];

                    flightList.Add(f);
                }

                return flightList;
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

        public FlightsDBService readFlight(string email)
        {
            SqlConnection con = null;
            try
            {
                con = connect("DBConnectionString");
                da = new SqlDataAdapter("select * from flights_final_cs where email='" + email + "'", con);
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