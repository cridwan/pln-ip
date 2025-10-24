import GuestLayout from "@/layouts/GuestLayout.vue";
import GuestAddScopeLayout from "@/layouts/GuestAddScopeLayout.vue";

export const routeTransaction = [
  {
    path: "/:id/guest/:id_unit/:id_machine/:menu/:id_project/:id_inspection/scope",
    name: "guest scope",
    component: () => import("@/modules/guest/views/Scope.vue"),
    meta: {
      layout: GuestLayout,
      requireAuth: false,
      role: ["planner"],
      except: ["superuser"],
    },
  },
  {
    path: "/:id/guest/:id_unit/:id_machine/:menu/:id_project/:id_inspection/work-instruction",
    name: "guest scope ika",
    component: () => import("@/modules/guest/views/work-instruction/Scope.vue"),
    meta: {
      layout: GuestLayout,
      requireAuth: false,
      role: ["planner"],
      except: ["superuser"],
    },
  },
  {
    path: "/:id/guest/:id_unit/:id_machine/:menu/:id_project/:id_inspection/part-std",
    name: "guest part std",
    component: () => import("@/modules/guest/views/PartStd.vue"),
    meta: {
      layout: GuestLayout,
      requireAuth: false,
      role: ["planner"],
      except: ["superuser"],
    },
  },
  {
    path: "/:id/guest/:id_unit/:id_machine/:menu/:id_project/:id_inspection/manpower-std",
    name: "guest manpower std",
    component: () => import("@/modules/guest/views/ManpowerStd.vue"),
    meta: {
      layout: GuestLayout,
      requireAuth: false,
      role: "superuser",
      except: ["superuser"],
    },
  },
  {
    path: "/:id/guest/:id_unit/:id_machine/:menu/:id_project/:id_inspection/consumable-material-std",
    name: "guest consumable material std",
    component: () => import("@/modules/guest/views/ConsumableMaterialStd.vue"),
    meta: {
      layout: GuestLayout,
      requireAuth: false,
      role: ["planner"],
      except: ["superuser"],
    },
  },
  {
    path: "/:id/guest/:id_unit/:id_machine/:menu/:id_project/:id_inspection/equipment",
    name: "guest equipment",
    component: () => import("@/modules/guest/views/Equipment.vue"),
    meta: {
      layout: GuestLayout,
      requireAuth: false,
      role: ["planner"],
      except: ["superuser"],
    },
  },
  {
    path: "/:id/guest/:id_unit/:id_machine/:menu/:id_project/:id_inspection/activity",
    name: "guest activity",
    component: () => import("@/modules/guest/views/Activity.vue"),
    meta: {
      layout: GuestLayout,
      requireAuth: false,
      role: ["planner"],
      except: ["superuser"],
    },
  },
  {
    path: "/:id/guest/:id_unit/:id_machine/:menu/:id_project/:id_inspection/part",
    name: "guest part",
    component: () => import("@/modules/guest/views/Part.vue"),
    meta: {
      layout: GuestLayout,
      requireAuth: false,
      role: ["planner"],
      except: ["superuser"],
    },
  },
  {
    path: "/:id/guest/:id_unit/:id_machine/:menu/:id_project/:id_inspection/manpower",
    name: "guest manpower",
    component: () => import("@/modules/guest/views/Manpower.vue"),
    meta: {
      layout: GuestLayout,
      requireAuth: false,
      role: ["planner"],
      except: ["superuser"],
    },
  },
  {
    path: "/:id/guest/:id_unit/:id_machine/:menu/:id_project/:id_inspection/approval",
    name: "guest approval",
    component: () => import("@/modules/guest/views/Approval.vue"),
    meta: {
      layout: GuestLayout,
      requireAuth: false,
      role: ["planner"],
      except: ["superuser"],
    },
  },
  {
    path: "/:id/guest/:id_unit/:id_machine/:menu/:id_project/:id_inspection/consumable-material",
    name: "guest consumable-material",
    component: () => import("@/modules/guest/views/ConsumableMaterial.vue"),
    meta: {
      layout: GuestLayout,
      requireAuth: false,
      role: ["planner"],
      except: ["superuser"],
    },
  },
  {
    path: "/:id/guest/:id_unit/:id_machine/:menu/:id_project/:id_inspection/additional-scope",
    name: "guest additional-scope",
    component: () => import("@/modules/guest/views/AddScopeTable.vue"),
    meta: {
      layout: GuestLayout,
      requireAuth: false,
      role: ["planner"],
      except: ["superuser"],
    },
  },
  {
    path: "/:id/guest/:id_unit/:id_machine/:menu/:id_project/:id_inspection/add-scope/:id_scope/scope",
    name: "add scope detail scope guest",
    component: () => import("@/modules/guest/views/add-scope-detail/Scope.vue"),
    meta: {
      layout: GuestAddScopeLayout,
      requireAuth: false,
      role: ["planner"],
      except: ["superuser"],
    },
  },
  {
    path: "/:id/guest/:id_unit/:id_machine/:menu/:id_project/:id_inspection/add-scope/:id_scope/equipment",
    name: "add scope detail equipment guest",
    component: () =>
      import("@/modules/guest/views/add-scope-detail/Equipment.vue"),
    meta: {
      layout: GuestAddScopeLayout,
      requireAuth: false,
      role: ["planner"],
      except: ["superuser"],
    },
  },
  {
    path: "/:id/guest/:id_unit/:id_machine/:menu/:id_project/:id_inspection/add-scope/:id_scope/activity",
    name: "add scope detail activity guest",
    component: () =>
      import("@/modules/guest/views/add-scope-detail/Activity.vue"),
    meta: {
      layout: GuestAddScopeLayout,
      requireAuth: false,
      role: ["planner"],
      except: ["superuser"],
    },
  },
  {
    path: "/:id/guest/:id_unit/:id_machine/:menu/:id_project/:id_inspection/add-scope/:id_scope/consumable-material",
    name: "add scope detail consumable material guest",
    component: () =>
      import("@/modules/guest/views/add-scope-detail/ConsumableMaterial.vue"),
    meta: {
      layout: GuestAddScopeLayout,
      requireAuth: false,
      role: ["planner"],
      except: ["superuser"],
    },
  },
  {
    path: "/:id/guest/:id_unit/:id_machine/:menu/:id_project/:id_inspection/add-scope/:id_scope/manpower",
    name: "add scope detail manpower guest",
    component: () =>
      import("@/modules/guest/views/add-scope-detail/Manpower.vue"),
    meta: {
      layout: GuestAddScopeLayout,
      requireAuth: false,
      role: ["planner"],
      except: ["superuser"],
    },
  },
  {
    path: "/:id/guest/:id_unit/:id_machine/:menu/:id_project/:id_inspection/add-scope/:id_scope/part",
    name: "add scope detail part guest",
    component: () => import("@/modules/guest/views/add-scope-detail/Part.vue"),
    meta: {
      layout: GuestAddScopeLayout,
      requireAuth: false,
      role: ["planner"],
      except: ["superuser"],
    },
  },
  {
    path: "/:id/guest/:id_unit/:id_machine/:menu/:id_project/:id_inspection/hse-doc",
    name: "guest hse doc guest",
    component: () => import("@/modules/guest/views/HseDoc.vue"),
    meta: {
      layout: GuestLayout,
      requireAuth: false,
      role: ["planner"],
      except: ["superuser"],
    },
  },
  {
    path: "/:id/guest/:id_unit/:id_machine/:menu/:id_project/:id_inspection/qc-plan",
    name: "guest qc plan guest",
    component: () => import("@/modules/guest/views/QcPlan.vue"),
    meta: {
      layout: GuestLayout,
      requireAuth: false,
      role: ["planner"],
      except: ["superuser"],
    },
  },
  {
    path: "/:id/guest/:id_unit/:id_machine/:menu/:id_project/:id_inspection/results",
    name: "guest results guest",
    component: () => import("@/modules/guest/views/Results.vue"),
    meta: {
      layout: GuestLayout,
      requireAuth: false,
      role: ["planner"],
      except: ["superuser"],
    },
  },
];
