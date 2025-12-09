import MainLayout from "@/layouts/MainLayout.vue";
import AddScopeLayout from "@/layouts/AddScopeLayout.vue";
import DefaultLayout from "@/layouts/DefaultLayout.vue";

export const routeTransaction = [
  {
    path: "/:id/create/unit/:id_unit/:id_machine/:menu/:id_project/:id_inspection/scope",
    name: "transaction scope",
    component: () => import("@/modules/transaction/views/Scope.vue"),
    meta: {
      layout: MainLayout,
      requireAuth: true,
      role: ["planner", "approval"],
      except: ["superuser"],
    },
  },
  {
    path: "/:id/create/unit/:id_unit/:id_machine/:menu/:id_project/:id_inspection/sequence",
    name: "transaction sequence",
    component: () => import("@/modules/transaction/views/Squences.vue"),
    meta: {
      layout: DefaultLayout,
      requireAuth: true,
      role: ["planner", "approval"],
      except: ["superuser"],
    },
  },
  {
    path: "/:id/create/unit/:id_unit/:id_machine/:menu/:id_project/:id_inspection/work-instruction",
    name: "transaction scope ika",
    component: () =>
      import("@/modules/transaction/views/work-instruction/Scope.vue"),
    meta: {
      layout: MainLayout,
      requireAuth: true,
      role: ["planner", "approval"],
      except: ["superuser"],
    },
  },
  {
    path: "/:id/create/unit/:id_unit/:id_machine/:menu/:id_project/:id_inspection/part-std",
    name: "transaction part std",
    component: () => import("@/modules/transaction/views/PartStd.vue"),
    meta: {
      layout: MainLayout,
      requireAuth: true,
      role: ["planner", "approval"],
      except: ["superuser"],
    },
  },
  {
    path: "/:id/create/unit/:id_unit/:id_machine/:menu/:id_project/:id_inspection/manpower-std",
    name: "transaction manpower std",
    component: () => import("@/modules/transaction/views/ManpowerStd.vue"),
    meta: {
      layout: MainLayout,
      requireAuth: true,
      role: ["planner", "approval"],
      except: ["superuser"],
    },
  },
  {
    path: "/:id/create/unit/:id_unit/:id_machine/:menu/:id_project/:id_inspection/consumable-material-std",
    name: "transaction consumable material std",
    component: () =>
      import("@/modules/transaction/views/ConsumableMaterialStd.vue"),
    meta: {
      layout: MainLayout,
      requireAuth: true,
      role: ["planner", "approval"],
      except: ["superuser"],
    },
  },
  {
    path: "/:id/create/unit/:id_unit/:id_machine/:menu/:id_project/:id_inspection/equipment",
    name: "transaction equipment",
    component: () => import("@/modules/transaction/views/Equipment.vue"),
    meta: {
      layout: MainLayout,
      requireAuth: true,
      role: ["planner", "approval"],
      except: ["superuser"],
    },
  },
  {
    path: "/:id/create/unit/:id_unit/:id_machine/:menu/:id_project/:id_inspection/activity",
    name: "transaction activity",
    component: () => import("@/modules/transaction/views/Activity.vue"),
    meta: {
      layout: MainLayout,
      requireAuth: true,
      role: ["planner", "approval"],
      except: ["superuser"],
    },
  },
  {
    path: "/:id/create/unit/:id_unit/:id_machine/:menu/:id_project/:id_inspection/part",
    name: "transaction part",
    component: () => import("@/modules/transaction/views/Part.vue"),
    meta: {
      layout: MainLayout,
      requireAuth: true,
      role: ["planner", "approval"],
      except: ["superuser"],
    },
  },
  {
    path: "/:id/create/unit/:id_unit/:id_machine/:menu/:id_project/:id_inspection/manpower",
    name: "transaction manpower",
    component: () => import("@/modules/transaction/views/Manpower.vue"),
    meta: {
      layout: MainLayout,
      requireAuth: true,
      role: ["planner", "approval"],
      except: ["superuser"],
    },
  },
  {
    path: "/:id/create/unit/:id_unit/:id_machine/:menu/:id_project/:id_inspection/approval",
    name: "transaction approval",
    component: () => import("@/modules/transaction/views/Approval.vue"),
    meta: {
      layout: MainLayout,
      requireAuth: true,
      role: ["planner", "approval"],
      except: ["superuser"],
    },
  },
  {
    path: "/:id/create/unit/:id_unit/:id_machine/:menu/:id_project/:id_inspection/request-approval",
    name: "transaction request approval",
    component: () => import("@/modules/transaction/views/RequestApproval.vue"),
    meta: {
      layout: MainLayout,
      requireAuth: true,
      role: "planner",
      except: ["superuser"],
    },
  },
  {
    path: "/:id/create/unit/:id_unit/:id_machine/:menu/:id_project/:id_inspection/consumable-material",
    name: "transaction consumable-material",
    component: () =>
      import("@/modules/transaction/views/ConsumableMaterial.vue"),
    meta: {
      layout: MainLayout,
      requireAuth: true,
      role: ["planner", "approval"],
      except: ["superuser"],
    },
  },
  {
    path: "/:id/create/unit/:id_unit/:id_machine/:menu/:id_project/:id_inspection/additional-scope",
    name: "transaction additional-scope",
    component: () => import("@/modules/transaction/views/AddScopeTable.vue"),
    meta: {
      layout: MainLayout,
      requireAuth: true,
      role: ["planner", "approval"],
      except: ["superuser"],
    },
  },
  {
    path: "/:id/create/unit/:id_unit/:id_machine/:menu/:id_project/:id_inspection/add-scope/:id_scope/scope",
    name: "add scope detail scope",
    component: () =>
      import("@/modules/transaction/views/add-scope-detail/Scope.vue"),
    meta: {
      layout: AddScopeLayout,
      requireAuth: true,
      role: ["planner", "approval"],
      except: ["superuser"],
    },
  },
  {
    path: "/:id/create/unit/:id_unit/:id_machine/:menu/:id_project/:id_inspection/add-scope/:id_scope/work-instruction",
    name: "add scope detail work instruction",
    component: () =>
      import(
        "@/modules/transaction/views/add-scope-detail/WorkInstruction.vue"
      ),
    meta: {
      layout: AddScopeLayout,
      requireAuth: true,
      role: ["planner","approval"],
      except: ["superuser"],
    },
  },
  {
    path: "/:id/create/unit/:id_unit/:id_machine/:menu/:id_project/:id_inspection/add-scope/:id_scope/equipment",
    name: "add scope detail equipment",
    component: () =>
      import("@/modules/transaction/views/add-scope-detail/Equipment.vue"),
    meta: {
      layout: AddScopeLayout,
      requireAuth: true,
      role: ["planner", "approval"],
      except: ["superuser"],
    },
  },
  {
    path: "/:id/create/unit/:id_unit/:id_machine/:menu/:id_project/:id_inspection/add-scope/:id_scope/activity",
    name: "add scope detail activity",
    component: () =>
      import("@/modules/transaction/views/add-scope-detail/Activity.vue"),
    meta: {
      layout: AddScopeLayout,
      requireAuth: true,
      role: ["planner", "approval"],
      except: ["superuser"],
    },
  },
  {
    path: "/:id/create/unit/:id_unit/:id_machine/:menu/:id_project/:id_inspection/add-scope/:id_scope/consumable-material",
    name: "add scope detail consumable material",
    component: () =>
      import(
        "@/modules/transaction/views/add-scope-detail/ConsumableMaterial.vue"
      ),
    meta: {
      layout: AddScopeLayout,
      requireAuth: true,
      role: ["planner", "approval"],
      except: ["superuser"],
    },
  },
  {
    path: "/:id/create/unit/:id_unit/:id_machine/:menu/:id_project/:id_inspection/add-scope/:id_scope/manpower",
    name: "add scope detail manpower",
    component: () =>
      import("@/modules/transaction/views/add-scope-detail/Manpower.vue"),
    meta: {
      layout: AddScopeLayout,
      requireAuth: true,
      role: ["planner", "approval"],
      except: ["superuser"],
    },
  },
  {
    path: "/:id/create/unit/:id_unit/:id_machine/:menu/:id_project/:id_inspection/add-scope/:id_scope/part",
    name: "add scope detail part",
    component: () =>
      import("@/modules/transaction/views/add-scope-detail/Part.vue"),
    meta: {
      layout: AddScopeLayout,
      requireAuth: true,
      role: ["planner", "approval"],
      except: ["superuser"],
    },
  },
  {
    path: "/:id/create/unit/:id_unit/:id_machine/:menu/:id_project/:id_inspection/hse-doc",
    name: "transaction hse doc",
    component: () => import("@/modules/transaction/views/HseDoc.vue"),
    meta: {
      layout: MainLayout,
      requireAuth: true,
      role: ["planner", "approval"],
      except: ["superuser"],
    },
  },
  {
    path: "/:id/create/unit/:id_unit/:id_machine/:menu/:id_project/:id_inspection/qc-plan",
    name: "transaction qc plan",
    component: () => import("@/modules/transaction/views/QcPlan.vue"),
    meta: {
      layout: MainLayout,
      requireAuth: true,
      role: ["planner", "approval"],
      except: ["superuser"],
    },
  },
  //
  {
    path: "/:id/create/unit/:id_unit/:id_machine/:menu/:id_project/:id_inspection/results",
    name: "transaction results",
    component: () => import("@/modules/transaction/views/Results.vue"),
    meta: {
      layout: MainLayout,
      requireAuth: true,
      role: ["planner", "approval"],
      except: ["superuser"],
    },
  },
  // {
  //   path: "/:id/create/unit/:id_unit/:id_machine/:menu/:id_project/:id_inspection/squences",
  //   name: "transaction squences",
  //   component: () => import("@/modules/transaction/views/Squences.vue"),
  //   meta: { layout: DefaultLayout, requireAuth: true, role: ["planner", "approval"] },
  // },
  // //
  // {
  //   path: "/:id/create/unit/:id_unit/:id_machine/:menu/:id_project/:id_inspection/scope-mekanik",
  //   name: "scope mekanik",
  //   component: () => import("@/modules/transaction/views/scope/Mekanik.vue"),
  //   meta: { layout: MainLayout, requireAuth: true, role: ["planner", "approval"] },
  // },
  // {
  //   path: "/:id/create/unit/:id_unit/:id_machine/:menu/:id_project/:id_inspection/scope-listrik",
  //   name: "scope listrik",
  //   component: () => import("@/modules/transaction/views/scope/Listrik.vue"),
  //   meta: { layout: MainLayout, requireAuth: true, role: ["planner", "approval"] },
  // },
  // {
  //   path: "/:id/create/unit/:id_unit/:id_machine/:menu/:id_project/:id_inspection/scope-instrument",
  //   name: "scope instrument",
  //   component: () => import("@/modules/transaction/views/scope/Instrument.vue"),
  //   meta: { layout: MainLayout, requireAuth: true, role: ["planner", "approval"] },
  // },
  // //
  // {
  //   path: "/:id/create/unit/:id_unit/:id_machine/:menu/:id_project/:id_inspection/work-instruction-mekanik",
  //   name: "work instruction mekanik",
  //   component: () =>
  //     import("@/modules/transaction/views/work-instruction/Mekanik.vue"),
  //   meta: { layout: MainLayout, requireAuth: true, role: ["planner", "approval"] },
  // },
  // {
  //   path: "/:id/create/unit/:id_unit/:id_machine/:menu/:id_project/:id_inspection/work-instruction-listrik",
  //   name: "work instruction listrik",
  //   component: () =>
  //     import("@/modules/transaction/views/work-instruction/Listrik.vue"),
  //   meta: { layout: MainLayout, requireAuth: true, role: ["planner", "approval"] },
  // },
  // {
  //   path: "/:id/create/unit/:id_unit/:id_machine/:menu/:id_project/:id_inspection/work-instruction-instrument",
  //   name: "work instruction instrument",
  //   component: () =>
  //     import("@/modules/transaction/views/work-instruction/Instrument.vue"),
  //   meta: { layout: MainLayout, requireAuth: true, role: ["planner", "approval"] },
  // },
  // //
  // {
  //   path: "/:id/create/unit/:id_unit/:id_machine/:menu/:id_project/:id_inspection/consumable-material",
  //   name: "transaction consumable material",
  //   component: () =>
  //     import("@/modules/transaction/views/ConsumableMaterial.vue"),
  //   meta: { layout: MainLayout, requireAuth: true, role: ["planner", "approval"] },
  // },
  // //
  // {
  //   path: "/:id/create/unit/:id_unit/:id_machine/:menu/:id_project/:id_inspection/manpower",
  //   name: "transaction manpower",
  //   component: () => import("@/modules/transaction/views/Manpower.vue"),
  //   meta: { layout: MainLayout, requireAuth: true, role: ["planner", "approval"] },
  // },
  // //
  // {
  //   path: "/:id/create/unit/:id_unit/:id_machine/:menu/:id_project/:id_inspection/part",
  //   name: "transaction part",
  //   component: () => import("@/modules/transaction/views/Part.vue"),
  //   meta: { layout: MainLayout, requireAuth: true, role: ["planner", "approval"] },
  // },
  // //
  // {
  //   path: "/:id/create/unit/:id_unit/:id_machine/:menu/:id_project/:id_inspection/tools",
  //   name: "transaction tools",
  //   component: () => import("@/modules/transaction/views/Tools.vue"),
  //   meta: { layout: MainLayout, requireAuth: true, role: ["planner", "approval"] },
  // },
  // //
  // {
  //   path: "/:id/create/unit/:id_unit/:id_machine/:menu/:id_project/:id_inspection/hse",
  //   name: "transaction hse",
  //   component: () => import("@/modules/transaction/views/Hse.vue"),
  //   meta: { layout: MainLayout, requireAuth: true, role: ["planner", "approval"] },
  // },
  // //
  // {
  //   path: "/:id/create/unit/:id_unit/:id_machine/:menu/:id_project/:id_inspection/qc-plan",
  //   name: "transaction qc plan",
  //   component: () => import("@/modules/transaction/views/QcPlan.vue"),
  //   meta: { layout: MainLayout, requireAuth: true, role: ["planner", "approval"] },
  // },
  // //
  // {
  //   path: "/:id/create/unit/:id_unit/:id_machine/:menu/:id_project/:id_inspection/results",
  //   name: "transaction results",
  //   component: () => import("@/modules/transaction/views/Results.vue"),
  //   meta: { layout: MainLayout, requireAuth: true, role: ["planner", "approval"] },
  // },
  // //
  // {
  //   path: "/:id/create/unit/:id_unit/:id_machine/:menu/:id_project/:id_inspection/add-scope-squences",
  //   name: "transaction add scope squences",
  //   component: () => import("@/modules/transaction/views/AddScopeSquences.vue"),
  //   meta: { layout: MainLayout, requireAuth: true, role: ["planner", "approval"] },
  // },
  // {
  //   path: "/:id/create/unit/:id_unit/:id_machine/:menu/:id_project/:id_inspection/add-scope-squences/:section",
  //   name: "transaction add scope squences section",
  //   component: () =>
  //     import("@/modules/transaction/views/AddScopeSquencesSection.vue"),
  //   meta: { layout: DefaultLayout, requireAuth: true, role: ["planner", "approval"] },
  // },
  // {
  //   path: "/:id/create/unit/:id_unit/:id_machine/:menu/:id_project/:id_inspection/add-scope-table",
  //   name: "transaction add scope table",
  //   component: () => import("@/modules/transaction/views/AddScopeTable.vue"),
  //   meta: { layout: MainLayout, requireAuth: true, role: ["planner", "approval"] },
  // },
  // //
  // //
  // {
  //   path: "/:id/create/unit/:id_unit/:id_machine/:menu/:id_project/:id_inspection/add-scope/:id_scope/scope-mekanik",
  //   name: "add scope detail scope mekanik",
  //   component: () =>
  //     import("@/modules/transaction/views/add-scope-detail/scope/Mekanik.vue"),
  //   meta: { layout: AddScopeLayout, requireAuth: true, role: ["planner", "approval"] },
  // },
  // {
  //   path: "/:id/create/unit/:id_unit/:id_machine/:menu/:id_project/:id_inspection/add-scope/:id_scope/scope-listrik",
  //   name: "add scope detail scope listrik",
  //   component: () =>
  //     import("@/modules/transaction/views/add-scope-detail/scope/Listrik.vue"),
  //   meta: { layout: AddScopeLayout, requireAuth: true, role: ["planner", "approval"] },
  // },
  // {
  //   path: "/:id/create/unit/:id_unit/:id_machine/:menu/:id_project/:id_inspection/add-scope/:id_scope/scope-instrument",
  //   name: "add scope detail scope instrument",
  //   component: () =>
  //     import(
  //       "@/modules/transaction/views/add-scope-detail/scope/Instrument.vue"
  //     ),
  //   meta: { layout: AddScopeLayout, requireAuth: true, role: ["planner", "approval"] },
  // },
  // {
  //   path: "/:id/create/unit/:id_unit/:id_machine/:menu/:id_project/:id_inspection/add-scope/:id_scope/work-instruction-mekanik",
  //   name: "add scope detail work instruction mekanik",
  //   component: () =>
  //     import(
  //       "@/modules/transaction/views/add-scope-detail/work-instruction/Mekanik.vue"
  //     ),
  //   meta: { layout: AddScopeLayout, requireAuth: true, role: ["planner", "approval"] },
  // },
  // {
  //   path: "/:id/create/unit/:id_unit/:id_machine/:menu/:id_project/:id_inspection/add-scope/:id_scope/work-instruction-listrik",
  //   name: "add scope detail work instruction listrik",
  //   component: () =>
  //     import(
  //       "@/modules/transaction/views/add-scope-detail/work-instruction/Listrik.vue"
  //     ),
  //   meta: { layout: AddScopeLayout, requireAuth: true, role: ["planner", "approval"] },
  // },
  // {
  //   path: "/:id/create/unit/:id_unit/:id_machine/:menu/:id_project/:id_inspection/add-scope/:id_scope/work-instruction-instrument",
  //   name: "add scope detail work instruction instrument",
  //   component: () =>
  //     import(
  //       "@/modules/transaction/views/add-scope-detail/work-instruction/Instrument.vue"
  //     ),
  //   meta: { layout: AddScopeLayout, requireAuth: true, role: ["planner", "approval"] },
  // },
  // {
  //   path: "/:id/create/unit/:id_unit/:id_machine/:menu/:id_project/:id_inspection/add-scope/:id_scope/consumable-material",
  //   name: "add scope detail consumable material",
  //   component: () =>
  //     import(
  //       "@/modules/transaction/views/add-scope-detail/ConsumableMaterial.vue"
  //     ),
  //   meta: { layout: AddScopeLayout, requireAuth: true, role: ["planner", "approval"] },
  // },
  // {
  //   path: "/:id/create/unit/:id_unit/:id_machine/:menu/:id_project/:id_inspection/add-scope/:id_scope/manpower",
  //   name: "add scope detail manpower",
  //   component: () =>
  //     import("@/modules/transaction/views/add-scope-detail/Manpower.vue"),
  //   meta: { layout: AddScopeLayout, requireAuth: true, role: ["planner", "approval"] },
  // },
  // {
  //   path: "/:id/create/unit/:id_unit/:id_machine/:menu/:id_project/:id_inspection/add-scope/:id_scope/part",
  //   name: "add scope detail part",
  //   component: () =>
  //     import("@/modules/transaction/views/add-scope-detail/Part.vue"),
  //   meta: { layout: AddScopeLayout, requireAuth: true, role: ["planner", "approval"] },
  // },
  // {
  //   path: "/:id/create/unit/:id_unit/:id_machine/:menu/:id_project/:id_inspection/add-scope/:id_scope/qc-plan",
  //   name: "add scope detail qc plan",
  //   component: () =>
  //     import("@/modules/transaction/views/add-scope-detail/QcPlan.vue"),
  //   meta: { layout: AddScopeLayout, requireAuth: true, role: ["planner", "approval"] },
  // },
  // {
  //   path: "/:id/create/unit/:id_unit/:id_machine/:menu/:id_project/:id_inspection/add-scope/:id_scope/tools",
  //   name: "add scope detail tools",
  //   component: () =>
  //     import("@/modules/transaction/views/add-scope-detail/Tools.vue"),
  //   meta: { layout: AddScopeLayout, requireAuth: true, role: ["planner", "approval"] },
  // },
  //
];
