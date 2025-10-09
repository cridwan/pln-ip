import type { TableColumnType } from "@/components/tables/Table.vue";

export const ColumnsPart: TableColumnType[] = [
  {
    key: "part",
    label: "Part Name",
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
    label: "Total Harga",
    align: "left",
    sort: false,
    width: "150",
  },
  {
    key: "unit",
    label: "Unit",
    align: "left",
    sort: false,
    width: "150",
  },
  {
    key: "number_drawing",
    label: "No. Drawing",
    align: "left",
    sort: false,
    width: "150",
  },
];

export const ColumnsPartFilter: TableColumnType[] = [
  {
    key: "activity",
    label: "Acitivity",
    align: "left",
    sort: false,
  },
  {
    key: "part",
    label: "Part Name",
    align: "left",
    sort: false,
  },
  {
    key: "total_qty",
    label: "Quantity",
    align: "center",
    sort: false,
    width: "150",
  },
  {
    key: "unit",
    label: "Unit",
    align: "left",
    sort: false,
    width: "150",
  },
  {
    key: "number_drawing",
    label: "No. Drawing",
    align: "left",
    sort: false,
    width: "150",
  },
];
