using Microsoft.AspNetCore.Mvc;

namespace Cuba.Controllers
{
    public class KanbanBoardController : Controller
    {
        public IActionResult kanbanBoard()
        {
            return View();
        }
    }
}
