using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace SPA_Angular_Core.Models
{
    public class QnA
    {
        public int id { get; set; }
        [Required]
        [RegularExpression("^[a-zA-ZøæåØÆÅ\\-. ]{10,500}$")]
        public string question { get; set; }
        [Required]
        [RegularExpression("^[a-zA-ZøæåØÆÅ\\-. ]{10,500}$")]
        public string answer { get; set; }
        public int upvotes { get; set; }
    }
}
