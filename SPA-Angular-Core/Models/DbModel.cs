using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
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
        public virtual DBQnA QnA { get; set; }
    }

    public class QnAContext : DbContext
    {

        public QnAContext(DbContextOptions<QnAContext> options) : base(options)  
        {
                   
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            DBQnA d1 = new DBQnA
            {
                Id = 1,
                Question = "Kan jeg kjøpe billett på bussen?",
                Downvotes = 3,
                Upvotes = 16
            };

            DBQnA d2 = new DBQnA
            {
                Id = 2,
                Question = "Hvorfor er det ulik pris på avganger på samme strekning?",
                Downvotes = 6,
                Upvotes = 12
            };

            modelBuilder.Entity<DBQnA>().HasData(d1, d2);

            modelBuilder.Entity<DBAnswer>(b =>
            {
                b.HasData(new
                {
                    Id = 1,
                    Answer = "Ja. Vi selger billett på bussen, men vi anbefaler å kjøpe billetten på vy.no eller i Vy-appen på forhånd. Det er som regel billigere og i tillegg er du garantert plass. Periodebilletter, reisedager og klippekort må foreløpig kjøpes på nettbuss.no eller i Nettbuss-appen. ",
                    Upvotes = 20,
                    QnAId = 1
                });
                b.HasData(new {
                    Id = 2,
                    Answer = "Billettprisene på nett vil kunne variere fra dag til dag. Dette kommer an på hvor mange ledige plasser det er igjen, hvor langt frem i tid reisen er og hvor populær avgangen er. Er du tidlig ute og kjøper på vy.no eller i Vy-appen får du de billigste billettene. ",
                    Upvotes = 18,
                    QnAId = 2
                });
                b.HasData(new
                {
                    Id = 3,
                    Answer = "Dette er for at du skal få noe å spørre om lille unge...! Betal det det koster og kom deg videre.",
                    Upvotes = 0,
                    QnAId = 2
                });
            });
        }

        public DbSet<DBQnA> DBQnAs { get; set; }
        public DbSet<DBAnswer> Answers { get; set; }
    }
}
