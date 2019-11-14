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
            var ret = _context.DBQnAs.Select(q => new QnA()
            {
                Id = q.Id,
                Text = q.Question,
                Upvotes = q.Upvotes,
                Downvotes = q.Downvotes,
                Answers = _context.Answers.Where(a => a.QnA.Id == q.Id).Select(a => new Answer
                {
                    Id = a.Id,
                    Text = a.Answer,
                    Upvotes = a.Upvotes
                }).ToList()
            }).ToList();

            return ret;
        }
        
        public QnA get(int id)
        {
            DBQnA dnQnA = _context.DBQnAs.FirstOrDefault(q => q.Id == id);
            
            var qna = new QnA
            {
                Id = dnQnA.Id,
                Text = dnQnA.Question,
                Upvotes = dnQnA.Upvotes,
                Downvotes = dnQnA.Downvotes,
                Answers = _context.Answers.Where(a => a.QnA.Id == dnQnA.Id).Select(a => new Answer
                {
                    Id = a.Id,
                    Text = a.Answer,
                    Upvotes = a.Upvotes
                }).ToList()
            };
            return qna;
        }

        public bool save(QnA qna)
        {
            var dbQnA = new DBQnA
            {
                Question = qna.Text
            };

            try
            {
               _context.DBQnAs.Add(dbQnA);
               _context.SaveChanges();
                qna.Id = dbQnA.Id;
            }
            catch(Exception ex)
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

            foundQnA.Upvotes++;

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

            foundQnA.Downvotes++;

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

        public bool saveAnswer(int question, Answer answer)
        {
            var dbAnswer = new DBAnswer
            {
                Answer = answer.Text,
            };

            DBQnA dbQnA = _context.DBQnAs.Find(question);
            if (dbQnA == null)
            {
                return false;
            }

            try
            {
                _context.Answers.Add(dbAnswer);
                
                dbAnswer.QnA = dbQnA;

                _context.SaveChanges();

                answer.Id = dbAnswer.Id;
            }
            catch (Exception ex)
            {
                return false;
            }
            return true;
        }

        public bool upvoteAnswer(int id)
        {
            DBAnswer dBAnswer = _context.Answers.FirstOrDefault(q => q.Id == id);
            if(dBAnswer == null)
            {
                return false;
            }

            dBAnswer.Upvotes++;

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
    }
}
