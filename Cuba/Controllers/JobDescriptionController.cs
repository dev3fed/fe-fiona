using Microsoft.AspNetCore.Mvc;

namespace Cuba.Controllers
{
    public class JobDescriptionController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
