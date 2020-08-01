using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using System.Web.Configuration;
using System.Data;
using System.Text;
using demo.Models;

/// <summary>
/// DBServices is a class created by me to provides some DataBase Services
/// </summary>
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

    //--------------------------------------------------------------------------------------------------
    // This method inserts a car to the cars table 
    //--------------------------------------------------------------------------------------------------
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


    public int remove(string prefix)
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

        String cStr = BuildRemoveCommand(prefix);      // helper method to build the insert string

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
    // Build the Insert command String
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


    private String BuildInsertCommand(Flight flight)
    {
        String command;

        StringBuilder sb = new StringBuilder();
        // use a string builder to create the dynamic string
        sb.AppendFormat("Values(N'{0}', N'{1}', N'{2}', N'{3}', N'{4}', N'{5}', N'{6}', N'{7}', N'{8}', N'{9}', N'{10}', N'{11}')",
            flight.Id.Replace("'", "''"), flight.CodeFrom.Replace("'", "''"), flight.CodeTo.Replace("'", "''"), flight.DepartureTime,
            flight.ArrivalTime, flight.FlyDuration.Replace("'", "''"), flight.Price, flight.NumStops.Replace("'", "''"), 
            flight.OrderDate, flight.Passengers, flight.Email, flight.Stops);
        String prefix = "INSERT INTO Flights_Ex3_Final_CS " + "(id, [from], [to], departuretime, arrivaltime, flyduration, price, numstops, orderdate, passengers, email, stops) ";
        command = prefix + sb.ToString();

        return command;
    }


    private String BuildInsertCommand(List<Leg> legArr)
    {
        String command = "";

        String legPrefix = "INSERT INTO Legs_Ex3_Final_CS " + "(id, tripid, legnum, flightno, [from], [to], airlinecode, departuretime, arrivaltime, flyduration) ";

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

    public List<Flight> getFlights()
    {
        List<Flight> flightList = new List<Flight>();
        SqlConnection con = null;

        try
        {
            con = connect("DBConnectionString"); // create a connection to the database using the connection String defined in the web config file

            String selectSTR = "SELECT * FROM Flights_Ex3_Final_CS";
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


    private String BuildRemoveCommand(string prefix)
    {
        String command;
        String removePrefix = "DELETE FROM Movies_CS WHERE actor LIKE '" + prefix + "%' ";
        command = removePrefix;

        return command;
    }

    public void update()
    {
        da.Update(dt);
    }
    //---------------------------------------------------------------------------------
    // Create the SqlCommand
    //---------------------------------------------------------------------------------
    private SqlCommand CreateCommand(String CommandSTR, SqlConnection con)
    {

        SqlCommand cmd = new SqlCommand(); // create the command object

        cmd.Connection = con;              // assign the connection to the command object

        cmd.CommandText = CommandSTR;      // can be Select, Insert, Update, Delete 

        cmd.CommandType = System.Data.CommandType.Text; // the type of the command, can also be stored procedure

        return cmd;
    }
}
