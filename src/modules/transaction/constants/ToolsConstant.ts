import type { TableColumnType } from "@/components/tables/Table.vue";

export const ColumnsTools: TableColumnType[] = [
  {
    key: "tool",
    label: "Tool Name",
    align: "left",
    sort: false,
  },
  {
    key: "quantity",
    label: "Quantity",
    align: "center",
    sort: false,
    width: "150",
  },
  {
    key: "unit",
    label: "Unit",
    align: "center",
    sort: false,
    width: "150",
  },
  {
    key: "section",
    label: "Section",
    align: "center",
    sort: false,
    width: "150",
  },
];

export const ColumnsTool: TableColumnType[] = [
  {
    key: "tool",
    label: "Tool Name",
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
    key: "unit",
    label: "Satuan",
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
    label: "Total Harga",
    align: "left",
    sort: false,
    width: "150",
  },
];
