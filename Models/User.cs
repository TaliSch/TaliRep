using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.Data.Entity;


namespace MyBlogEmpty.Models
{
    public class User
    {
        public string ID { get; set; }
        [Required]
        public string Password { get; set; }
        [Required]
        public string Style { get; set; }
    }
}