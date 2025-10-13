import type { TableColumnType } from "@/components/tables/Table.vue";

export const ColumnsLocation: TableColumnType[] = [
  {
    key: "name",
    label: "Lokasi",
    align: "left",
    sort: false,
  },
  {
    key: "lat",
    label: "Latitude",
    align: "center",
    sort: false,
    width: "150",
  },
  {
    key: "lon",
    label: "Longitude",
    align: "center",
    sort: false,
    width: "150",
  },
  {
    key: "description",
    label: "Deskripsi",
    align: "center",
    sort: false,
  },
];
