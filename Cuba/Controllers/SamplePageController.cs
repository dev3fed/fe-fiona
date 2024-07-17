using Microsoft.AspNetCore.Mvc;

namespace Cuba.Controllers
{
    public class SamplePageController : Controller
    {
        public IActionResult SamplePage()
        {
            return View();
        }
    }
}
