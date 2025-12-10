import type { TableColumnType } from "@/components/tables/Table.vue";

export const ColumnsWorkInstruction: TableColumnType[] = [
  {
    key: "asset",
    label: "Scope",
    align: "left",
    sort: false,
  },
  {
    key: "ik_link",
    label: "Ik Online",
    align: "left",
    sort: false,
    width: "150",
  },
  {
    key: "preview",
    label: "Ik Doc",
    align: "left",
    sort: false,
    width: "150",
  },
];
