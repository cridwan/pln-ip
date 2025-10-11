import type { TableColumnType } from "@/components/tables/Table.vue";

export const ColumnsHse: TableColumnType[] = [
  {
    key: "name",
    label: "Document",
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

export const ColumnsHseAdditional: TableColumnType[] = [
  {
    key: "name",
    label: "Document Additional",
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
