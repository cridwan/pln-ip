<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";

import { useGlobalStore } from "@/stores/GlobalStore";
import { Icon, Loading } from "@/components";
import eventBus from "@/utils/eventBus";
import {
  DialogContent,
  DialogDescription,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  VisuallyHidden,
} from "radix-vue";
import Sidebar from "@/components/layouts/Sidebar.vue";

const videosData = ref({
  ci: [
    {
      id: 0,
      video: () =>
        import("/videos/combustion-inspection/1-manhole-turbine-cylinder.webm"),
      name: "Manhole Turbine Cylinder",
      top: 235,
      left: 545,
    },
    {
      id: 1,
      video: () =>
        import("/videos/combustion-inspection/2-flame-detector.webm"),
      name: "Flame Detector",
      top: 222,
      left: 685,
    },
    {
      id: 2,
      video: () => import("/videos/combustion-inspection/3-flame-igniter.webm"),
      name: "Flame Igniter",
      top: 235,
      left: 525,
    },
    {
      id: 3,
      video: () =>
        import("/videos/combustion-inspection/4-discavity-temperature.webm"),
      name: "Discavity Temperature",
      top: 210,
      left: 440,
    },
    {
      id: 4,
      video: () =>
        import("/videos/combustion-inspection/5-black-patch-temperature.webm"),
      name: "Black Patch Temperature",
      top: 238,
      left: 420,
    },
    {
      id: 5,
      video: () =>
        import("/videos/combustion-inspection/6-fuel-branch-pipe.webm"),
      name: "Fuel Branch Pipe",
      top: 238,
      left: 420,
    },
    {
      id: 6,
      video: () =>
        import("/videos/combustion-inspection/7-cross-flame-tube.webm"),
      name: "Cross Flame Tube",
      top: 235,
      left: 370,
    },
    {
      id: 7,
      video: () => import("/videos/combustion-inspection/8-top-hat.webm"),
      name: "Top Hat",
      top: 235,
      left: 505,
    },
    {
      id: 8,
      video: () => import("/videos/combustion-inspection/9-fuel-nozzle.mp4"),
      name: "Fuel Nozzle",
      top: 235,
      left: 715,
    },
    {
      id: 9,
      video: () =>
        import("/videos/combustion-inspection/10-combuster-basket.mp4"),
      name: "Combuster Basket",
      top: 235,
      left: 660,
    },
    {
      id: 10,
      video: () => import("/videos/combustion-inspection/11-top-hat.mp4"),
      name: "Top Hat",
      top: 240,
      left: 540,
    },
    {
      id: 11,
      video: () => import("/videos/combustion-inspection/12-u-support.mp4"),
      name: "U-Support",
      top: 235,
      left: 785,
    },
    {
      id: 12,
      video: () => import("/videos/combustion-inspection/13-bypass-elbow.mp4"),
      name: "Bypass Elbow",
      top: 235,
      left: 515,
    },
    {
      id: 13,
      video: () =>
        import("/videos/combustion-inspection/14-transition-piece.mp4"),
      name: "Transition Piece",
      top: 237,
      left: 615,
    },
    {
      id: 14,
      video: () => import("/videos/combustion-inspection/15.mp4"),
      name: "",
      top: 0,
      left: 0,
    },
    {
      id: 15,
      video: () =>
        import("/videos/combustion-inspection/16-transition-piece.mp4"),
      name: "Transition Piece",
      top: 237,
      left: 615,
    },
    {
      id: 16,
      video: () => import("/videos/combustion-inspection/17-u-support.mp4"),
      name: "U-Support",
      top: 237,
      left: 630,
    },
    {
      id: 17,
      video: () => import("/videos/combustion-inspection/18-bypass-elbow.mp4"),
      name: "Bypass Elbow",
      top: 235,
      left: 790,
    },
    {
      id: 18,
      video: () => import("/videos/combustion-inspection/19-top-hat.mp4"),
      name: "Top Hat",
      top: 233,
      left: 685,
    },
    {
      id: 19,
      video: () =>
        import("/videos/combustion-inspection/20-cross-flame-tube.mp4"),
      name: "Cross Flame Tube",
      top: 237,
      left: 580,
    },
    {
      id: 20,
      video: () =>
        import("/videos/combustion-inspection/21-flame-detector.mp4"),
      name: "Flame Detector",
      top: 237,
      left: 785,
    },
    {
      id: 21,
      video: () =>
        import("/videos/combustion-inspection/22-manhole-turbine.mp4"),
      name: "Manhole Turbine",
      top: 235,
      left: 615,
    },
    {
      id: 22,
      video: () =>
        import("/videos/combustion-inspection/23-discavity-temperature.mp4"),
      name: "Discavity Temperature",
      top: 230,
      left: 630,
    },
    {
      id: 23,
      video: () =>
        import("/videos/combustion-inspection/24-black-patch-temperature.mp4"),
      name: "Black Patch Temperature",
      top: 238,
      left: 420,
    },
    {
      id: 24,
      video: () =>
        import("/videos/combustion-inspection/25-fuel-branch-pipe.mp4"),
      name: "Fuel Branch Pipe",
      top: 237,
      left: 420,
    },
    {
      id: 25,
      video: () => import("/videos/combustion-inspection/26-flame-igniter.mp4"),
      name: "Flame Igniter",
      top: 236,
      left: 525,
    },
    {
      id: 26,
      video: () => import("/videos/combustion-inspection/27.mp4"),
      name: "",
      top: 0,
      left: 0,
    },
  ],
  mi: [
    {
      id: 0,
      video: () =>
        import("/videos/major-inspection/1-manhole-turbine-cylinder.mp4"),
      name: "Manhole Turbine Cylinder",
      top: 233,
      left: 550,
    },
    {
      id: 1,
      video: () => import("/videos/major-inspection/2-inlet-duct.mp4"),
      name: "Inlet Duct",
      top: 233,
      left: 660,
    },
    {
      id: 2,
      video: () => import("/videos/major-inspection/3-inlet-manifold.mp4"),
      name: "Inlet Manifold",
      top: 233,
      left: 630,
    },
    {
      id: 3,
      video: () => import("/videos/major-inspection/4-cover-coupling.mp4"),
      name: "Cover Coupling",
      top: 237,
      left: 625,
    },
    {
      id: 4,
      video: () => import("/videos/major-inspection/5-vapor-pipe.mp4"),
      name: "Vapor Pipe",
      top: 237,
      left: 585,
    },
    {
      id: 5,
      video: () => import("/videos/major-inspection/6-coupling-bolt.mp4"),
      name: "Coupling Bolt",
      top: 237,
      left: 585,
    },
    {
      id: 6,
      video: () => import("/videos/major-inspection/7-coupling-spacer.mp4"),
      name: "Coupling Spacer",
      top: 237,
      left: 500,
    },
    {
      id: 7,
      video: () =>
        import("/videos/major-inspection/8-black-patch-temperature.mp4"),
      name: "Black Patch Temperature",
      top: 235,
      left: 505,
    },
    {
      id: 8,
      video: () => import("/videos/major-inspection/9-discavity.mp4"),
      name: "Discavity",
      top: 210,
      left: 535,
    },
    {
      id: 9,
      video: () => import("/videos/major-inspection/10-flame-detector.mp4"),
      name: "Flame Detector",
      top: 225,
      left: 690,
    },
    {
      id: 10,
      video: () => import("/videos/major-inspection/11-flame-igniter.mp4"),
      name: "Flame Igniter",
      top: 236,
      left: 535,
    },
    {
      id: 11,
      video: () => import("/videos/major-inspection/12-cross-flame.mp4"),
      name: "Cross Flame",
      top: 235,
      left: 520,
    },
    {
      id: 12,
      video: () => import("/videos/major-inspection/13-cooling-pipe.mp4"),
      name: "Cooling Pipe",
      top: 236,
      left: 600,
    },
    {
      id: 13,
      video: () => import("/videos/major-inspection/14-fuel-branch-pipe.mp4"),
      name: "Fuel Branch Pipe",
      top: 230,
      left: 730,
    },
    {
      id: 14,
      video: () => import("/videos/major-inspection/15-rca-pipe.mp4"),
      name: "RCA Pipe",
      top: 236,
      left: 850,
    },
    {
      id: 15,
      video: () => import("/videos/major-inspection/16-bleed-pipe.mp4"),
      name: "Bleed Pipe",
      top: 235,
      left: 615,
    },
    {
      id: 16,
      video: () => import("/videos/major-inspection/17-exhaust-manifold.mp4"),
      name: "Exhaust Manifold",
      top: 235,
      left: 565,
    },
    {
      id: 17,
      video: () => import("/videos/major-inspection/18-top-hat.mp4"),
      name: "Top Hat",
      top: 238,
      left: 540,
    },
    {
      id: 18,
      video: () => import("/videos/major-inspection/19-fuel-nozzle.mp4"),
      name: "Fuel Nozzle",
      top: 237,
      left: 1180,
    },
    {
      id: 19,
      video: () => import("/videos/major-inspection/20-combustor-basket.mp4"),
      name: "Combustor Basket",
      top: 237,
      left: 1180,
    },
    {
      id: 20,
      video: () => import("/videos/major-inspection/21-top-hat.mp4"),
      name: "Top Hat",
      top: 238,
      left: 1180,
    },
    {
      id: 22,
      video: () => import("/videos/major-inspection/23-fuel-nozzle.mp4"),
      name: "Fuel Nozzle",
      top: 238,
      left: 1180,
    },
    {
      id: 23,
      video: () => import("/videos/major-inspection/24-turbine-cylinder.mp4"),
      name: "Turbine Cylinder",
      top: 238,
      left: 1140,
    },
    {
      id: 24,
      video: () => import("/videos/major-inspection/25-bypass-elbow.mp4"),
      name: "Bypass Elbow",
      top: 240,
      left: 1080,
    },
    {
      id: 25,
      video: () => import("/videos/major-inspection/26-transition-piece.mp4"),
      name: "Transition Piece",
      top: 240,
      left: 1135,
    },
    {
      id: 26,
      video: () => import("/videos/major-inspection/27-u-support.mp4"),
      name: "U-Support",
      top: 240,
      left: 1210,
    },
    {
      id: 27,
      video: () => import("/videos/major-inspection/28-bypass-ring.mp4"),
      name: "Bypass Ring",
      top: 240,
      left: 1140,
    },
    {
      id: 28,
      video: () => import("/videos/major-inspection/29-turbine-vane-row-1.mp4"),
      name: "Turbine Vane Row 1",
      top: 240,
      left: 1040,
    },
    {
      id: 29,
      video: () =>
        import("/videos/major-inspection/30-turbine-blade-ring-row-4.mp4"),
      name: "Turbine Blade Ring Row 4",
      top: 240,
      left: 1100,
    },
    {
      id: 30,
      video: () =>
        import("/videos/major-inspection/31-turbine-blade-ring-row-3.mp4"),
      name: "Turbine Blade Ring Row 3",
      top: 242,
      left: 675,
    },
    {
      id: 31,
      video: () =>
        import("/videos/major-inspection/32-turbine-blade-ring-row-2.mp4"),
      name: "Turbine Blade Ring Row 2",
      top: 240,
      left: 720,
    },
    {
      id: 32,
      video: () =>
        import("/videos/major-inspection/33-turbine-blade-ring-row-1.mp4"),
      name: "Turbine Blade Ring Row 1",
      top: 240,
      left: 660,
    },
    {
      id: 33,
      video: () =>
        import("/videos/major-inspection/34-turbine-seal-housing-row-2.mp4"),
      name: "Turbine Seal Housing Row 2",
      top: 240,
      left: 610,
    },
    {
      id: 34,
      video: () =>
        import("/videos/major-inspection/35-turbine-seal-housing-row-3.mp4"),
      name: "Turbine Seal Housing Row 3",
      top: 240,
      left: 610,
    },
    {
      id: 35,
      video: () =>
        import("/videos/major-inspection/36-turbine-seal-housing-row-4.mp4"),
      name: "Turbine Seal Housing Row 4",
      top: 242,
      left: 1180,
    },
    {
      id: 36,
      video: () =>
        import("/videos/major-inspection/37-rca-flexible-pipe-upper.mp4"),
      name: "RCA Flexible Pipe Upper",
      top: 238,
      left: 1030,
    },
    {
      id: 37,
      video: () =>
        import(
          "/videos/major-inspection/38-compressor-comb-cylinder-upper.mp4"
        ),
      name: "Compressor-Comb Cylinder Upper",
      top: 240,
      left: 1050,
    },
    {
      id: 38,
      video: () =>
        import(
          "/videos/major-inspection/39-compressor-blade-ring-row-1-upper.mp4"
        ),
      name: "Compressor Blade Ring Row 1 Upper",
      top: 240,
      left: 1180,
    },
    {
      id: 39,
      video: () =>
        import(
          "/videos/major-inspection/40-compressor-blade-ring-row-2-upper.mp4"
        ),
      name: "Compressor Blade Ring Row 2 Upper",
      top: 240,
      left: 1180,
    },
    {
      id: 40,
      video: () =>
        import(
          "/videos/major-inspection/41-compressor-blade-ring-row-3-upper.mp4"
        ),
      name: "Compressor Blade Ring Row 3 Upper",
      top: 240,
      left: 1060,
    },
    {
      id: 41,
      video: () => import("/videos/major-inspection/42-inlet-casing-upper.mp4"),
      name: "Inlet Casing Upper",
      top: 238,
      left: 1180,
    },
    {
      id: 42,
      video: () =>
        import("/videos/major-inspection/43-exhaust-manifold-upper.mp4"),
      name: "Exhaust Manifold Upper",
      top: 238,
      left: 1180,
    },
    {
      id: 43,
      video: () =>
        import("/videos/major-inspection/44-torque-tube-cover-upper.mp4"),
      name: "Torque Tube Cover Upper",
      top: 240,
      left: 1010,
    },
    {
      id: 44,
      video: () =>
        import(
          "/videos/major-inspection/45-seal-housing-torque-tube-cover-upper.mp4"
        ),
      name: "Seal Housing Torque Tube Cover Upper",
      top: 238,
      left: 1100,
    },
    {
      id: 45,
      video: () => import("/videos/major-inspection/46-ost-pipe.mp4"),
      name: "OST Pipe",
      top: 240,
      left: 780,
    },
    {
      id: 46,
      video: () => import("/videos/major-inspection/47-ost-cover.mp4"),
      name: "OST Cover",
      top: 238,
      left: 740,
    },
    {
      id: 47,
      video: () =>
        import("/videos/major-inspection/48-exhaust-cylinder-upper.mp4"),
      name: "Exhaust Cylinder Upper",
      top: 240,
      left: 1000,
    },
    {
      id: 48,
      video: () =>
        import("/videos/major-inspection/49-thrust-bearing-cover.mp4"),
      name: "Thrust Bearing Cover",
      top: 240,
      left: 640,
    },
    {
      id: 49,
      video: () =>
        import("/videos/major-inspection/50-thrust-bearing-upper.mp4"),
      name: "Thrust Bearing Upper",
      top: 240,
      left: 700,
    },
    {
      id: 50,
      video: () =>
        import("/videos/major-inspection/51-thrust-bearing-lower.mp4"),
      name: "Thrust Bearing Lower",
      top: 240,
      left: 630,
    },
    {
      id: 51,
      video: () => import("/videos/major-inspection/52-bearing-2-upper.mp4"),
      name: "Bearing 2 Upper",
      top: 240,
      left: 950,
    },
    {
      id: 52,
      video: () => import("/videos/major-inspection/53-bearing-1-upper.mp4"),
      name: "Bearing 1 Upper",
      top: 237,
      left: 965,
    },
    {
      id: 53,
      video: () => import("/videos/major-inspection/54-ost-device.mp4"),
      name: "OST Device",
      top: 240,
      left: 1070,
    },
    {
      id: 54,
      video: () =>
        import("/videos/major-inspection/55-turbine-compressor-rotor.mp4"),
      name: "Turbine Compressor Rotor",
      top: 242,
      left: 820,
    },
    {
      id: 55,
      video: () => import("/videos/major-inspection/56-bearing-2-lower.mp4"),
      name: "Bearing 2 Lower",
      top: 239,
      left: 1100,
    },
    {
      id: 56,
      video: () => import("/videos/major-inspection/57-bearing-1-lower.mp4"),
      name: "Bearing 1 Lower",
      top: 237,
      left: 1260,
    },
    {
      id: 57,
      video: () =>
        import(
          "/videos/major-inspection/58-turbine-blade-ring-row-2-lower.mp4"
        ),
      name: "Turbine Blade Ring Row 2 Lower",
      top: 237,
      left: 1190,
    },
    {
      id: 58,
      video: () =>
        import(
          "/videos/major-inspection/59-turbine-blade-ring-row-3-lower.mp4"
        ),
      name: "Turbine Blade Ring Row 3 Lower",
      top: 240,
      left: 1080,
    },
    {
      id: 59,
      video: () =>
        import(
          "/videos/major-inspection/60-turbine-blade-ring-row-1-lower.mp4"
        ),
      name: "Turbine Blade Ring Row 1 Lower",
      top: 240,
      left: 1150,
    },
    {
      id: 60,
      video: () =>
        import(
          "/videos/major-inspection/61-turbine-blade-ring-row-4-lower.mp4"
        ),
      name: "Turbine Blade Ring Row 4 Lower",
      top: 237,
      left: 905,
    },
    {
      id: 61,
      video: () =>
        import(
          "/videos/major-inspection/62-seal-housing-torque-cover-lower.mp4"
        ),
      name: "Seal Housing Torque Cover Lower",
      top: 240,
      left: 1160,
    },
    {
      id: 62,
      video: () =>
        import(
          "/videos/major-inspection/63-compressor-diaphragm-row-1-lower.mp4"
        ),
      name: "Compressor Diaphragm Row 1 Lower",
      top: 238,
      left: 1170,
    },
    {
      id: 63,
      video: () =>
        import(
          "/videos/major-inspection/64-compressor-diaphragm-row-2-lower.mp4"
        ),
      name: "Compressor Diaphragm Row 2 Lower",
      top: 238,
      left: 1110,
    },
    {
      id: 64,
      video: () =>
        import(
          "/videos/major-inspection/65-compressor-diaphragm-row-3-lower.mp4"
        ),
      name: "Compressor Diaphragm Row 3 Lower",
      top: 238,
      left: 1110,
    },
    {
      id: 65,
      video: () =>
        import(
          "/videos/major-inspection/66-compressor-diaphragm-row-4-lower.mp4"
        ),
      name: "Compressor Diaphragm Row 4 Lower",
      top: 238,
      left: 1050,
    },
    {
      id: 66,
      video: () =>
        import("/videos/major-inspection/67-compressor-vane-row-5-lower.mp4"),
      name: "Compressor Vane Row 5 Lower",
      top: 239,
      left: 965,
    },
    {
      id: 67,
      video: () =>
        import("/videos/major-inspection/68-compressor-vane-row-6-lower.mp4"),
      name: "Compressor Vane Row 6 Lower",
      top: 239,
      left: 910,
    },
    {
      id: 68,
      video: () =>
        import(
          "/videos/major-inspection/69-compressor-blade-ring-row-1-lower.mp4"
        ),
      name: "Compressor Blade Ring Row 1 Lower",
      top: 237,
      left: 1270,
    },
    {
      id: 69,
      video: () =>
        import(
          "/videos/major-inspection/70-compressor-blade-ring-row-2-lower.mp4"
        ),
      name: "Compressor Blade Ring Row 2 Lower",
      top: 239,
      left: 1150,
    },
    {
      id: 70,
      video: () =>
        import(
          "/videos/major-inspection/71-compressor-blade-ring-row-3-lower.mp4"
        ),
      name: "Compressor Blade Ring Row 3 Lower",
      top: 239,
      left: 1070,
    },
    {
      id: 71,
      video: () =>
        import("/videos/major-inspection/72-inlet-seal-housing-lower.mp4"),
      name: "Inlet Seal Housing Lower",
      top: 238,
      left: 1160,
    },
    {
      id: 72,
      video: () => import("/videos/major-inspection/73-igv-link-lower.mp4"),
      name: "IGV Link Lower",
      top: 237,
      left: 1120,
    },
    {
      id: 73,
      video: () => import("/videos/major-inspection/74-igv-lower.mp4"),
      name: "IGV Lower",
      top: 239,
      left: 1040,
    },
    {
      id: 74,
      video: () =>
        import(
          "/videos/major-inspection/75-turbine-ring-segment-row-1-upper.mp4"
        ),
      name: "Turbine Ring Segment Row 1 Upper",
      top: 239,
      left: 875,
    },
    {
      id: 75,
      video: () => import("/videos/turbine-inspection/34.mp4"),
      name: "",
      top: 0,
      left: 0,
    },
    {
      id: 76,
      video: () =>
        import(
          "/videos/turbine-inspection/35-turbine-ring-segment-row-1-upper.mp4"
        ),
      name: "Turbine Ring Segment Row 1 Upper",
      top: 240,
      left: 725,
    },
    {
      id: 77,
      video: () =>
        import(
          "/videos/turbine-inspection/36-turbine-ring-segment-row-2-upper.mp4"
        ),
      name: "Turbine Ring Segment Row 2 Upper",
      top: 240,
      left: 770,
    },
    {
      id: 78,
      video: () =>
        import(
          "/videos/turbine-inspection/37-turbine-vane-segment-row-2-upper.mp4"
        ),
      name: "Turbine Vane Segment Row 2 Upper",
      top: 240,
      left: 890,
    },
    {
      id: 79,
      video: () => import("/videos/turbine-inspection/38.mp4"),
      name: "",
      top: 0,
      left: 0,
    },
    {
      id: 80,
      video: () =>
        import(
          "/videos/turbine-inspection/39-turbine-vane-segment-row-2-upper.mp4"
        ),
      name: "Turbine Vane Segment Row 2 Upper",
      top: 240,
      left: 890,
    },
    {
      id: 81,
      video: () =>
        import(
          "/videos/turbine-inspection/40-turbine-ring-segment-row-2-upper.mp4"
        ),
      name: "Turbine Ring Segment Row 2 Upper",
      top: 240,
      left: 770,
    },
    {
      id: 82,
      video: () =>
        import(
          "/videos/turbine-inspection/41-turbine-ring-segment-row-3-upper.mp4"
        ),
      name: "Turbine Ring Segment Row 3 Upper",
      top: 241,
      left: 680,
    },
    {
      id: 83,
      video: () =>
        import(
          "/videos/turbine-inspection/42-turbine-vane-segment-row-3-upper.mp4"
        ),
      name: "Turbine Vane Segment Row 3 Upper",
      top: 241,
      left: 890,
    },
    {
      id: 84,
      video: () => import("/videos/turbine-inspection/43.mp4"),
      name: "",
      top: 0,
      left: 0,
    },
    {
      id: 85,
      video: () =>
        import(
          "/videos/turbine-inspection/44-turbine-vane-segment-row-3-upper.mp4"
        ),
      name: "Turbine Vane Segment Row 3 Upper",
      top: 241,
      left: 890,
    },
    {
      id: 86,
      video: () =>
        import(
          "/videos/turbine-inspection/45-turbine-ring-segment-row-3-upper.mp4"
        ),
      name: "Turbine Ring Segment Row 3 Upper",
      top: 241,
      left: 690,
    },
    {
      id: 87,
      video: () =>
        import(
          "/videos/turbine-inspection/46-turbine-ring-segment-row-4-upper.mp4"
        ),
      name: "Turbine Ring Segment Row 4 Upper",
      top: 241,
      left: 690,
    },
    {
      id: 88,
      video: () =>
        import(
          "/videos/turbine-inspection/47-turbine-vane-segment-row-4-upper.mp4"
        ),
      name: "Turbine Vane Segment Row 4 Upper",
      top: 241,
      left: 890,
    },
    {
      id: 89,
      video: () => import("/videos/turbine-inspection/48.mp4"),
      name: "",
      top: 0,
      left: 0,
    },
    {
      id: 90,
      video: () =>
        import(
          "/videos/turbine-inspection/49-turbine-vane-segment-row-4-upper.mp4"
        ),
      name: "Turbine Vane Segment Row 4 Upper",
      top: 241,
      left: 890,
    },
    {
      id: 91,
      video: () =>
        import(
          "/videos/turbine-inspection/50-turbine-ring-segment-row-4-upper.mp4"
        ),
      name: "Turbine Ring Segment Row 4 Upper",
      top: 241,
      left: 690,
    },
    {
      id: 92,
      video: () =>
        import(
          "/videos/turbine-inspection/51-turbine-ring-segment-row-1-lower.mp4"
        ),
      name: "Turbine Ring Segment Row 1 Lower",
      top: 241,
      left: 690,
    },
    {
      id: 93,
      video: () => import("/videos/turbine-inspection/52.mp4"),
      name: "",
      top: 0,
      left: 0,
    },
    {
      id: 94,
      video: () =>
        import(
          "/videos/turbine-inspection/53-turbine-ring-segment-row-1-lower.mp4"
        ),
      name: "Turbine Ring Segment Row 1 Lower",
      top: 241,
      left: 690,
    },
    {
      id: 95,
      video: () =>
        import(
          "/videos/turbine-inspection/54-turbine-seal-housing-row-2-lower.mp4"
        ),
      name: "Turbine Seal Housing Row 2 Lower",
      top: 241,
      left: 930,
    },
    {
      id: 96,
      video: () =>
        import(
          "/videos/turbine-inspection/55-turbine-ring-segment-row-2-lower.mp4"
        ),
      name: "Turbine Ring Segment Row 2 Lower",
      top: 241,
      left: 730,
    },
    {
      id: 97,
      video: () =>
        import(
          "/videos/turbine-inspection/56-turbine-vane-segment-row-2-lower.mp4"
        ),
      name: "Turbine Vane Segment Row 2 Lower",
      top: 240,
      left: 810,
    },
    {
      id: 98,
      video: () => import("/videos/turbine-inspection/57.mp4"),
      name: "",
      top: 0,
      left: 0,
    },
    {
      id: 99,
      video: () =>
        import(
          "/videos/turbine-inspection/58-turbine-vane-segment-row-2-lower.mp4"
        ),
      name: "Turbine Vane Segment Row 2 Lower",
      top: 240,
      left: 810,
    },
    {
      id: 100,
      video: () =>
        import(
          "/videos/turbine-inspection/59-turbine-ring-segment-row-2-lower.mp4"
        ),
      name: "Turbine Ring Segment Row 2 Lower",
      top: 240,
      left: 730,
    },
    {
      id: 101,
      video: () =>
        import(
          "/videos/turbine-inspection/60-turbine-seal-housing-row-2-lower.mp4"
        ),
      name: "Turbine Seal Housing Row 2 Lower",
      top: 241,
      left: 935,
    },
    {
      id: 102,
      video: () =>
        import(
          "/videos/turbine-inspection/61-turbine-seal-housing-row-3-lower.mp4"
        ),
      name: "Turbine Seal Housing Row 3 Lower",
      top: 242,
      left: 1110,
    },
    {
      id: 103,
      video: () =>
        import(
          "/videos/turbine-inspection/62-turbine-ring-segment-row-3-lower.mp4"
        ),
      name: "Turbine Ring Segment Row 3 Lower",
      top: 241,
      left: 860,
    },
    {
      id: 104,
      video: () =>
        import(
          "/videos/turbine-inspection/63-turbine-vane-segment-row-3-lower.mp4"
        ),
      name: "Turbine Vane Segment Row 3 Lower",
      top: 241,
      left: 1005,
    },
    {
      id: 105,
      video: () => import("/videos/turbine-inspection/64.mp4"),
      name: "",
      top: 0,
      left: 0,
    },
    {
      id: 106,
      video: () =>
        import(
          "/videos/turbine-inspection/65-turbine-vane-segment-row-3-lower.mp4"
        ),
      name: "Turbine Vane Segment Row 3 Lower",
      top: 241,
      left: 1010,
    },
    {
      id: 107,
      video: () =>
        import(
          "/videos/turbine-inspection/66-turbine-ring-segment-row-3-lower.mp4"
        ),
      name: "Turbine Ring Segment Row 3 Lower",
      top: 241,
      left: 860,
    },
    {
      id: 108,
      video: () =>
        import(
          "/videos/turbine-inspection/67-turbine-seal-housing-row-3-lower.mp4"
        ),
      name: "Turbine Seal Housing Row 3 Lower",
      top: 242,
      left: 1110,
    },
    {
      id: 109,
      video: () =>
        import(
          "/videos/turbine-inspection/68-turbine-seal-housing-row-4-lower.mp4"
        ),
      name: "Turbine Seal Housing Row 4 Lower",
      top: 241,
      left: 1090,
    },
    {
      id: 110,
      video: () =>
        import(
          "/videos/add-scope/ti/turbine-section/8-turbine-ring-segment-row-4-lower.mp4"
        ),
      name: "Ring Segment Row 4 Lower",
      top: 240,
      left: 750,
    },
    {
      id: 111,
      video: () =>
        import(
          "/videos/add-scope/ti/turbine-section/9-turbine-vane-segment-row-4-lower.mp4"
        ),
      name: "Vane Segment Row 4 Lower",
      top: 240,
      left: 940,
    },
    {
      id: 112,
      video: () => import("/videos/add-scope/ti/turbine-section/10.mp4"),
      name: "",
      top: 0,
      left: 0,
    },
    {
      id: 113,
      video: () =>
        import(
          "/videos/add-scope/ti/turbine-section/11-turbine-vane-segment-row-4-lower.mp4"
        ),
      name: "Vane Segment Row 4 Lower",
      top: 241,
      left: 940,
    },
    {
      id: 114,
      video: () =>
        import(
          "/videos/add-scope/ti/turbine-section/12-turbine-ring-segment-row-4-lower.mp4"
        ),
      name: "Ring Segment Row 4 Lower",
      top: 240,
      left: 750,
    },
    {
      id: 115,
      video: () =>
        import(
          "/videos/add-scope/ti/turbine-section/13-turbine-seal-housing-row-4-lower.mp4"
        ),
      name: "Seal Housing Row 4 Lower",
      top: 241,
      left: 1140,
    },
    {
      id: 116,
      video: () =>
        import(
          "/videos/major-inspection/117-compressor-diaphragm-row-1-upper.mp4"
        ),
      name: "Compressor Diaphragm Row 1 Upper",
      top: 239,
      left: 750,
    },
    {
      id: 117,
      video: () =>
        import(
          "/videos/major-inspection/118-compressor-diaphragm-row-2-upper.mp4"
        ),
      name: "Compressor Diaphragm Row 2 Upper",
      top: 239,
      left: 630,
    },
    {
      id: 118,
      video: () =>
        import(
          "/videos/major-inspection/119-compressor-diaphragm-row-3-upper.mp4"
        ),
      name: "Compressor Diaphragm Row 3 Upper",
      top: 239,
      left: 550,
    },
    {
      id: 119,
      video: () =>
        import(
          "/videos/major-inspection/120-compressor-diaphragm-row-4-upper.mp4"
        ),
      name: "Compressor Diaphragm Row 4 Upper",
      top: 239,
      left: 640,
    },
    {
      id: 120,
      video: () =>
        import(
          "/videos/major-inspection/121-compressor-diaphragm-row-5-upper.mp4"
        ),
      name: "Compressor Diaphragm Row 5 Upper",
      top: 239,
      left: 580,
    },
    {
      id: 121,
      video: () =>
        import(
          "/videos/major-inspection/122-compressor-diaphragm-row-6-upper.mp4"
        ),
      name: "Compressor Diaphragm Row 6 Upper",
      top: 239,
      left: 520,
    },
    {
      id: 122,
      video: () =>
        import(
          "/videos/major-inspection/123-compressor-diaphragm-row-1-upper.mp4"
        ),
      name: "Compressor Diaphragm Row 1 Upper",
      top: 240,
      left: 900,
    },
    {
      id: 123,
      video: () =>
        import(
          "/videos/major-inspection/124-compressor-diaphragm-row-2-upper.mp4"
        ),
      name: "Compressor Diaphragm Row 2 Upper",
      top: 240,
      left: 790,
    },
    {
      id: 124,
      video: () =>
        import(
          "/videos/major-inspection/125-compressor-diaphragm-row-3-upper.mp4"
        ),
      name: "Compressor Diaphragm Row 3 Upper",
      top: 241,
      left: 700,
    },
    {
      id: 125,
      video: () =>
        import(
          "/videos/major-inspection/126-compressor-diaphragm-row-4-upper.mp4"
        ),
      name: "Compressor Diaphragm Row 4 Upper",
      top: 241,
      left: 640,
    },
    {
      id: 126,
      video: () =>
        import(
          "/videos/major-inspection/127-compressor-diaphragm-row-5-upper.mp4"
        ),
      name: "Compressor Diaphragm Row 5 Upper",
      top: 241,
      left: 570,
    },
    {
      id: 127,
      video: () =>
        import(
          "/videos/major-inspection/128-compressor-diaphragm-row-6-upper.mp4"
        ),
      name: "Compressor Diaphragm Row 6 Upper",
      top: 240,
      left: 520,
    },
    {
      id: 128,
      video: () =>
        import(
          "/videos/major-inspection/129-compressor-diaphragm-row-15-lower.mp4"
        ),
      name: "Compressor Diaphragm Row 15 Lower",
      top: 241,
      left: 990,
    },
    {
      id: 129,
      video: () =>
        import(
          "/videos/major-inspection/130-compressor-diaphragm-row-16-lower.mp4"
        ),
      name: "Compressor Diaphragm Row 16 Lower",
      top: 241,
      left: 985,
    },
    {
      id: 130,
      video: () => import("/videos/major-inspection/131-ogv-lower.mp4"),
      name: "OGV Lower",
      top: 239,
      left: 970,
    },
    {
      id: 131,
      video: () => import("/videos/major-inspection/132.mp4"),
      name: "",
      top: 0,
      left: 0,
    },
    {
      id: 132,
      video: () => import("/videos/major-inspection/133-ogv-lower.mp4"),
      name: "OGV Lower",
      top: 239,
      left: 970,
    },
    {
      id: 133,
      video: () =>
        import(
          "/videos/major-inspection/134-compressor-diaphragm-row-17-lower.mp4"
        ),
      name: "Compressor Diaphragm Row 17 Lower",
      top: 243,
      left: 1140,
    },
    {
      id: 134,
      video: () =>
        import(
          "/videos/major-inspection/135-compressor-diaphragm-row-16-lower.mp4"
        ),
      name: "Compressor Diaphragm Row 16 Lower",
      top: 241,
      left: 980,
    },
    {
      id: 135,
      video: () =>
        import(
          "/videos/major-inspection/136-compressor-diaphragm-row-15-lower.mp4"
        ),
      name: "Compressor Diaphragm Row 15 Lower",
      top: 241,
      left: 985,
    },
    {
      id: 136,
      video: () =>
        import(
          "/videos/major-inspection/137-compressor-diaphragm-row-14-lower.mp4"
        ),
      name: "Compressor Diaphragm Row 14 Lower",
      top: 241,
      left: 1010,
    },
    {
      id: 137,
      video: () =>
        import(
          "/videos/major-inspection/138-compressor-diaphragm-row-13-lower.mp4"
        ),
      name: "Compressor Diaphragm Row 13 Lower",
      top: 239,
      left: 1010,
    },
    {
      id: 138,
      video: () =>
        import(
          "/videos/major-inspection/139-compressor-diaphragm-row-12-lower.mp4"
        ),
      name: "Compressor Diaphragm Row 12 Lower",
      top: 240,
      left: 1090,
    },
    {
      id: 139,
      video: () => import("/videos/major-inspection/140.mp4"),
      name: "",
      top: 0,
      left: 0,
    },
    {
      id: 140,
      video: () =>
        import(
          "/videos/major-inspection/141-compressor-diaphragm-row-12-lower.mp4"
        ),
      name: "Compressor Diaphragm Row 12 Lower",
      top: 240,
      left: 1090,
    },
    {
      id: 141,
      video: () =>
        import(
          "/videos/major-inspection/142-compressor-diaphragm-row-13-lower.mp4"
        ),
      name: "Compressor Diaphragm Row 13 Lower",
      top: 240,
      left: 1010,
    },
    {
      id: 142,
      video: () =>
        import(
          "/videos/major-inspection/143-compressor-diaphragm-row-12-lower.mp4"
        ),
      name: "Compressor Diaphragm Row 12 Lower",
      top: 239,
      left: 970,
    },
    {
      id: 143,
      video: () =>
        import(
          "/videos/major-inspection/144-compressor-diaphragm-row-11-lower.mp4"
        ),
      name: "Compressor Diaphragm Row 11 Lower",
      top: 241,
      left: 1205,
    },
    {
      id: 144,
      video: () =>
        import(
          "/videos/major-inspection/145-compressor-diaphragm-row-10-lower.mp4"
        ),
      name: "Compressor Diaphragm Row 10 Lower",
      top: 239,
      left: 1205,
    },
    {
      id: 145,
      video: () =>
        import(
          "/videos/major-inspection/146-compressor-diaphragm-row-9-lower.mp4"
        ),
      name: "Compressor Diaphragm Row 9 Lower",
      top: 239,
      left: 1205,
    },
    {
      id: 146,
      video: () =>
        import(
          "/videos/major-inspection/147-compressor-diaphragm-row-8-lower.mp4"
        ),
      name: "Compressor Diaphragm Row 8 Lower",
      top: 237,
      left: 1205,
    },
    {
      id: 147,
      video: () =>
        import(
          "/videos/major-inspection/148-compressor-diaphragm-row-7-lower.mp4"
        ),
      name: "Compressor Diaphragm Row 7 Lower",
      top: 237,
      left: 1200,
    },
    {
      id: 148,
      video: () => import("/videos/major-inspection/149.mp4"),
      name: "",
      top: 0,
      left: 0,
    },
    {
      id: 149,
      video: () =>
        import(
          "/videos/major-inspection/150-compressor-diaphragm-row-7-lower.mp4"
        ),
      name: "Compressor Diaphragm Row 7 Lower",
      top: 237,
      left: 1190,
    },
    {
      id: 150,
      video: () =>
        import(
          "/videos/major-inspection/151-compressor-diaphragm-row-8-lower.mp4"
        ),
      name: "Compressor Diaphragm Row 8 Lower",
      top: 237,
      left: 1205,
    },
    {
      id: 151,
      video: () =>
        import(
          "/videos/major-inspection/152-compressor-diaphragm-row-9-lower.mp4"
        ),
      name: "Compressor Diaphragm Row 9 Lower",
      top: 238,
      left: 1205,
    },
    {
      id: 152,
      video: () =>
        import(
          "/videos/major-inspection/153-compressor-diaphragm-row-10-lower.mp4"
        ),
      name: "Compressor Diaphragm Row 10 Lower",
      top: 238,
      left: 1205,
    },
    {
      id: 153,
      video: () =>
        import(
          "/videos/major-inspection/154-compressor-diaphragm-row-11-lower.mp4"
        ),
      name: "Compressor Diaphragm Row 11 Lower",
      top: 240,
      left: 1205,
    },
    {
      id: 154,
      video: () =>
        import(
          "/videos/major-inspection/155-compressor-diaphragm-row-15-upper.mp4"
        ),
      name: "Compressor Diaphragm Row 15 Upper",
      top: 241,
      left: 1210,
    },
    {
      id: 155,
      video: () =>
        import(
          "/videos/major-inspection/156-compressor-diaphragm-row-16-upper.mp4"
        ),
      name: "Compressor Diaphragm Row 16 Upper",
      top: 240,
      left: 1195,
    },
    {
      id: 156,
      video: () =>
        import(
          "/videos/major-inspection/157-compressor-diaphragm-row-17-upper.mp4"
        ),
      name: "Compressor Diaphragm Row 17 Upper",
      top: 240,
      left: 1210,
    },
    {
      id: 157,
      video: () => import("/videos/major-inspection/158-ogv-upper.mp4"),
      name: "OGV Upper",
      top: 237,
      left: 1210,
    },
    {
      id: 158,
      video: () => import("/videos/major-inspection/159.mp4"),
      name: "",
      top: 0,
      left: 0,
    },
    {
      id: 159,
      video: () => import("/videos/major-inspection/160-ogv-upper.mp4"),
      name: "OGV Upper",
      top: 237,
      left: 1210,
    },
    {
      id: 160,
      video: () =>
        import(
          "/videos/major-inspection/161-compressor-diaphragm-row-17-upper.mp4"
        ),
      name: "Compressor Diaphragm Row 17 Upper",
      top: 240,
      left: 1210,
    },
    {
      id: 161,
      video: () =>
        import(
          "/videos/major-inspection/162-compressor-diaphragm-row-16-upper.mp4"
        ),
      name: "Compressor Diaphragm Row 16 Upper",
      top: 240,
      left: 1195,
    },
    {
      id: 162,
      video: () =>
        import(
          "/videos/major-inspection/163-compressor-diaphragm-row-14-upper.mp4"
        ),
      name: "Compressor Diaphragm Row 14 Upper",
      top: 238,
      left: 1090,
    },
    {
      id: 163,
      video: () =>
        import(
          "/videos/major-inspection/164-compressor-diaphragm-row-13-upper.mp4"
        ),
      name: "Compressor Diaphragm Row 13 Upper",
      top: 241,
      left: 1090,
    },
    {
      id: 164,
      video: () =>
        import(
          "/videos/major-inspection/165-compressor-diaphragm-row-12-upper.mp4"
        ),
      name: "Compressor Diaphragm Row 12 Upper",
      top: 240,
      left: 1090,
    },
    {
      id: 165,
      video: () => import("/videos/major-inspection/166.mp4"),
      name: "",
      top: 0,
      left: 0,
    },
    {
      id: 166,
      video: () =>
        import(
          "/videos/major-inspection/167-compressor-diaphragm-row-12-upper.mp4"
        ),
      name: "Compressor Diaphragm Row 12 Upper",
      top: 241,
      left: 1090,
    },
    {
      id: 167,
      video: () =>
        import(
          "/videos/major-inspection/168-compressor-diaphragm-row-13-upper.mp4"
        ),
      name: "Compressor Diaphragm Row 13 Upper",
      top: 241,
      left: 1090,
    },
    {
      id: 168,
      video: () =>
        import(
          "/videos/major-inspection/169-compressor-diaphragm-row-14-upper.mp4"
        ),
      name: "Compressor Diaphragm Row 14 Upper",
      top: 238,
      left: 1090,
    },
    {
      id: 169,
      video: () =>
        import(
          "/videos/major-inspection/170-compressor-diaphragm-row-11-upper.mp4"
        ),
      name: "Compressor Diaphragm Row 11 Upper",
      top: 240,
      left: 1100,
    },
    {
      id: 170,
      video: () =>
        import(
          "/videos/major-inspection/171-compressor-diaphragm-row-10-upper.mp4"
        ),
      name: "Compressor Diaphragm Row 10 Upper",
      top: 240,
      left: 1090,
    },
    {
      id: 171,
      video: () =>
        import(
          "/videos/major-inspection/172-compressor-diaphragm-row-9-upper.mp4"
        ),
      name: "Compressor Diaphragm Row 9 Upper",
      top: 238,
      left: 1090,
    },
    {
      id: 172,
      video: () =>
        import(
          "/videos/major-inspection/173-compressor-diaphragm-row-8-upper.mp4"
        ),
      name: "Compressor Diaphragm Row 8 Upper",
      top: 241,
      left: 1160,
    },
    {
      id: 173,
      video: () =>
        import(
          "/videos/major-inspection/174-compressor-diaphragm-row-7-upper.mp4"
        ),
      name: "Compressor Diaphragm Row 7 Upper",
      top: 241,
      left: 1160,
    },
    {
      id: 174,
      video: () => import("/videos/major-inspection/175.mp4"),
      name: "",
      top: 0,
      left: 0,
    },
    {
      id: 175,
      video: () =>
        import(
          "/videos/major-inspection/176-compressor-diaphragm-row-7-upper.mp4"
        ),
      name: "Compressor Diaphragm Row 7 Upper",
      top: 241,
      left: 1155,
    },
    {
      id: 176,
      video: () =>
        import(
          "/videos/major-inspection/177-compressor-diaphragm-row-8-upper.mp4"
        ),
      name: "Compressor Diaphragm Row 8 Upper",
      top: 241,
      left: 1160,
    },
    {
      id: 177,
      video: () =>
        import(
          "/videos/major-inspection/178-compressor-diaphragm-row-9-upper.mp4"
        ),
      name: "Compressor Diaphragm Row 9 Upper",
      top: 238,
      left: 1090,
    },
    {
      id: 178,
      video: () =>
        import(
          "/videos/major-inspection/179-compressor-diaphragm-row-10-upper.mp4"
        ),
      name: "Compressor Diaphragm Row 10 Upper",
      top: 239,
      left: 1090,
    },
    {
      id: 179,
      video: () =>
        import(
          "/videos/major-inspection/180-compressor-diaphragm-row-11-upper.mp4"
        ),
      name: "Compressor Diaphragm Row 11 Upper",
      top: 240,
      left: 1100,
    },
    {
      id: 180,
      video: () => import("/videos/major-inspection/181-igv-link.mp4"),
      name: "IGV Link",
      top: 241,
      left: 840,
    },
    {
      id: 181,
      video: () =>
        import(
          "/videos/add-scope/ci/compressor-section/6-seal-housing-upper.mp4"
        ),
      name: "Seal Housing Upper",
      top: 235,
      left: 510,
    },
    {
      id: 182,
      video: () =>
        import("/videos/add-scope/ci/compressor-section/7-igv-upper.mp4"),
      name: "IGV Upper",
      top: 235,
      left: 570,
    },
    {
      id: 183,
      video: () =>
        import("/videos/add-scope/ci/compressor-section/54-seal-housing.mp4"),
      name: "Seal Housing Upper",
      top: 236,
      left: 515,
    },
    {
      id: 184,
      video: () =>
        import("/videos/add-scope/ci/compressor-section/55-igv-link.mp4"),
      name: "IGV Link",
      top: 233,
      left: 810,
    },
    {
      id: 185,
      video: () =>
        import("/videos/major-inspection/186-turbine-blade-row-4.mp4"),
      name: "Turbine Blade Row 4",
      top: 238,
      left: 890,
    },
    {
      id: 186,
      video: () =>
        import("/videos/major-inspection/187-turbine-blade-row-3.mp4"),
      name: "Turbine Blade Row 3",
      top: 238,
      left: 990,
    },
    {
      id: 187,
      video: () =>
        import("/videos/major-inspection/188-turbine-blade-row-2.mp4"),
      name: "Turbine Blade Row 2",
      top: 238,
      left: 1090,
    },
    {
      id: 188,
      video: () =>
        import("/videos/major-inspection/189-turbine-blade-row-1.mp4"),
      name: "Turbine Blade Row 1",
      top: 238,
      left: 1175,
    },
    {
      id: 189,
      video: () =>
        import("/videos/major-inspection/190-turbine-blade-row-4.mp4"),
      name: "Turbine Blade Row 4",
      top: 238,
      left: 895,
    },
    {
      id: 190,
      video: () =>
        import("/videos/major-inspection/191-turbine-blade-row-3.mp4"),
      name: "Turbine Blade Row 3",
      top: 238,
      left: 990,
    },
    {
      id: 191,
      video: () =>
        import("/videos/major-inspection/192-turbine-blade-row-2.mp4"),
      name: "Turbine Blade Row 2",
      top: 237,
      left: 1090,
    },
    {
      id: 192,
      video: () =>
        import("/videos/major-inspection/193-turbine-blade-row-1.mp4"),
      name: "Turbine Blade Row 1",
      top: 237,
      left: 1180,
    },
    {
      id: 193,
      video: () =>
        import("/videos/major-inspection/194-compressor-blade-row-1.mp4"),
      name: "Compressor Blade Row 1",
      top: 238,
      left: 1310,
    },
    {
      id: 194,
      video: () =>
        import("/videos/major-inspection/195-compressor-blade-row-2.mp4"),
      name: "Compressor Blade Row 2",
      top: 236,
      left: 1100,
    },
    {
      id: 195,
      video: () =>
        import("/videos/major-inspection/196-compressor-blade-row-3.mp4"),
      name: "Compressor Blade Row 3",
      top: 237,
      left: 940,
    },
    {
      id: 196,
      video: () =>
        import("/videos/major-inspection/197-compressor-blade-row-4.mp4"),
      name: "Compressor Blade Row 4",
      top: 237,
      left: 830,
    },
    {
      id: 197,
      video: () =>
        import("/videos/major-inspection/198-compressor-blade-row-5.mp4"),
      name: "Compressor Blade Row 5",
      top: 237,
      left: 730,
    },
    {
      id: 198,
      video: () =>
        import("/videos/major-inspection/199-compressor-blade-row-6.mp4"),
      name: "Compressor Blade Row 6",
      top: 238,
      left: 620,
    },
    {
      id: 199,
      video: () => import("/videos/major-inspection/200.mp4"),
      name: "",
      top: 0,
      left: 0,
    },
    {
      id: 200,
      video: () =>
        import("/videos/major-inspection/201-compressor-blade-row-6.mp4"),
      name: "Compressor Blade Row 6",
      top: 238,
      left: 620,
    },
    {
      id: 201,
      video: () =>
        import("/videos/major-inspection/202-compressor-blade-row-5.mp4"),
      name: "Compressor Blade Row 5",
      top: 238,
      left: 730,
    },
    {
      id: 202,
      video: () =>
        import("/videos/major-inspection/203-compressor-blade-row-4.mp4"),
      name: "Compressor Blade Row 4",
      top: 238,
      left: 830,
    },
    {
      id: 203,
      video: () =>
        import("/videos/major-inspection/204-compressor-blade-row-3.mp4"),
      name: "Compressor Blade Row 3",
      top: 237,
      left: 940,
    },
    {
      id: 204,
      video: () =>
        import("/videos/major-inspection/205-compressor-blade-row-2.mp4"),
      name: "Compressor Blade Row 2",
      top: 237,
      left: 1100,
    },
    {
      id: 205,
      video: () =>
        import("/videos/major-inspection/206-compressor-blade-row-1.mp4"),
      name: "Compressor Blade Row 1",
      top: 238,
      left: 1310,
    },
    {
      id: 206,
      video: () => import("/videos/major-inspection/207-igv-lower.mp4"),
      name: "IGV Lower",
      top: 238,
      left: 1185,
    },
    {
      id: 207,
      video: () => import("/videos/major-inspection/208-igv-link-lower.mp4"),
      name: "IGV Link Lower",
      top: 238,
      left: 1185,
    },
    {
      id: 208,
      video: () =>
        import("/videos/major-inspection/209-inlet-seal-housing-lower.mp4"),
      name: "Inlet Seal Housing Lower",
      top: 238,
      left: 1185,
    },
    {
      id: 209,
      video: () =>
        import(
          "/videos/major-inspection/210-compressor-diaphragm-row-6-lower.mp4"
        ),
      name: "Compressor Diaphragm Row 6 Lower",
      top: 238,
      left: 1185,
    },
    {
      id: 210,
      video: () =>
        import(
          "/videos/major-inspection/211-compressor-diaphragm-row-5-lower.mp4"
        ),
      name: "Compressor Diaphragm Row 5 Lower",
      top: 238,
      left: 1120,
    },
    {
      id: 211,
      video: () =>
        import(
          "/videos/major-inspection/212-compressor-diaphragm-row-4-lower.mp4"
        ),
      name: "Compressor Diaphragm Row 4 Lower",
      top: 238,
      left: 1120,
    },
    {
      id: 212,
      video: () =>
        import(
          "/videos/major-inspection/213-compressor-diaphragm-row-3-lower.mp4"
        ),
      name: "Compressor Diaphragm Row 3 Lower",
      top: 238,
      left: 1120,
    },
    {
      id: 213,
      video: () =>
        import(
          "/videos/major-inspection/214-compressor-diaphragm-row-2-lower.mp4"
        ),
      name: "Compressor Diaphragm Row 2 Lower",
      top: 238,
      left: 1120,
    },
    {
      id: 214,
      video: () =>
        import(
          "/videos/major-inspection/215-compressor-diaphragm-row-1-lower.mp4"
        ),
      name: "Compressor Diaphragm Row 1 Lower",
      top: 238,
      left: 1120,
    },
    {
      id: 215,
      video: () =>
        import(
          "/videos/major-inspection/216-compressor-blade-ring-row-3-lower.mp4"
        ),
      name: "Compressor Blade Ring Row 3 Lower",
      top: 238,
      left: 1120,
    },
    {
      id: 216,
      video: () =>
        import(
          "/videos/major-inspection/217-compressor-blade-ring-row-2-lower.mp4"
        ),
      name: "Compressor Blade Ring Row 2 Lower",
      top: 238,
      left: 1120,
    },
    {
      id: 217,
      video: () =>
        import(
          "/videos/major-inspection/218-compressor-blade-ring-row-1-lower.mp4"
        ),
      name: "Compressor Blade Ring Row 1 Lower",
      top: 238,
      left: 1120,
    },
    {
      id: 218,
      video: () =>
        import(
          "/videos/major-inspection/219-seal-housing-torque-tube-cover-lower.mp4"
        ),
      name: "Seal Housing Torque Tube Cover Lower",
      top: 238,
      left: 665,
    },
    {
      id: 219,
      video: () =>
        import(
          "/videos/major-inspection/220-turbine-blade-ring-row-4-lower.mp4"
        ),
      name: "Turbine Blade Ring Row 4 Lower",
      top: 238,
      left: 870,
    },
    {
      id: 220,
      video: () =>
        import(
          "/videos/major-inspection/221-turbine-blade-ring-row-1-lower.mp4"
        ),
      name: "Turbine Blade Ring Row 1 Lower",
      top: 238,
      left: 1270,
    },
    {
      id: 221,
      video: () =>
        import(
          "/videos/major-inspection/222-turbine-blade-ring-row-2-lower.mp4"
        ),
      name: "Turbine Blade Ring Row 2 Lower",
      top: 238,
      left: 1270,
    },
    {
      id: 222,
      video: () =>
        import(
          "/videos/major-inspection/223-turbine-blade-ring-row-2-lower.mp4"
        ),
      name: "Turbine Blade Ring Row 2 Lower",
      top: 239,
      left: 940,
    },
    {
      id: 223,
      video: () => import("/videos/major-inspection/224-bearing-1-lower.mp4"),
      name: "Bearing 1 Lower",
      top: 238,
      left: 1290,
    },
    {
      id: 224,
      video: () => import("/videos/major-inspection/225-bearing-2-lower.mp4"),
      name: "Bearing 2 Lower",
      top: 238,
      left: 1290,
    },
    {
      id: 225,
      video: () =>
        import("/videos/major-inspection/226-turbine-compressor-rotor.mp4"),
      name: "Turbine Compressor Rotor",
      top: 238,
      left: 760,
    },
    {
      id: 226,
      video: () => import("/videos/major-inspection/227-bearing-2-upper.mp4"),
      name: "Bearing 2 Upper",
      top: 239,
      left: 910,
    },
    {
      id: 227,
      video: () => import("/videos/major-inspection/228-bearing-1-upper.mp4"),
      name: "Bearing 1 Upper",
      top: 238,
      left: 1070,
    },
    {
      id: 228,
      video: () =>
        import("/videos/major-inspection/229-exhaust-cylinder-upper.mp4"),
      name: "Exhaust Cylinder Upper",
      top: 237,
      left: 1070,
    },
    {
      id: 229,
      video: () =>
        import(
          "/videos/major-inspection/230-seal-housing-torque-cover-upper.mp4"
        ),
      name: "Seal Housing Torque Cover Upper",
      top: 238,
      left: 1110,
    },
    {
      id: 230,
      video: () =>
        import("/videos/major-inspection/231-inlet-casing-upper.mp4"),
      name: "Inlet Casing Upper",
      top: 238,
      left: 1290,
    },
    {
      id: 231,
      video: () =>
        import("/videos/major-inspection/232-torque-tube-cover-upper.mp4"),
      name: "Torque Tube Cover Upper",
      top: 240,
      left: 1110,
    },
    {
      id: 232,
      video: () =>
        import(
          "/videos/major-inspection/233-compressor-blade-ring-row-1-upper.mp4"
        ),
      name: "Compressor Blade Ring Row 1 Upper",
      top: 239,
      left: 1320,
    },
    {
      id: 233,
      video: () =>
        import(
          "/videos/major-inspection/234-compressor-blade-ring-row-2-upper.mp4"
        ),
      name: "Compressor Blade Ring Row 2 Upper",
      top: 239,
      left: 1160,
    },
    {
      id: 234,
      video: () =>
        import(
          "/videos/major-inspection/235-compressor-blade-ring-row-3-upper.mp4"
        ),
      name: "Compressor Blade Ring Row 3 Upper",
      top: 239,
      left: 1180,
    },
    {
      id: 235,
      video: () =>
        import(
          "/videos/major-inspection/236-compressor-comb-cylinder-upper.mp4"
        ),
      name: "Compressor-comb Cylinder Upper",
      top: 240,
      left: 1270,
    },
    {
      id: 236,
      video: () =>
        import("/videos/major-inspection/237-rca-flexible-pipe-upper.mp4"),
      name: "RCA Flexible Pipe Upper",
      top: 239,
      left: 1210,
    },
    {
      id: 237,
      video: () =>
        import(
          "/videos/major-inspection/238-turbine-seal-housing-row-2-upper.mp4"
        ),
      name: "Turbine Seal Housing Row 2 Upper",
      top: 239,
      left: 1210,
    },
    {
      id: 238,
      video: () =>
        import(
          "/videos/major-inspection/239-turbine-seal-housing-row-3-upper.mp4"
        ),
      name: "Turbine Seal Housing Row 3 Upper",
      top: 239,
      left: 1180,
    },
    {
      id: 239,
      video: () =>
        import(
          "/videos/major-inspection/240-turbine-seal-housing-row-4-upper.mp4"
        ),
      name: "Turbine Seal Housing Row 4 Upper",
      top: 239,
      left: 1210,
    },
    {
      id: 240,
      video: () =>
        import(
          "/videos/major-inspection/241-turbine-blade-ring-row-4-upper.mp4"
        ),
      name: "Turbine Blade Ring Row 4 Upper",
      top: 239,
      left: 1210,
    },
    {
      id: 241,
      video: () =>
        import(
          "/videos/major-inspection/242-turbine-blade-ring-row-3-upper.mp4"
        ),
      name: "Turbine Blade Ring Row 3 Upper",
      top: 239,
      left: 1210,
    },
    {
      id: 242,
      video: () =>
        import(
          "/videos/major-inspection/243-turbine-blade-ring-row-2-upper.mp4"
        ),
      name: "Turbine Blade Ring Row 2 Upper",
      top: 239,
      left: 1320,
    },
    {
      id: 243,
      video: () =>
        import(
          "/videos/major-inspection/244-turbine-blade-ring-row-1-upper.mp4"
        ),
      name: "Turbine Blade Ring Row 1 Upper",
      top: 239,
      left: 1320,
    },
    {
      id: 244,
      video: () =>
        import("/videos/major-inspection/245-turbine-vane-segment-row-1.mp4"),
      name: "Turbine Vane Segment Row 1",
      top: 239,
      left: 1420,
    },
    {
      id: 245,
      video: () => import("/videos/major-inspection/246-bypass-ring-upper.mp4"),
      name: "Bypass Ring Upper",
      top: 239,
      left: 1540,
    },
    {
      id: 246,
      video: () => import("/videos/major-inspection/247-ost-device.mp4"),
      name: "OST Device",
      top: 239,
      left: 1260,
    },
    {
      id: 247,
      video: () => import("/videos/major-inspection/248-ost-cover.mp4"),
      name: "OST Cover",
      top: 239,
      left: 1400,
    },
    {
      id: 248,
      video: () => import("/videos/major-inspection/249-ost-pipe.mp4"),
      name: "OST Pipe",
      top: 239,
      left: 1280,
    },
    {
      id: 249,
      video: () =>
        import("/videos/major-inspection/250-exhaust-manifold-upper.mp4"),
      name: "Exhaust Manifold Upper",
      top: 239,
      left: 1350,
    },
    {
      id: 250,
      video: () => import("/videos/major-inspection/251-u-support.mp4"),
      name: "U-Support",
      top: 239,
      left: 1420,
    },
    {
      id: 251,
      video: () => import("/videos/major-inspection/252-transition-piece.mp4"),
      name: "Transition Piece",
      top: 239,
      left: 1360,
    },
    {
      id: 252,
      video: () => import("/videos/major-inspection/253-bypass-elbow.mp4"),
      name: "Bypass Elbow",
      top: 239,
      left: 1290,
    },
    {
      id: 253,
      video: () =>
        import("/videos/major-inspection/254-turbine-cylinder-upper.mp4"),
      name: "Turbine Cylinder Upper",
      top: 239,
      left: 1350,
    },
    {
      id: 254,
      video: () => import("/videos/major-inspection/255-top-hat.mp4"),
      name: "Top Hat",
      top: 239,
      left: 1340,
    },
    {
      id: 255,
      video: () => import("/videos/major-inspection/256-cooling-pipe.mp4"),
      name: "Cooling Pipe",
      top: 239,
      left: 1260,
    },
    {
      id: 240,
      video: () =>
        import(
          "/videos/major-inspection/241-turbine-blade-ring-row-4-upper.mp4"
        ),
      name: "Turbine Blade Ring Row 4 Upper",
      top: 239,
      left: 1210,
    },
    {
      id: 256,
      video: () => import("/videos/major-inspection/257-rca-pipe.mp4"),
      name: "RCA Pipe",
      top: 239,
      left: 1420,
    },
    {
      id: 257,
      video: () => import("/videos/major-inspection/258-bleed-pipe.mp4"),
      name: "Bleed Pipe",
      top: 239,
      left: 1320,
    },
    {
      id: 258,
      video: () => import("/videos/major-inspection/259-fuel-gas-manifold.mp4"),
      name: "Fuel Gas Manifold",
      top: 239,
      left: 1355,
    },
    {
      id: 259,
      video: () => import("/videos/major-inspection/260-fuel-branch-pipe.mp4"),
      name: "Fuel Branch Pipe",
      top: 239,
      left: 1340,
    },
    {
      id: 260,
      video: () => import("/videos/major-inspection/261-cross-flame-tube.mp4"),
      name: "Cross Flame Tube",
      top: 239,
      left: 1210,
    },
    {
      id: 261,
      video: () => import("/videos/major-inspection/262-flame-detector.mp4"),
      name: "Flame Detector",
      top: 239,
      left: 1535,
    },
    {
      id: 262,
      video: () =>
        import("/videos/major-inspection/263-manhole-turbine-cylinder.mp4"),
      name: "Manhole Turbine Cylinder",
      top: 239,
      left: 1350,
    },
    {
      id: 263,
      video: () =>
        import("/videos/major-inspection/264-discavity-temperature.mp4"),
      name: "Discavity Temperature",
      top: 239,
      left: 1300,
    },
    {
      id: 264,
      video: () =>
        import("/videos/major-inspection/265-black-patch-temperature.mp4"),
      name: "Black Patch Temperature",
      top: 239,
      left: 1270,
    },
    {
      id: 265,
      video: () => import("/videos/major-inspection/266-flame-igniter.mp4"),
      name: "Flame Igniter",
      top: 239,
      left: 1320,
    },
    {
      id: 266,
      video: () =>
        import("/videos/major-inspection/267-thrust-bearing-lower.mp4"),
      name: "Thrust Bearing Lower",
      top: 239,
      left: 1470,
    },
    {
      id: 267,
      video: () =>
        import("/videos/major-inspection/268-thrust-bearing-upper.mp4"),
      name: "Thrust Bearing Upper",
      top: 239,
      left: 1420,
    },
    {
      id: 268,
      video: () =>
        import("/videos/major-inspection/269-thrust-bearing-cover.mp4"),
      name: "Thrust Bearing Cover",
      top: 239,
      left: 1210,
    },
    {
      id: 269,
      video: () => import("/videos/major-inspection/270-coupling-spacer.mp4"),
      name: "Coupling Spacer",
      top: 239,
      left: 1145,
    },
    {
      id: 270,
      video: () => import("/videos/major-inspection/271-coupling-bolt.mp4"),
      name: "Coupling Bolt",
      top: 239,
      left: 1230,
    },
    {
      id: 271,
      video: () => import("/videos/major-inspection/272-vapour-pipe.mp4"),
      name: "Vapour Pipe",
      top: 239,
      left: 1180,
    },
    {
      id: 272,
      video: () =>
        import("/videos/major-inspection/273-coupling-cover-lower.mp4"),
      name: "Coupling Cover Lower",
      top: 239,
      left: 1210,
    },
    {
      id: 273,
      video: () =>
        import("/videos/major-inspection/274-coupling-cover-upper.mp4"),
      name: "Coupling Cover Upper",
      top: 239,
      left: 1310,
    },
    {
      id: 274,
      video: () => import("/videos/major-inspection/275-inlet-manifold.mp4"),
      name: "Inlet Manifold",
      top: 239,
      left: 1210,
    },
    {
      id: 275,
      video: () => import("/videos/major-inspection/276-inlet-duct.mp4"),
      name: "Inlet Duct",
      top: 239,
      left: 1215,
    },
  ],
  ti: [
    {
      id: 0,
      video: () =>
        import("/videos/combustion-inspection/1-manhole-turbine-cylinder.webm"),
      name: "Manhole Turbine Cylinder",
      top: 235,
      left: 545,
    },
    {
      id: 1,
      video: () =>
        import("/videos/combustion-inspection/2-flame-detector.webm"),
      name: "Flame Detector",
      top: 222,
      left: 685,
    },
    {
      id: 2,
      video: () => import("/videos/combustion-inspection/3-flame-igniter.webm"),
      name: "Flame Igniter",
      top: 235,
      left: 525,
    },
    {
      id: 3,
      video: () =>
        import("/videos/combustion-inspection/4-discavity-temperature.webm"),
      name: "Discavity Temperature",
      top: 210,
      left: 440,
    },
    {
      id: 4,
      video: () =>
        import("/videos/combustion-inspection/5-black-patch-temperature.webm"),
      name: "Black Patch Temperature",
      top: 238,
      left: 420,
    },
    {
      id: 5,
      video: () =>
        import("/videos/combustion-inspection/6-fuel-branch-pipe.webm"),
      name: "Fuel Branch Pipe",
      top: 238,
      left: 420,
    },
    {
      id: 6,
      video: () =>
        import("/videos/combustion-inspection/7-cross-flame-tube.webm"),
      name: "Cross Flame Tube",
      top: 235,
      left: 370,
    },
    {
      id: 7,
      video: () => import("/videos/combustion-inspection/8-top-hat.webm"),
      name: "Top Hat",
      top: 235,
      left: 505,
    },
    {
      id: 8,
      video: () => import("/videos/combustion-inspection/9-fuel-nozzle.mp4"),
      name: "Fuel Nozzle",
      top: 235,
      left: 715,
    },
    {
      id: 9,
      video: () =>
        import("/videos/combustion-inspection/10-combuster-basket.mp4"),
      name: "Combuster Basket",
      top: 235,
      left: 660,
    },
    {
      id: 10,
      video: () => import("/videos/combustion-inspection/11-top-hat.mp4"),
      name: "Top Hat",
      top: 240,
      left: 540,
    },
    {
      id: 11,
      video: () => import("/videos/turbine-inspection/12-cooling-pipe.mp4"),
      name: "Cooling Pipe",
      top: 240,
      left: 700,
    },
    {
      id: 12,
      video: () => import("/videos/turbine-inspection/13-turbine-cylinder.mp4"),
      name: "Turbine Cylinder",
      top: 241,
      left: 1010,
    },
    {
      id: 13,
      video: () => import("/videos/turbine-inspection/14-bypass-elbow.mp4"),
      name: "Bypass Elbow",
      top: 240,
      left: 970,
    },
    {
      id: 14,
      video: () => import("/videos/turbine-inspection/15-transition-piece.mp4"),
      name: "Transition Piece",
      top: 240,
      left: 1010,
    },
    {
      id: 15,
      video: () => import("/videos/turbine-inspection/16-u-support.mp4"),
      name: "U Support",
      top: 240,
      left: 1180,
    },
    {
      id: 16,
      video: () => import("/videos/turbine-inspection/17-bypass-ring.mp4"),
      name: "Bypass Ring",
      top: 240,
      left: 960,
    },
    {
      id: 17,
      video: () =>
        import("/videos/turbine-inspection/18-turbine-vane-row-1-upper.mp4"),
      name: "Turbine Vane Row 1 Upper",
      top: 240,
      left: 770,
    },
    {
      id: 18,
      video: () =>
        import("/videos/turbine-inspection/19-turbine-vane-row-4-upper.mp4"),
      name: "Turbine Vane Row 4 Upper",
      top: 240,
      left: 860,
    },
    {
      id: 19,
      video: () =>
        import("/videos/turbine-inspection/20-turbine-vane-row-3-upper.mp4"),
      name: "Turbine Vane Row 3 Upper",
      top: 240,
      left: 980,
    },
    {
      id: 20,
      video: () =>
        import("/videos/turbine-inspection/21-turbine-vane-row-2-upper.mp4"),
      name: "Turbine Vane Row 2 Upper",
      top: 240,
      left: 640,
    },
    {
      id: 21,
      video: () =>
        import("/videos/turbine-inspection/22-turbine-blade-ring-1.mp4"),
      name: "Turbine Blade Ring 1",
      top: 240,
      left: 815,
    },
    {
      id: 22,
      video: () =>
        import("/videos/turbine-inspection/23-turbine-seal-housing-row-2.mp4"),
      name: "Turbine Seal Housing Row 2",
      top: 240,
      left: 690,
    },
    {
      id: 23,
      video: () =>
        import("/videos/turbine-inspection/24-turbine-seal-housing-row-3.mp4"),
      name: "Turbine Seal Housing Row 3",
      top: 240,
      left: 1100,
    },
    {
      id: 24,
      video: () =>
        import(
          "/videos/turbine-inspection/25-turbine-seal-housing-row-4-lower.mp4"
        ),
      name: "Turbine Seal Housing Row 4 Lower",
      top: 240,
      left: 1090,
    },
    {
      id: 25,
      video: () =>
        import(
          "/videos/turbine-inspection/26-turbine-blade-ring-row-1-lower.mp4"
        ),
      name: "Turbine Blade Ring Row 1 Lower",
      top: 428,
      left: 780,
    },
    {
      id: 26,
      video: () =>
        import(
          "/videos/turbine-inspection/27-turbine-blade-ring-row-2-lower.mp4"
        ),
      name: "Turbine Blade Ring Row 2 Lower",
      top: 240,
      left: 610,
    },
    {
      id: 27,
      video: () =>
        import(
          "/videos/turbine-inspection/28-turbine-blade-ring-row-3-lower.mp4"
        ),
      name: "Turbine Blade Ring Row 3 Lower",
      top: 240,
      left: 1000,
    },
    {
      id: 28,
      video: () =>
        import(
          "/videos/turbine-inspection/29-turbine-blade-ring-row-4-lower.mp4"
        ),
      name: "Turbine Blade Ring Row 4 Lower",
      top: 241,
      left: 830,
    },
    {
      id: 29,
      video: () =>
        import("/videos/turbine-inspection/30-turbine-blade-row-1.mp4"),
      name: "Turbine Blade Row 1",
      top: 243,
      left: 750,
    },
    {
      id: 30,
      video: () =>
        import("/videos/turbine-inspection/31-turbine-blade-row-2.mp4"),
      name: "Turbine Blade Row 2",
      top: 242,
      left: 640,
    },
    {
      id: 31,
      video: () =>
        import("/videos/turbine-inspection/32-turbine-blade-row-3.mp4"),
      name: "Turbine Blade Row 3",
      top: 241,
      left: 950,
    },
    {
      id: 32,
      video: () =>
        import(
          "/videos/turbine-inspection/33-turbine-ring-segment-row-1-upper.mp4"
        ),
      name: "Turbine Ring Segment Row 1 Upper",
      top: 240,
      left: 880,
    },
    {
      id: 33,
      video: () => import("/videos/turbine-inspection/34.mp4"),
      name: "",
      top: 0,
      left: 0,
    },
    {
      id: 34,
      video: () =>
        import(
          "/videos/turbine-inspection/35-turbine-ring-segment-row-1-upper.mp4"
        ),
      name: "Turbine Ring Segment Row 1 Upper",
      top: 240,
      left: 725,
    },
    {
      id: 35,
      video: () =>
        import(
          "/videos/turbine-inspection/36-turbine-ring-segment-row-2-upper.mp4"
        ),
      name: "Turbine Ring Segment Row 2 Upper",
      top: 240,
      left: 770,
    },
    {
      id: 36,
      video: () =>
        import(
          "/videos/turbine-inspection/37-turbine-vane-segment-row-2-upper.mp4"
        ),
      name: "Turbine Vane Segment Row 2 Upper",
      top: 240,
      left: 890,
    },
    {
      id: 37,
      video: () => import("/videos/turbine-inspection/38.mp4"),
      name: "",
      top: 0,
      left: 0,
    },
    {
      id: 38,
      video: () =>
        import(
          "/videos/turbine-inspection/39-turbine-vane-segment-row-2-upper.mp4"
        ),
      name: "Turbine Vane Segment Row 2 Upper",
      top: 240,
      left: 890,
    },
    {
      id: 39,
      video: () =>
        import(
          "/videos/turbine-inspection/40-turbine-ring-segment-row-2-upper.mp4"
        ),
      name: "Turbine Ring Segment Row 2 Upper",
      top: 240,
      left: 770,
    },
    {
      id: 40,
      video: () =>
        import(
          "/videos/turbine-inspection/41-turbine-ring-segment-row-3-upper.mp4"
        ),
      name: "Turbine Ring Segment Row 3 Upper",
      top: 241,
      left: 680,
    },
    {
      id: 41,
      video: () =>
        import(
          "/videos/turbine-inspection/42-turbine-vane-segment-row-3-upper.mp4"
        ),
      name: "Turbine Vane Segment Row 3 Upper",
      top: 241,
      left: 890,
    },
    {
      id: 42,
      video: () => import("/videos/turbine-inspection/43.mp4"),
      name: "",
      top: 0,
      left: 0,
    },
    {
      id: 43,
      video: () =>
        import(
          "/videos/turbine-inspection/44-turbine-vane-segment-row-3-upper.mp4"
        ),
      name: "Turbine Vane Segment Row 3 Upper",
      top: 241,
      left: 890,
    },
    {
      id: 44,
      video: () =>
        import(
          "/videos/turbine-inspection/45-turbine-ring-segment-row-3-upper.mp4"
        ),
      name: "Turbine Ring Segment Row 3 Upper",
      top: 241,
      left: 690,
    },
    {
      id: 45,
      video: () =>
        import(
          "/videos/turbine-inspection/46-turbine-ring-segment-row-4-upper.mp4"
        ),
      name: "Turbine Ring Segment Row 4 Upper",
      top: 241,
      left: 690,
    },
    {
      id: 46,
      video: () =>
        import(
          "/videos/turbine-inspection/47-turbine-vane-segment-row-4-upper.mp4"
        ),
      name: "Turbine Vane Segment Row 4 Upper",
      top: 241,
      left: 890,
    },
    {
      id: 47,
      video: () => import("/videos/turbine-inspection/48.mp4"),
      name: "",
      top: 0,
      left: 0,
    },
    {
      id: 48,
      video: () =>
        import(
          "/videos/turbine-inspection/49-turbine-vane-segment-row-4-upper.mp4"
        ),
      name: "Turbine Vane Segment Row 4 Upper",
      top: 241,
      left: 890,
    },
    {
      id: 49,
      video: () =>
        import(
          "/videos/turbine-inspection/50-turbine-ring-segment-row-4-upper.mp4"
        ),
      name: "Turbine Ring Segment Row 4 Upper",
      top: 241,
      left: 690,
    },
    {
      id: 50,
      video: () =>
        import(
          "/videos/turbine-inspection/51-turbine-ring-segment-row-1-lower.mp4"
        ),
      name: "Turbine Ring Segment Row 1 Lower",
      top: 241,
      left: 690,
    },
    {
      id: 51,
      video: () => import("/videos/turbine-inspection/52.mp4"),
      name: "",
      top: 0,
      left: 0,
    },
    {
      id: 52,
      video: () =>
        import(
          "/videos/turbine-inspection/53-turbine-ring-segment-row-1-lower.mp4"
        ),
      name: "Turbine Ring Segment Row 1 Lower",
      top: 241,
      left: 690,
    },
    {
      id: 53,
      video: () =>
        import(
          "/videos/turbine-inspection/54-turbine-seal-housing-row-2-lower.mp4"
        ),
      name: "Turbine Seal Housing Row 2 Lower",
      top: 241,
      left: 930,
    },
    {
      id: 54,
      video: () =>
        import(
          "/videos/turbine-inspection/55-turbine-ring-segment-row-2-lower.mp4"
        ),
      name: "Turbine Ring Segment Row 2 Lower",
      top: 241,
      left: 730,
    },
    {
      id: 55,
      video: () =>
        import(
          "/videos/turbine-inspection/56-turbine-vane-segment-row-2-lower.mp4"
        ),
      name: "Turbine Vane Segment Row 2 Lower",
      top: 240,
      left: 810,
    },
    {
      id: 56,
      video: () => import("/videos/turbine-inspection/57.mp4"),
      name: "",
      top: 0,
      left: 0,
    },
    {
      id: 57,
      video: () =>
        import(
          "/videos/turbine-inspection/58-turbine-vane-segment-row-2-lower.mp4"
        ),
      name: "Turbine Vane Segment Row 2 Lower",
      top: 240,
      left: 810,
    },
    {
      id: 58,
      video: () =>
        import(
          "/videos/turbine-inspection/59-turbine-ring-segment-row-2-lower.mp4"
        ),
      name: "Turbine Ring Segment Row 2 Lower",
      top: 240,
      left: 730,
    },
    {
      id: 59,
      video: () =>
        import(
          "/videos/turbine-inspection/60-turbine-seal-housing-row-2-lower.mp4"
        ),
      name: "Turbine Seal Housing Row 2 Lower",
      top: 241,
      left: 935,
    },
    {
      id: 60,
      video: () =>
        import(
          "/videos/turbine-inspection/61-turbine-seal-housing-row-3-lower.mp4"
        ),
      name: "Turbine Seal Housing Row 3 Lower",
      top: 242,
      left: 1110,
    },
    {
      id: 61,
      video: () =>
        import(
          "/videos/turbine-inspection/62-turbine-ring-segment-row-3-lower.mp4"
        ),
      name: "Turbine Ring Segment Row 3 Lower",
      top: 241,
      left: 860,
    },
    {
      id: 62,
      video: () =>
        import(
          "/videos/turbine-inspection/63-turbine-vane-segment-row-3-lower.mp4"
        ),
      name: "Turbine Vane Segment Row 3 Lower",
      top: 241,
      left: 1005,
    },
    {
      id: 63,
      video: () => import("/videos/turbine-inspection/64.mp4"),
      name: "",
      top: 0,
      left: 0,
    },
    {
      id: 64,
      video: () =>
        import(
          "/videos/turbine-inspection/65-turbine-vane-segment-row-3-lower.mp4"
        ),
      name: "Turbine Vane Segment Row 3 Lower",
      top: 241,
      left: 1010,
    },
    {
      id: 65,
      video: () =>
        import(
          "/videos/turbine-inspection/66-turbine-ring-segment-row-3-lower.mp4"
        ),
      name: "Turbine Ring Segment Row 3 Lower",
      top: 241,
      left: 860,
    },
    {
      id: 66,
      video: () =>
        import(
          "/videos/turbine-inspection/67-turbine-seal-housing-row-3-lower.mp4"
        ),
      name: "Turbine Seal Housing Row 3 Lower",
      top: 242,
      left: 1110,
    },
    {
      id: 67,
      video: () =>
        import(
          "/videos/turbine-inspection/68-turbine-seal-housing-row-4-lower.mp4"
        ),
      name: "Turbine Seal Housing Row 4 Lower",
      top: 241,
      left: 1090,
    },
    {
      id: 68,
      video: () =>
        import(
          "/videos/add-scope/ti/turbine-section/8-turbine-ring-segment-row-4-lower.mp4"
        ),
      name: "Turbine Ring Segment Row 4 Lower",
      top: 240,
      left: 750,
    },
    {
      id: 69,
      video: () =>
        import(
          "/videos/add-scope/ti/turbine-section/9-turbine-vane-segment-row-4-lower.mp4"
        ),
      name: "Turbine Vane Segment Row 4 Lower",
      top: 240,
      left: 940,
    },
    {
      id: 70,
      video: () => import("/videos/add-scope/ti/turbine-section/10.mp4"),
      name: "",
      top: 0,
      left: 0,
    },
    {
      id: 71,
      video: () =>
        import(
          "/videos/add-scope/ti/turbine-section/11-turbine-vane-segment-row-4-lower.mp4"
        ),
      name: "Turbine Vane Segment Row 4 Lower",
      top: 241,
      left: 940,
    },
    {
      id: 72,
      video: () =>
        import(
          "/videos/add-scope/ti/turbine-section/12-turbine-ring-segment-row-4-lower.mp4"
        ),
      name: "Turbine Ring Segment Row 4 Lower",
      top: 240,
      left: 750,
    },
    {
      id: 73,
      video: () =>
        import(
          "/videos/add-scope/ti/turbine-section/13-turbine-seal-housing-row-4-lower.mp4"
        ),
      name: "Turbine Seal Housing Row 4 Lower",
      top: 241,
      left: 1140,
    },
    {
      id: 74,
      video: () =>
        import("/videos/turbine-inspection/75-turbine-blade-row-3.mp4"),
      name: "Turbine Blade Row 3",
      top: 241,
      left: 1090,
    },
    {
      id: 75,
      video: () =>
        import("/videos/turbine-inspection/76-turbine-blade-row-2.mp4"),
      name: "Turbine Blade Row 2",
      top: 240,
      left: 620,
    },
    {
      id: 76,
      video: () =>
        import("/videos/turbine-inspection/77-turbine-blade-row-1.mp4"),
      name: "Turbine Blade Row 1",
      top: 240,
      left: 785,
    },
    {
      id: 77,
      video: () =>
        import(
          "/videos/turbine-inspection/78-turbine-blade-ring-row-4-lower.mp4"
        ),
      name: "Turbine Blade Ring Row 4 Lower",
      top: 241,
      left: 920,
    },
    {
      id: 78,
      video: () =>
        import(
          "/videos/turbine-inspection/79-turbine-blade-ring-row-3-lower.mp4"
        ),
      name: "Turbine Blade Ring Row 3 Lower",
      top: 241,
      left: 1120,
    },
    {
      id: 79,
      video: () =>
        import(
          "/videos/turbine-inspection/80-turbine-blade-ring-row-2-lower.mp4"
        ),
      name: "Turbine Blade Ring Row 2 Lower",
      top: 241,
      left: 545,
    },
    {
      id: 80,
      video: () =>
        import(
          "/videos/turbine-inspection/81-turbine-blade-ring-row-1-lower.mp4"
        ),
      name: "Turbine Blade Ring Row 1 Lower",
      top: 241,
      left: 645,
    },
    {
      id: 81,
      video: () =>
        import(
          "/videos/turbine-inspection/82-turbine-seal-housing-row-2-upper.mp4"
        ),
      name: "Turbine Seal Housing Row 2 Upper",
      top: 241,
      left: 550,
    },
    {
      id: 82,
      video: () =>
        import(
          "/videos/turbine-inspection/83-turbine-seal-housing-row-3-upper.mp4"
        ),
      name: "Turbine Seal Housing Row 3 Upper",
      top: 241,
      left: 445,
    },
    {
      id: 83,
      video: () =>
        import(
          "/videos/turbine-inspection/84-turbine-seal-housing-row-4-upper.mp4"
        ),
      name: "Turbine Seal Housing Row 4 Upper",
      top: 240,
      left: 1030,
    },
    {
      id: 84,
      video: () =>
        import(
          "/videos/turbine-inspection/85-turbine-blade-ring-row-1-upper.mp4"
        ),
      name: "Turbine Blade Ring Row 1 Upper",
      top: 238,
      left: 620,
    },
    {
      id: 85,
      video: () =>
        import(
          "/videos/turbine-inspection/86-turbine-blade-ring-row-2-upper.mp4"
        ),
      name: "Turbine Blade Ring Row 2 Upper",
      top: 238,
      left: 1120,
    },
    {
      id: 86,
      video: () =>
        import(
          "/videos/turbine-inspection/87-turbine-blade-ring-row-3-upper.mp4"
        ),
      name: "Turbine Blade Ring Row 3 Upper",
      top: 239,
      left: 990,
    },
    {
      id: 87,
      video: () =>
        import(
          "/videos/turbine-inspection/88-turbine-blade-ring-row-4-upper.mp4"
        ),
      name: "Turbine Blade Ring Row 4 Upper",
      top: 239,
      left: 850,
    },
    {
      id: 88,
      video: () =>
        import("/videos/turbine-inspection/89-turbine-van-row-1-upper.mp4"),
      name: "Turbine Van Row 1 Upper",
      top: 239,
      left: 710,
    },
    {
      id: 89,
      video: () => import("/videos/turbine-inspection/90-bypass-ring.mp4"),
      name: "Bypass Ring",
      top: 238,
      left: 840,
    },
    {
      id: 90,
      video: () => import("/videos/turbine-inspection/91-turbine-cylinder.mp4"),
      name: "Turbine Cylinder",
      top: 238,
      left: 1085,
    },
    {
      id: 91,
      video: () => import("/videos/turbine-inspection/92-cooling-pipe.mp4"),
      name: "Cooling Pipe",
      top: 238,
      left: 1060,
    },
    {
      id: 92,
      video: () => import("/videos/turbine-inspection/93-transition-piece.mp4"),
      name: "Transition Piece",
      top: 241,
      left: 1090,
    },
    {
      id: 93,
      video: () => import("/videos/combustion-inspection/12-u-support.mp4"),
      name: "U-Support",
      top: 235,
      left: 785,
    },
    {
      id: 94,
      video: () => import("/videos/combustion-inspection/13-bypass-elbow.mp4"),
      name: "Bypass Elbow",
      top: 235,
      left: 515,
    },
    {
      id: 95,
      video: () =>
        import("/videos/combustion-inspection/14-transition-piece.mp4"),
      name: "Transition Piece",
      top: 237,
      left: 615,
    },
    {
      id: 96,
      video: () => import("/videos/combustion-inspection/15.mp4"),
      name: "",
      top: 0,
      left: 0,
    },
    {
      id: 97,
      video: () =>
        import("/videos/combustion-inspection/16-transition-piece.mp4"),
      name: "Transition Piece",
      top: 237,
      left: 615,
    },
    {
      id: 98,
      video: () => import("/videos/combustion-inspection/17-u-support.mp4"),
      name: "U-Support",
      top: 237,
      left: 630,
    },
    {
      id: 99,
      video: () => import("/videos/combustion-inspection/18-bypass-elbow.mp4"),
      name: "Bypass Elbow",
      top: 235,
      left: 790,
    },
    {
      id: 100,
      video: () => import("/videos/combustion-inspection/19-top-hat.mp4"),
      name: "Top Hat",
      top: 233,
      left: 685,
    },
    {
      id: 101,
      video: () =>
        import("/videos/combustion-inspection/20-cross-flame-tube.mp4"),
      name: "Cross Flame Tube",
      top: 237,
      left: 580,
    },
    {
      id: 102,
      video: () =>
        import("/videos/combustion-inspection/21-flame-detector.mp4"),
      name: "Flame Detector",
      top: 237,
      left: 785,
    },
    {
      id: 103,
      video: () =>
        import("/videos/combustion-inspection/22-manhole-turbine.mp4"),
      name: "Manhole Turbine",
      top: 235,
      left: 615,
    },
    {
      id: 104,
      video: () =>
        import("/videos/combustion-inspection/23-discavity-temperature.mp4"),
      name: "Discavity Temperature",
      top: 230,
      left: 630,
    },
    {
      id: 105,
      video: () =>
        import("/videos/combustion-inspection/24-black-patch-temperature.mp4"),
      name: "Black Patch Temperature",
      top: 238,
      left: 420,
    },
    {
      id: 106,
      video: () =>
        import("/videos/combustion-inspection/25-fuel-branch-pipe.mp4"),
      name: "Fuel Branch Pipe",
      top: 237,
      left: 420,
    },
    {
      id: 107,
      video: () => import("/videos/combustion-inspection/26-flame-igniter.mp4"),
      name: "Flame Igniter",
      top: 236,
      left: 525,
    },
    {
      id: 108,
      video: () => import("/videos/combustion-inspection/27.mp4"),
      name: "",
      top: 0,
      left: 0,
    },
  ],
});

