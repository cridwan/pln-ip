import type { TableColumnType } from "@/components/tables/Table.vue";

export const ColumnsScope: TableColumnType[] = [
  {
    key: "asset",
    label: "Scope",
    align: "left",
    sort: false,
    width: "300",
  },
  {
    key: "asset_welness",
    label: "Asset Welness",
    align: "center",
    sort: false,
    width: "150",
  },
  {
    key: "oh_recom",
    label: "OH Recom",
    align: "center",
    sort: false,
    width: "150",
  },
  {
    key: "wo_priority",
    label: "WO Priority",
    align: "center",
    sort: false,
    width: "150",
  },
  {
    key: "history",
    label: "History",
    align: "center",
    sort: false,
    width: "150",
  },
  {
    key: "rla",
    label: "RLA",
    align: "center",
    sort: false,
    width: "150",
  },
  {
    key: "ncr",
    label: "NCR",
    align: "center",
    sort: false,
    width: "150",
  },
];
