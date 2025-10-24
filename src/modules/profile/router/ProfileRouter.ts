import EmptyLayout from "@/layouts/EmptyLayout.vue";

export const routeProfile = [
  {
    path: "/profile",
    name: "profile",
    component: () => import("@/modules/profile/views/Index.vue"),
    meta: {
      layout: EmptyLayout,
      requireAuth: true,
    },
  },
];
