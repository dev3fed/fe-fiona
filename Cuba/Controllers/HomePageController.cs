using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;

namespace Cuba.Controllers
{
    // [Authorize]
    public class HomePageController : Controller
    {

        public IActionResult Index()
        {
            return View();
        }
    }
}
