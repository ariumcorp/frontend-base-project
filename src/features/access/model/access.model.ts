import { AccessType } from "@/utils";
import { z } from "zod";

export const ActionPermissionSchema = z.object({
  code: z.string(),
  name: z.string(),
  description: z.string(),
  isAllowed: z.number(),
});

export type ActionPermission = z.infer<typeof ActionPermissionSchema>;

export const initialStateActionPermission: ActionPermission = {
  code: "",
  name: "",
  description: "",
  isAllowed: 0,
};

export const accessSchema = z.object({
  id: z.number(),
  applicationId: z.number(),
  applicationCode: z.string(),
  resourceTypeId: z.number(),
  resourceTypeCode: z.nativeEnum(AccessType),
  code: z.string(),
  parentId: z.number().nullable(),
  parentCode: z.string().nullable(),
  name: z.string(),
  description: z.string(),
  path: z.string(),
  icon: z.string(),
  order: z.number(),
  createdDatetime: z.string().datetime(),
  createdBy: z.string(),
  updatedDatetime: z.string().datetime(),
  updatedBy: z.string(),
  pathsParent: z.array(z.string()),
  pathComplete: z.string(),
  actions: z.array(ActionPermissionSchema),
});

export type Access = z.infer<typeof accessSchema> & {
  children: Access[];
};

export const initialStateAccess: Access = {
  id: 0,
  applicationId: 0,
  applicationCode: "",
  resourceTypeCode: AccessType.Menu,
  resourceTypeId: 0,
  code: "",
  parentId: 0,
  parentCode: "",
  name: "",
  description: "",
  path: "",
  icon: "",
  order: 0,
  createdDatetime: "",
  createdBy: "",
  updatedDatetime: "",
  updatedBy: "",
  children: [],
  pathsParent: [],
  pathComplete: "",
  actions: [],
};
