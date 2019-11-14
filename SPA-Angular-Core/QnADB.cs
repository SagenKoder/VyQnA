using System;
using System.Collections.Generic;
using System.Linq;
using SPA_Angular_Core.Models;

namespace SPA_Angular_Core
{
    public class QnADB
    {
        private readonly QnAContext _context;
        public QnADB(QnAContext context)
        {
            _context = context;
        }
        
        public List<QnA> getAll()
        {
            return _context.DBQnAs.Select(q => new QnA()
                { 
                    id = q.id, 
                    answer = q.answer, 
                    question = q.question, 
                    upvotes = q.upvotes,
                    downvotes = q.downvotes
                })
                .ToList();
        }
        
        public QnA get(int id)
        {
            DBQnA dnQnA = _context.DBQnAs.FirstOrDefault(q => q.id == id);

            var qna = new QnA()
            {
                id = dnQnA.id,
                answer = dnQnA.answer,
                question = dnQnA.question,
                upvotes = dnQnA.upvotes,
                downvotes = dnQnA.downvotes
            };
            return qna;
        }

        public bool save(QnA qna)
        {
            var dbQnA = new DBQnA
            {
                id = qna.id,
                answer = qna.answer,
                question = qna.question,
                upvotes = qna.upvotes,
                downvotes = qna.downvotes
            };

            try
            {
               _context.DBQnAs.Add(dbQnA);
               _context.SaveChanges();
            }
            catch(Exception ex)
            {
                return false;
            }
            return true;
        }

        public bool update(int id, QnA qna)
        {
            DBQnA foundQnA = _context.DBQnAs.Find(id);
            if (foundQnA == null)
            {
                return false;
            }

            foundQnA.answer = qna.answer;
            foundQnA.question = qna.question;
            foundQnA.upvotes = qna.upvotes;
            foundQnA.downvotes = qna.downvotes;

            try
            {
                _context.SaveChanges();
            }
            catch(Exception feil)
            {
                return false;
            }
            return true;
        }

        public bool upvoteQuestion(int id)
        {
            DBQnA foundQnA = _context.DBQnAs.Find(id);
            if (foundQnA == null)
            {
                return false;
            }

            foundQnA.upvotes = foundQnA.upvotes + 1;

            try
            {
                _context.SaveChanges();
            }
            catch (Exception feil)
            {
                return false;
            }
            return true;
        }

        public bool downvoteQuestion(int id)
        {
            DBQnA foundQnA = _context.DBQnAs.Find(id);
            if (foundQnA == null)
            {
                return false;
            }

            foundQnA.downvotes = foundQnA.downvotes + 1;

            try
            {
                _context.SaveChanges();
            }
            catch (Exception feil)
            {
                return false;
            }
            return true;
        }

        public bool delete(int id)
        {
            try
            {
                DBQnA foundQnA = _context.DBQnAs.Find(id);
                _context.DBQnAs.Remove(foundQnA);
                _context.SaveChanges();
            }
            catch(Exception feil)
            {
                return false;
            }
            return true;
        }
    }
}
