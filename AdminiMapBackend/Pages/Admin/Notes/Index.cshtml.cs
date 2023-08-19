using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using AdminiMapBackend.Data;
using AdminiMapBackend.Entities;

namespace AdminiMapBackend.Pages.Admin.Notes
{
    public class IndexModel : PageModel
    {
        private readonly AdminiMapBackend.Data.AdminiMapContext _context;

        public IndexModel(AdminiMapBackend.Data.AdminiMapContext context)
        {
            _context = context;
        }

        public IList<Note> Note { get;set; } = default!;

        public async Task OnGetAsync()
        {
            if (_context.Notes != null)
            {
                Note = await _context.Notes.ToListAsync();
            }
        }
    }
}
