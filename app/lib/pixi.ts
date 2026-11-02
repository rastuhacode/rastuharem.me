// Keep the same renderer and Graphics implementation without the public entry's
// asset loaders, text systems, events, and other automatic registrations.
// These internal paths are verified with PixiJS 8.22; check dependency updates.

// This is just for client's JS reduction as the PixiJS loads unused modules.
import "pixi-internal/rendering/init";

export { Application } from "pixi-internal/app/Application";
export { Graphics } from "pixi-internal/scene/graphics/shared/Graphics";
