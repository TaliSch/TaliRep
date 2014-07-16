using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace MyBlogEmpty.CustomConfigs
{
    public class GeneralSettingsSection : ConfigurationSection
    {
        [ConfigurationProperty("user")]
        public UserElement User
        {
            get { return (UserElement)this["user"]; }
            set { this["user"] = value; }
        }

        [ConfigurationProperty("style")]
        public StyleElement Style
        {
            get { return (StyleElement)this["style"]; }
            set { this["style"] = value; }
        }

        public class UserElement : ConfigurationElement
        {
            [ConfigurationProperty("username", DefaultValue = "", IsRequired = true)]
            public string UserName
            {
                get { return (string)this["username"]; }
                set { this["username"] = value; }
            }

            [ConfigurationProperty("password", DefaultValue = "", IsRequired = true)]
            public string EmailPassword
            {
                get { return (string)this["password"]; }
                set { this["password"] = value; }
            }
        }
        public class StyleElement : ConfigurationElement
        {
            [ConfigurationProperty("index", DefaultValue = "", IsRequired = true)]
            public string Index
            {
                get { return (string)this["index"]; }
                set { this["index"] = value; }
            }
        }
    }
}