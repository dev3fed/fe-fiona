using Microsoft.AspNetCore.Mvc;

namespace Viho.Controllers
{
    public class FAQController : Controller
    {
        public IActionResult FAQ()
        {
            return View();
        }
    }
}
