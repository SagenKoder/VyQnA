using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

using SPA_Angular_Core.Models;

namespace SPA_Angular_Core.Controllers
{
    [Route("api/[controller]")]
    public class QnAController : Controller
    {
        private readonly QnAContext _context;
        public QnAController(QnAContext context)
        {
            _context = context;
        }

        [HttpGet]
        public JsonResult Get()
        {
            var qnaDB = new QnADB(_context);
            List<QnA> all = qnaDB.getAll();
            return Json(all);
        }

        [HttpGet("{id}")]
        public JsonResult Get(int id)
        {
            var qnaDB = new QnADB(_context);
            var qna = qnaDB.get(id);
            return Json(qna);
        }

        [HttpPost]
        public JsonResult Post([FromBody]QnA qna)
        {
            if (ModelState.IsValid)
            {
                var qnaDB = new QnADB(_context);
                bool OK = qnaDB.save(qna);
                if (OK)
                {
                    return Json("OK");
                }
            }
            return Json("Could not insert QnA into database!");          
        }             

        [HttpPut("{id}")]
        public JsonResult Put(int id, [FromBody]QnA qna)
        {
            if(ModelState.IsValid)
            {
                var qnaDB = new QnADB(_context);
                bool OK = qnaDB.update(id, qna);
                if (OK)
                {
                    return Json("OK");
                }
            }
            return Json("Could not change QnA database!");
        }

        [HttpDelete("{id}")]
        public JsonResult Delete(int id)
        {
            var qnaDB = new QnADB(_context);
            bool OK = qnaDB.delete(id);
            if (!OK)
            {
                return Json("Could not delete QnA from database!");               
            }
            return Json("OK");
        }

        [HttpGet("UpvoteQuestion/{id}")]
        public JsonResult UpvoteQuestion(int id)
        {
            var qnaDB = new QnADB(_context);
            bool OK = qnaDB.upvoteQuestion(id);
            if (!OK)
            {
                return Json("Could not upvote QnA in database!");
            }
            return Json("OK");
        }

        [HttpGet("DownvoteQuestion/{id}")]
        public JsonResult DownvoteQuestion(int id)
        {
            var qnaDB = new QnADB(_context);
            bool OK = qnaDB.downvoteQuestion(id);
            if (!OK)
            {
                return Json("Could not downvote QnA in database!");
            }
            return Json("OK");
        }
    }
}
