using Microsoft.AspNetCore.Mvc;

namespace Cuba.Controllers
{
    public class OrganizationController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
