import type { TableColumnType } from "@/components/tables/Table.vue";

export const ColumnsToolStd: TableColumnType[] = [
  {
    key: "tool",
    label: "Tool",
    align: "left",
    sort: false,
  },
  {
    key: "tool.merk",
    label: "Merk",
    align: "left",
    sort: false,
  },
  {
    key: "tool.status",
    label: "Status",
    align: "left",
    sort: false,
  },
  {
    key: "unit",
    label: "Unit",
    align: "left",
    sort: false,
  },
  {
    key: "total_qty",
    label: "Qty",
    align: "left",
    sort: false,
  },
];
