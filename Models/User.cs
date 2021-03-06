﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.Data.Entity;
using System.Drawing;
using System.IO;


namespace MyBlogEmpty.Models
{
    public class UserCredentials
    {
        [Required]
        [MaxLength(10)]
        public string ID { get; set; }
        [Required]
        [MaxLength(10)]
        public string Password { get; set; }
    }

    public class UserPreferences
    {
        [Required]
        [MaxLength(10)]
        public string ID { get; set; }
        [Required]
        public string Style { get; set; }
        
        //[Required]
        public string Title { get; set; }

        public string Face { get; set; }

        public string Backgrownd { get; set; }

    }
}