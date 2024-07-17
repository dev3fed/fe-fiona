using Microsoft.AspNetCore.Mvc;

namespace Cuba.Controllers
{
    public class BuildersController : Controller
    {
        public IActionResult FormBuilder1()
        {
            return View();
        }
        public IActionResult FormBuilder2()
        {
            return View();
        }
        public IActionResult PageBuilder()
        {
            return View();
        }
        public IActionResult ButtonBuilder()
        {
            return View();
        }
    }
}
