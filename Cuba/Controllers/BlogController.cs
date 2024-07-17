using Microsoft.AspNetCore.Mvc;

namespace Viho.Controllers
{
    public class BlogController : Controller
    {
        public IActionResult BlogDetails()
        {
            return View();
        }
        public IActionResult BlogSingle()
        {
            return View();
        }
        public IActionResult AddPost()
        {
            return View();
        }
    }
}
