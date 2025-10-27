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
    align: "left",
    sort: false,
    width: "150",
  },
  {
    key: "lon",
    label: "Longitude",
    align: "left",
    sort: false,
    width: "150",
  },
  {
    key: "description",
    label: "Deskripsi",
    align: "left",
    sort: false,
  },
  {
    key: "sub_area",
    label: "Sub Area",
    align: "left",
    sort: false,
  },
];
