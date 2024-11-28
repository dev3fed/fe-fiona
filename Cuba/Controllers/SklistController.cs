using Microsoft.AspNetCore.Mvc;

namespace Cuba.Controllers
{
    public class SklistController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
       
    }
}
