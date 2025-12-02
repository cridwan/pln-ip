import type { TableColumnType } from "@/components/tables/Table.vue";

export const ColumnsResults: TableColumnType[] = [
  {
    key: "manpower",
    label: "Manpower",
    align: "left",
    sort: false,
  },
  {
    key: "download",
    label: "Download",
    align: "center",
    sort: false,
    width: 200,
  },
];

export const ColumnsResultsGuest: TableColumnType[] = [
  {
    key: "manpower",
    label: "",
    align: "left",
    sort: false,
  },
  {
    key: "download",
    label: "",
    align: "center",
    sort: false,
    width: 200,
  },
];
