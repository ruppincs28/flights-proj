using System.Collections.Generic;
using demo.Models.DataBaseServices;

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
            CompaniesDBService companiesDBService = new CompaniesDBService();
            Company returnVal = companiesDBService.getCompany(username);
            if (returnVal != null)
            {
                return returnVal.Password == password ? returnVal : null;
            }
            return returnVal;
        }

        public int insert()
        {
            CompaniesDBService companiesDBService = new CompaniesDBService();
            int numAffected = companiesDBService.insert(this);
            return numAffected;
        }

        public static List<Company> GetCompanies()
        {
            CompaniesDBService companiesDBService = new CompaniesDBService();
            return companiesDBService.getCompanies();
        }
    }
}