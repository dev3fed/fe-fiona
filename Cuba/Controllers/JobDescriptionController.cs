using Microsoft.AspNetCore.Mvc;

namespace Cuba.Controllers
{
    [Route("job-description")]
    [Route("jobDescription")]
    public class JobDescriptionController : Controller
    {
        [HttpGet("")]
        [HttpGet("index")]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet("detail")]
        public IActionResult Detail()
        {
            return View();
        }

        [HttpGet("draft-detail")]
        [HttpGet("approval-detail")]
        public IActionResult DraftDetail()
        {
            return View();
        }

    }
    
}
