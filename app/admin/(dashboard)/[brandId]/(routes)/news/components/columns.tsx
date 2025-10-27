"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type NewsColumn = {
  id: string
  name: string;
  value: string;
  eventDate: string;
  updatedBy: string;
}

export const columns: ColumnDef<NewsColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "preview news",
    header: "Preview News",
  },
  {
    accessorKey: "eventDate",
    header: "Event Date",
  },
  {
    accessorKey: "updatedBy",
    header: "Updated By",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];
