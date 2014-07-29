namespace MyBlogEmpty.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Initial4 : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.UserPreferences", "Face", c => c.String());
            AlterColumn("dbo.UserPreferences", "Backgrownd", c => c.String());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.UserPreferences", "Backgrownd", c => c.Binary());
            AlterColumn("dbo.UserPreferences", "Face", c => c.Binary());
        }
    }
}
