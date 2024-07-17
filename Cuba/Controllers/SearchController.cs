using Microsoft.AspNetCore.Mvc;

namespace Cuba.Controllers
{
    public class SearchController : Controller
    {
        public IActionResult Search()
        {
            return View();
        }
    }
}