const videos: any = computed(() => {
  return videosData.value[(route.params.menu as string) || "ci"];
});

const videoSrc = ref<string | null>(null);

const loadVideo = async () => {
  if (videos.value[currentVideoIndex.value]) {
    videoSrc.value = (
      await videos.value[currentVideoIndex.value].video()
    ).default;
    preloadVideo(videoSrc.value as string);
  }
};

const router = useRouter();
const route = useRoute();
const globalStore = useGlobalStore();
const {
  titleHeader,
  disabledBack,
  disabledNext,
  isFinish,
  isAddScope,
  isStepNavigation,
} = storeToRefs(globalStore);

const currentVideoIndex = ref(0);
const videoRef = ref<HTMLVideoElement | null>(null);
const isButtonVisible = ref(false);
const openStep = ref(false);
const isReversing = ref(false);
let reverseInterval: number | null = null;
const is_loading = ref(false);

const videoState = ref({
  isTransitioning: false,
});

async function preloadVideo(url: string): Promise<void> {
  is_loading.value = true;
  try {
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`Gagal mengambil video: ${response.statusText}`);

    const blob = await response.blob();
    const videoUrl = URL.createObjectURL(blob);

    const videoElement = document.getElementById("video") as HTMLVideoElement;
    videoElement.src = videoUrl;

    videoElement.onloadeddata = () => {
      is_loading.value = false;
    };
  } catch (error) {
    console.error(error);
    is_loading.value = false;
  }
}

