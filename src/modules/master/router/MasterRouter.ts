import MasterAdditionalLayout from "@/layouts/MasterAdditionalLayout.vue";
import MasterLayout from "@/layouts/MasterLayout.vue";

export const routeMaster = [
  {
    path: "/master/location",
    name: "master location",
    component: () => import("@/modules/master/views/Location.vue"),
    meta: { layout: MasterLayout, requireAuth: true, role: "superuser" },
  },
  {
    path: "/master/qc-plan",
    name: "QC Plan",
    component: () => import("@/modules/master/views/QcPlan.vue"),
    meta: { layout: MasterLayout, requireAuth: true, role: "superuser" },
  },

  {
    path: "/master/unit",
    name: "master unit",
    component: () => import("@/modules/master/views/Unit.vue"),
    meta: { layout: MasterLayout, requireAuth: true, role: "superuser" },
  },
  {
    path: "/master/machine",
    name: "master machine",
    component: () => import("@/modules/master/views/Machine.vue"),
    meta: { layout: MasterLayout, requireAuth: true, role: "superuser" },
  },
  {
    path: "/master/inspection-type",
    name: "master inspection type",
    component: () => import("@/modules/master/views/InspectionType.vue"),
    meta: { layout: MasterLayout, requireAuth: true, role: "superuser" },
  },
  {
    path: "/master/global-unit",
    name: "master global unit",
    component: () => import("@/modules/master/views/GlobalUnit.vue"),
    meta: { layout: MasterLayout, requireAuth: true, role: "superuser" },
  },
  {
    path: "/master/scope",
    name: "master scope",
    component: () => import("@/modules/master/views/Scope.vue"),
    meta: { layout: MasterLayout, requireAuth: true, role: "superuser" },
  },
  {
    path: "/master/additional-scope",
    name: "master additional scope",
    component: () => import("@/modules/master/views/AdditionalScope.vue"),
    meta: { layout: MasterLayout, requireAuth: true, role: "superuser" },
  },
  {
    path: "/master/additional-scope/:id/:name/scope-standart",
    name: "master additional scope standart",
    component: () =>
      import("@/modules/master/views/additional-scope/Scope.vue"),
    meta: {
      layout: MasterAdditionalLayout,
      requireAuth: true,
      role: "superuser",
    },
  },
  {
    path: "/master/additional-scope/:id/:name/consumable-material",
    name: "master additional consumable material",
    component: () =>
      import("@/modules/master/views/additional-scope/ConsumableMaterial.vue"),
    meta: {
      layout: MasterAdditionalLayout,
      requireAuth: true,
      role: "superuser",
    },
  },
  {
    path: "/master/additional-scope/:id/:name/manpower",
    name: "master additional manpower",
    component: () =>
      import("@/modules/master/views/additional-scope/Manpower.vue"),
    meta: {
      layout: MasterAdditionalLayout,
      requireAuth: true,
      role: "superuser",
    },
  },
  {
    path: "/master/additional-scope/:id/:name/part",
    name: "master additional part",
    component: () => import("@/modules/master/views/additional-scope/Part.vue"),
    meta: {
      layout: MasterAdditionalLayout,
      requireAuth: true,
      role: "superuser",
    },
  },
  {
    path: "/master/additional-scope/:id/:name/tools",
    name: "master additional tools",
    component: () =>
      import("@/modules/master/views/additional-scope/Tools.vue"),
    meta: {
      layout: MasterAdditionalLayout,
      requireAuth: true,
      role: "superuser",
    },
  },
  {
    path: "/master/additional-scope/:id/:name/sequence",
    name: "master additional sequence",
    component: () =>
      import("@/modules/master/views/additional-scope/Sequence.vue"),
    meta: {
      layout: MasterAdditionalLayout,
      requireAuth: true,
      role: "superuser",
    },
  },
  {
    path: "/master/additional-scope/:id/:name/equipment",
    name: "master additional equipment",
    component: () =>
      import("@/modules/master/views/additional-scope/Equipment.vue"),
    meta: {
      layout: MasterAdditionalLayout,
      requireAuth: true,
      role: "superuser",
    },
  },
  {
    path: "/master/additional-scope/:id/:name/activity",
    name: "master additional activity",
    component: () =>
      import("@/modules/master/views/additional-scope/Activity.vue"),
    meta: {
      layout: MasterAdditionalLayout,
      requireAuth: true,
      role: "superuser",
    },
  },
  {
    path: "/master/consumable-materials",
    name: "master consumable material",
    component: () => import("@/modules/master/views/ConsumableMaterial.vue"),
    meta: { layout: MasterLayout, requireAuth: true, role: "superuser" },
  },
  {
    path: "/master/part",
    name: "master part",
    component: () => import("@/modules/master/views/Part.vue"),
    meta: { layout: MasterLayout, requireAuth: true, role: "superuser" },
  },
  {
    path: "/master/tools",
    name: "master tools",
    component: () => import("@/modules/master/views/Tools.vue"),
    meta: { layout: MasterLayout, requireAuth: true, role: "superuser" },
  },
  {
    path: "/master/manpower",
    name: "master manpower",
    component: () => import("@/modules/master/views/Manpower.vue"),
    meta: { layout: MasterLayout, requireAuth: true, role: "superuser" },
  },
  {
    path: "/master/role",
    name: "master role",
    component: () => import("@/modules/master/views/Role.vue"),
    meta: { layout: MasterLayout, requireAuth: true, role: "superuser" },
  },
  {
    path: "/master/user",
    name: "master user",
    component: () => import("@/modules/master/views/User.vue"),
    meta: { layout: MasterLayout, requireAuth: true, role: "superuser" },
  },
  {
    path: "/master/bidang",
    name: "master bidang",
    component: () => import("@/modules/master/views/Bidang.vue"),
    meta: { layout: MasterLayout, requireAuth: true, role: "superuser" },
  },
  {
    path: "/master/sub-bidang",
    name: "master subbidang",
    component: () => import("@/modules/master/views/SubBidang.vue"),
    meta: { layout: MasterLayout, requireAuth: true, role: "superuser" },
  },
  {
    path: "/master/hse-doc",
    name: "master hse doc",
    component: () => import("@/modules/master/views/HseDoc.vue"),
    meta: { layout: MasterLayout, requireAuth: true, role: "superuser" },
  },
  {
    path: "/master/hses",
    name: "master hse",
    component: () => import("@/modules/master/views/Hse.vue"),
    meta: { layout: MasterLayout, requireAuth: true, role: "superuser" },
  },
  {
    path: "/master/sequence",
    name: "master sequence",
    component: () => import("@/modules/master/views/Sequence.vue"),
    meta: { layout: MasterLayout, requireAuth: true, role: "superuser" },
  },
  {
    path: "/master/activity",
    name: "master activity",
    component: () => import("@/modules/master/views/Activity.vue"),
    meta: { layout: MasterLayout, requireAuth: true, role: "superuser" },
  },
  {
    path: "/master/equipment",
    name: "master equipment",
    component: () => import("@/modules/master/views/Equipment.vue"),
    meta: { layout: MasterLayout, requireAuth: true, role: "superuser" },
  },
  {
    path: "/master/part-std",
    name: "master part std",
    component: () => import("@/modules/master/views/PartStd.vue"),
    meta: { layout: MasterLayout, requireAuth: true, role: "superuser" },
  },
  {
    path: "/master/manpower-std",
    name: "master manpower std",
    component: () => import("@/modules/master/views/ManpowerStd.vue"),
    meta: { layout: MasterLayout, requireAuth: true, role: "superuser" },
  },
  {
    path: "/master/consumable-material-std",
    name: "master consumable material std",
    component: () => import("@/modules/master/views/ConsumableMaterialStd.vue"),
    meta: { layout: MasterLayout, requireAuth: true, role: "superuser" },
  },
];
