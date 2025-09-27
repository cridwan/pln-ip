import type { InspectionTypeInterface } from "@/modules/master/types/InspectionType";

export type StatusProjectType = "approve" | "pending";


interface ApprovedByInterface {
    name: string
}
export interface ProjectInterface {
    name: string;
    uuid: string;
    inspection_type_uuid: string;
    inspection_type: InspectionTypeInterface;
    status: StatusProjectType;
    approved_at: string;
    unapproved_at: string;
    approved_by: string;
    approved_by_user: ApprovedByInterface;
    reason: string;
    created_at: string;
    updated_at: string;
}