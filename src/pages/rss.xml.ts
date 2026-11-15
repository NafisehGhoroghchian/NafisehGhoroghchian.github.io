import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { resume } from '../lib/resume';
import { getPosts } from '../lib/posts';

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: `${resume.name} — blog`,
    description: 'Notes on agentic LLM systems, RL post-training, evaluation, and graph ML.',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/blog/${post.id}`,
      categories: post.data.tags,
    })),
  });
}
