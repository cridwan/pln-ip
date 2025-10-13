import ScopeLayout from "@/layouts/ScopeLayout.vue";

export const routeInspection = [
  {
    path: "/:id/create/unit/:id_unit/:id_machine",
    name: "inspection",
    component: () => import("@/modules/inspection/views/Index.vue"),
    meta: {
      layout: ScopeLayout,
      requireAuth: false,
      role: "planner",
      except: ["superuser"],
    },
  },
];
