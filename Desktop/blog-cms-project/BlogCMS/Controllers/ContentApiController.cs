using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using OrchardCore.ContentManagement;
using OrchardCore.ContentManagement.Records;
using YesSql;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;
using System.Text.Json;


namespace BlogCMS.Controllers
{
    [Route("api/content")]
    [ApiController]
    [AllowAnonymous]
    public class ContentApiController : ControllerBase
    {
        private readonly YesSql.ISession _session;

        public ContentApiController(YesSql.ISession session)
        {
            _session = session;
        }

        [HttpGet("blogpost")]
        public async Task<IActionResult> GetBlogPosts()
        {
            var items = await _session.Query<ContentItem, ContentItemIndex>(x => 
                x.ContentType == "BlogPost" && x.Published)
                .ListAsync();

            var posts = items.Select(item => new
{
    contentItemId = item.ContentItemId,
    title = item.DisplayText,
    published = item.Published,
    createdUtc = item.CreatedUtc,
    modifiedUtc = item.ModifiedUtc,
    publishedUtc = item.PublishedUtc,
    author = "Lina",
       body = item.Content.BlogPost?.Body?.Html?.ToString() ?? "",
}).ToList();

            return Ok(posts);
        }
    }
}