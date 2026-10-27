import { useEffect, useMemo, useState } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  type PaginationState,
  useReactTable,
  type RowSelectionState,
} from "@tanstack/react-table";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { usePagination } from "@/hooks/use-pagination";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FaBoxOpen } from "react-icons/fa6";
import Container from "./container";
import { TextSmall } from "./typography";
import { TableLoading } from "./ui/skeleton";
import { NoData, type EmptyProps } from "./ui/empty";
import { Checkbox } from "./ui/checkbox";

export type DataTableProps<T> = {
  columns: ColumnDef<T>[];
  data?: T[] | null;
  rowLength?: number;
  showPagination?: boolean;
  loading?: boolean;
  noDataProps?: EmptyProps;
  enableRowSelection?: boolean;
  selectedRows?: T[] | null;
  rowProps?: (
    props: T,
  ) => React.HTMLAttributes<HTMLTableRowElement> | null | undefined;
  onSelectRow?: (row: T[]) => void;
};

export const createSelectColumn = <T,>(): ColumnDef<T> => {
  return {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        className="border-input"
        aria-label="Select all"
        containerProps={{
          padding: "none",
          flexDisplay: false,
        }}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        className="border-input"
        aria-label="Select row"
        containerProps={{
          padding: "none",
          flexDisplay: false,
        }}
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 30,
  };
};

const DataTable = <T,>({
  columns,
  data,
  rowLength = 5,
  showPagination = true,
  loading,
  noDataProps,
  enableRowSelection = false,
  selectedRows,
  rowProps,
  onSelectRow,
}: DataTableProps<T>) => {
  const pageSize = rowLength;

  const {
    title = "No Data",
    description = "No data available.",
    ...rest
  } = noDataProps || {};

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSize,
  });

  const [rowSelection, setRowSelection] = useState<RowSelectionState>(
    selectedRows?.reduce((acc, row) => {
      acc[(row as any).id] = true;
      return acc;
    }, {} as Record<string, boolean>) || {},
  );

  const tableColumns = useMemo(() => {
    if (enableRowSelection) {
      return [createSelectColumn<T>(), ...columns];
    }
    return columns;
  }, [enableRowSelection, columns]);

  const table = useReactTable({
    data: data || [],
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: showPagination ? getPaginationRowModel() : undefined,
    onPaginationChange: setPagination,
    manualSorting: true,
    enableRowSelection,
    getRowId: row => (row as any).id,
    onRowSelectionChange: updater => {
      const newSelection =
        typeof updater === "function" ? updater(rowSelection) : updater;
      setRowSelection(newSelection);

      if (onSelectRow) {
        const selectedRows = table
          .getRowModel()
          .rows.filter(row => newSelection[row.id])
          .map(row => row.original);
        onSelectRow(selectedRows);
      }
    },
    state: {
      ...(showPagination ? { pagination } : {}),
      rowSelection,
    },
  });

  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage: table.getState().pagination.pageIndex + 1,
    totalPages: table.getPageCount(),
    paginationItemsToDisplay: 5,
  });

  useEffect(() => {
    if (!enableRowSelection) {
      setRowSelection({});
    } else {
      setRowSelection(
        selectedRows?.reduce((acc, row) => {
          acc[(row as any).id] = true;
          return acc;
        }, {} as Record<string, boolean>) || {},
      );
    }
  }, [enableRowSelection, selectedRows]);

  return (
    <div className="space-y-4 w-full">
      {loading ? (
        <TableLoading />
      ) : !table.getRowModel().rows?.length ? (
        <NoData title={title} description={description} {...rest} />
      ) : (
        <>
          <div className="rounded-md bg-background">
            <Table>
              <TableHeader className="bg-secondary/50">
                {table.getHeaderGroups().map(headerGroup => (
                  <TableRow
                    key={headerGroup.id}
                    className="hover:bg-transparent"
                  >
                    {headerGroup.headers.map(header => {
                      return (
                        <TableHead
                          key={header.id}
                          style={{
                            width:
                              header.getSize() !== 150
                                ? `${header.getSize()}px`
                                : "auto",
                            minWidth:
                              header.getSize() !== 150
                                ? `${header.getSize()}px`
                                : "auto",
                          }}
                          className="h-11"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map(row => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      {...(rowProps?.(row.original) || {})}
                    >
                      {row.getVisibleCells().map(cell => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center p-0"
                    >
                      <Container
                        flexDisplay
                        justifyContent="center"
                        alignItems="center"
                        flexDirection="row"
                        className="bg-card border-border/50"
                        bordered
                      >
                        <FaBoxOpen className="size-10" />
                        <TextSmall secondary>No data available.</TextSmall>
                      </Container>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {showPagination && (
            <div className="flex items-center justify-between gap-3 max-sm:flex-col">
              <p
                className="flex-1 text-sm whitespace-nowrap text-muted-foreground"
                aria-live="polite"
              >
                Page{" "}
                <span className="text-foreground">
                  {table.getState().pagination.pageIndex + 1}
                </span>{" "}
                of{" "}
                <span className="text-foreground">{table.getPageCount()}</span>
              </p>

              <div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <Button
                        size="icon"
                        variant="outline"
                        className="disabled:pointer-events-none disabled:opacity-50"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        aria-label="Go to previous page"
                      >
                        <ChevronLeftIcon size={16} aria-hidden="true" />
                      </Button>
                    </PaginationItem>

                    {showLeftEllipsis && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                    {pages.map(page => {
                      const isActive =
                        page === table.getState().pagination.pageIndex + 1;
                      return (
                        <PaginationItem key={page}>
                          <Button
                            size="icon"
                            variant={`${isActive ? "outline" : "ghost"}`}
                            onClick={() => table.setPageIndex(page - 1)}
                            aria-current={isActive ? "page" : undefined}
                          >
                            {page}
                          </Button>
                        </PaginationItem>
                      );
                    })}

                    {showRightEllipsis && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                    <PaginationItem>
                      <Button
                        size="icon"
                        variant="outline"
                        className="disabled:pointer-events-none disabled:opacity-50"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        aria-label="Go to next page"
                      >
                        <ChevronRightIcon size={16} aria-hidden="true" />
                      </Button>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DataTable;
