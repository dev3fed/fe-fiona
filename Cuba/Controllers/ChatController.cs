using Microsoft.AspNetCore.Mvc;

namespace Cuba.Controllers
{
    public class ChatController : Controller
    {
        public IActionResult ChatApp()
        {
            return View();
        }
        public IActionResult VideoChat()
        {
            return View();
        }
    }
}
