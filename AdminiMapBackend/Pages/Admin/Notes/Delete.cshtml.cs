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
    public class DeleteModel : PageModel
    {
        private readonly AdminiMapBackend.Data.AdminiMapContext _context;

        public DeleteModel(AdminiMapBackend.Data.AdminiMapContext context)
        {
            _context = context;
        }

        [BindProperty]
      public Note Note { get; set; } = default!;

        public async Task<IActionResult> OnGetAsync(int? id)
        {
            if (id == null || _context.Notes == null)
            {
                return NotFound();
            }

            var note = await _context.Notes.FirstOrDefaultAsync(m => m.Id == id);

            if (note == null)
            {
                return NotFound();
            }
            else 
            {
                Note = note;
            }
            return Page();
        }

        public async Task<IActionResult> OnPostAsync(int? id)
        {
          if (id == null || _context.Notes == null)
          {
              return NotFound();
          }
          var note = await _context.Notes.FindAsync(id);

          if (note != null)
          {
              Note = note;
              _context.Notes.Remove(Note);
              await _context.SaveChangesAsync();
          }

          return RedirectToPage("./Index");
        }
    }
}
