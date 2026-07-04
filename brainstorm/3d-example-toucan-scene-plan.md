# 3D Toucan Website Scene Plan

## Goal

Create a bright tropical 3D product page where the toucan feels like the hero object for a premium client website package. The motion should feel intentional, readable, and centered, especially on mobile.

## Toucan Trajectory

- Keep the toucan close to the center of the viewport for the whole scroll.
- Use a mostly vertical track:
  - Start slightly below center and a little farther from the camera.
  - Rise toward center as the first section introduces the product.
  - Move closer to camera around the middle section for the strongest hero moment.
  - Drift upward or slightly back out near the final CTA so text has room.
- Avoid wide left-to-right sweeps.
- On mobile, horizontal movement should be almost zero.
- On desktop, horizontal movement can be subtle, only enough to feel alive.
- Rotation should reveal the toucan naturally:
  - Slow body turn as the page scrolls.
  - Slight banking motion, like a perched bird shifting balance.
  - No spinning or tech-demo rotation.

## Camera And Scale

- Camera stays stable and mostly centered.
- Use the toucan movement, not camera movement, as the main scroll effect.
- The toucan should never get so close that the beak or body clips out awkwardly.
- The closest point should feel like an intentional product reveal.
- Mobile scale should be slightly smaller than desktop so the bird does not crush the copy.

## Tropical Visual Direction

- Make the environment clearly tropical and colorful.
- Use claymation-friendly elements:
  - Palm trees or palm fronds in the background.
  - Big soft tropical leaves.
  - Rainbow arc or partial rainbow behind the toucan.
  - Warm sun glow.
  - Colorful ambient particles like pollen, mist, or tiny light flecks.
  - Optional stylized clouds.
- Keep the background decorative, not cluttered.
- The toucan remains the primary subject.

## Scene Layout

- Fixed 3D canvas behind scroll content.
- Foreground text sections scroll over the scene.
- Use parallax depth:
  - Far layer: sky gradient, rainbow, clouds.
  - Mid layer: palm silhouettes or large leaves.
  - Hero layer: toucan model.
  - Near layer: subtle particles or light flecks.
- Keep visual weight balanced around the center so it works on mobile.

## Lighting

- Bright tropical lighting, not dark cinematic lighting.
- Main light: warm sun from upper left.
- Fill light: soft cyan/sky color.
- Accent light: warm pink/orange bounce to bring out the toucan colors.
- Avoid swampy dark green fog.
- Shadows should be soft and clay-like.

## Page Content

- Copy should sell this as a purchasable 3D website item.
- Suggested sections:
  - Hero: "A 3D website that makes your offer impossible to ignore."
  - Scroll Story: explain the object moving with the page.
  - Client Uses: restaurants, products, mascots, launches, luxury services.
  - Deliverables: 3D model placement, scroll choreography, responsive sections, deployment.
  - CTA: "Your company's call to action, brought to life."

## Avoid

- Neon sci-fi rings as the dominant visual.
- Dark teal swamp mood.
- Huge sideways toucan path.
- Overly busy background elements competing with the model.
- Generic tech-demo motion.
- Clipping the toucan off-screen on mobile.

## Next Build Pass

1. Replace the current decorative scene elements with tropical set pieces.
2. Rework toucan scroll math around a vertical center path.
3. Add simple palm/rainbow/cloud elements as lightweight Three primitives or image planes.
4. Tune mobile separately so the model stays centered and readable.
5. Only then refine copy, CTA styling, and section rhythm.
