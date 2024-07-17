using Microsoft.AspNetCore.Mvc;

namespace Cuba.Controllers
{
    public class FileManagerController : Controller
    {
        public IActionResult FileManager()
        {
            return View();
        }
    }
}
