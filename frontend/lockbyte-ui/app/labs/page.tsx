
'use client';

import {
  ArrowRight,
  FileWarning,
  Search,
  ServerCrash,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import ParticlesComponent from '@/components/particles-background';
import { useCallback, useEffect, useState } from 'react';
import { filterPublicLabs, getPublicLabs, getPublicTags } from '@/lib/api';
import { LabListItem, Tag } from '@/lib/api';
import { useDebounce } from '@/hooks/use-debounce';
import LabsLoading from './loading';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

function LabCard({ lab }: { lab: LabListItem }) {
  return (
    <Link
      href={`/labs/${lab.id}`}
      className="group block bg-gradient-to-br from-white/8 via-purple-500/5 to-blue-500/8 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-purple-500/60 hover:from-purple-500/10 hover:via-blue-500/8 hover:to-purple-500/10 transition-all duration-500 hover:shadow-[0_0_30px_rgba(151,71,255,0.2)] hover:scale-[1.02]"
    >
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold tracking-tight text-white">
          {lab.name}
        </h3>
        <Badge
          variant={lab.estatus === 'Published' ? 'default' : 'secondary'}
          className="flex-shrink-0 ml-2"
        >
          {lab.estatus}
        </Badge>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {lab.tags?.map(tag => (
          <Badge key={tag.id} variant="secondary" className="bg-blue-500/10 text-blue-300 border-blue-500/20 text-xs">
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

export default function LabsPage() {
  const [labs, setLabs] = useState<LabListItem[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const fetchAndSetLabs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (debouncedSearchTerm || selectedTagIds.length > 0) {
        const filteredLabs = await filterPublicLabs(debouncedSearchTerm, selectedTagIds);
        setLabs(filteredLabs);
      } else {
        const response = await getPublicLabs();
        setLabs(response.body);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm, selectedTagIds]);

  useEffect(() => {
    fetchAndSetLabs();
  }, [fetchAndSetLabs]);

  useEffect(() => {
    async function fetchTags() {
      try {
        const fetchedTags = await getPublicTags();
        setTags(fetchedTags);
      } catch (err) {
        console.error("Failed to fetch tags:", err);
      }
    }
    fetchTags();
  }, []);

  const handleTagClick = (tagId: number) => {
    setSelectedTagIds(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <ServerCrash className="h-16 w-16 text-red-500" />
        <h2 className="mt-4 text-2xl font-semibold">Failed to Load Labs</h2>
        <p className="mt-2 text-gray-400">
          There was an error fetching the labs. Please try again later.
        </p>
        <Button onClick={fetchAndSetLabs} className="mt-6">
          Try Again
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
              Labs
            </h1>
            <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
              Explore our hands-on cybersecurity labs to practice and enhance your skills.
            </p>
          </header>

          <div className="bg-gradient-to-br from-white/5 via-purple-500/5 to-blue-500/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 mb-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search labs by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 bg-gray-900/50 border-white/20"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => setSearchTerm('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <Button
                  key={tag.id}
                  variant={selectedTagIds.includes(tag.id) ? 'default' : 'secondary'}
                  onClick={() => handleTagClick(tag.id)}
                  className={cn("rounded-full transition-all duration-200", {
                    "bg-purple-600/80 border border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)]": selectedTagIds.includes(tag.id),
                  })}
                >
                  {tag.name}
                </Button>
              ))}
            </div>
          </div>

          {loading ? (
            <LabsLoading />
          ) : labs.length === 0 ? (
            <div className="bg-gradient-to-br from-white/5 via-purple-500/5 to-blue-500/5 backdrop-blur-sm p-12 rounded-xl border border-white/10 flex flex-col items-center justify-center min-h-[40vh]">
              <FileWarning className="h-12 w-12 text-gray-500" />
              <h3 className="mt-4 text-xl font-semibold">No Labs Found</h3>
              <p className="mt-1 text-gray-400">
                Try adjusting your search or filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {labs.map((lab) => (
                <LabCard key={lab.id} lab={lab} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
