"use client"

import { useEffect, useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { toast } from "sonner"
import { ArrowUpDown } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface Ranker {
  userId: number;
  fullName: string;
  labsSolved: number;
  totalTimeMinutes: number;
  totalErrors: number;
}

type SortKey = keyof Ranker;

const ITEMS_PER_PAGE = 10;

export function RankingTable() {
  const [data, setData] = useState<Ranker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>({ key: 'labsSolved', direction: 'descending' });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/ranking`, { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch ranking data.");
        const responseData = await res.json();
        setData(responseData || []);
      } catch (e) {
        setError(e instanceof Error ? e.message : "An unknown error occurred.");
        toast.error(e instanceof Error ? e.message : "An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const sortedData = useMemo(() => {
    const sortableItems = [...data];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedData, currentPage]);

  const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);

  const requestSort = (key: SortKey) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset to first page on sort
  };

  const getSortIndicator = (key: SortKey) => {
    if (!sortConfig || sortConfig.key !== key) return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    return sortConfig.direction === 'ascending' ? ' ' : ' ';
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0) return `${hours}h ${remainingMinutes}m`;
    return `${remainingMinutes}m`;
  };

  const renderHeader = (key: SortKey, label: string, icon?: React.ReactNode) => (
    <TableHead className="text-white font-semibold">
      <Button variant="ghost" onClick={() => requestSort(key)} className="px-2 py-1 hover:bg-white/10">
        <div className="flex items-center">
          {icon}
          {label}
          {getSortIndicator(key)}
        </div>
      </Button>
    </TableHead>
  );

  if (error) {
    return (
      <Card className="bg-red-900/30 border-red-500/50">
        <CardHeader><CardTitle>Error</CardTitle></CardHeader>
        <CardContent><p className="text-red-300">{error}</p></CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-[#ffffff]/8 via-[#9747ff]/5 to-[#5a5bed]/8 backdrop-blur-sm p-6 rounded-xl border border-[#ffffff]/10 h-full shadow-[0_0_15px_rgba(151,71,255,0.15)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(151,71,255,0.3)]">
      <CardHeader>
        <CardTitle className="text-white text-2xl">User Rankings</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[400px] w-full" />
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-white/10">
                    <TableHead className="text-white font-semibold">Rank</TableHead>
                    {renderHeader('fullName', 'User')}
                    {renderHeader('labsSolved', 'Labs Solved',)}
                    {renderHeader('totalTimeMinutes', 'Total Time', )}
                    {renderHeader('totalErrors', 'Total Errors',)}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((ranker, index) => (
                    <TableRow key={ranker.userId} className="border-b border-white/10 hover:bg-white/5">
                      <TableCell className="font-medium text-white">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</TableCell>
                      <TableCell className="text-white/90">{ranker.fullName}</TableCell>
                      <TableCell className="text-white/80">{ranker.labsSolved}</TableCell>
                      <TableCell className="text-white/80">{formatTime(ranker.totalTimeMinutes)}</TableCell>
                      <TableCell className="text-white/80">{ranker.totalErrors}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {totalPages > 1 && (
              <Pagination className="mt-6 text-white">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.max(1, p - 1)); }} />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink href="#" isActive={currentPage === i + 1} onClick={(e) => { e.preventDefault(); setCurrentPage(i + 1); }}>
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.min(totalPages, p + 1)); }} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
