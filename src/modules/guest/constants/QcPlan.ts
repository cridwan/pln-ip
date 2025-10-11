import type { TableColumnType } from "@/components/tables/Table.vue";

export const ColumnsQcPlan: TableColumnType[] = [
  {
    key: "name",
    label: "HSE Document",
    align: "left",
    sort: false,
  },
  {
    key: "attachment",
    label: "Attachment",
    align: "center",
    sort: false,
    width: "150",
  },
  {
    key: "preview",
    label: "",
    align: "center",
    sort: false,
    width: "150",
  },
];
