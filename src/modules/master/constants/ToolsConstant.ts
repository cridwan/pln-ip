import type { TableColumnType } from "@/components/tables/Table.vue";

export const ColumnsTools: TableColumnType[] = [
  {
    key: "name",
    label: "Tool",
    align: "left",
    sort: false,
  },
  {
    key: "merk",
    label: "Merk",
    align: "left",
    sort: false,
  },
  {
    key: "price",
    label: "Price",
    align: "left",
    sort: false,
  },
  {
    key: "unit",
    label: "Satuan",
    align: "left",
    sort: false,
  },
  {
    key: "status",
    label: "Status",
    align: "left",
    sort: false,
  },
];
