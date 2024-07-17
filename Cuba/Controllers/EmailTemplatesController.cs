using Microsoft.AspNetCore.Mvc;

namespace Viho.Controllers
{
    public class EmailTemplatesController : Controller
    {
        public IActionResult BasicEmail()
        {
            return View();
        }
        public IActionResult BasicWithHeader()
        {
            return View();
        }
        public IActionResult EcomerceTemplate()
        {
            return View();
        }
        public IActionResult EmailTemplate2()
        {
            return View();
        }
        public IActionResult EcommerceEmail()
        {
            return View();
        }
        public IActionResult OrderSuccess()
        {
            return View();
        }
    }
}
