import type { TableColumnType } from "@/components/tables/Table.vue";

export const ColumnsPartStd: TableColumnType[] = [
  {
    key: "part",
    label: "Part",
    align: "left",
    sort: false,
  },
  {
    key: "qty",
    label: "Qty",
    align: "left",
    sort: false,
  },
];
