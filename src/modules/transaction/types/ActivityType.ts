import type { TableColumnType } from "@/components/tables/Table.vue";

export interface FormActivityInterface {
  activity_uuid: string;
}
export interface FormActivityInterfaceClone {
  activity_uuid: string;
  equipment_uuid: string;
}
export interface ActivitySelectInterface {
  name: string;
  uuid: string;
  original_uuid: string;
}


export const ColumnsActivityTransaction: TableColumnType[] = [
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