const handleVideoEnd = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const videoParam = urlParams.get("video") || "1";
  const toParam = urlParams.get("to");

  if (toParam) {
    if (currentVideoIndex.value < parseInt(toParam) - 1) {
      isButtonVisible.value = true;
      disabledNext.value = false;
      disabledBack.value = false;
      setTimeout(() => {
        const nextVideo = currentVideoIndex.value + 1;
        currentVideoIndex.value = nextVideo;
        isButtonVisible.value = false;
        disabledNext.value = true;
        disabledBack.value = true;

        const url = new URL(window.location.href);
        url.search = `?video=${parseInt(videoParam) + 1}&to=${toParam}`;
        window.history.replaceState({}, "", url);
      }, 500);
    } else if (currentVideoIndex.value > parseInt(toParam) - 1) {
      isButtonVisible.value = true;
      disabledNext.value = false;
      disabledBack.value = false;
      setTimeout(() => {
        isButtonVisible.value = false;
        disabledNext.value = true;
        disabledBack.value = true;
        if (videoRef.value) {
          reverseInterval = setInterval(reverseVideo, 100);
        }
      }, 500);
    } else if (currentVideoIndex.value === parseInt(toParam) - 1) {
      isButtonVisible.value = true;
      disabledNext.value = false;
      disabledBack.value = false;

      const { to, video, ...updatedQuery } = route.query;
      router.replace({
        path: route.path,
        query: { video: currentVideoIndex.value + 1, ...updatedQuery },
      });
    }
  } else {
    isButtonVisible.value = true;
    disabledNext.value = false;
    disabledBack.value = false;
  }
};

