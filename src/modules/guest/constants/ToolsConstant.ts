import type { TableColumnType } from "@/components/tables/Table.vue";

export const ColumnsTools: TableColumnType[] = [
  {
    key: "tool",
    label: "Tool Name",
    align: "left",
    sort: false,
  },
  {
    key: "quantity",
    label: "Quantity",
    align: "center",
    sort: false,
    width: "150",
  },
  {
    key: "unit",
    label: "Unit",
    align: "center",
    sort: false,
    width: "150",
  },
  {
    key: "section",
    label: "Section",
    align: "center",
    sort: false,
    width: "150",
  },
];
