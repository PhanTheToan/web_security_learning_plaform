'use client';

import { ArrowRight, FileWarning, ServerCrash } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CtaSection } from '@/components/cta-section';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Topic } from '@/types/topic';
import { useEffect, useMemo, useState } from 'react';
import { PaginationComponent } from '@/components/ui/pagination';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import ParticlesComponent from '@/components/particles-background';


function TopicCard({ topic }: { topic: Topic }) {
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
      <div className="mt-4 flex flex-wrap gap-2">
        {topic.tags?.map((tag) => (
          <Badge
            key={tag.id}
            variant="secondary"
            className="bg-blue-500/10 text-blue-300 border-blue-500/20 text-xs"
          >
            {tag.name}
          </Badge>
        ))}
      </div>
      <div className="flex justify-end mt-4">
        <ArrowRight className="h-5 w-5 text-gray-500 group-hover:text-white transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

/**
 * Toolbar mới:
 * - Search theo title (q)
 * - Filter theo tag (tag)
 * - Giữ select page size
 * - Tất cả thao tác đều update qua querystring để pagination hoạt động đúng
 */
function Toolbar({
  size,
  totalElements,
  sizeOptions,
  q: currentQ, // Renamed to avoid conflict with internal q state
  tag: currentTag, // Renamed to avoid conflict with internal tag state
  tagOptions,
  onQChange,
  onTagChange,
}: {
  size: number;
  totalElements: number;
  sizeOptions: number[];
  q: string;
  tag: string; // tagId (string) hoặc "all"
  tagOptions: { id: number; name: string }[];
  onQChange: (q: string) => void;
  onTagChange: (tag: string) => void;
}) {
  const [qInput, setQInput] = useState(currentQ);
  const router = useRouter(); // To update the URL without full reload

  useEffect(() => {
    setQInput(currentQ);
  }, [currentQ]);

  // Handle page size change (still uses URL for simplicity of pagination)
  const handleSizeChange = (newSize: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set('size', newSize);
    params.set('page', '0'); // Reset page when size changes
    router.push(`?${params.toString()}`);
  };

  // Handle tag change
  const handleTagChange = (newTag: string) => {
    onTagChange(newTag);
    const params = new URLSearchParams(window.location.search);
    if (newTag === 'all') {
      params.delete('tag');
    } else {
      params.set('tag', newTag);
    }
    params.set('page', '0'); // Reset page when tag changes
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-4 my-2">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left: Search + Tag filter */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 w-full">
          {/* Search box */}
          <div className="w-full md:max-w-md">
            <div className="flex gap-2">
              <Input
                value={qInput}
                placeholder="Search topics by name..."
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                onChange={(e) => {
                  setQInput(e.target.value);
                  onQChange(e.target.value); // Trigger debounced update in TopicsPage
                }}
              />
              <Button asChild variant="secondary" className="bg-white/5 border border-white/10 hover:bg-white/10">
                {/* This button will not trigger a full page reload anymore */}
                <Link href={`?q=${qInput}&tag=${currentTag}&size=${size}&page=0`}>Search</Link>
              </Button>
            </div>
          </div>

          {/* Tag select */}
          <div className="w-full md:w-64">
            <Select value={currentTag} onValueChange={handleTagChange}>
              <SelectTrigger className="w-full bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Filter by tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All tags</SelectItem>
                {tagOptions.map((t) => (
                  <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Right: page size + count */}
        <div className="flex items-center justify-between lg:justify-end gap-3">
          <Select value={String(size)} onValueChange={handleSizeChange}>
            <SelectTrigger className="w-28 bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Page size" />
            </SelectTrigger>
            <SelectContent>
              {sizeOptions.map((option) => (
                <SelectItem value={String(option)} key={option}>{option} / page</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span className="text-sm text-gray-400 hidden md:inline">
            {totalElements} topics
          </span>
        </div>
      </div>

      {/* Optional: tiny hint row */}
      <div className="text-xs text-white/40">
        Tip: Type to search.
      </div>
    </div>
  );
}

function TopicsLoading() {
  return (
    <>
      <div className="bg-gradient-to-br from-white/5 via-purple-500/5 to-blue-500/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 mb-8">
        <Skeleton className="h-10 w-64" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-gradient-to-br from-white/8 via-purple-500/5 to-blue-500/8 p-6 rounded-xl border border-white/10"
          >
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <div className="flex justify-end">
              <Skeleton className="h-5 w-5" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

import { useSearchParams, useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce'; // Import useDebounce

// ... (Toolbar component remains the same)

export default function TopicsPage() {
  const searchParams = useSearchParams();

  const [allTopics, setAllTopics] = useState<Topic[]>([]); // Store all topics
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sizeOptions = [10, 20, 50];
  
  // State for search and tag filter
  const [q, setQ] = useState(searchParams.get('q') || '');
  const [tag, setTag] = useState(searchParams.get('tag') || 'all');

  // Debounced values for filtering
  const debouncedQ = useDebounce(q, 500); // 500ms debounce
  const debouncedTag = useDebounce(tag, 0); // No debounce for tag

  // Pagination parameters from URL
  const currentPage = Number(searchParams.get('page')) || 0;
  const size = Number(searchParams.get('size')) || sizeOptions[0];

  // Tag options derived from allTopics
  const tagOptions = useMemo(() => {
    const map = new Map<number, string>();
    allTopics.forEach((topic) => {
      topic.tags?.forEach((t) => {
        if (!map.has(t.id)) map.set(t.id, t.name);
      });
    });
    return Array.from(map.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [allTopics]);

  // Fetch all topics once on mount
  useEffect(() => {
    async function fetchTopics() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:8082/api/public/topics`,
          { cache: 'no-store' }
        );
        if (!response.ok) {
          throw new Error('Failed to fetch topics');
        }
        const result = await response.json();
        setAllTopics(result.content);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }
    fetchTopics();
  }, []); // Empty dependency array means this runs once on mount

  // Filter topics based on debounced search query and tag
  const filteredData = useMemo(() => {
    let topics = allTopics;

    if (debouncedQ) {
      topics = topics.filter(topic =>
        topic.title.toLowerCase().includes(debouncedQ.toLowerCase())
      );
    }

    if (debouncedTag !== 'all') {
      topics = topics.filter(topic =>
        topic.tags.some(t => String(t.id) === debouncedTag)
      );
    }

    return topics;
  }, [allTopics, debouncedQ, debouncedTag]);

  // Client-side pagination
  const paginatedData = useMemo(() => {
    const startIndex = currentPage * size;
    return filteredData.slice(startIndex, startIndex + size);
  }, [filteredData, currentPage, size]);

  const totalPages = Math.ceil(filteredData.length / size);

  if (error) {
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

          {loading ? (
            <TopicsLoading />
          ) : (
            <>
              <div className="bg-gradient-to-br from-white/5 via-purple-500/5 to-blue-500/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 mb-8">
                <Toolbar
                  size={size}
                  totalElements={filteredData.length}
                  sizeOptions={sizeOptions}
                  q={q} // Pass current q
                  tag={tag} // Pass current tag
                  tagOptions={tagOptions}
                  onQChange={setQ} // Pass setter for q
                  onTagChange={setTag} // Pass setter for tag
                />
              </div>

              {paginatedData.length === 0 ? (
                <div className="bg-gradient-to-br from-white/5 via-purple-500/5 to-blue-500/5 backdrop-blur-sm p-12 rounded-xl border border-white/10 flex flex-col items-center justify-center min-h-[40vh]">
                  <FileWarning className="h-12 w-12 text-gray-500" />
                  <h3 className="mt-4 text-xl font-semibold">No Topics Found</h3>
                  <p className="mt-1 text-gray-400">
                    Try adjusting your filters or check back later.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedData.map((topic) => (
                    <TopicCard key={topic.id} topic={topic} />
                  ))}
                </div>
              )}

              {paginatedData.length > 0 && (
                <div className="mt-12 flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    Showing{' '}
                    <strong>
                      {currentPage * size + 1}–
                      {currentPage * size + paginatedData.length}
                    </strong>{' '}
                    of <strong>{filteredData.length}</strong> topics
                  </div>
                  <PaginationComponent
                    totalPages={totalPages}
                    currentPage={currentPage}
                    size={size}
                    status={'all'}
                  />
                </div>
              )}
            </>
          )}
        </div>
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