const index_temp = ref<number>(0);
const is_start_at_end = ref<boolean>(false);

const initializeVideo = async () => {
  videoState.value.isTransitioning = true;
  isButtonVisible.value = false;
  disabledNext.value = true;
  disabledBack.value = true;

  if (videoRef.value) {
    videoRef.value.pause();
  }

  currentVideoIndex.value = index_temp.value;

  await loadVideo();
  preloadVideo(videoSrc.value as string);
};

watch(is_loading, async (value) => {
  if (!value) {
    isFinish.value = index_temp.value === videos.value.length - 1;
    isAddScope.value = index_temp.value === videos.value.length - 1;

    await new Promise<void>((resolve) => {
      if (videoRef.value) {
        videoRef.value.onloadedmetadata = null;

        videoRef.value.onloadedmetadata = () => {
          if (is_start_at_end.value && videoRef.value) {
            videoRef.value.currentTime = videoRef.value.duration - 0.1;
            isButtonVisible.value = true;
            disabledNext.value = false;
            disabledBack.value = false;
          } else {
            videoRef.value?.play();
          }

          resolve();
        };

        if (videoRef.value.readyState >= 1) {
          console.log("Force metadata ready");
          videoRef.value.dispatchEvent(new Event("loadedmetadata"));
        }
      } else {
        console.error("videoRef belum terinisialisasi!");
        resolve();
      }
    });

    videoState.value.isTransitioning = false;
  }
});

