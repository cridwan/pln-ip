import type { TableColumnType } from "@/components/tables/Table.vue";

export const ColumnsPart: TableColumnType[] = [
  {
    key: "name",
    label: "Part",
    align: "left",
    sort: false,
  },
  {
    key: "merk",
    label: "Merk",
    align: "left",
    sort: false,
  },
  {
    key: "no_drawing",
    label: "No Drawing",
    align: "left",
    sort: false,
  },
  {
    key: "global_unit",
    label: "Satuan",
    align: "left",
    sort: false,
  },
  {
    key: "price",
    label: "Harga",
    align: "left",
    sort: false,
  },
];
