import type { TableColumnType } from "@/components/tables/Table.vue";

export const ColumnsConsumableMaterial: TableColumnType[] = [
  {
    key: "material",
    label: "Material",
    align: "left",
    sort: false,
  },
  {
    key: "merk",
    label: "Merk",
    align: "left",
    sort: false,
    width: "150",
  },
  {
    key: "price",
    label: "Harga",
    align: "left",
    sort: false,
    width: "150",
  },
  {
    key: "unit",
    label: "Unit",
    align: "left",
    sort: false,
    width: "150",
  },
];