const updateURLParameter = (index: number, startAtEnd = false) => {
  const url = new URL(window.location.href);
  url.searchParams.set("video", (index + 1).toString());
  if (startAtEnd) {
    url.searchParams.set("start", "end");
  } else {
    url.searchParams.delete("start");
  }
  window.history.replaceState({}, "", url);
};

const reverseVideo = () => {
  if (!videoRef.value || videoRef.value.currentTime <= 0) {
    if (reverseInterval) {
      clearInterval(reverseInterval);
      reverseInterval = null;
    }
    isReversing.value = false;

    const prevIndex = currentVideoIndex.value - 1;

    if (prevIndex < 0) {
      router.push(
        `/${route.params.id}/create/unit/${route.params.id_unit}/ci/scope`
      );
      return;
    }

    index_temp.value = prevIndex;
    is_start_at_end.value = true;
    updateURLParameter(prevIndex, true);
    initializeVideo();
    return;
  }

  videoRef.value.currentTime = Math.max(0, videoRef.value.currentTime - 0.1);
};

const handleBack = async () => {
  if (videoState.value.isTransitioning) return;

  isReversing.value = true;
  videoState.value.isTransitioning = true;
  isButtonVisible.value = false;
  disabledNext.value = true;
  disabledBack.value = true;

  if (videoRef.value) {
    reverseInterval = setInterval(reverseVideo, 100);
  }
};

