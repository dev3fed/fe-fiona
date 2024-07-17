using Microsoft.AspNetCore.Mvc;

namespace Cuba.Controllers
{
    public class ProjectController : Controller
    {
        public IActionResult projects()
        {
            return View();
        }
        public IActionResult ProjectCreate()
        {
            return View();
        }
    }
}
