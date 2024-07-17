using Microsoft.AspNetCore.Mvc;

namespace Cuba.Controllers
{
    public class ButtonsController : Controller
    {
        public IActionResult DefaultStyle()
        {
            return View();
        }
        public IActionResult FlatStyle()
        {
            return View();
        }
        public IActionResult EdgeStyle()
        {
            return View();
        }
        public IActionResult RaisedStyle()
        {
            return View();
        }
        public IActionResult ButtonGroup()
        {
            return View();
        }
    }
}
