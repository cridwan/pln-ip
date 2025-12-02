import type { TableColumnType } from "@/components/tables/Table.vue";

export const ColumnsGeneratorType: TableColumnType[] = [
  {
    key: "name",
    label: "Jenis Pembangkit",
    align: "left",
    sort: false,
  },
  {
    key: "color",
    label: "Warna",
    align: "left",
    sort: false,
  },
];
