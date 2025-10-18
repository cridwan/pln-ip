import { defineStore } from "pinia";

import { api } from "@/api/axios";
import { encryptStorage } from "@/utils/storage";
import type { StorageLike } from "pinia-plugin-persistedstate";
import type { IParams } from "@/types/GlobalType";

import type {
  CreateScopeInterface,
  FormAdScopeInterface,
  FormScopeInterface,
} from "../types/ScopeType";
import type { UpdateConsMatInterface } from "../types/ConsumableMaterialType";
import type { UpdateManPowerInterface } from "../types/ManpowerType";
import type { UpdatePartInterface } from "../types/PartType";
import type { CreateAddScopeInterface } from "../types/AddScopeTableType";
import type { UpdateToolsInterface } from "../types/ToolsType";
import type { CreateHseInterface } from "../types/HseType";
import type { FormEquipmentCloneInterface } from "../types/EquipmentType";
import type { FormActivityInterfaceClone } from "../types/ActivityType";
import type { FormPartCloneInterface } from "../types/PartStdType";
import type { FormConsMatCloneInterface } from "../types/ConsumableMaterialStdType";
import type { FormManpowerCloneInterface } from "../types/ManpowerStdType";
import type { FormApprovalInterface, FormRequestApprovalInterface } from "../types/ApprovalType";

