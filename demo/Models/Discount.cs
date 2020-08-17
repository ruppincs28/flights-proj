using System;
using System.Collections.Generic;
using System.Linq;
using System.Data;
using System.Web;
using demo.Models.DataBaseServices;

namespace demo.Models
{
    public class Discount
    {
        int id;
        string airline;
        string from;
        string to;
        DateTime startDate;
        DateTime endDate;
        string discountRate;


        public Discount(int id, string airline, string from, string to, DateTime startDate, DateTime endDate, string discountRate)
        {
            this.id = id;
            this.airline = airline;
            this.from = from;
            this.to = to;
            this.startDate = startDate;
            this.endDate = endDate;
            this.discountRate = discountRate;
        }


        public Discount()
        {
            //
            // Empty constructor for DataReader
            //
        }


        public int Id { get => id; set => id = value; }
        public string Airline { get => airline; set => airline = value; }
        public string From { get => from; set => from = value; }
        public string To { get => to; set => to = value; }
        public DateTime StartDate { get => startDate; set => startDate = value; }
        public DateTime EndDate { get => endDate; set => endDate = value; }
        public string DiscountRate { get => discountRate; set => discountRate = value; }


        public static List<Discount> GetAll()
        {
            DBservices dbs = new DBservices();
            return dbs.getDiscounts();
        }

        public static void ModifyDiscount(Discount discount)
        {
            // read the discount table from the database into a dbs object
            DBservices dbs = new DBservices();
            dbs = dbs.readDiscount(discount.Id);

            foreach (DataRow dr in dbs.dt.Rows)
            {
                dr["Airline"] = discount.Airline;
                dr["From"] = discount.From;
                dr["To"] = discount.To;
                dr["Startdate"] = discount.StartDate;
                dr["Enddate"] = discount.EndDate;
                dr["Discountrate"] = discount.DiscountRate;
            }
            // update the DB
            dbs.update();
        }

        public static void DeleteDiscount(int id)
        {
            // read the discount table from the database into a dbs object
            DBservices dbs = new DBservices();
            dbs = dbs.readDiscount(id);

            foreach (DataRow dr in dbs.dt.Rows)
            {
                dr.Delete();
            }
            // update the DB
            dbs.update();
        }

        public int insert()
        {
            DBservices dbs = new DBservices();
            int numAffected = dbs.insert(this);
            return numAffected;
        }
    }
}