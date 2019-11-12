using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Web;
using System.Data.Common;
using Microsoft.EntityFrameworkCore;

namespace SPA_Angular_Core.Models
{
    public class DBQnA
    {
        [Key]
        public int id { get; set; }
        public string question { get; set; }
        public string answer { get; set; }
        public int upvotes { get; set; }
    }

    public class QnAContext : DbContext
    {
        public QnAContext(DbContextOptions<QnAContext> options)
        : base(options)  { }
      
        public DbSet<DBQnA> DBQnAs { get; set; }
    }
}