const handleNext = async () => {
  if (
    videoState.value.isTransitioning ||
    currentVideoIndex.value >= videos.value.length - 1
  )
    return;

  const nextIndex = currentVideoIndex.value + 1;
  index_temp.value = nextIndex;
  is_start_at_end.value = false;
  updateURLParameter(nextIndex);
  await initializeVideo();
};

const handleJumpStep = async (index: number) => {
  const nextIndex = index - 1;
  index_temp.value = nextIndex;
  is_start_at_end.value = false;
  updateURLParameter(nextIndex);
  await initializeVideo();
  openStep.value = false;

  // if (videoRef.value) {
  //   if (videoRef.value.currentTime === videoRef.value.duration) {
  //     const urlParams = new URLSearchParams(window.location.search);
  //     const videoParam = urlParams.get("video") || "1";
  //     const video = parseInt(videoParam, 10);

  //     if (index === video) {
  //       return;
  //     }

  //     const { path } = route;

  //     disabledNext.value = true;
  //     disabledBack.value = true;
  //     isButtonVisible.value = false;

  //     if (index > video) {
  //       const updatedQuery = { video: video + 1, to: index };
  //       router.push({ path, query: updatedQuery });
  //       const nextIndex = currentVideoIndex.value + 1;
  //       currentVideoIndex.value = nextIndex;
  //       index_temp.value = nextIndex;
  //       is_start_at_end.value = false;
  //       await initializeVideo();
  //     } else {
  //       const updatedQuery = { video: video, to: index };
  //       router.push({ path, query: updatedQuery });
  //       if (videoRef.value) {
  //         reverseInterval = setInterval(reverseVideo, 100);
  //       }
  //     }

  //     openStep.value = false;
  //   }
  // }
};

