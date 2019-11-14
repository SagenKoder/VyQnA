using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SPA_Angular_Core.Models
{
    public class DBQnA
    {
        [Key]
        public int Id { get; set; }
        public string Question { get; set; }
        public virtual ICollection<DBAnswer> Answers { get; set; }
        public int Upvotes { get; set; }
        public int Downvotes { get; set; }
    }

    public class DBAnswer
    {
        [Key]
        public int Id { get; set; }
        public string Answer { get; set; }
        public int Upvotes { get; set; }
        public int QnAId { get; set; }
        [ForeignKey("QnAId")]
        public virtual DBQnA QnA { get; set; }
    }

    public class QnAContext : DbContext
    {

        public QnAContext(DbContextOptions<QnAContext> options) : base(options)  
        {
                   
        }
      
        public DbSet<DBQnA> DBQnAs { get; set; }
        public DbSet<DBAnswer> Answers { get; set; }
    }
}
