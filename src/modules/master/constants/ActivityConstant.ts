import type { TableColumnType } from "@/components/tables/Table.vue";

export const ColumnsActivity: TableColumnType[] = [
  {
    key: "serial_number",
    label: "No Urut",
    align: "left",
    sort: false,
  },
  {
    key: "name",
    label: "Activity",
    align: "left",
    sort: false,
  },
  {
    key: "duration",
    label: "Duration",
    align: "left",
    sort: false,
  },
  {
    key: "equipment",
    label: "Equipment",
    align: "left",
    sort: false,
  },
  {

    key: "ik_link",
    label: "IK Link",
    align: "left",
    sort: false,
  },
  {
    key: "ik_doc",
    label: "IK Doc",
    align: "left",
    sort: false,
  }
];

export const ColumnsActivityGuest: TableColumnType[] = [
  {
    key: "serial_number",
    label: "No Urut",
    align: "left",
    sort: false,
  },
  {
    key: "name",
    label: "Activity",
    align: "left",
    sort: false,
  },
  {
    key: "duration",
    label: "Duration",
    align: "left",
    sort: false,
  },
  {
    key: "equipment",
    label: "Equipment",
    align: "left",
    sort: false,
  },
];
