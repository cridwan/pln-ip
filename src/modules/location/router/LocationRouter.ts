import DefaultLayout from "@/layouts/DefaultLayout.vue";
import MapLayout from "@/layouts/MapLayout.vue";

export const routeLocation = [
  {
    path: "/",
    name: "location",
    component: () => import("@/modules/location/views/Index.vue"),
    meta: {
      layout: MapLayout,
      requireAuth: true,
      role: ["planner", "approval", "guest"],
      except: ["superuser"],
    },
  },
  {
    path: "/:id",
    name: "detail location",
    component: () => import("@/modules/location/views/Detail.vue"),
    meta: {
      layout: DefaultLayout,
      requireAuth: true,
      role: ["planner", "approval", "guest"],
      except: ["superuser"],
    },
  },
];