const handleStepNavigation = () => {
  openStep.value = true;
};

const handleCloseStep = () => {
  openStep.value = false;
};

watch(openStep, (value) => {
  if (value) {
    isStepNavigation.value = false;
  } else {
    isStepNavigation.value = true;
  }
});

const initializeFromURL = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const videoParam = urlParams.get("video") || "1";
  const startParam = urlParams.get("start");
  const index = Math.max(
    0,
    Math.min(parseInt(videoParam, 10) - 1, videos.value.length - 1)
  );

  index_temp.value = index;
  is_start_at_end.value = startParam === "end";
  await initializeVideo();
};

onMounted(() => {
  titleHeader.value =
    route.params.menu === "ci"
      ? "Combustion Inspection"
      : route.params.menu === "ti"
      ? "Turbine Inspection"
      : route.params.menu === "mi"
      ? "Major Inspection"
      : "";

  disabledNext.value = true;
  disabledBack.value = true;
  isStepNavigation.value = true;

  window.addEventListener("popstate", initializeFromURL);
  eventBus.on("next", handleNext);
  eventBus.on("back", handleBack);
  eventBus.on("stepNavigation", handleStepNavigation);

  initializeFromURL();
});

onUnmounted(() => {
  window.removeEventListener("popstate", initializeFromURL);
  eventBus.off("next", handleNext);
  eventBus.off("back", handleBack);
  eventBus.on("stepNavigation", handleStepNavigation);
  if (reverseInterval) {
    clearInterval(reverseInterval);
    reverseInterval = null;
  }
});
</script>

