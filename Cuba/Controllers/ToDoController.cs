using Microsoft.AspNetCore.Mvc;

namespace Cuba.Controllers
{
    public class ToDoController : Controller
    {
        public IActionResult Todo()
        {
            return View();
        }
    }
}
