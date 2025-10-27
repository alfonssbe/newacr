"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type ParentSpecColumn = {
  id: string
  nameIndo: string;
  nameEnglish: string;
  updatedAt: string;
  updatedBy: string;
}

export const columns: ColumnDef<ParentSpecColumn>[] = [
  {
    accessorKey: "nameIndo",
    header: "Name (Indo)",
  },
  {
    accessorKey: "nameEnglish",
    header: "Name (English)",
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
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
