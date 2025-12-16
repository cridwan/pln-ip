import type { TableColumnType } from "@/components/tables/Table.vue";

export const ColumnsUser: TableColumnType[] = [
  {
    key: "name",
    label: "Name",
    align: "left",
    sort: false,
  },
  {
    key: "email",
    label: "Email",
    align: "left",
    sort: false,
  },
  {
    key: "role",
    label: "Role",
    align: "left",
    sort: false,
  },
  {
    key: "area",
    label: "Area",
    align: "left",
    sort: false,
  },
];
