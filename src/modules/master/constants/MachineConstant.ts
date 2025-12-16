import type { TableColumnType } from "@/components/tables/Table.vue";

export const ColumnsMachine: TableColumnType[] = [
  {
    key: "name",
    label: "Nama Mesin",
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
    key: "location",
    label: "Lokasi",
    align: "left",
    sort: false,
  },
];
