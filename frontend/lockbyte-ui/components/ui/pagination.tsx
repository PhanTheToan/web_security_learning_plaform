'use client';

import * as React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { Button, ButtonProps, buttonVariants } from '@/components/ui/button';

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  />
);
Pagination.displayName = 'Pagination';

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn('flex flex-row items-center gap-1', className)}
    {...props}
  />
));
PaginationContent.displayName = 'PaginationContent';

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('', className)} {...props} />
));
PaginationItem.displayName = 'PaginationItem';

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, 'size'> &
  React.ComponentProps<typeof Link>;

const PaginationLink = ({
  className,
  isActive,
  size = 'icon',
  ...props
}: PaginationLinkProps) => (
  <Link
    aria-current={isActive ? 'page' : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? 'outline' : 'ghost',
        size,
      }),
      className,
    )}
    {...props}
  />
);
PaginationLink.displayName = 'PaginationLink';

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn('gap-1 pl-2.5', className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
);
PaginationPrevious.displayName = 'PaginationPrevious';

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn('gap-1 pr-2.5', className)}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
);
PaginationNext.displayName = 'PaginationNext';

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<'span'>) => (
  <span
    aria-hidden
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);
export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};

// Your custom PaginationComponent
interface PaginationComponentProps {
  totalPages: number;
  currentPage: number;
  size: number;
  status: string;
}

export function PaginationComponent({
  totalPages,
  currentPage,
  size,
  status,
}: PaginationComponentProps) {
  const createPageURL = (pageNumber: number) => {
    if (pageNumber < 0 || pageNumber >= totalPages) {
      // Prevent creating invalid URLs
      return '#';
    }
    const params = new URLSearchParams();
    params.set('page', String(pageNumber));
    params.set('size', String(size));
    if (status && status.toLowerCase() !== 'all') {
      params.set('status', status);
    }
    return `/topics?${params.toString()}`;
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(0, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);

    // Adjust window if it's at the edge
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(0, endPage - maxPagesToShow + 1);
    }

    if (startPage > 0) {
      pageNumbers.push(
        <PaginationItem key="start-ellipsis">
          <PaginationEllipsis />
        </PaginationItem>,
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <PaginationItem key={i}>
          <PaginationLink href={createPageURL(i)} isActive={i === currentPage}>
            {i + 1}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    if (endPage < totalPages - 1) {
      pageNumbers.push(
        <PaginationItem key="end-ellipsis">
          <PaginationEllipsis />
        </PaginationItem>,
      );
    }

    return pageNumbers;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <Button
            asChild
            variant="ghost"
            disabled={currentPage === 0}
            className="h-9 w-9 p-0"
          >
            <Link href={createPageURL(0)}>
              <span className="sr-only">First</span>
              <ChevronsLeft className="h-4 w-4" />
            </Link>
          </Button>
        </PaginationItem>
        <PaginationItem>
          <Button
            asChild
            variant="ghost"
            disabled={currentPage === 0}
            className="h-9 w-9 p-0"
          >
            <Link href={createPageURL(currentPage - 1)}>
              <span className="sr-only">Previous</span>
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
        </PaginationItem>

        {renderPageNumbers()}

        <PaginationItem>
          <Button
            asChild
            variant="ghost"
            disabled={currentPage >= totalPages - 1}
            className="h-9 w-9 p-0"
          >
            <Link href={createPageURL(currentPage + 1)}>
              <span className="sr-only">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </PaginationItem>
        <PaginationItem>
          <Button
            asChild
            variant="ghost"
            disabled={currentPage >= totalPages - 1}
            className="h-9 w-9 p-0"
          >
            <Link href={createPageURL(totalPages - 1)}>
              <span className="sr-only">Last</span>
              <ChevronsRight className="h-4 w-4" />
            </Link>
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}