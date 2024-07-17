using Microsoft.AspNetCore.Mvc;

namespace Viho.Controllers
{
    public class LearningController : Controller
    {
        public IActionResult LearningList()
        {
            return View();
        }
        public IActionResult DetailedCourse()
        {
            return View();
        }
    }
}
