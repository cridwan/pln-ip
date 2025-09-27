export interface MenuInterface {
  id: number;
  name: string;
  url: string;
  icon: string;
  children?: {
    id: number;
    name: string;
    url: string;
    icon?: string;
  }[];
}

export const Menus: MenuInterface[] = [
  {
    id: 1,
    name: "Home",
    url: "/",
    icon: "home",
  },
  {
    id: 5,
    name: "Scope",
    url: "/scope",
    icon: "document",
  },
  {
    id: 5,
    name: "Instruksi Kerja",
    url: "/work-instruction",
    icon: "megaphone",
  },
  // {
  //   id: 11,
  //   name: "Equipment",
  //   url: "/equipment",
  //   icon: "wrench",
  // },
  // {
  //   id: 11,
  //   name: "Activity",
  //   url: "/activity",
  //   icon: "pulse-line",
  // },
  {
    id: 11,
    name: "Part Standart",
    url: "/part-std",
    icon: "part-std",
  },
  {
    id: 11,
    name: "Manpower Standart",
    url: "/manpower-std",
    icon: "manpower-std",
  },
  {
    id: 11,
    name: "Consumable Material Standart",
    url: "/consumable-material-std",
    icon: "consumable-material-std",
  },
  {
    id: 10,
    name: "QC Plan",
    url: "/qc-plan",
    icon: "mind-gear",
  },
  {
    id: 12,
    name: "Results",
    url: "/results",
    icon: "document-clean",
  },
  {
    id: 12,
    name: "Approval",
    url: "/approval",
    icon: "check-list",
  },
  {
    id: 13,
    name: "Additional Scope",
    url: "/additional-scope",
    icon: "login",
  },
  // {
  //   id: 11,
  //   name: "Preview",
  //   url: "/preview",
  //   icon: "magnifying-glass",
  // },
  // {
  //   id: 2,
  //   name: "Sequences",
  //   url: "/squences",
  //   icon: "forward-message",
  // },
  // {
  //   id: 3,
  //   name: "Scope",
  //   url: "/scope",
  //   icon: "document",
  //   children: [
  //     {
  //       id: 301,
  //       name: "Mekanik",
  //       url: "/scope-mekanik",
  //     },
  //     {
  //       id: 302,
  //       name: "Listrik",
  //       url: "/scope-listrik",
  //     },
  //     {
  //       id: 303,
  //       name: "Instrument",
  //       url: "/scope-instrument",
  //     },
  //   ],
  // },
  // {
  //   id: 4,
  //   name: "Instruksi Kerja",
  //   url: "/work-instruction",
  //   icon: "checklist",
  //   children: [
  //     {
  //       id: 301,
  //       name: "Mekanik",
  //       url: "/work-instruction-mekanik",
  //     },
  //     {
  //       id: 302,
  //       name: "Listrik",
  //       url: "/work-instruction-listrik",
  //     },
  //     {
  //       id: 303,
  //       name: "Instrument",
  //       url: "/work-instruction-instrument",
  //     },
  //   ],
  // },
  // {
  //   id: 5,
  //   name: "Consumable Material",
  //   url: "/consumable-material",
  //   icon: "box",
  // },
  // {
  //   id: 6,
  //   name: "Manpower",
  //   url: "/manpower",
  //   icon: "male",
  // },
  // {
  //   id: 7,
  //   name: "Part",
  //   url: "/part",
  //   icon: "trolley-items",
  // },
  // {
  //   id: 8,
  //   name: "Tools",
  //   url: "/tools",
  //   icon: "tools",
  // },
  // {
  //   id: 9,
  //   name: "HSE",
  //   url: "/hse",
  //   icon: "construction-worker",
  // },
  // {
  //   id: 10,
  //   name: "QC Plan",
  //   url: "/qc-plan",
  //   icon: "mind-gear",
  // },
  // {
  //   id: 11,
  //   name: "Add Scope",
  //   url: "/add-scope",
  //   icon: "login",
  //   children: [
  //     {
  //       id: 111,
  //       name: "Detail",
  //       url: "/add-scope-table",
  //     },
  //     {
  //       id: 112,
  //       name: "Sequences",
  //       url: "/add-scope-squences",
  //     },
  //   ],
  // },
  // {
  //   id: 11,
  //   name: "Preview",
  //   url: "/preview",
  //   icon: "magnifying-glass",
  // },
  // {
  //   id: 12,
  //   name: "Results",
  //   url: "/results",
  //   icon: "document-clean",
  // },
];