export const useTransactionStore = defineStore(
  "transaction",
  () => {
    const getTotalDurationScope = async (payload: Record<string, any>) => {
      return await api
        .get(`/transaction/scope-standart/resource/duration`, {
          params: payload,
        })
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const getScopeStandar = async (payload: IParams) => {
      return await api
        .get(`/transaction/scope-standart/resource/pagination`, {
          params: payload,
        })
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const getSelectScopeStandar = async (payload: IParams) => {
      return await api
        .get(`/transaction/scope-standart/resource/select/options`, {
          params: payload,
        })
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const cloneScopeStandar = async (payload: FormScopeInterface) => {
      return await api
        .post(`/transaction/scope-standart/resource/clone`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const cloneAdScopeStandar = async (payload: FormAdScopeInterface) => {
      return await api
        .post(`/transaction/additional-scope/resource/clone`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const createScopeStandar = async (payload: CreateScopeInterface) => {
      return await api
        .post(`/transaction/scope-standart/resource/asset`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const deleteScopeStandar = async (id: string) => {
      return await api
        .delete(`/transaction/scope-standart/${id}`)
        .then((res) => {
          return Promise.resolve(res);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const getActivity = async (payload: IParams) => {
      return await api
        .get(`/transaction/activity/resource/pagination`, {
          params: payload,
        })
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const getSelectActivity = async (payload: IParams) => {
      return await api
        .get(`/transaction/activity/resource/select/options`, {
          params: payload,
        })
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const createActivity = async (payload: CreateScopeInterface) => {
      return await api
        .post(`/transaction/activity/resource/asset`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };
    const createActivityClone = async (payload: FormActivityInterfaceClone) => {
      return await api
        .post(`/transaction/activity/resource/clone`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const deleteActivity = async (id: string) => {
      return await api
        .delete(`/transaction/activity/${id}`)
        .then((res) => {
          return Promise.resolve(res);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const getEquipment = async (payload: IParams) => {
      return await api
        .get(`/transaction/equipment/resource/pagination`, {
          params: payload,
        })
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const getSelectEquipment = async (payload: IParams) => {
      return await api
        .get(`/transaction/equipment/resource/select/options`, {
          params: payload,
        })
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const createEquipment = async (payload: CreateScopeInterface) => {
      return await api
        .post(`/transaction/equipment/resource/asset`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const cloneEquipment = async (payload: FormEquipmentCloneInterface) => {
      return await api
        .post(`/transaction/equipment/resource/clone`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const deleteEquipment = async (id: string) => {
      return await api
        .delete(`/transaction/equipment/${id}`)
        .then((res) => {
          return Promise.resolve(res);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const getConsMat = async (payload: IParams) => {
      return await api
        .get(`/transaction/consumable-material/resource/grouping`, {
          params: payload,
        })
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const getConsMatSelect = async (payload: IParams) => {
      return await api
        .get(`/transaction/consumable-material/resource/select/options`, {
          params: payload,
        })
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const updateConsMat = async (
      payload: UpdateConsMatInterface,
      id: string
    ) => {
      return await api
        .put(`/transaction/consumable-material/${id}`, payload)
        .then((res) => {
          return Promise.resolve(res);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const cloneConsMatStd = async (payload: FormConsMatCloneInterface) => {
      return await api
        .post(`/transaction/consumable-material/resource/clone`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const deleteConsMatStd = async (id: string) => {
      return await api
        .delete(`/transaction/consumable-material/${id}`)
        .then((res) => {
          return Promise.resolve(res);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const getManPower = async (payload: IParams) => {
      return await api
        .get(`/transaction/manpower/resource/grouping`, {
          params: payload,
        })
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const getManPowerSelect = async (payload: IParams) => {
      return await api
        .get(`/transaction/manpower/resource/select/options`, {
          params: payload,
        })
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const updateManPower = async (
      payload: UpdateManPowerInterface,
      id: string
    ) => {
      return await api
        .put(`/transaction/manpower/${id}`, payload)
        .then((res) => {
          return Promise.resolve(res);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const cloneManPowerStd = async (payload: FormManpowerCloneInterface) => {
      return await api
        .post(`/transaction/manpower/resource/clone`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const deleteManPowerStd = async (id: string) => {
      return await api
        .delete(`/transaction/manpower/${id}`)
        .then((res) => {
          return Promise.resolve(res);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const getPart = async (payload: IParams) => {
      return await api
        .get(`/transaction/part/resource/grouping`, {
          params: payload,
        })
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const getPartSelect = async (payload: IParams) => {
      return await api
        .get(`/transaction/part/resource/select/options`, {
          params: payload,
        })
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const updatePart = async (payload: UpdatePartInterface, id: string) => {
      return await api
        .put(`/transaction/part/${id}`, payload)
        .then((res) => {
          return Promise.resolve(res);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const clonePartStd = async (payload: FormPartCloneInterface) => {
      return await api
        .post(`/transaction/part/resource/clone`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const deletePartStd = async (id: string) => {
      return await api
        .delete(`/transaction/part/${id}`)
        .then((res) => {
          return Promise.resolve(res);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const getTools = async (payload: IParams) => {
      return await api
        .get(`/transaction/tools`, {
          params: payload,
        })
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const updateTools = async (payload: UpdateToolsInterface, id: string) => {
      return await api
        .put(`/transaction/tools/${id}`, payload)
        .then((res) => {
          return Promise.resolve(res);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const getHse = async (payload: IParams) => {
      return await api
        .get(`/transaction/hse/resource/pagination`, {
          params: payload,
        })
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const createHse = async (payload: CreateHseInterface) => {
      return await api
        .post(`/transaction/hse/resource`, payload)
        .then((res) => {
          return Promise.resolve(res);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const updateHse = async (id: string, payload: CreateHseInterface) => {
      return await api
        .put(`/transaction/hse/${id}`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const deleteHse = async (id: string) => {
      return await api
        .delete(`/transaction/hse/${id}`)
        .then((res) => {
          return Promise.resolve(res);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const getQcPlan = async (payload: IParams) => {
      return await api
        .get(`/transaction/qc-plan/resource/pagination`, {
          params: payload,
        })
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const getHseDoc = async (payload: IParams) => {
      return await api
        .get(`/transaction/hse/resource/pagination`, {
          params: payload,
        })
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const getAddScope = async (payload: IParams) => {
      return await api
        .get(`/transaction/additional-scope/resource/pagination`, {
          params: payload,
        })
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const deleteAdScope = async (id: string) => {
      return await api
        .delete(`/transaction/additional-scope/${id}`)
        .then((res) => {
          return Promise.resolve(res);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const createAddScope = async (payload: CreateAddScopeInterface) => {
      return await api
        .post(`/transaction/additional-scope/resource/asset`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const getDetailInspection = async (id: string) => {
      return await api
        .get(`/inspection-type/${id}`)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const getDownloadResultScope = async (project_uuid: string, type: string = 'SCOPE STANDART') => {
      return await api
        .get(`/transaction/result/resource/export/scope-standart`, {
          params: {
            project_uuid,
            type
          },
          responseType: "blob",
        })
        .then((resp) => {
          const url = window.URL.createObjectURL(
            new Blob([resp.data], {
              type: resp.headers["content-type"],
            })
          );

          const a = document.createElement("a");
          a.href = url;
          a.download = `Scope.xlsx`;

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

    const getDownloadResultBudgetActivity = async (project_uuid: string, type: string = 'SCOPE STANDART') => {
      return await api
        .get(`/transaction/result/resource/export/budget-activity`, {
          params: {
            project_uuid,
            type
          },
          responseType: "blob",
        })
        .then((resp) => {
          const url = window.URL.createObjectURL(
            new Blob([resp.data], {
              type: resp.headers["content-type"],
            })
          );

          const a = document.createElement("a");
          a.href = url;
          a.download = `Scope.xlsx`;

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

    const getDownloadResultConsMat = async (project_uuid: string) => {
      return await api
        .get(`/transaction/result/resource/export/consmat`, {
          params: {
            project_uuid,
          },
          responseType: "blob",
        })
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

    const getDownloadResultPart = async (project_uuid: string) => {
      return await api
        .get(`/transaction/result/resource/export/part`, {
          params: {
            project_uuid,
          },
          responseType: "blob",
        })
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

    const getDownloadResultManpower = async (project_uuid: string) => {
      return await api
        .get(`/transaction/result/resource/export/manpower`, {
          params: {
            project_uuid,
          },
          responseType: "blob",
        })
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

    const getDownloadResultTools = async (project_uuid: string) => {
      return await api
        .get(`/transaction/result/resource/export/tools`, {
          params: {
            project_uuid,
          },
          responseType: "blob",
        })
        .then((resp) => {
          const url = window.URL.createObjectURL(
            new Blob([resp.data], {
              type: resp.headers["content-type"],
            })
          );

          const a = document.createElement("a");
          a.href = url;
          a.download = `Tools.xlsx`;

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

    const getDownloadResultHse = async (project_uuid: string) => {
      return await api
        .get(`/transaction/result/resource/export/hse`, {
          params: {
            project_uuid,
          },
          responseType: "blob",
        })
        .then((resp) => {
          const url = window.URL.createObjectURL(
            new Blob([resp.data], {
              type: resp.headers["content-type"],
            })
          );

          const a = document.createElement("a");
          a.href = url;
          a.download = `Hse.xlsx`;

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

    const getDownloadResultQcPlan = async (project_uuid: string) => {
      return await api
        .get(`/transaction/result/resource/export/qc-plan`, {
          params: {
            project_uuid,
          },
          responseType: "blob",
        })
        .then((resp) => {
          const url = window.URL.createObjectURL(
            new Blob([resp.data], {
              type: resp.headers["content-type"],
            })
          );
          console.log('download pdf')
          const a = document.createElement("a");
          a.href = url;
          a.download = `QcPlan.xlsx`;

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


    const getProject = async (uuid: string) => {
      return await api
        .get(`/transaction/project/${uuid}/show`)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const approveProject = async (uuid: string, payload: FormApprovalInterface) => {
      return await api
        .put(`/transaction/project/${uuid}/approve`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const requestApproveProject = async (uuid: string, payload: FormRequestApprovalInterface) => {
      return await api
        .put(`/transaction/project/${uuid}/request-approve`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    return {
      getScopeStandar,
      createScopeStandar,
      deleteScopeStandar,
      getConsMat,
      updateConsMat,
      cloneConsMatStd,
      deleteConsMatStd,
      getManPower,
      updateManPower,
      cloneManPowerStd,
      deleteManPowerStd,
      getPart,
      updatePart,
      clonePartStd,
      deletePartStd,
      getTools,
      updateTools,
      getHse,
      createHse,
      updateHse,
      deleteHse,
      getQcPlan,
      getAddScope,
      createAddScope,
      getDetailInspection,
      getDownloadResultScope,
      getDownloadResultConsMat,
      getDownloadResultPart,
      getDownloadResultManpower,
      getDownloadResultTools,
      getDownloadResultHse,
      getDownloadResultQcPlan,
      getTotalDurationScope,
      getEquipment,
      createEquipment,
      deleteEquipment,
      getActivity,
      createActivity,
      createActivityClone,
      deleteActivity,
      cloneScopeStandar,
      cloneEquipment,
      cloneAdScopeStandar,
      getProject,
      approveProject,
      deleteAdScope,
      getSelectScopeStandar,
      getSelectEquipment,
      getSelectActivity,
      getPartSelect,
      getManPowerSelect,
      getConsMatSelect,
      getHseDoc,
      getDownloadResultBudgetActivity,
      requestApproveProject,
    };
  },
  {
    persist: {
      storage: encryptStorage as StorageLike,
      pick: [],
    },
  }
);
