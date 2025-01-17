﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace VyBillettQnA.Models
{
    public class Answer
    {
        public int Id { get; set; }
        [Required]
        [RegularExpression("^[A-ZÆØÅa-zæøå\\s?\\.,\\-_\\\\';:&%!\\n\\r<>]{5,5000}$")]
        public string Text { get; set; }
        public int Upvotes { get; set; }
    }
}
