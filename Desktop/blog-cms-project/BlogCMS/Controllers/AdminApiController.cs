using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OrchardCore.ContentManagement;
using OrchardCore.ContentManagement.Records;
using YesSql;
using System.Linq;
using System.Threading.Tasks;

namespace BlogCMS.Controllers
{
    [Route("api/admin")]
    [ApiController]
    [Authorize]
    public class AdminApiController : ControllerBase
    {
        private readonly YesSql.ISession _session;

        public AdminApiController(YesSql.ISession session)
        {
            _session = session;
        }

        [HttpGet("posts")]
        public async Task<IActionResult> GetAllPosts()
        {
            var items = await _session.Query<ContentItem, ContentItemIndex>(x => 
                x.ContentType == "BlogPost")
                .ListAsync();

            var posts = items.Select(item => new
            {
                contentItemId = item.ContentItemId,
                displayText = item.DisplayText,
                published = item.Published,
                createdUtc = item.CreatedUtc,
                modifiedUtc = item.ModifiedUtc,
                publishedUtc = item.PublishedUtc,
                author = "Lina"
            }).ToList();

            return Ok(posts);
        }
    }
}