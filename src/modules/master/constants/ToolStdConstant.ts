import type { TableColumnType } from "@/components/tables/Table.vue";

export const ColumnsToolStd: TableColumnType[] = [
  {
    key: "tool",
    label: "Tool",
    align: "left",
    sort: false,
  },
  {
    key: "tool.global_unit.name",
    label: "Unit",
    align: "left",
    sort: false,
  },
  {
    key: "qty",
    label: "Qty",
    align: "left",
    sort: false,
  },
  {
    key: "price",
    label: "Price",
    align: "left",
    sort: false,
  },
];
