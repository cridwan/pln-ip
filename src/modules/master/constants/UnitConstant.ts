import type { TableColumnType } from "@/components/tables/Table.vue";

export const ColumnsUnit: TableColumnType[] = [
  {
    key: "name",
    label: "Nama Unit",
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
