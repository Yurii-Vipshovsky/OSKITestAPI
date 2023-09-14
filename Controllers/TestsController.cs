using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using OSKITestAPI.Data;
using OSKITestAPI.Models;

namespace OSKITestAPI.Controllers
{

    public class NewTestData
    {
        public string Name { get; set; }
        public List<NewQuestion> Questions { get; set; }
    }

    public class NewQuestion
    {
        public string questionText { get; set; }
        public string questionAnswer { get; set; }
    }

    public class AnswerItem
    {
        public string questionId { get; set; }
        public string answer { get; set; }
    }

    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class TestsController : ControllerBase
    {
        private readonly OSKIDBContext _context;

        public TestsController(OSKIDBContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Only for admin users
        /// </summary>
        /// <returns>List with all tests</returns>
        /// <response code="200">Return list with all tests</response> 
        /// <response code="401">If unautorized user or not admin user</response> 
        [HttpGet("/GetAllTests")]
        [Authorize(Roles = "admin")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> GetAllTests()
        {
            var tests = _context.Tests.ToList();
            return Ok(tests);
        }

        /// <summary>
        /// View all tests passed and assigned to curent User
        /// </summary>
        /// <returns>All tests assigned to curent user</returns>
        /// <response code="200">Return list with tests</response> 
        /// <response code="401">If unautorized user</response> 
        [HttpGet("/GetAllTestsForCurrentUser")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> GetAllTestsForCurrentUser()
        {
            var tests = _context.Results
                .Where(r => r.UserId.ToString() == User.FindFirst("userId").Value)//find better way in programing
                .Include(r => r.Test)
                .Select(r => new
                {
                    TestId = r.TestId,
                    TestName = r.Test.Name,
                    IsCompleted = r.IsComleted,
                    Score = r.Score
                })
                .ToList();
            return Ok(tests);
        }

        /// <summary>
        /// Get test questions
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Return test name and all quesions</returns>
        /// <response code="200">Return test name and all quesions</response> 
        /// <response code="401">If unautorized user</response> 
        [HttpGet("/GetTest/{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> GetTest(string id)
        {
            var test = _context.Results.Include(r=>r.Test).FirstOrDefault(r =>(r.TestId.ToString() == id) && (r.UserId.ToString() == User.FindFirst("userId").Value));//find better way in programing
            if(test == null)
            {
                return BadRequest();
            }
            if (test.IsComleted)
            {
                return BadRequest("User can't pass one test twise");
            }
            var questions = _context.Questions
                .Where(r => r.TestId.ToString() == id)
                .Select(r => new
                {
                    r.Id,
                    r.QuestionText
                })
                .ToList();
            return Ok(new
            {
                TestName = test.Test.Name,
                Questions = questions
            });
        }

        /// <summary>
        /// Answer to test questions
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///
        ///     POST /AnswerTest/{id}
        ///     [
        ///        {
        ///         "questionId": "Guid of question",
        ///         "answer": "User answer to this question"
        ///        }
        ///     ]
        ///
        /// </remarks>
        /// <param name="id"></param>
        /// <param name="answers"></param>
        /// <returns>User score for this test</returns>
        /// <response code="200">User score for this test</response> 
        /// <response code="400">If test is unavailable or unassigned or user passed it before</response>
        /// <response code="401">If unautorized user</response> 
        [HttpPost("/AnswerTest/{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> AnswerTest(string id, [FromBody] List<AnswerItem> answers)
        {
            var result = _context.Results.Include(r=>r.Test).FirstOrDefault(r => ((r.TestId.ToString() == id) && (r.UserId.ToString() == User.FindFirst("userId").Value)));
            if (result == null)
            {
                return BadRequest();
            }
            if (result.IsComleted)
            {
                return BadRequest("User can't pass one test twise");
            }
            result.IsComleted = true;
            var questions = _context.Questions
                .Where(r => r.TestId.ToString() == id)
                .ToList();
            int CorrectAnswersCount = 0;
            foreach (var answer in answers)
            {
                if(questions.FirstOrDefault(elem => elem.Id.ToString() == answer.questionId).checkAnswer(answer.answer))
                {
                    CorrectAnswersCount++;
                }
            }
            result.CalculateScore(CorrectAnswersCount);
            _context.Update(result);
            _context.SaveChanges();
            return Ok(result.Score);
        }


        /// <summary>
        /// To create new test with questions
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///
        ///     POST /CreateTest
        ///     {
        ///       "name": "Test name",
        ///       "questions": [
        ///         {
        ///           "questionText": "Question for this test",
        ///           "questionAnswer": "Answer for this question"
        ///         }
        ///       ]
        ///     }
        /// </remarks>
        /// <param name="getTest"></param>
        /// <returns></returns>
        /// <response code="200">If test created</response> 
        /// <response code="400">If test with same name is exists</response>
        /// <response code="401">If unautorized user or user is not admin</response> 
        [HttpPost("/CreateTest")]
        [Authorize(Roles = "admin")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Create([FromBody] NewTestData getTest)
        {
            if ((_context.Tests?.Any(e => e.Name == getTest.Name)).GetValueOrDefault())
            {
                return BadRequest("Test with same name Exist");
            }           
            Test test = new Test() { Id = Guid.NewGuid(), Name = getTest.Name };
            _context.Add(test);
            await _context.SaveChangesAsync();
            foreach (var question in getTest.Questions)
            {
                Question newQuestion = new Question()
                {
                    Id = Guid.NewGuid(),
                    QuestionAnswer = question.questionAnswer,
                    QuestionText = question.questionText,
                    Test = test
                };
                _context.Add(newQuestion);
            }
            await _context.SaveChangesAsync();
            return Ok();
        }

        /// <summary>
        /// To assign test to user
        /// </summary>
        /// <param name="testId">Goid of test</param>
        /// <param name="userId">Goid of user</param>
        /// <returns></returns>
        /// <response code="200">If test created</response> 
        /// <response code="400">If test with id doesn't exist, if user with id doesn't exists, if user already assigned to this test</response>
        /// <response code="401">If unautorized user or user is not admin</response> 
        [HttpPost("/AssignTest/{testId}&{userId}")]
        [Authorize(Roles = "admin")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Assign(string testId, string userId)
        {
            if (!(_context.Tests?.Any(e => e.Id.ToString() == testId)).GetValueOrDefault())
            {
                return BadRequest("Test with this ID doesn't Exist");
            }
            if (!(_context.Users?.Any(e => e.Id.ToString() == userId)).GetValueOrDefault())
            {
                return BadRequest("User with this ID doesn't Exist");
            }
            if((_context.Results?.Any(e => (e.TestId.ToString() == testId) && (e.UserId.ToString() == userId))).GetValueOrDefault())
            {
                return BadRequest("This user already assigned to this test");
            }
            Result result = new Result() { 
                Id = new Guid(),
                TestId = Guid.Parse(testId),
                UserId = Guid.Parse(userId),
                IsComleted = false,
            };
            _context.Add(result);
            _context.SaveChanges();
            return Ok();
        }
    }
}
