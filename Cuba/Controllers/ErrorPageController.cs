using Microsoft.AspNetCore.Mvc;

namespace Cuba.Controllers
{
    public class ErrorPageController : Controller
    {
        public IActionResult ErrorPage400()
        {
            return View();
        }
        public IActionResult ErrorPage401()
        {
            return View();
        }
        public IActionResult ErrorPage403()
        {
            return View();
        }
        public IActionResult ErrorPage404()
        {
            return View();
        }
        public IActionResult ErrorPage500()
        {
            return View();
        }
        public IActionResult ErrorPage503()
        {
            return View();
        }
    }
}
