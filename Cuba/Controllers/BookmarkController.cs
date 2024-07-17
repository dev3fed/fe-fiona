using Microsoft.AspNetCore.Mvc;

namespace Cuba.Controllers
{
    public class BookmarkController : Controller
    {
        public IActionResult Bookmark()
        {
            return View();
        }
    }
}
