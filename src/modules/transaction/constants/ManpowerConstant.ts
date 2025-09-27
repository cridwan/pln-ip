import type { TableColumnType } from "@/components/tables/Table.vue";

export const ColumnsManpower: TableColumnType[] = [
  {
    key: "manpower",
    label: "Manpower",
    align: "left",
    sort: false,
  },
  {
    key: "total_qty",
    label: "Quantity",
    align: "left",
    sort: false,
    width: "150",
  },
  {
    key: "price",
    label: "Harga",
    align: "left",
    sort: false,
    width: "150",
  },
  {
    key: "total",
    label: "Total",
    align: "left",
    sort: false,
    width: "150",
  },
];
