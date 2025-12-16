import type { TableColumnType } from "@/components/tables/Table.vue";

export const ColumnsScope: TableColumnType[] = [
  {
    key: "asset",
    label: "Scope",
    align: "left",
    sort: false,
    width: "300",
  }
];

export const ColumnsScopeDetailGuest: TableColumnType[] = [
  {
    key: "name",
    label: "Scope",
    align: "left",
    sort: false,
    width: "300",
  }
];

export const ColumnsScopeGuest: TableColumnType[] = [
  {
    key: "name",
    label: "Scope",
    align: "left",
    sort: false,
    width: "300",
  },
  {
    key: "sequence.name",
    label: "Sequence",
    align: "left",
    sort: false,
    width: "300",
  },
  {
    key: "video",
    label: "Video",
    align: "left",
    sort: false,
    width: "300",
  }
];
