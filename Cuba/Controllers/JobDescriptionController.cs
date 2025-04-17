
using Microsoft.AspNetCore.Mvc;

namespace Cuba.Controllers
{
    [Route("job-description")]
    public class JobDescriptionController : Controller
    {
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

        // [HttpGet("draft-detail")] 
        // public IActionResult DraftDetail()
        // {
        //     return View();
        // }

        // [HttpGet("new-subordinate")] 
        // public IActionResult NewSubordinate()
        // {
        //     return View();
        // }

    }
    
}
