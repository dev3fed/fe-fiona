using Microsoft.AspNetCore.Mvc;

namespace Viho.Controllers
{
    public class KnowledgeController : Controller
    {
        public IActionResult Knowledgebase()
        {
            return View();
        }
    }
}
