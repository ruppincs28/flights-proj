using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace demo.Models
{
    public class Admin
    {
        string username;
        string password;

        public Admin()
        {

        }


        public Admin(string username, string password)
        {
            this.Username = username;
            this.Password = password;
        }

        public string Username { get => username; set => username = value; }
        public string Password { get => password; set => password = value; }

        public static bool validateAdmin(string username, string password)
        {
            DBservices dbs = new DBservices();
            Admin returnVal = dbs.getAdmin(username);
            if (returnVal != null)
            {
                return returnVal.Password == password ? true : false;
            } else
            {
                return false;
            }
        }

    }
}