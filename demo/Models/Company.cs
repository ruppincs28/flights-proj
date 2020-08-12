using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace demo.Models
{
    public class Company
    {
        string username;
        string password;
        string image;

        public Company()
        {

        }

        public Company(string username, string password, string image)
        {
            this.username = username;
            this.password = password;
            this.image = image;
        }

        public string Username { get => username; set => username = value; }
        public string Password { get => password; set => password = value; }
        public string Image { get => image; set => image = value; }

        public static Company validateCompany(string username, string password)
        {
            DBservices dbs = new DBservices();
            Company returnVal = dbs.getCompany(username);
            if (returnVal != null)
            {
                return returnVal.Password == password ? returnVal : null;
            }
            return returnVal;
        }

        public int insert()
        {
            DBservices dbs = new DBservices();
            int numAffected = dbs.insert(this);
            return numAffected;
        }
    }
}