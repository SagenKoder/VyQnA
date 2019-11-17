using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace VyBillettQnA.Models
{
    public class QnA
    {
        public int Id { get; set; }
        [Required]
        [RegularExpression("^[A-ZÆØÅa-zæøå\\s?\\.,\\-_\\\\';:&%!\\n\\r<>]{5,500}$")]
        public string Text { get; set; }
        public int Upvotes { get; set; }
        public int Downvotes { get; set; }
        public ICollection<Answer> Answers { get; set; }
    }
}
