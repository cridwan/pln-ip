import type { TableColumnType } from "@/components/tables/Table.vue";

export const ColumnsWorkInstruction: TableColumnType[] = [
  {
    key: "asset",
    label: "Scope",
    align: "left",
    sort: false,
  },
  {
    key: "preview",
    label: "Preview",
    align: "center",
    sort: false,
    width: "150",
  },
];
