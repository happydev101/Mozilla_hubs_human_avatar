import { MediaLoaderParams } from "../inflators/media-loader";
import { CameraPrefab, CubeMediaFramePrefab } from "../prefabs/camera-tool";
import { MediaPrefab } from "../prefabs/media";
import { EntityDef } from "../utils/jsx-entity";
import { AvatarPrefab } from "./avatar";

type CameraPrefabT = () => EntityDef;
type CubeMediaPrefabT = () => EntityDef;
type MediaPrefabT = (params: MediaLoaderParams) => EntityDef;
type AvatarPrefabT = () => EntityDef;

export type PrefabDefinition = {
  permission?: "spawn_camera";
  template: CameraPrefabT | CubeMediaPrefabT | MediaPrefabT | AvatarPrefabT;
};

export type PrefabName = "camera" | "cube" | "media" | "avatar";

export const prefabs = new Map<PrefabName, PrefabDefinition>();
prefabs.set("camera", { permission: "spawn_camera", template: CameraPrefab });
prefabs.set("cube", { template: CubeMediaFramePrefab });
prefabs.set("media", { template: MediaPrefab });
prefabs.set("avatar", { template: AvatarPrefab});
