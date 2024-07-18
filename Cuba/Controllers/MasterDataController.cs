using Microsoft.AspNetCore.Mvc;

namespace Cuba.Controllers
{
    public class MasterDataController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
