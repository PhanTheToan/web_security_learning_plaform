import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import ParticlesComponent from '@/components/particles-background';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { TopicDetailApiResponse } from '@/types/topic';
import { ArrowRight, Copy, Home } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

async function fetchTopic(id: string): Promise<TopicDetailApiResponse | null> {
  try {
    const response = await fetch(`http://localhost:8082/api/public/topic/${id}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    if (!response.ok) {
      if (response.status === 404) {
        return null; // Will be handled by notFound()
      }
      throw new Error('Failed to fetch topic');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    // In a real app, you might want to log this error to a service
    throw new Error('Could not fetch topic data.');
  }
}

export default async function TopicDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const topic = await fetchTopic(params.id);

  if (!topic) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <ParticlesComponent id="tsparticles-detail" />
      <Header />
      <main>
        <div className="container mx-auto px-4 py-8 relative z-10">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">
                    <Home className="h-4 w-4" />
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/topics">Topics</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{topic.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <header className="mt-6 mb-8">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {topic.title}
            </h1>
            <div className="mt-4 flex items-center gap-4">
              <Badge
                variant={
                  topic.status === 'Published' ? 'default' : 'secondary'
                }
              >
                {topic.status}
              </Badge>
              <Button variant="outline" size="sm" className="gap-2">
                <Copy className="h-4 w-4" />
                Copy Link
              </Button>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-gradient-to-br from-white/5 via-purple-500/5 to-blue-500/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
              <article className="prose prose-invert max-w-none prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-a:text-purple-400 hover:prose-a:text-purple-300 prose-strong:text-white prose-blockquote:border-l-purple-400 prose-code:bg-gray-700 prose-code:p-1 prose-code:rounded-md prose-pre:bg-gray-700 prose-pre:p-4 prose-pre:rounded-lg">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {topic.content}
                </ReactMarkdown>
              </article>
            </div>

            <aside className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-gradient-to-br from-white/5 via-purple-500/5 to-blue-500/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
                  <h2 className="text-2xl font-bold mb-4">Related Labs</h2>
                  <div className="space-y-4">
                    {topic.labs.length > 0 ? (
                      topic.labs.map((lab) => (
                        <Link
                          key={lab.id}
                          href={`/labs/${lab.id}`}
                          className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg transition-all duration-300 hover:bg-purple-500/20 hover:scale-105"
                        >
                          <div>
                            <p className="font-semibold">{lab.name}</p>
                            <Badge
                              variant={
                                lab.estatus === 'Published'
                                  ? 'default'
                                  : 'secondary'
                              }
                              className="mt-1"
                            >
                              {lab.estatus}
                            </Badge>
                          </div>
                          <ArrowRight className="h-5 w-5 text-gray-400" />
                        </Link>
                      ))
                    ) : (
                      <p className="text-gray-400 text-center py-4">
                        No related labs found.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}