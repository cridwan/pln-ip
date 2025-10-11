import type { TableColumnType } from "@/components/tables/Table.vue";

export const ColumnsAddScopeDetailScope: TableColumnType[] = [
  {
    key: "asset",
    label: "Scope",
    align: "left",
    sort: false,
  },
];

export const ColumnsAddScopeDetailWorkInstruction: TableColumnType[] = [
  {
    key: "asset",
    label: "Scope",
    align: "left",
    sort: false,
  },
];

export const ColumnsAddScopeDetailConsMat: TableColumnType[] = [
  {
    key: "material",
    label: "Material",
    align: "left",
    sort: false,
  },
  {
    key: "merk",
    label: "Merk",
    align: "center",
    sort: false,
  },
  {
    key: "quantity",
    label: "Quantity",
    align: "center",
    sort: false,
  },
  {
    key: "unit",
    label: "Unit",
    align: "center",
    sort: false,
  },
];

export const ColumnsAddScopeDetailManpower: TableColumnType[] = [
  {
    key: "manpower",
    label: "Manpower",
    align: "left",
    sort: false,
  },
  {
    key: "quantity",
    label: "Quantity",
    align: "center",
    sort: false,
  },
  {
    key: "unit",
    label: "",
    align: "center",
    sort: false,
  },
];

export const ColumnsAddScopeDetailPart: TableColumnType[] = [
  {
    key: "part",
    label: "Part Name",
    align: "left",
    sort: false,
  },
  {
    key: "size",
    label: "Size",
    align: "center",
    sort: false,
  },
  {
    key: "location",
    label: "Location",
    align: "left",
    sort: false,
  },
  {
    key: "quantity",
    label: "Quantity",
    align: "center",
    sort: false,
  },
  {
    key: "unit",
    label: "Unit",
    align: "center",
    sort: false,
  },
  {
    key: "number_drawing",
    label: "No. Drawing",
    align: "center",
    sort: false,
  },
];

export const ColumnsAddScopeDetailQcPlan: TableColumnType[] = [
  {
    key: "name",
    label: "QC Plan Document",
    align: "left",
    sort: false,
  },
  {
    key: "attachment",
    label: "Attachment",
    align: "center",
    sort: false,
  },
  {
    key: "preview",
    label: "",
    align: "center",
    sort: false,
  },
];
