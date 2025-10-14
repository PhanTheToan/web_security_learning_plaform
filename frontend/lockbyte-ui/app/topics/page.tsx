
import {
  ArrowRight,
  FileWarning,
  ListFilter,
  Search,
  ServerCrash,
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TopicsApiResponse } from '@/types/topic';
import { Suspense } from 'react';
import { PaginationComponent } from '@/components/ui/pagination';

export const dynamic = 'force-dynamic';

async function fetchTopics(
  page: number,
  size: number,
  status: string,
): Promise<TopicsApiResponse | null> {
  const statusParam =
    status && status.toLowerCase() !== 'all' ? `&status=${status}` : '';
  try {
    const response = await fetch(
      `http://localhost:8082/api/public/topics?page=${page}&size=${size}${statusParam}`,
      {
        cache: 'no-store', // Disable caching for dynamic content
      },
    );
    if (!response.ok) {
      throw new Error('Failed to fetch topics');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

function TopicCard({ topic }: { topic: any }) {
  return (
    <Link
      href={`/topics/${topic.id}`}
      className="group block bg-gradient-to-br from-white/8 via-purple-500/5 to-blue-500/8 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-purple-500/60 hover:from-purple-500/10 hover:via-blue-500/8 hover:to-purple-500/10 transition-all duration-500 hover:shadow-[0_0_30px_rgba(151,71,255,0.2)] hover:scale-[1.02]"
    >
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold tracking-tight text-white">
          {topic.title}
        </h3>
        <Badge
          variant={topic.status === 'Published' ? 'default' : 'secondary'}
          className="flex-shrink-0 ml-2"
        >
          {topic.status}
        </Badge>
      </div>
      <p className="text-sm text-white/70 mt-2">By {topic.authorName}</p>
      <div className="flex justify-end mt-4">
        <ArrowRight className="h-5 w-5 text-gray-500 group-hover:text-white transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

function Toolbar({
  size,
  status,
  totalElements,
  sizeOptions,
}: {
  size: number;
  status: string;
  totalElements: number;
  sizeOptions: number[];
}) {
  return (
    <div className="flex items-center justify-between gap-4 my-6">
      <div className="flex items-center gap-4">
        <Tabs defaultValue={status}>
          <TabsList>
            <Link href="?status=all&size=10">
              <TabsTrigger value="all">All</TabsTrigger>
            </Link>
            <Link href="?status=Published&size=10">
              <TabsTrigger value="Published">Published</TabsTrigger>
            </Link>
            <Link href="?status=Draft&size=10">
              <TabsTrigger value="Draft">Draft</TabsTrigger>
            </Link>
          </TabsList>
        </Tabs>
      </div>
      <div className="flex items-center gap-2">
        <Select defaultValue={String(size)}>
          <SelectTrigger className="w-28">
            <SelectValue placeholder="Page size" />
          </SelectTrigger>
          <SelectContent>
            {sizeOptions.map((option) => (
              <Link href={`?status=${status}&size=${option}`} key={option}>
                <SelectItem value={String(option)}>{option} / page</SelectItem>
              </Link>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-gray-400 hidden md:inline">
          {totalElements} topics
        </span>
      </div>
    </div>
  );
}

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import ParticlesComponent from '@/components/particles-background';

export default async function TopicsPage({
  searchParams,
}: {
  searchParams?: {
    page?: string;
    size?: string;
    status?: string;
  };
}) {
  const sizeOptions = [10, 20, 50];
  const currentPage = Number(searchParams?.page) || 0;
  const size = Number(searchParams?.size) || sizeOptions[0];
  const status = searchParams?.status || 'all';

  const data = await fetchTopics(currentPage, size, status);

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <ServerCrash className="h-16 w-16 text-red-500" />
        <h2 className="mt-4 text-2xl font-semibold">Failed to Load Topics</h2>
        <p className="mt-2 text-gray-400">
          There was an error fetching the topics. Please try again later.
        </p>
        <Button asChild className="mt-6">
          <Link href="/topics">Try Again</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <ParticlesComponent id="tsparticles" />
      <Header />
      <main>
        <div className="container mx-auto px-4 py-12 sm:py-16 relative z-10">
          <header className="mb-12 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Topics
            </h1>
            <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
              Explore our curated collection of cybersecurity articles, guides,
              and research.
            </p>
          </header>

          <div className="bg-gradient-to-br from-white/5 via-purple-500/5 to-blue-500/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 mb-8">
            <Suspense fallback={<div>Loading toolbar...</div>}>
              <Toolbar
                size={size}
                status={status}
                totalElements={data.totalElements}
                sizeOptions={sizeOptions}
              />
            </Suspense>
          </div>

          {data.empty ? (
            <div className="bg-gradient-to-br from-white/5 via-purple-500/5 to-blue-500/5 backdrop-blur-sm p-12 rounded-xl border border-white/10 flex flex-col items-center justify-center min-h-[40vh]">
              <FileWarning className="h-12 w-12 text-gray-500" />
              <h3 className="mt-4 text-xl font-semibold">No Topics Found</h3>
              <p className="mt-1 text-gray-400">
                Try adjusting your filters or check back later.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.content.map((topic) => (
                <TopicCard key={topic.id} topic={topic} />
              ))}
            </div>
          )}

          {!data.empty && (
            <div className="mt-12 flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Showing{' '}
                <strong>
                  {data.pageable.offset + 1}–
                  {data.pageable.offset + data.numberOfElements}
                </strong>{' '}
                of <strong>{data.totalElements}</strong> topics
              </div>
              <PaginationComponent
                totalPages={data.totalPages}
                currentPage={currentPage}
                size={size}
                status={status}
              />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
