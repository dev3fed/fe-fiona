using Microsoft.AspNetCore.Mvc;

namespace Cuba.Controllers
{
    public class ContactsController : Controller
    {
        public IActionResult Contacts()
        {
            return View();
        }
    }
}
