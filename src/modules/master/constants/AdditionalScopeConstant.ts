import type { TableColumnType } from "@/components/tables/Table.vue";

export const ColumnsAdditionalScope: TableColumnType[] = [
  {
    key: "name",
    label: "Name",
    align: "left",
    sort: false,
  },
  {
    key: "sequence.name",
    label: "Sequence",
    align: "left",
    sort: false,
  },
  {
    key: "sequence_video",
    label: "Video",
    align: "left",
    sort: false,
  },
];
