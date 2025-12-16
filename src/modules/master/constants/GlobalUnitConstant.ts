import type { TableColumnType } from "@/components/tables/Table.vue";

export const ColumnsGlobalUnit: TableColumnType[] = [
  {
    key: "name",
    label: "Nama",
    align: "left",
    sort: false,
  },
  {
    key: "slug",
    label: "Singkatan",
    align: "left",
    sort: false,
  },
];
