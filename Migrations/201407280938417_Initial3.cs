namespace MyBlogEmpty.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Initial3 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.UserPreferences", "Face", c => c.Binary());
            AddColumn("dbo.UserPreferences", "Backgrownd", c => c.Binary());
            DropColumn("dbo.UserPreferences", "Name");
        }
        
        public override void Down()
        {
            AddColumn("dbo.UserPreferences", "Name", c => c.String());
            DropColumn("dbo.UserPreferences", "Backgrownd");
            DropColumn("dbo.UserPreferences", "Face");
        }
    }
}
