import DefaultLayout from "@/layouts/DefaultLayout.vue";

export const routeUnit = [
  {
    path: "/:id/create/unit",
    name: "unit",
    component: () => import("@/modules/unit/views/Index.vue"),
    meta: {
      layout: DefaultLayout,
      requireAuth: false,
      role: ["planner"],
      except: ["superuser"],
    },
  },
];