<template>
  <div class="scope-container">
    <div>
      <Sidebar />
    </div>
    <div
      v-if="is_loading"
      class="z-[100000000000] fixed top-0 right-0 bottom-0 left-0 bg-neutral-900 bg-opacity-50 flex justify-center items-center"
    >
      <Loading width="50" height="50" />
    </div>
    <div class="scope-video-container">
      <video
        id="video"
        ref="videoRef"
        preload="auto"
        muted
        playsinline
        class="scope-video"
        @ended="handleVideoEnd"
      ></video>
      <div v-for="(item, key) in videos" :key="key">
        <div
          v-if="
            isButtonVisible && currentVideoIndex === key && item.name !== ''
          "
          class="absolute"
          :style="{ top: `${item.top}px`, left: `${item.left}px` }"
        >
          <button class="button-part">
            {{ item.name }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <DialogRoot v-model:open="openStep">
    <DialogPortal>
      <DialogContent
        class="v-drawer-content"
        @interact-outside="() => (openStep = false)"
      >
        <VisuallyHidden>
          <DialogTitle />
          <DialogDescription />
        </VisuallyHidden>
        <div class="p-4">
          <div class="flex justify-start">
            <Icon
              name="double-arrow-right"
              class="text-[24px] text-neutral-50 cursor-pointer hover:text-cyan-500"
              @click="handleCloseStep"
            />
          </div>
          <p class="mt-6 text-2xl text-neutral-50 font-bold">
            Inspection Sequences:
          </p>
          <ul
            v-if="route.params.menu === 'ci'"
            class="mt-2 max-h-[calc(100vh-220px)] overflow-y-auto"
          >
            <p class="text-neutral-50 text-lg font-bold mt-1">Disassembly</p>
            <li
              v-for="(item, key) in videos.slice(0, 14)"
              :key="item.id"
              class="list-disc list-inside mt-1"
              :class="{ hidden: item.name === '' }"
              @click="handleJumpStep(item.id + 1)"
            >
              <a class="text-neutral-50 hover:text-cyan-500 cursor-pointer">
                {{ item.name }}
              </a>
            </li>

            <p class="text-neutral-50 text-lg font-bold mt-2">Assembly</p>
            <li
              v-for="(item, key) in videos.slice(15, 27)"
              :key="item.id"
              class="list-disc list-inside mt-1"
              :class="{ hidden: item.name === '' }"
              @click="handleJumpStep(item.id + 1)"
            >
              <a class="text-neutral-50 hover:text-cyan-500 cursor-pointer">
                {{ item.name }}
              </a>
            </li>
          </ul>
          <ul v-else class="mt-2 max-h-[calc(100vh-220px)] overflow-y-auto">
            <li
              v-for="(item, key) in videos"
              :key="item.id"
              class="list-disc list-inside mt-1"
              :class="{ hidden: item.name === '' }"
              @click="handleJumpStep(item.id + 1)"
            >
              <a class="text-neutral-50 hover:text-cyan-500 cursor-pointer">
                {{ item.name }}
              </a>
            </li>
          </ul>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style lang="sass" scoped>
.wrapper-bid
  @apply absolute top-[120px] left-10 z-[100]

.button-part
  @apply py-2 px-6 rounded bg-cyan-500 text-base text-neutral-50 shadow-lg shadow-neutral-700 hover:bg-yellow-500
</style>
