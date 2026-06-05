"use client"

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

function Pagination({
  className,
  currentPage,
  totalPages,
  onPageChange,
  ...props
}: React.HTMLAttributes<HTMLElement> & {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  const renderPageNumbers = () => {
    const items: (number | "ellipsis")[] = []
    const delta = 1

    const rangeStart = Math.max(2, currentPage - delta)
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta)

    items.push(1)
    if (rangeStart > 2) items.push("ellipsis")
    for (let i = rangeStart; i <= rangeEnd; i++) items.push(i)
    if (rangeEnd < totalPages - 1) items.push("ellipsis")
    if (totalPages > 1) items.push(totalPages)

    return items
  }

  return (
    <nav
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      role="navigation"
      aria-label="pagination"
      {...props}
    >
      <ul className="flex flex-row items-center gap-1">
        <li>
          <button
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "aria-disabled:pointer-events-none aria-disabled:opacity-50"
            )}
            aria-disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="size-4" />
            <span className="sr-only">Previous page</span>
          </button>
        </li>
        {renderPageNumbers().map((item, index) =>
          item === "ellipsis" ? (
            <li key={`ellipsis-${index}`}>
              <span className="flex size-8 items-center justify-center">
                <MoreHorizontal className="size-4" />
                <span className="sr-only">More pages</span>
              </span>
            </li>
          ) : (
            <li key={item}>
              <button
                className={cn(
                  buttonVariants({
                    variant: item === currentPage ? "default" : "ghost",
                    size: "icon",
                  })
                )}
                onClick={() => onPageChange(item)}
                aria-current={item === currentPage ? "page" : undefined}
              >
                {item}
              </button>
            </li>
          )
        )}
        <li>
          <button
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "aria-disabled:pointer-events-none aria-disabled:opacity-50"
            )}
            aria-disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="size-4" />
            <span className="sr-only">Next page</span>
          </button>
        </li>
      </ul>
    </nav>
  )
}

export { Pagination }
