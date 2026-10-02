// Direction contract for the shop's visual world, emitted as an HTML comment
// so it survives the production build and can be audited from the markup.
const CONTRACT = `<!--
THESIS: A game store whose first screen already recommends. The spotlight Game and the Games closest to it in meaning share one stage; refuses the hero-banner-then-identical-card-grid store page.
OWN-WORLD: Ink-navy ground (Steam lineage), acid-lime action color, cover art as the only other color. Expanded heavy Archivo lettering like box-art titling, Geist for reading. Crisp small radii, hairline rings, capsules and portrait covers.
STORY: Visitor sees a Game they know, sees what sits next to it by meaning, follows a cover.
FIRST VIEWPORT: Full-width stage, 1080p screenshot wiping in from the right, title bottom-left at display scale, primary action under it, vertical rail of six Games at right with a filling timer, "More like" cover strip directly below.
FORM: Store canon pinned by the brief (Steam, Epic), played straight. Seed 8c1d10dd.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
-->`;

export function DesignContract() {
  return <div hidden dangerouslySetInnerHTML={{ __html: CONTRACT }} />;
}
