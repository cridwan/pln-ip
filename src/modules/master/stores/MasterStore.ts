import { defineStore } from "pinia";

import { api } from "@/api/axios";
import { encryptStorage } from "@/utils/storage";
import type { StorageLike } from "pinia-plugin-persistedstate";
import type { IParams } from "@/types/GlobalType";

import type { LocationCreateInterface } from "../types/LocationType";
import type { UnitCreateInterface } from "../types/UnitType";
import type { MachineCreateInterface } from "../types/MachineType";
import type { InspectionTypeCreateInterface } from "../types/InspectionType";
import type { PartCreateInterface } from "../types/PartType";
import type { ManpowerCreateInterface } from "../types/ManpowerType";
import type { ConsMatCreateInterface } from "../types/ConsumableMaterialType";
import type { ToolsCreateInterface } from "../types/ToolsType";
import type { GlobalUnitCreateInterface } from "../types/GlobalUnitType";
import type { RoleCreateInterface } from "../types/RoleType";
import type { UserCreateInterface } from "../types/UserType";
import type {
  ScopeCreateInterface,
  ScopeUpdateInterface,
} from "../types/ScopeType";
import type { AdditionalScopeCreateInterface } from "../types/AdditionalScopeType";
import type { BidangCreateInterface } from "../types/BidangType";
import type { SubBidangCreateInterface } from "../types/SubBidangType";
import type { HseDocCreateInterface } from "../types/HseDocTypes";
import type { HseCreateInterface } from "../types/HseTypes";
import type { SequenceCreateInterface } from "../types/SequenceTypes";
import type { ActivityCreateInterface } from "../types/AcitivityType";
import type { EquipmentCreateInterface } from "../types/EquipmentType";
import type { PartStdCreateInterface } from "../types/PartStdType";
import type { ManpowerStdCreateInterface } from "../types/ManpowerStdType";
import type { ConsumableMaterialStdCreateInterface } from "../types/ConsumableMaterialStdType";
import type {
  AxiosHeaderValue,
  AxiosInstance,
  AxiosRequestConfig,
} from "axios";
import type { QCPlanCreateInterface } from "../types/QcPlanType";
import type { AreaCreateInterface } from "../types/AreaType";
import type { SubAreaCreateInterface } from "../types/SubAreaType";

