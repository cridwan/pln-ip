import type { TableColumnType } from "@/components/tables/Table.vue";

export const ColumnsManpower: TableColumnType[] = [
  {
    key: "manpower",
    label: "Manpower",
    align: "left",
    sort: false,
  },
  {
    key: "qty",
    label: "Quantity",
    align: "left",
    sort: false,
    width: "150",
  },
];
