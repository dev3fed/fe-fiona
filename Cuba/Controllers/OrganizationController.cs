using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;

namespace Cuba.Controllers
{
    [Authorize]
    [Route("organization")]
    public class OrganizationController : Controller
    {
        [HttpGet("index")] 
        public IActionResult Index()
        {
            return View();
        }
    
        [HttpGet("form-position")] 
        public IActionResult FormPosition()
        {
            return View();
        }

        [HttpGet("draft-detail")]
        [HttpGet("approval-detail")]
        public IActionResult DraftDetail()
        {
            return View();
        }

        [HttpGet("new-subordinate")] 
        public IActionResult NewSubordinate()
        {
            return View();
        }

    }
    
}
