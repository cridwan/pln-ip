import DefaultLayout from "@/layouts/DefaultLayout.vue";
import MapLayout from "@/layouts/MapLayout.vue";

export const routeLocation = [
  {
    path: "/",
    name: "location",
    component: () => import("@/modules/location/views/Index.vue"),
    meta: {
      layout: MapLayout,
      requireAuth: false,
      role: "planner",
      except: ["superuser"],
    },
  },
  {
    path: "/:id",
    name: "detail location",
    component: () => import("@/modules/location/views/Detail.vue"),
    meta: {
      layout: DefaultLayout,
      requireAuth: false,
      role: "planner",
      except: ["superuser"],
    },
  },
];
