/* eslint-disable react/prop-types */
/** @jsx createElementEntity */
import { COLLISION_LAYERS } from "../constants";
import { createElementEntity } from "../utils/jsx-entity";
import ai_characterModelSrc from "../assets/models/custom/ai_character3.glb";
import { cloneModelFromCache, loadModel } from "../components/gltf-model-plus";
import { preload } from "../utils/preload";

preload(loadModel(ai_characterModelSrc, null, true));

export function AvatarPrefab() {
  return (
    <entity
      name="Avatar Frame"
      networked
      networkedTransform
      cursorRaycastable
      remoteHoverTarget
      handCollisionTarget
      offersRemoteConstraint
      offersHandConstraint
      destroyAtExtremeDistance
      // holdable
      rigidbody={{
        gravity: -9.8,
        collisionGroup: COLLISION_LAYERS.INTERACTABLES,
        collisionMask:
          COLLISION_LAYERS.HANDS |
          COLLISION_LAYERS.ENVIRONMENT |
          COLLISION_LAYERS.INTERACTABLES |
          COLLISION_LAYERS.AVATAR
      }}
      physicsShape={{ halfExtents: [0.5, 0.5, 0.5] }}
    >
      <entity
        model={{ model: cloneModelFromCache(ai_characterModelSrc).scene }}
        scale={[1, 1, 1]}
        rotation={[0, 80, 0]}
        position={[0, -1.5, 0]}
      />
    </entity>
  );
}