export const MenusAddScope: MenuInterface[] = [
  {
    id: 1,
    name: "Additional Scope",
    url: "/",
    icon: "out",
  },
  {
    id: 2,
    name: "Scope",
    url: "/scope",
    icon: "document",
  },
  // {
  //   id: 2,
  //   name: "Equipment",
  //   url: "/equipment",
  //   icon: "wrench",
  // },
  // {
  //   id: 2,
  //   name: "Activity",
  //   url: "/activity",
  //   icon: "pulse-line",
  // },
  {
    id: 4,
    name: "Consumable Material",
    url: "/consumable-material",
    icon: "box",
  },
  {
    id: 5,
    name: "Manpower",
    url: "/manpower",
    icon: "male",
  },
  {
    id: 6,
    name: "Part",
    url: "/part",
    icon: "trolley-items",
  },
];

export const MenusMaster: MenuInterface[] = [
  {
    id: 16,
    name: "Master Data",
    url: "/master-data",
    icon: "arrow",
    children: [
      {
        id: 1,
        name: "Location",
        url: "/location",
        icon: "location-pin",
      },
      {
        id: 2,
        name: "Unit",
        url: "/unit",
        icon: "unit",
      },
      {
        id: 3,
        name: "Machine",
        url: "/machine",
        icon: "machine",
      },
      {
        id: 6,
        name: "Global Unit",
        url: "/global-unit",
        icon: "ruler",
      },
      {
        id: 15,
        name: "Sequence",
        url: "/sequence",
        icon: "sequence",
      },
      {
        id: 7,
        name: "Consumable Material",
        url: "/consumable-materials",
        icon: "box",
      },
      {
        id: 8,
        name: "Manpower",
        url: "/manpower",
        icon: "male",
      },
      {
        id: 9,
        name: "Part",
        url: "/part",
        icon: "trolley-items",
      },
      {
        id: 11,
        name: "User",
        url: "/user",
        icon: "users",
      },
      {
        id: 14,
        name: "Bidang",
        url: "/bidang",
        icon: "bidang",
      },
      {
        id: 15,
        name: "Sub Bidang",
        url: "/sub-bidang",
        icon: "sub-bidang",
      },
      {
        id: 15,
        name: "HSE DOC",
        url: "/hse-doc",
        icon: "hse-doc",
      },
      {
        id: 17,
        name: "QC Plan",
        url: "/qc-plan",
        icon: "qc-plan",
      },
    ],
  },
  {
    id: 4,
    name: "Inspection Type",
    url: "/inspection-type",
    icon: "inspection-type",
  },
  {
    id: 5,
    name: "Scope",
    url: "/scope",
    icon: "document",
  },
  // {
  //   id: 15,
  //   name: "HSE",
  //   url: "/hses",
  //   icon: "hse",
  // },
  {
    id: 11,
    name: "Equipment",
    url: "/equipment",
    icon: "wrench",
  },
  {
    id: 11,
    name: "Activity",
    url: "/activity",
    icon: "pulse-line",
  },
  {
    id: 11,
    name: "Part Standart",
    url: "/part-std",
    icon: "part-std",
  },
  {
    id: 11,
    name: "Manpower Standart",
    url: "/manpower-std",
    icon: "manpower-std",
  },
  {
    id: 11,
    name: "Consumable Material Standart",
    url: "/consumable-material-std",
    icon: "consumable-material-std",
  },
  // {
  //   id: 10,
  //   name: "Tools",
  //   url: "/tools",
  //   icon: "tools",
  // },
  {
    id: 13,
    name: "Additional Scope",
    url: "/additional-scope",
    icon: "login",
  },
];

export const MenuAdditional: MenuInterface[] = [
  {
    id: 5,
    name: "Scope",
    url: "/master/additional-scope/:id/:name/scope-standart",
    icon: "document",
  },
  {
    id: 9,
    name: "Equipment",
    url: "/master/additional-scope/:id/:name/equipment",
    icon: "wrench",
  },
  {
    id: 9,
    name: "Activity",
    url: "/master/additional-scope/:id/:name/activity",
    icon: "pulse-line",
  },
  {
    id: 7,
    name: "Consumable Material Standart",
    url: "/master/additional-scope/:id/:name/consumable-material",
    icon: "consumable-material-std",
  },
  {
    id: 8,
    name: "Manpower Standart",
    url: "/master/additional-scope/:id/:name/manpower",
    icon: "manpower-std",
  },
  {
    id: 9,
    name: "Part Standart",
    url: "/master/additional-scope/:id/:name/part",
    icon: "part-std",
  },
  // {
  //   id: 9,
  //   name: "Tools",
  //   url: "/master/additional-scope/:id/:name/tools",
  //   icon: "tools",
  // },
  // {
  //   id: 9,
  //   name: "Sequence",
  //   url: "/master/additional-scope/:id/:name/sequence",
  //   icon: "sequence",
  // },
];
