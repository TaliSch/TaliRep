using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyBlogEmpty.Controllers.Shared
{
    public class ConrollerSession
    {
        HttpSessionStateBase session;
        public ConrollerSession(HttpSessionStateBase session)
        {
            this.session = session;
        }
        public bool Admin
        {
            get
            {
                if (session["admin"] == null)
                    session["admin"] = false;
                return (bool)session["admin"];
            }
            set { session["admin"] = value; }
        }  
        
        //public int NextPosSession
        //{
        //    get { return (int)session["nextPos"]; }
        //    set { session["nextPos"] = value; }
        //}
    }
}