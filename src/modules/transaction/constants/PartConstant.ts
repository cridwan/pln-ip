import type { TableColumnType } from "@/components/tables/Table.vue";

export const ColumnsPart: TableColumnType[] = [
  {
    key: "part",
    label: "Part Name",
    align: "left",
    sort: false,
  },
  {
    key: "qty",
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
