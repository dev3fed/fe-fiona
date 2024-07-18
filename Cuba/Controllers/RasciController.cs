using Microsoft.AspNetCore.Mvc;

namespace Cuba.Controllers
{
    public class RasciController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