export const useMasterStore = defineStore(
  "master",
  () => {
    // --- LOCATION
    const getLocation = async (payload: IParams) => {
      return await api
        .get(`/location`, {
          params: payload,
        })
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const createLocation = async (payload: LocationCreateInterface) => {
      return await api
        .post(`/location`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const updateLocation = async (
      id: string,
      payload: LocationCreateInterface
    ) => {
      return await api
        .put(`/location/${id}`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const deleteLocation = async (id: string) => {
      return await api
        .delete(`/location/${id}`)
        .then((res) => {
          return Promise.resolve(res);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const downloadLocation = async () => {
      return await api
        .post(
          `/location/export`,
          {},
          {
            responseType: "blob",
          }
        )
        .then((resp) => {
          const url = window.URL.createObjectURL(
            new Blob([resp.data], {
              type: resp.headers["content-type"],
            })
          );

          const a = document.createElement("a");
          a.href = url;
          a.download = `Location.xlsx`;

          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);

          URL.revokeObjectURL(url);

          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const templateLocation = async () => {
      return await api
        .post(
          `/location/template`,
          {},
          {
            responseType: "blob",
          }
        )
        .then((resp) => {
          const url = window.URL.createObjectURL(
            new Blob([resp.data], {
              type: resp.headers["content-type"],
            })
          );

          const a = document.createElement("a");
          a.href = url;
          a.download = `Location Template.xlsx`;

          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);

          URL.revokeObjectURL(url);

          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const importLocation = async (payload: File) => {
      const formData = new FormData();
      formData.append("file", payload);

      return await api
        .post(`/location/import`, formData)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };
    // --- END

    // --- UNIT
    const getUnit = async (payload: IParams) => {
      return await api
        .get(`/unit`, {
          params: payload,
        })
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const createUnit = async (payload: UnitCreateInterface) => {
      return await api
        .post(`/unit`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const updateUnit = async (id: string, payload: UnitCreateInterface) => {
      return await api
        .put(`/unit/${id}`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const deleteUnit = async (id: string) => {
      return await api
        .delete(`/unit/${id}`)
        .then((res) => {
          return Promise.resolve(res);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const downloadUnit = async (params?: AxiosRequestConfig["params"]) => {
      return await api
        .post(
          `/unit/export`,
          {},
          {
            responseType: "blob",
            params,
          }
        )
        .then((resp) => {
          const url = window.URL.createObjectURL(
            new Blob([resp.data], {
              type: resp.headers["content-type"],
            })
          );

          const a = document.createElement("a");
          a.href = url;
          a.download = `Unit.xlsx`;

          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);

          URL.revokeObjectURL(url);

          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const templateUnit = async () => {
      return await api
        .post(
          `/unit/template`,
          {},
          {
            responseType: "blob",
          }
        )
        .then((resp) => {
          const url = window.URL.createObjectURL(
            new Blob([resp.data], {
              type: resp.headers["content-type"],
            })
          );

          const a = document.createElement("a");
          a.href = url;
          a.download = `Unit Template.xlsx`;

          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);

          URL.revokeObjectURL(url);

          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const importUnit = async (payload: File) => {
      const formData = new FormData();
      formData.append("file", payload);

      return await api
        .post(`/unit/import`, formData)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };
    // --- END

    // --- MACHINE
    const getMachine = async (payload: IParams) => {
      return await api
        .get(`/machine`, {
          params: payload,
        })
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const createMachine = async (payload: MachineCreateInterface) => {
      return await api
        .post(`/machine`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const updateMachine = async (
      id: string,
      payload: MachineCreateInterface
    ) => {
      return await api
        .put(`/machine/${id}`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const deleteMachine = async (id: string) => {
      return await api
        .delete(`/machine/${id}`)
        .then((res) => {
          return Promise.resolve(res);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const downloadMachine = async (params?: AxiosRequestConfig["params"]) => {
      return await api
        .post(
          `/machine/export`,
          {},
          {
            responseType: "blob",
            params,
          }
        )
        .then((resp) => {
          const url = window.URL.createObjectURL(
            new Blob([resp.data], {
              type: resp.headers["content-type"],
            })
          );

          const a = document.createElement("a");
          a.href = url;
          a.download = `Machine.xlsx`;

          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);

          URL.revokeObjectURL(url);

          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const templateMachine = async () => {
      return await api
        .post(
          `/machine/template`,
          {},
          {
            responseType: "blob",
          }
        )
        .then((resp) => {
          const url = window.URL.createObjectURL(
            new Blob([resp.data], {
              type: resp.headers["content-type"],
            })
          );

          const a = document.createElement("a");
          a.href = url;
          a.download = `Machine Template.xlsx`;

          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);

          URL.revokeObjectURL(url);

          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const importMachine = async (payload: File) => {
      const formData = new FormData();
      formData.append("file", payload);

      return await api
        .post(`/machine/import`, formData)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };
    // --- END

    // --- INSPECTION TYPE
    const getInspectionType = async (payload: IParams) => {
      return await api
        .get(`/inspection-type`, {
          params: payload,
        })
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const createInspectionType = async (
      payload: InspectionTypeCreateInterface
    ) => {
      return await api
        .post(`/inspection-type`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const updateInspectionType = async (
      id: string,
      payload: InspectionTypeCreateInterface
    ) => {
      return await api
        .put(`/inspection-type/${id}`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const deleteInspectionType = async (id: string) => {
      return await api
        .delete(`/inspection-type/${id}`)
        .then((res) => {
          return Promise.resolve(res);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const downloadInspectionType = async (
      params?: AxiosRequestConfig["params"]
    ) => {
      return await api
        .post(
          `/inspection-type/export`,
          {},
          {
            responseType: "blob",
            params,
          }
        )
        .then((resp) => {
          const url = window.URL.createObjectURL(
            new Blob([resp.data], {
              type: resp.headers["content-type"],
            })
          );

          const a = document.createElement("a");
          a.href = url;
          a.download = `Inspection Type.xlsx`;

          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);

          URL.revokeObjectURL(url);

          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const templateInspectionType = async () => {
      return await api
        .post(
          `/inspection-type/template`,
          {},
          {
            responseType: "blob",
          }
        )
        .then((resp) => {
          const url = window.URL.createObjectURL(
            new Blob([resp.data], {
              type: resp.headers["content-type"],
            })
          );

          const a = document.createElement("a");
          a.href = url;
          a.download = `Inspection Type Template.xlsx`;

          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);

          URL.revokeObjectURL(url);

          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const importInspectionType = async (payload: File) => {
      const formData = new FormData();
      formData.append("file", payload);

      return await api
        .post(`/inspection-type/import`, formData)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };
    // --- END

    // --- GLOBAL UNIT
    const getGlobalUnit = async (payload: IParams) => {
      return await api
        .get(`/global-unit`, {
          params: payload,
        })
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const createGlobalUnit = async (payload: GlobalUnitCreateInterface) => {
      return await api
        .post(`/global-unit`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const updateGlobalUnit = async (
      id: string,
      payload: GlobalUnitCreateInterface
    ) => {
      return await api
        .put(`/global-unit/${id}`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const deleteGlobalUnit = async (id: string) => {
      return await api
        .delete(`/global-unit/${id}`)
        .then((res) => {
          return Promise.resolve(res);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const downloadGlobalUnit = async () => {
      return await api
        .post(
          `/global-unit/export`,
          {},
          {
            responseType: "blob",
          }
        )
        .then((resp) => {
          const url = window.URL.createObjectURL(
            new Blob([resp.data], {
              type: resp.headers["content-type"],
            })
          );

          const a = document.createElement("a");
          a.href = url;
          a.download = `Global Unit.xlsx`;

          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);

          URL.revokeObjectURL(url);

          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const templateGlobalUnit = async () => {
      return await api
        .post(
          `/global-unit/template`,
          {},
          {
            responseType: "blob",
          }
        )
        .then((resp) => {
          const url = window.URL.createObjectURL(
            new Blob([resp.data], {
              type: resp.headers["content-type"],
            })
          );

          const a = document.createElement("a");
          a.href = url;
          a.download = `Global Unit Template.xlsx`;

          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);

          URL.revokeObjectURL(url);

          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const importGlobalUnit = async (payload: File) => {
      const formData = new FormData();
      formData.append("file", payload);

      return await api
        .post(`/global-unit/import`, formData)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };
    // --- END

    // --- SCOPE
    const getScope = async (payload: IParams, prefix: string = "") => {
      return await api
        .get(`${prefix}/scope-standart`, {
          params: payload,
        })
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const createScope = async (payload: ScopeCreateInterface) => {
      return await api
        .post(`/scope-standart`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const updateScope = async (id: string, payload: ScopeUpdateInterface) => {
      return await api
        .put(`/scope-standart/${id}`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const deleteScope = async (id: string, prefix: string = "") => {
      return await api
        .delete(`${prefix}/scope-standart/${id}`)
        .then((res) => {
          return Promise.resolve(res);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const downloadScope = async (params?: AxiosRequestConfig["params"], prefix: string = "") => {
      return await api
        .post(
          `${prefix}/scope-standart/export`,
          {},
          {
            responseType: "blob",
            params,
          }
        )
        .then((resp) => {
          const url = window.URL.createObjectURL(
            new Blob([resp.data], {
              type: resp.headers["content-type"],
            })
          );

          const a = document.createElement("a");
          a.href = url;
          a.download = `Scope Standart.xlsx`;

          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);

          URL.revokeObjectURL(url);

          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const templateScope = async (prefix: string = "") => {
      return await api
        .post(
          `${prefix}/scope-standart/template`,
          {},
          {
            responseType: "blob",
          }
        )
        .then((resp) => {
          const url = window.URL.createObjectURL(
            new Blob([resp.data], {
              type: resp.headers["content-type"],
            })
          );

          const a = document.createElement("a");
          a.href = url;
          a.download = `Scope Standart Template.xlsx`;

          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);

          URL.revokeObjectURL(url);

          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const importScope = async (payload: File, prefix: string = "") => {
      const formData = new FormData();
      formData.append("file", payload);

      return await api
        .post(`${prefix}/scope-standart/import`, formData)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };
    // --- END

    // --- ADDITIONAL SCOPE
    const getAdditionalScope = async (payload: IParams) => {
      return await api
        .get(`/additional-scope`, {
          params: payload,
        })
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const createAdditionalScope = async (
      payload: AdditionalScopeCreateInterface
    ) => {
      return await api
        .post(`/additional-scope`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const updateAdditionalScope = async (
      id: string,
      payload: AdditionalScopeCreateInterface
    ) => {
      return await api
        .put(`/additional-scope/${id}`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const deleteAdditionalScope = async (id: string) => {
      return await api
        .delete(`/additional-scope/${id}`)
        .then((res) => {
          return Promise.resolve(res);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const downloadAdditionalScope = async (
      params?: AxiosRequestConfig["params"]
    ) => {
      return await api
        .post(
          `/additional-scope/export`,
          {},
          {
            responseType: "blob",
            params,
          }
        )
        .then((resp) => {
          const url = window.URL.createObjectURL(
            new Blob([resp.data], {
              type: resp.headers["content-type"],
            })
          );

          const a = document.createElement("a");
          a.href = url;
          a.download = `Additional Scope.xlsx`;

          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);

          URL.revokeObjectURL(url);

          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const templateAdditionalScope = async () => {
      return await api
        .post(
          `/additional-scope/template`,
          {},
          {
            responseType: "blob",
          }
        )
        .then((resp) => {
          const url = window.URL.createObjectURL(
            new Blob([resp.data], {
              type: resp.headers["content-type"],
            })
          );

          const a = document.createElement("a");
          a.href = url;
          a.download = `Additional Scope Template.xlsx`;

          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);

          URL.revokeObjectURL(url);

          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const importAdditionalScope = async (payload: File) => {
      const formData = new FormData();
      formData.append("file", payload);

      return await api
        .post(`/additional-scope/import`, formData)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };
    // --- END

    // --- CONSUMABLE MATERIAL
    const getConsMat = async (payload: IParams) => {
      return await api
        .get(`/consumble-material`, {
          params: payload,
        })
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const getConsMatGrouping = async (payload: IParams) => {
      return await api
        .get(`/cons-mat-std/grouping`, {
          params: payload,
        })
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const createConsMat = async (payload: ConsMatCreateInterface) => {
      return await api
        .post(`/consumble-material`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const updateConsMat = async (
      id: string,
      payload: ConsMatCreateInterface
    ) => {
      return await api
        .put(`/consumble-material/${id}`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const deleteConsMat = async (id: string) => {
      return await api
        .delete(`/consumble-material/${id}`)
        .then((res) => {
          return Promise.resolve(res);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const downloadConsMat = async () => {
      return await api
        .post(
          `/consumble-material/export`,
          {},
          {
            responseType: "blob",
          }
        )
        .then((resp) => {
          const url = window.URL.createObjectURL(
            new Blob([resp.data], {
              type: resp.headers["content-type"],
            })
          );

          const a = document.createElement("a");
          a.href = url;
          a.download = `Consumable Material.xlsx`;

          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);

          URL.revokeObjectURL(url);

          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const templateConsMat = async () => {
      return await api
        .post(
          `/consumble-material/template`,
          {},
          {
            responseType: "blob",
          }
        )
        .then((resp) => {
          const url = window.URL.createObjectURL(
            new Blob([resp.data], {
              type: resp.headers["content-type"],
            })
          );

          const a = document.createElement("a");
          a.href = url;
          a.download = `Consumable Material Template.xlsx`;

          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);

          URL.revokeObjectURL(url);

          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const importConsMat = async (payload: File) => {
      const formData = new FormData();
      formData.append("file", payload);

      return await api
        .post(`/consumble-material/import`, formData)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };
    // --- END

    // --- PART
    const getPart = async (payload: IParams) => {
      return await api
        .get(`/part`, {
          params: payload,
        })
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const getPartGrouping = async (payload: IParams) => {
      return await api
        .get(`/part-std/grouping`, {
          params: payload,
        })
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const createPart = async (payload: PartCreateInterface) => {
      return await api
        .post(`/part`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const updatePart = async (id: string, payload: PartCreateInterface) => {
      return await api
        .put(`/part/${id}`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const deletePart = async (id: string) => {
      return await api
        .delete(`/part/${id}`)
        .then((res) => {
          return Promise.resolve(res);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const downloadPart = async () => {
      return await api
        .post(
          `/part/export`,
          {},
          {
            responseType: "blob",
          }
        )
        .then((resp) => {
          const url = window.URL.createObjectURL(
            new Blob([resp.data], {
              type: resp.headers["content-type"],
            })
          );

          const a = document.createElement("a");
          a.href = url;
          a.download = `Part.xlsx`;

          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);

          URL.revokeObjectURL(url);

          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const templatePart = async () => {
      return await api
        .post(
          `/part/template`,
          {},
          {
            responseType: "blob",
          }
        )
        .then((resp) => {
          const url = window.URL.createObjectURL(
            new Blob([resp.data], {
              type: resp.headers["content-type"],
            })
          );

          const a = document.createElement("a");
          a.href = url;
          a.download = `Part Template.xlsx`;

          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);

          URL.revokeObjectURL(url);

          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const importPart = async (payload: File) => {
      const formData = new FormData();
      formData.append("file", payload);

      return await api
        .post(`/part/import`, formData)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };
    // --- END

    // --- TOOLS
    const getTools = async (payload: IParams) => {
      return await api
        .get(`/tools`, {
          params: payload,
        })
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const createTools = async (payload: ToolsCreateInterface) => {
      return await api
        .post(`/tools`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const updateTools = async (id: string, payload: ToolsCreateInterface) => {
      return await api
        .put(`/tools/${id}`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const deleteTools = async (id: string) => {
      return await api
        .delete(`/tools/${id}`)
        .then((res) => {
          return Promise.resolve(res);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };
    // --- END

    // --- MANPOWER
    const getManpower = async (payload: IParams) => {
      return await api
        .get(`/manpower`, {
          params: payload,
        })
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const getManpowerGrouping = async (payload: IParams) => {
      return await api
        .get(`/manpower-std/grouping`, {
          params: payload,
        })
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const createManpower = async (payload: ManpowerCreateInterface) => {
      return await api
        .post(`/manpower`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const updateManpower = async (
      id: string,
      payload: ManpowerCreateInterface
    ) => {
      return await api
        .put(`/manpower/${id}`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const deleteManpower = async (id: string) => {
      return await api
        .delete(`/manpower/${id}`)
        .then((res) => {
          return Promise.resolve(res);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const downloadManpower = async (params?: AxiosRequestConfig["params"]) => {
      return await api
        .post(
          `/manpower/export`,
          {},
          {
            responseType: "blob",
            params,
          }
        )
        .then((resp) => {
          const url = window.URL.createObjectURL(
            new Blob([resp.data], {
              type: resp.headers["content-type"],
            })
          );

          const a = document.createElement("a");
          a.href = url;
          a.download = `Manpower.xlsx`;

          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);

          URL.revokeObjectURL(url);

          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const templateManpower = async () => {
      return await api
        .post(
          `/manpower/template`,
          {},
          {
            responseType: "blob",
          }
        )
        .then((resp) => {
          const url = window.URL.createObjectURL(
            new Blob([resp.data], {
              type: resp.headers["content-type"],
            })
          );

          const a = document.createElement("a");
          a.href = url;
          a.download = `Manpower Template.xlsx`;

          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);

          URL.revokeObjectURL(url);

          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const importManpower = async (payload: File) => {
      const formData = new FormData();
      formData.append("file", payload);

      return await api
        .post(`/manpower/import`, formData)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };
    // --- END

    // --- USER
    const getUser = async (payload: IParams) => {
      return await api
        .get(`/user`, {
          params: payload,
        })
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const getNotificationLatest = async (payload: any) => {
      return await api
        .get(`/notification/latest/lists`, {
          params: payload,
        })
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const notificationMarkAsRead = async (uuid: string) => {
      return await api
        .get(`/notification/mark-as-read/${uuid}`)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const createUser = async (payload: UserCreateInterface) => {
      return await api
        .post(`/user`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const updateUser = async (id: number, payload: UserCreateInterface) => {
      return await api
        .put(`/user/${id}`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const deleteUser = async (id: number) => {
      return await api
        .delete(`/user/${id}`)
        .then((res) => {
          return Promise.resolve(res);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const downloadUser = async () => {
      return await api
        .post(
          `/user/export`,
          {},
          {
            responseType: "blob",
          }
        )
        .then((resp) => {
          const url = window.URL.createObjectURL(
            new Blob([resp.data], {
              type: resp.headers["content-type"],
            })
          );

          const a = document.createElement("a");
          a.href = url;
          a.download = `User.xlsx`;

          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);

          URL.revokeObjectURL(url);

          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const templateUser = async () => {
      return await api
        .post(
          `/user/template`,
          {},
          {
            responseType: "blob",
          }
        )
        .then((resp) => {
          const url = window.URL.createObjectURL(
            new Blob([resp.data], {
              type: resp.headers["content-type"],
            })
          );

          const a = document.createElement("a");
          a.href = url;
          a.download = `User Template.xlsx`;

          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);

          URL.revokeObjectURL(url);

          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const importUser = async (payload: File) => {
      const formData = new FormData();
      formData.append("file", payload);

      return await api
        .post(`/user/import`, formData)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };
    // --- END

    // --- ROLE
    const getRole = async (payload: IParams) => {
      return await api
        .get(`/role`, {
          params: payload,
        })
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const getPermission = async () => {
      return await api
        .get(`/role/list/permissions`)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const createRole = async (payload: RoleCreateInterface) => {
      return await api
        .post(`/role`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const updateRole = async (id: number, payload: RoleCreateInterface) => {
      return await api
        .put(`/role/${id}`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const deleteRole = async (id: number) => {
      return await api
        .delete(`/role/${id}`)
        .then((res) => {
          return Promise.resolve(res);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };
    // --- END

    // --- BIDANG
    const getBidang = async (payload: IParams) => {
      return await api
        .get(`/bidang`, {
          params: payload,
        })
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const createBidang = async (payload: BidangCreateInterface) => {
      return await api
        .post(`/bidang`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const updateBidang = async (id: string, payload: BidangCreateInterface) => {
      return await api
        .put(`/bidang/${id}`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const deleteBidang = async (id: string) => {
      return await api
        .delete(`/bidang/${id}`)
        .then((res) => {
          return Promise.resolve(res);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const downloadBidang = async () => {
      return await api
        .post(
          `/bidang/export`,
          {},
          {
            responseType: "blob",
          }
        )
        .then((resp) => {
          const url = window.URL.createObjectURL(
            new Blob([resp.data], {
              type: resp.headers["content-type"],
            })
          );

          const a = document.createElement("a");
          a.href = url;
          a.download = `Bidang.xlsx`;

          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);

          URL.revokeObjectURL(url);

          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const templateBidang = async () => {
      return await api
        .post(
          `/bidang/template`,
          {},
          {
            responseType: "blob",
          }
        )
        .then((resp) => {
          const url = window.URL.createObjectURL(
            new Blob([resp.data], {
              type: resp.headers["content-type"],
            })
          );

          const a = document.createElement("a");
          a.href = url;
          a.download = `Bidang Template.xlsx`;

          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);

          URL.revokeObjectURL(url);

          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const importBidang = async (payload: File) => {
      const formData = new FormData();
      formData.append("file", payload);

      return await api
        .post(`/bidang/import`, formData)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };
    // --- END

    // --- area
    const getArea = async (payload: IParams) => {
      return await api
        .get(`/area`, {
          params: payload,
        })
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const createArea = async (payload: AreaCreateInterface) => {
      return await api
        .post(`/area`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const updateArea = async (id: string, payload: AreaCreateInterface) => {
      return await api
        .put(`/area/${id}`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const deleteArea = async (id: string) => {
      return await api
        .delete(`/area/${id}`)
        .then((res) => {
          return Promise.resolve(res);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const downloadArea = async () => {
      return await api
        .post(
          `/area/export`,
          {},
          {
            responseType: "blob",
          }
        )
        .then((resp) => {
          const url = window.URL.createObjectURL(
            new Blob([resp.data], {
              type: resp.headers["content-type"],
            })
          );

          const a = document.createElement("a");
          a.href = url;
          a.download = `Area.xlsx`;

          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);

          URL.revokeObjectURL(url);

          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const templateArea = async () => {
      return await api
        .post(
          `/area/template`,
          {},
          {
            responseType: "blob",
          }
        )
        .then((resp) => {
          const url = window.URL.createObjectURL(
            new Blob([resp.data], {
              type: resp.headers["content-type"],
            })
          );

          const a = document.createElement("a");
          a.href = url;
          a.download = `Area Template.xlsx`;

          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);

          URL.revokeObjectURL(url);

          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const importArea = async (payload: File) => {
      const formData = new FormData();
      formData.append("file", payload);

      return await api
        .post(`/area/import`, formData)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };
    // --- END

    // --- SUBBIDANG
    const getSubBidang = async (payload: IParams) => {
      return await api
        .get(`/sub-bidang`, {
          params: payload,
        })
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const createSubBidang = async (payload: SubBidangCreateInterface) => {
      return await api
        .post(`/sub-bidang`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const updateSubBidang = async (
      id: string,
      payload: SubBidangCreateInterface
    ) => {
      return await api
        .put(`/sub-bidang/${id}`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const deleteSubBidang = async (id: string) => {
      return await api
        .delete(`/sub-bidang/${id}`)
        .then((res) => {
          return Promise.resolve(res);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const downloadSubBidang = async (params?: AxiosRequestConfig["params"]) => {
      return await api
        .post(
          `/sub-bidang/export`,
          {},
          {
            responseType: "blob",
            params,
          }
        )
        .then((resp) => {
          const url = window.URL.createObjectURL(
            new Blob([resp.data], {
              type: resp.headers["content-type"],
            })
          );

          const a = document.createElement("a");
          a.href = url;
          a.download = `Sub Bidang.xlsx`;

          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);

          URL.revokeObjectURL(url);

          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const templateSubBidang = async () => {
      return await api
        .post(
          `/sub-bidang/template`,
          {},
          {
            responseType: "blob",
          }
        )
        .then((resp) => {
          const url = window.URL.createObjectURL(
            new Blob([resp.data], {
              type: resp.headers["content-type"],
            })
          );

          const a = document.createElement("a");
          a.href = url;
          a.download = `Sub Bidang Template.xlsx`;

          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);

          URL.revokeObjectURL(url);

          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const importSubBidang = async (payload: File) => {
      const formData = new FormData();
      formData.append("file", payload);

      return await api
        .post(`/sub-bidang/import`, formData)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };
    // --- END

    // --- SUB AREA
    const getSubArea = async (payload: IParams) => {
      return await api
        .get(`/sub-area`, {
          params: payload,
        })
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const createSubArea = async (payload: SubAreaCreateInterface) => {
      return await api
        .post(`/sub-area`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const updateSubArea = async (
      id: string,
      payload: SubAreaCreateInterface
    ) => {
      return await api
        .put(`/sub-area/${id}`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const deleteSubArea = async (id: string) => {
      return await api
        .delete(`/sub-area/${id}`)
        .then((res) => {
          return Promise.resolve(res);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const downloadSubArea = async (params?: AxiosRequestConfig["params"]) => {
      return await api
        .post(
          `/sub-area/export`,
          {},
          {
            responseType: "blob",
            params,
          }
        )
        .then((resp) => {
          const url = window.URL.createObjectURL(
            new Blob([resp.data], {
              type: resp.headers["content-type"],
            })
          );

          const a = document.createElement("a");
          a.href = url;
          a.download = `Sub Area.xlsx`;

          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);

          URL.revokeObjectURL(url);

          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const templateSubArea = async () => {
      return await api
        .post(
          `/sub-area/template`,
          {},
          {
            responseType: "blob",
          }
        )
        .then((resp) => {
          const url = window.URL.createObjectURL(
            new Blob([resp.data], {
              type: resp.headers["content-type"],
            })
          );

          const a = document.createElement("a");
          a.href = url;
          a.download = `Sub Area Template.xlsx`;

          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);

          URL.revokeObjectURL(url);

          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const importSubArea = async (payload: File) => {
      const formData = new FormData();
      formData.append("file", payload);

      return await api
        .post(`/sub-area/import`, formData)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };
    // --- END

    // --- HSE DOC
    const getHseDoc = async (payload: IParams) => {
      return await api
        .get(`/hse-doc`, {
          params: payload,
        })
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const createHseDoc = async (payload: HseDocCreateInterface) => {
      return await api
        .post(`/hse-doc`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const updateHseDoc = async (id: string, payload: HseDocCreateInterface) => {
      return await api
        .put(`/hse-doc/${id}`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const deleteHseDoc = async (id: string) => {
      return await api
        .delete(`/hse-doc/${id}`)
        .then((res) => {
          return Promise.resolve(res);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const downloadHseDoc = async () => {
      return await api
        .post(
          `/hse-doc/export`,
          {},
          {
            responseType: "blob",
          }
        )
        .then((resp) => {
          const url = window.URL.createObjectURL(
            new Blob([resp.data], {
              type: resp.headers["content-type"],
            })
          );

          const a = document.createElement("a");
          a.href = url;
          a.download = `HSE Doc.xlsx`;

          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);

          URL.revokeObjectURL(url);

          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const templateHseDoc = async () => {
      return await api
        .post(
          `/hse-doc/template`,
          {},
          {
            responseType: "blob",
          }
        )
        .then((resp) => {
          const url = window.URL.createObjectURL(
            new Blob([resp.data], {
              type: resp.headers["content-type"],
            })
          );

          const a = document.createElement("a");
          a.href = url;
          a.download = `HSE Doc Template.xlsx`;

          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);

          URL.revokeObjectURL(url);

          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const importHseDoc = async (payload: File) => {
      const formData = new FormData();
      formData.append("file", payload);

      return await api
        .post(`/hse-doc/import`, formData)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };
    // --- END

    // --- HSE
    const getHse = async (payload: IParams) => {
      return await api
        .get(`/hse`, {
          params: payload,
        })
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const createHse = async (payload: HseCreateInterface) => {
      return await api
        .post(`/hse`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const updateHse = async (id: string, payload: HseCreateInterface) => {
      return await api
        .put(`/hse/${id}`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const deleteHse = async (id: string) => {
      return await api
        .delete(`/hse/${id}`)
        .then((res) => {
          return Promise.resolve(res);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };
    // --- END

    // --- HSE
    const getSequence = async (payload: IParams) => {
      return await api
        .get(`/sequence`, {
          params: payload,
        })
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const createSequence = async (payload: SequenceCreateInterface) => {
      return await api
        .post(`/sequence`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const updateSequence = async (
      id: string,
      payload: SequenceCreateInterface
    ) => {
      return await api
        .put(`/sequence/${id}`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const deleteSequence = async (id: string) => {
      return await api
        .delete(`/sequence/${id}`)
        .then((res) => {
          return Promise.resolve(res);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const downloadSequence = async () => {
      return await api
        .post(
          `/sequence/export`,
          {},
          {
            responseType: "blob",
          }
        )
        .then((resp) => {
          const url = window.URL.createObjectURL(
            new Blob([resp.data], {
              type: resp.headers["content-type"],
            })
          );

          const a = document.createElement("a");
          a.href = url;
          a.download = `Sequence.xlsx`;

          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);

          URL.revokeObjectURL(url);

          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const templateSequence = async () => {
      return await api
        .post(
          `/sequence/template`,
          {},
          {
            responseType: "blob",
          }
        )
        .then((resp) => {
          const url = window.URL.createObjectURL(
            new Blob([resp.data], {
              type: resp.headers["content-type"],
            })
          );

          const a = document.createElement("a");
          a.href = url;
          a.download = `Sequence Template.xlsx`;

          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);

          URL.revokeObjectURL(url);

          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const importSequence = async (payload: File) => {
      const formData = new FormData();
      formData.append("file", payload);

      return await api
        .post(`/sequence/import`, formData)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };
    // --- END

    // ACTIVITY
    const getActivity = async (payload: IParams, prefix: string = "") => {
      return await api
        .get(`${prefix}/activity`, {
          params: payload,
        })
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const createActivity = async (payload: ActivityCreateInterface) => {
      return await api
        .post(`/activity`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const updateActivity = async (
      id: string,
      payload: ActivityCreateInterface
    ) => {
      return await api
        .put(`/activity/${id}`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const deleteActivity = async (id: string, prefix: string = "") => {
      return await api
        .delete(`${prefix}/activity/${id}`)
        .then((res) => {
          return Promise.resolve(res);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const downloadActivity = async (params?: AxiosRequestConfig["params"], prefix: string = "") => {
      return await api
        .post(
          `${prefix}/activity/export`,
          {},
          {
            responseType: "blob",
            params,
          }
        )
        .then((resp) => {
          const url = window.URL.createObjectURL(
            new Blob([resp.data], {
              type: resp.headers["content-type"],
            })
          );

          const a = document.createElement("a");
          a.href = url;
          a.download = `Activity.xlsx`;

          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);

          URL.revokeObjectURL(url);

          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const templateActivity = async (prefix: string = "") => {
      return await api
        .post(
          `${prefix}/activity/template`,
          {},
          {
            responseType: "blob",
          }
        )
        .then((resp) => {
          const url = window.URL.createObjectURL(
            new Blob([resp.data], {
              type: resp.headers["content-type"],
            })
          );

          const a = document.createElement("a");
          a.href = url;
          a.download = `Activity Template.xlsx`;

          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);

          URL.revokeObjectURL(url);

          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const importActivity = async (payload: File, prefix: string = "") => {
      const formData = new FormData();
      formData.append("file", payload);

      return await api
        .post(`${prefix}/activity/import`, formData)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };
    // END

    // EQUIPMENT
    const getEquipment = async (payload: IParams, prefix: string = "") => {
      return await api
        .get(`/equipment`, {
          params: payload,
        })
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const createEquipment = async (payload: EquipmentCreateInterface) => {
      return await api
        .post(`/equipment`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const updateEquipment = async (
      id: string,
      payload: EquipmentCreateInterface
    ) => {
      return await api
        .put(`/equipment/${id}`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const deleteEquipment = async (id: string, prefix: string = "") => {
      return await api
        .delete(`${prefix}/equipment/${id}`)
        .then((res) => {
          return Promise.resolve(res);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const downloadEquipment = async (params?: AxiosRequestConfig["params"], prefix: string = "") => {
      return await api
        .post(
          `${prefix}/equipment/export`,
          {},
          {
            responseType: "blob",
            params,
          }
        )
        .then((resp) => {
          const url = window.URL.createObjectURL(
            new Blob([resp.data], {
              type: resp.headers["content-type"],
            })
          );

          const a = document.createElement("a");
          a.href = url;
          a.download = `Equipment.xlsx`;

          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);

          URL.revokeObjectURL(url);

          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const templateEquipment = async (prefix: string = "") => {
      return await api
        .post(
          `${prefix}/equipment/template`,
          {},
          {
            responseType: "blob",
          }
        )
        .then((resp) => {
          const url = window.URL.createObjectURL(
            new Blob([resp.data], {
              type: resp.headers["content-type"],
            })
          );

          const a = document.createElement("a");
          a.href = url;
          a.download = `Equipment Template.xlsx`;

          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);

          URL.revokeObjectURL(url);

          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const importEquipment = async (payload: File, prefix: string = "") => {
      const formData = new FormData();
      formData.append("file", payload);

      return await api
        .post(`${prefix}/equipment/import`, formData)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };
    // END

    // PART STD
    const getPartStd = async (payload: IParams, prefix: string = "") => {
      return await api
        .get(`${prefix}/part-std`, {
          params: payload,
        })
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const createPartStd = async (payload: PartStdCreateInterface) => {
      return await api
        .post(`/part-std`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const updatePartStd = async (
      id: string,
      payload: PartStdCreateInterface
    ) => {
      return await api
        .put(`/part-std/${id}`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const deletePartStd = async (id: string, prefix: string = "") => {
      return await api
        .delete(`${prefix}/part-std/${id}`)
        .then((res) => {
          return Promise.resolve(res);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const downloadPartStd = async (params?: AxiosRequestConfig["params"], prefix: string = "") => {
      return await api
        .post(
          `${prefix}/part-std/export`,
          {},
          {
            responseType: "blob",
            params,
          }
        )
        .then((resp) => {
          const url = window.URL.createObjectURL(
            new Blob([resp.data], {
              type: resp.headers["content-type"],
            })
          );

          const a = document.createElement("a");
          a.href = url;
          a.download = `Part Standart.xlsx`;

          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);

          URL.revokeObjectURL(url);

          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const templatePartStd = async (prefix: string = "") => {
      return await api
        .post(
          `${prefix}/part-std/template`,
          {},
          {
            responseType: "blob",
          }
        )
        .then((resp) => {
          const url = window.URL.createObjectURL(
            new Blob([resp.data], {
              type: resp.headers["content-type"],
            })
          );

          const a = document.createElement("a");
          a.href = url;
          a.download = `Part Standart Template.xlsx`;

          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);

          URL.revokeObjectURL(url);

          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const importPartStd = async (payload: File, prefix: string = '') => {
      const formData = new FormData();
      formData.append("file", payload);

      return await api
        .post(`${prefix}/part-std/import`, formData)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };
    // END

    // MANPOWER STD
    const getManpowerStd = async (payload: IParams, prefix: string = "") => {
      return await api
        .get(`${prefix}/manpower-std`, {
          params: payload,
        })
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const createManpowerStd = async (payload: ManpowerStdCreateInterface) => {
      return await api
        .post(`/manpower-std`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const updateManpowerStd = async (
      id: string,
      payload: ManpowerStdCreateInterface
    ) => {
      return await api
        .put(`/manpower-std/${id}`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const deleteManpowerStd = async (id: string, prefix: string = "") => {
      return await api
        .delete(`${prefix}/manpower-std/${id}`)
        .then((res) => {
          return Promise.resolve(res);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const downloadManpowerStd = async (
      params?: AxiosRequestConfig["params"],
      prefix: string = ""
    ) => {
      return await api
        .post(
          `${prefix}/manpower-std/export`,
          {},
          {
            params,
            responseType: "blob",
          }
        )
        .then((resp) => {
          const url = window.URL.createObjectURL(
            new Blob([resp.data], {
              type: resp.headers["content-type"],
            })
          );

          const a = document.createElement("a");
          a.href = url;
          a.download = `Manpower Standart.xlsx`;

          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);

          URL.revokeObjectURL(url);

          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const templateManpowerStd = async (prefix: string = "") => {
      return await api
        .post(
          `${prefix}/manpower-std/template`,
          {},
          {
            responseType: "blob",
          }
        )
        .then((resp) => {
          const url = window.URL.createObjectURL(
            new Blob([resp.data], {
              type: resp.headers["content-type"],
            })
          );

          const a = document.createElement("a");
          a.href = url;
          a.download = `Manpower Standart Template.xlsx`;

          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);

          URL.revokeObjectURL(url);

          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const importManpowerStd = async (payload: File, prefix: string = "") => {
      const formData = new FormData();
      formData.append("file", payload);

      return await api
        .post(`${prefix}/manpower-std/import`, formData)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };
    // END

    // CONSUMABLE MATERIAL STD
    const getConsumableMaterialStd = async (payload: IParams, prefix: string = "") => {
      return await api
        .get(`${prefix}/cons-mat-std`, {
          params: payload,
        })
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const createConsumableMaterialStd = async (
      payload: ConsumableMaterialStdCreateInterface
    ) => {
      return await api
        .post(`/cons-mat-std`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const updateConsumableMaterialStd = async (
      id: string,
      payload: ConsumableMaterialStdCreateInterface
    ) => {
      return await api
        .put(`/cons-mat-std/${id}`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const deleteConsumableMaterialStd = async (id: string) => {
      return await api
        .delete(`/cons-mat-std/${id}`)
        .then((res) => {
          return Promise.resolve(res);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const downloadConsumableMaterialStd = async (
      params?: AxiosRequestConfig["params"],
      prefix: string = ""
    ) => {
      return await api
        .post(
          `${prefix}/cons-mat-std/export`,
          {},
          {
            responseType: "blob",
            params,
          }
        )
        .then((resp) => {
          const url = window.URL.createObjectURL(
            new Blob([resp.data], {
              type: resp.headers["content-type"],
            })
          );

          const a = document.createElement("a");
          a.href = url;
          a.download = `Consumable Material Standart.xlsx`;

          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);

          URL.revokeObjectURL(url);

          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const templateConsumableMaterialStd = async (prefix: string = "") => {
      return await api
        .post(
          `${prefix}/cons-mat-std/template`,
          {},
          {
            responseType: "blob",
          }
        )
        .then((resp) => {
          const url = window.URL.createObjectURL(
            new Blob([resp.data], {
              type: resp.headers["content-type"],
            })
          );

          const a = document.createElement("a");
          a.href = url;
          a.download = `Consumable Material Standart Template.xlsx`;

          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);

          URL.revokeObjectURL(url);

          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const importConsumableMaterialStd = async (payload: File, prefix: string = "") => {
      const formData = new FormData();
      formData.append("file", payload);

      return await api
        .post(`${prefix}/cons-mat-std/import`, formData)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };
    // END

    // QC PLAN
    const getQcPlan = async (payload: IParams) => {
      return await api
        .get(`/qc-plan`, {
          params: payload,
        })
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const createQcPlan = async (payload: QCPlanCreateInterface) => {
      return await api
        .post(`/qc-plan`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const updateQcPlan = async (id: string, payload: QCPlanCreateInterface) => {
      return await api
        .put(`/qc-plan/${id}`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const deleteQcPlan = async (id: string) => {
      return await api
        .delete(`/qc-plan/${id}`)
        .then((res) => {
          return Promise.resolve(res);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const downloadQcPlan = async (params?: AxiosRequestConfig["params"]) => {
      return await api
        .post(
          `/qc-plan/export`,
          {},
          {
            responseType: "blob",
            params,
          }
        )
        .then((resp) => {
          const url = window.URL.createObjectURL(
            new Blob([resp.data], {
              type: resp.headers["content-type"],
            })
          );

          const a = document.createElement("a");
          a.href = url;
          a.download = `QC Plan.xlsx`;

          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);

          URL.revokeObjectURL(url);

          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const templateQcPlan = async () => {
      return await api
        .post(
          `/qc-plan/template`,
          {},
          {
            responseType: "blob",
          }
        )
        .then((resp) => {
          const url = window.URL.createObjectURL(
            new Blob([resp.data], {
              type: resp.headers["content-type"],
            })
          );

          const a = document.createElement("a");
          a.href = url;
          a.download = `QC Plan Template.xlsx`;

          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);

          URL.revokeObjectURL(url);

          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const importQcPlan = async (payload: File) => {
      const formData = new FormData();
      formData.append("file", payload);

      return await api
        .post(`/qc-plan/import`, formData)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };
    // END

    return {
      getLocation,
      createLocation,
      updateLocation,
      deleteLocation,
      downloadLocation,
      templateLocation,
      importLocation,
      getUnit,
      createUnit,
      updateUnit,
      deleteUnit,
      downloadUnit,
      templateUnit,
      importUnit,
      getMachine,
      createMachine,
      updateMachine,
      deleteMachine,
      downloadMachine,
      templateMachine,
      importMachine,
      getInspectionType,
      createInspectionType,
      updateInspectionType,
      deleteInspectionType,
      downloadInspectionType,
      templateInspectionType,
      importInspectionType,
      getGlobalUnit,
      createGlobalUnit,
      updateGlobalUnit,
      deleteGlobalUnit,
      downloadGlobalUnit,
      templateGlobalUnit,
      importGlobalUnit,
      getScope,
      createScope,
      updateScope,
      deleteScope,
      downloadScope,
      templateScope,
      importScope,
      getAdditionalScope,
      createAdditionalScope,
      updateAdditionalScope,
      deleteAdditionalScope,
      downloadAdditionalScope,
      templateAdditionalScope,
      importAdditionalScope,
      getConsMat,
      createConsMat,
      updateConsMat,
      deleteConsMat,
      downloadConsMat,
      templateConsMat,
      importConsMat,
      getPart,
      createPart,
      updatePart,
      deletePart,
      downloadPart,
      templatePart,
      importPart,
      getTools,
      createTools,
      updateTools,
      deleteTools,
      getManpower,
      createManpower,
      updateManpower,
      deleteManpower,
      downloadManpower,
      templateManpower,
      importManpower,
      getUser,
      createUser,
      updateUser,
      deleteUser,
      downloadUser,
      templateUser,
      importUser,
      getRole,
      getPermission,
      createRole,
      updateRole,
      deleteRole,
      getBidang,
      createBidang,
      updateBidang,
      deleteBidang,
      downloadBidang,
      templateBidang,
      importBidang,
      getSubBidang,
      createSubBidang,
      updateSubBidang,
      deleteSubBidang,
      downloadSubBidang,
      templateSubBidang,
      importSubBidang,
      getHseDoc,
      updateHseDoc,
      createHseDoc,
      deleteHseDoc,
      downloadHseDoc,
      templateHseDoc,
      importHseDoc,
      getHse,
      createHse,
      updateHse,
      deleteHse,
      getSequence,
      createSequence,
      updateSequence,
      deleteSequence,
      downloadSequence,
      templateSequence,
      importSequence,
      getActivity,
      createActivity,
      updateActivity,
      deleteActivity,
      downloadActivity,
      templateActivity,
      importActivity,
      getEquipment,
      createEquipment,
      updateEquipment,
      deleteEquipment,
      downloadEquipment,
      templateEquipment,
      importEquipment,
      getPartStd,
      createPartStd,
      updatePartStd,
      deletePartStd,
      downloadPartStd,
      templatePartStd,
      importPartStd,
      getManpowerStd,
      createManpowerStd,
      updateManpowerStd,
      deleteManpowerStd,
      downloadManpowerStd,
      templateManpowerStd,
      importManpowerStd,
      getConsumableMaterialStd,
      createConsumableMaterialStd,
      updateConsumableMaterialStd,
      deleteConsumableMaterialStd,
      downloadConsumableMaterialStd,
      templateConsumableMaterialStd,
      importConsumableMaterialStd,
      getQcPlan,
      createQcPlan,
      updateQcPlan,
      deleteQcPlan,
      downloadQcPlan,
      templateQcPlan,
      importQcPlan,
      getPartGrouping,
      getManpowerGrouping,
      getConsMatGrouping,
      getNotificationLatest,
      notificationMarkAsRead,
      getArea,
      createArea,
      updateArea,
      deleteArea,
      downloadArea,
      templateArea,
      importArea,
      getSubArea,
      createSubArea,
      updateSubArea,
      deleteSubArea,
      downloadSubArea,
      templateSubArea,
      importSubArea,
    };
  },
  {
    persist: {
      storage: encryptStorage as StorageLike,
      pick: [],
    },
  }
);
