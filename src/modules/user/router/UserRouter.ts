import UserHistoryLayout from "@/layouts/UserHistoryLayout.vue";

export const routeUser = [
  {
    path: "/user-history",
    name: "user history",
    component: () => import("@/modules/user/views/UserHistory.vue"),
    meta: {
      layout: UserHistoryLayout,
      requireAuth: true,
      role: "planner",
      except: ["superuser"],
    },
  },
];
