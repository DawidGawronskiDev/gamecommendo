"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  ArrowsOutIcon,
  LineSegmentsIcon,
  MinusIcon,
  PlusIcon,
} from "@phosphor-icons/react";
import { MapData } from "../types";
import { DismissalToggle } from "@/features/dismissal/components/dismissal-toggle";
import { FavouriteToggle } from "@/features/favourite/components/favourite-toggle";
import { LibraryToggle } from "@/features/library/components/library-toggle";
import { MapCard } from "./map-card";
import { ProductQuickView } from "@/features/product/components/product-quick-view";

const MIN_ZOOM = 1;
const MAX_ZOOM = 48;
const FOCUS_ZOOM = 10;
const HIT_RADIUS = 14;
const CLICK_SLOP = 6;
const MAX_LABELS = 28;
const CARD_WIDTH = 288;
const CARD_HEIGHT = 190;
const POINT_BUDGET = 2500;
const EDGE_BUDGET = 700;
const MAX_SEGMENTS = 6000;
const SETTLE_DELAY = 140;
const POINT_ALPHAS = [0.35, 0.5, 0.7, 1];
const ALL_GENRES = "all";

type MapStatus = "loading" | "ready" | "error";

type MapCardState = {
  index: number;
  x: number;
  y: number;
  isPinned: boolean;
};

type MapApi = {
  zoomBy: (factor: number) => void;
  reset: () => void;
  setGenreMask: (mask: number) => void;
  redraw: () => void;
};

type MapLayers = { games: boolean; library: boolean; favourites: boolean };

type MapPanelProps = {
  data: MapData | null;
  libraryCount: number;
  favouriteCount: number;
  layers: MapLayers;
  onLayerToggle: (layer: keyof MapLayers) => void;
  status: MapStatus;
  genre: string;
  onGenreChange: (genre: string) => void;
};

function MapPanel({
  data,
  libraryCount,
  favouriteCount,
  layers,
  onLayerToggle,
  status,
  genre,
  onGenreChange,
}: MapPanelProps) {
  const linkCount = useMemo(
    () => data?.nodes.reduce((sum, node) => sum + node[9].length, 0) ?? 0,
    [data],
  );

  const hasMarks = libraryCount > 0 || favouriteCount > 0;
  const layerRows: {
    layer: keyof MapLayers;
    name: string;
    dot: string;
    count: number;
  }[] = [
    {
      layer: "games",
      name: "All Games",
      dot: "bg-foreground",
      count: data?.nodes.length ?? 0,
    },
    ...(libraryCount > 0
      ? [
          {
            layer: "library" as const,
            name: "Library",
            dot: "bg-library",
            count: libraryCount,
          },
        ]
      : []),
    ...(favouriteCount > 0
      ? [
          {
            layer: "favourites" as const,
            name: "Favourites",
            dot: "bg-favourite",
            count: favouriteCount,
          },
        ]
      : []),
  ];

  const genreItems = useMemo(
    () => [
      { value: ALL_GENRES, label: "All genres" },
      ...(data?.genres.map((name, bit) => ({
        value: String(bit),
        label: name,
      })) ?? []),
    ],
    [data],
  );

  return (
    <div className="absolute top-4 left-4 z-10 flex w-[min(22rem,calc(100%-2rem))] flex-col gap-3 bg-background p-4 ring-1 ring-foreground/10 md:top-6 md:left-8">
      <h1 className="font-heading text-2xl leading-none font-extrabold tracking-tighter uppercase md:text-3xl">
        Map
      </h1>
      <p className="hidden text-sm leading-relaxed text-muted-foreground sm:block">
        Every Game in the Catalog, placed by the meaning of its Game Profile.
        Close Games sit together and a line joins each Game to its three
        Neighbours. Brighter and larger means more popular.
      </p>
      {status === "loading" && (
        <p role="status" className="text-sm text-muted-foreground">
          Loading the map…
        </p>
      )}
      {status === "error" && (
        <p role="status" className="text-sm text-muted-foreground">
          The map could not be loaded. Reload the page to try again.
        </p>
      )}
      {data && (
        <>
          <p className="text-xs text-muted-foreground tabular-nums">
            {data.nodes.length.toLocaleString("en-US")} Games ·{" "}
            {linkCount.toLocaleString("en-US")} Neighbour lines
          </p>
          {hasMarks && (
            <div
              role="group"
              aria-label="Shown on the Map"
              className="flex flex-col border-y border-foreground/10 py-1"
            >
              {layerRows.map((row) => (
                <button
                  key={row.layer}
                  type="button"
                  aria-pressed={layers[row.layer]}
                  onClick={() => onLayerToggle(row.layer)}
                  className="group/layer flex items-center gap-2 py-1.5 text-left text-xs text-muted-foreground tabular-nums outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring aria-pressed:text-foreground"
                >
                  <span
                    aria-hidden
                    className={cn(
                      "size-2 rounded-full opacity-30 group-aria-pressed/layer:opacity-100",
                      row.dot,
                    )}
                  />
                  <span className="flex-1">{row.name}</span>
                  <span>{row.count.toLocaleString("en-US")}</span>
                  <span className="w-7 text-right text-[0.625rem] font-semibold tracking-widest uppercase">
                    {layers[row.layer] ? "On" : "Off"}
                  </span>
                </button>
              ))}
            </div>
          )}
          <div className="flex flex-col gap-1">
            <span
              id="game-map-genre-label"
              className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase"
            >
              Highlight genre
            </span>
            <Select
              items={genreItems}
              value={genre || ALL_GENRES}
              onValueChange={(value) =>
                onGenreChange(!value || value === ALL_GENRES ? "" : value)
              }
            >
              <SelectTrigger
                aria-labelledby="game-map-genre-label"
                className="w-full"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {genreItems.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </>
      )}
    </div>
  );
}

type MapControlsProps = {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  hasLines: boolean;
  onLinesToggle: () => void;
};

function MapControls({
  onZoomIn,
  onZoomOut,
  onReset,
  hasLines,
  onLinesToggle,
}: MapControlsProps) {
  return (
    <div className="absolute right-4 bottom-4 z-10 flex flex-col gap-1.5 md:right-8 md:bottom-6">
      <Button
        size="icon-sm"
        variant="outline"
        aria-label="Zoom in"
        onClick={onZoomIn}
        className="bg-background"
      >
        <PlusIcon />
      </Button>
      <Button
        size="icon-sm"
        variant="outline"
        aria-label="Zoom out"
        onClick={onZoomOut}
        className="bg-background"
      >
        <MinusIcon />
      </Button>
      <Button
        size="icon-sm"
        variant="outline"
        aria-label="Reset view"
        onClick={onReset}
        className="bg-background"
      >
        <ArrowsOutIcon />
      </Button>
      <Button
        size="icon-sm"
        variant="outline"
        aria-label={hasLines ? "Hide Neighbour lines" : "Show Neighbour lines"}
        aria-pressed={hasLines}
        onClick={onLinesToggle}
        className="mt-1.5 bg-background"
      >
        <LineSegmentsIcon className={cn(!hasLines && "opacity-40")} />
      </Button>
    </div>
  );
}

type MapViewProps = React.ComponentProps<"section"> & {
  libraryGameIds: number[];
  favouriteGameIds: number[];
  dismissedGameIds: number[];
  isMember: boolean;
};

export function MapView({
  libraryGameIds,
  favouriteGameIds,
  dismissedGameIds,
  isMember,
  className,
  ...props
}: MapViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const apiRef = useRef<MapApi>(null);
  const libraryRef = useRef<Set<number>>(new Set());
  const favouriteRef = useRef<Set<number>>(new Set());
  const [data, setData] = useState<MapData | null>(null);
  const [status, setStatus] = useState<MapStatus>("loading");
  const [genre, setGenre] = useState("");
  const [hasLines, setHasLines] = useState(true);
  const linesRef = useRef(true);
  const [layers, setLayers] = useState<MapLayers>({
    games: true,
    library: true,
    favourites: true,
  });
  const layersRef = useRef(layers);
  const [card, setCard] = useState<MapCardState | null>(null);
  const [quickView, setQuickView] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const librarySet = useMemo(() => new Set(libraryGameIds), [libraryGameIds]);
  const libraryCount = useMemo(
    () => data?.nodes.filter((node) => librarySet.has(node[0])).length ?? 0,
    [data, librarySet],
  );

  const favouriteSet = useMemo(
    () => new Set(favouriteGameIds),
    [favouriteGameIds],
  );
  const favouriteCount = useMemo(
    () => data?.nodes.filter((node) => favouriteSet.has(node[0])).length ?? 0,
    [data, favouriteSet],
  );

  useEffect(() => {
    libraryRef.current = librarySet;
    favouriteRef.current = favouriteSet;
    apiRef.current?.redraw();
  }, [librarySet, favouriteSet]);

  useEffect(() => {
    let isCancelled = false;

    fetch("/game-map.json")
      .then((response) => {
        if (!response.ok) throw new Error(`Map request failed`);
        return response.json() as Promise<MapData>;
      })
      .then((mapData) => {
        if (isCancelled) return;
        setData(mapData);
        setStatus("ready");
      })
      .catch(() => {
        if (!isCancelled) setStatus("error");
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context || !data) return;

    const { nodes } = data;
    const maxCount = nodes[0]?.[7] || 1;
    const weights = nodes.map((node) => Math.sqrt(node[7] / maxCount));
    const view = { k: 1, x: 0, y: 0 };
    const size = { width: 0, height: 0, base: 0 };
    const drag = {
      isActive: false,
      isMoving: false,
      startX: 0,
      startY: 0,
      x: 0,
      y: 0,
    };
    let genreMask = 0;
    let hovered = -1;
    let pinned = -1;
    let clicked = -1;
    let frame = 0;
    let ratio = 1;
    let drawnLimit = 0;
    let isMoving = false;
    let isBaseStale = true;
    let hasCard = false;
    let settleTimer: ReturnType<typeof setTimeout> | undefined;

    const base = document.createElement("canvas");
    const baseContext = base.getContext("2d")!;

    const labelFont = `600 11px ${getComputedStyle(canvas).fontFamily}`;
    let foreground = "";
    let background = "";
    let libraryColor = "";
    let favouriteColor = "";
    const readColors = () => {
      foreground = getComputedStyle(canvas).color;
      libraryColor = getComputedStyle(canvas).getPropertyValue("--library");
      favouriteColor = getComputedStyle(canvas).getPropertyValue("--favourite");
      background = getComputedStyle(document.body).backgroundColor;
    };
    readColors();

    const screenX = (index: number) =>
      nodes[index][1] * size.base * view.k + view.x;
    const screenY = (index: number) =>
      nodes[index][2] * size.base * view.k + view.y;
    const radius = (index: number) =>
      (0.7 + 3.3 * weights[index]) * Math.min(2.6, Math.sqrt(view.k));
    const matchesGenre = (index: number) =>
      !genreMask || (nodes[index][8] & genreMask) !== 0;
    const isFavourite = (index: number) =>
      layersRef.current.favourites && favouriteRef.current.has(nodes[index][0]);
    const isOwned = (index: number) =>
      layersRef.current.library && libraryRef.current.has(nodes[index][0]);
    const isShown = (index: number) =>
      layersRef.current.games || isFavourite(index) || isOwned(index);

    const pointLimit = () =>
      Math.min(
        nodes.length,
        Math.floor(POINT_BUDGET * view.k ** 1.6 * (isMoving ? 0.6 : 1)),
      );
    const isOffscreen = (x: number, y: number) =>
      x < -8 || y < -8 || x > size.width + 8 || y > size.height + 8;

    const renderBase = () => {
      baseContext.setTransform(ratio, 0, 0, ratio, 0, 0);
      baseContext.clearRect(0, 0, size.width, size.height);
      baseContext.fillStyle = foreground;
      baseContext.strokeStyle = foreground;
      // With the other Games off, the density rule has nothing to thin out.
      drawnLimit = layersRef.current.games ? pointLimit() : nodes.length;

      if (!isMoving && linesRef.current && layersRef.current.games) {
        const edgeLimit = Math.min(
          drawnLimit,
          Math.floor(EDGE_BUDGET * view.k * view.k),
        );
        let segments = 0;
        baseContext.globalAlpha = Math.min(
          0.22,
          0.05 + 0.03 * Math.sqrt(view.k),
        );
        baseContext.lineWidth = 1;
        baseContext.beginPath();
        for (
          let index = 0;
          index < edgeLimit && segments < MAX_SEGMENTS;
          index++
        ) {
          const x = screenX(index);
          const y = screenY(index);
          const isHidden = isOffscreen(x, y);
          for (const neighbour of nodes[index][9]) {
            const nx = screenX(neighbour);
            const ny = screenY(neighbour);
            if (isHidden && isOffscreen(nx, ny)) continue;

            baseContext.moveTo(x, y);
            baseContext.lineTo(nx, ny);
            segments++;
          }
        }
        baseContext.stroke();
      }

      const dimmed = new Path2D();
      const owned = new Path2D();
      const loved = new Path2D();
      const levels = POINT_ALPHAS.map(() => new Path2D());
      for (let index = drawnLimit - 1; index >= 0; index--) {
        const x = screenX(index);
        const y = screenY(index);
        if (isOffscreen(x, y) || !isShown(index)) continue;

        const r = radius(index);
        const path = !matchesGenre(index)
          ? dimmed
          : isFavourite(index)
            ? loved
            : isOwned(index)
              ? owned
              : levels[
                  Math.min(
                    POINT_ALPHAS.length - 1,
                    Math.floor(Math.sqrt(weights[index]) * POINT_ALPHAS.length),
                  )
                ];
        if (r < 1.5) {
          path.rect(x - r, y - r, r * 2, r * 2);
        } else {
          path.moveTo(x + r, y);
          path.arc(x, y, r, 0, Math.PI * 2);
        }
      }
      baseContext.globalAlpha = 0.07;
      baseContext.fill(dimmed);
      levels.forEach((path, level) => {
        baseContext.globalAlpha = POINT_ALPHAS[level];
        baseContext.fill(path);
      });
      baseContext.globalAlpha = 1;
      baseContext.fillStyle = libraryColor;
      baseContext.fill(owned);
      baseContext.fillStyle = favouriteColor;
      baseContext.fill(loved);
    };

    const draw = () => {
      frame = 0;
      if (isBaseStale) {
        renderBase();
        isBaseStale = false;
      }

      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(base, 0, 0);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      if (isMoving) return;

      context.fillStyle = foreground;
      context.strokeStyle = foreground;
      const active = pinned >= 0 ? pinned : hovered;
      if (active >= 0) {
        const x = screenX(active);
        const y = screenY(active);
        context.globalAlpha = 0.95;
        context.lineWidth = 1.5;
        context.beginPath();
        for (const neighbour of nodes[active][9]) {
          context.moveTo(x, y);
          context.lineTo(screenX(neighbour), screenY(neighbour));
        }
        context.stroke();
        for (const index of [active, ...nodes[active][9]]) {
          context.beginPath();
          context.arc(
            screenX(index),
            screenY(index),
            radius(index) + 4,
            0,
            Math.PI * 2,
          );
          context.stroke();
        }
      }

      context.font = labelFont;
      context.textBaseline = "middle";
      context.lineJoin = "round";
      const boxes: [number, number, number, number][] = [];
      const labelled = active >= 0 ? [active, ...nodes[active][9]] : [];
      for (
        let index = 0;
        index < drawnLimit && boxes.length < MAX_LABELS + labelled.length;
        index++
      ) {
        const candidate = index < labelled.length ? labelled[index] : index;
        if (
          index >= labelled.length &&
          (!matchesGenre(candidate) || !isShown(candidate))
        ) {
          continue;
        }

        const x = screenX(candidate) + radius(candidate) + 6;
        const y = screenY(candidate);
        if (x < 0 || y < 8 || x > size.width - 40 || y > size.height - 8) {
          continue;
        }

        const name = nodes[candidate][3];
        const width = context.measureText(name).width;
        if (
          boxes.some(
            ([bx, by, bw, bh]) =>
              x < bx + bw + 8 &&
              x + width + 8 > bx &&
              y < by + bh &&
              y + 16 > by,
          )
        ) {
          continue;
        }

        boxes.push([x, y, width, 16]);
        context.globalAlpha = 1;
        context.lineWidth = 4;
        context.strokeStyle = background;
        context.strokeText(name, x, y);
        context.globalAlpha = index < labelled.length ? 1 : 0.8;
        context.fillText(name, x, y);
      }
      context.strokeStyle = foreground;
      context.globalAlpha = 1;
    };

    const requestDraw = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    const viewChanged = (isInteractive: boolean) => {
      isBaseStale = true;
      if (isInteractive) {
        isMoving = true;
        clearTimeout(settleTimer);
        settleTimer = setTimeout(() => {
          isMoving = false;
          isBaseStale = true;
          requestDraw();
        }, SETTLE_DELAY);
      }
      requestDraw();
    };

    const showCard = (index: number, isPinned: boolean) => {
      hasCard = index >= 0;
      if (index < 0) {
        setCard(null);
        return;
      }

      const x = screenX(index);
      const y = screenY(index);
      setCard({
        index,
        isPinned,
        x: x + CARD_WIDTH + 24 > size.width ? x - CARD_WIDTH - 16 : x + 16,
        y: Math.max(
          8,
          Math.min(y - CARD_HEIGHT / 2, size.height - CARD_HEIGHT - 8),
        ),
      });
    };

    const clearActive = () => {
      hovered = -1;
      pinned = -1;
      if (!hasCard) return;

      hasCard = false;
      setCard(null);
    };

    const resetView = () => {
      view.k = 1;
      view.x = (size.width - size.base) / 2;
      view.y = (size.height - size.base) / 2;
    };

    const zoomAt = (factor: number, px: number, py: number) => {
      const k = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, view.k * factor));
      view.x = px - (px - view.x) * (k / view.k);
      view.y = py - (py - view.y) * (k / view.k);
      view.k = k;
    };

    const focus = (index: number) => {
      view.k = FOCUS_ZOOM;
      view.x = size.width / 2 - nodes[index][1] * size.base * view.k;
      view.y = size.height / 2 - nodes[index][2] * size.base * view.k;
      pinned = index;
      showCard(index, true);
    };

    const nodeAt = (px: number, py: number) => {
      let best = -1;
      let bestDistance = HIT_RADIUS * HIT_RADIUS;
      for (let index = 0; index < drawnLimit; index++) {
        if (!matchesGenre(index) || !isShown(index)) continue;

        const dx = screenX(index) - px;
        const dy = screenY(index) - py;
        const distance = dx * dx + dy * dy;
        if (distance < bestDistance) {
          best = index;
          bestDistance = distance;
        }
      }
      return best;
    };

    const pointerPosition = (event: PointerEvent | WheelEvent) => {
      const bounds = canvas.getBoundingClientRect();
      return [event.clientX - bounds.left, event.clientY - bounds.top] as const;
    };

    const onWheel = (event: WheelEvent) => {
      // At the widest view, let the page scroll past the map.
      if (event.deltaY > 0 && view.k <= MIN_ZOOM) return;

      event.preventDefault();
      const [px, py] = pointerPosition(event);
      clearActive();
      zoomAt(Math.exp(-event.deltaY * 0.0015), px, py);
      viewChanged(true);
    };

    const onPointerDown = (event: PointerEvent) => {
      canvas.setPointerCapture(event.pointerId);
      clicked = -1;
      drag.isActive = true;
      drag.isMoving = false;
      drag.startX = drag.x = event.clientX;
      drag.startY = drag.y = event.clientY;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (drag.isActive) {
        const dx = event.clientX - drag.x;
        const dy = event.clientY - drag.y;
        drag.x = event.clientX;
        drag.y = event.clientY;
        drag.isMoving ||=
          Math.hypot(
            event.clientX - drag.startX,
            event.clientY - drag.startY,
          ) >= CLICK_SLOP;
        if (!drag.isMoving) return;

        view.x += dx;
        view.y += dy;
        clearActive();
        viewChanged(true);
        return;
      }

      if (event.pointerType !== "mouse" || pinned >= 0) return;

      const index = nodeAt(...pointerPosition(event));
      if (index === hovered) return;

      hovered = index;
      canvas.style.cursor = index >= 0 ? "pointer" : "grab";
      showCard(index, false);
      requestDraw();
    };

    const onPointerUp = (event: PointerEvent) => {
      const wasClick = drag.isActive && !drag.isMoving;
      drag.isActive = false;
      if (!wasClick) return;

      const index = nodeAt(...pointerPosition(event));
      if (index >= 0 && event.pointerType === "mouse") {
        clicked = index;
        return;
      }

      pinned = index;
      hovered = -1;
      showCard(index, true);
      requestDraw();
    };

    const onClick = () => {
      if (clicked < 0) return;

      const node = nodes[clicked];
      clicked = -1;
      setQuickView({ id: node[0], name: node[3] });
    };

    const onPointerLeave = () => {
      if (pinned >= 0 || hovered < 0) return;

      hovered = -1;
      showCard(-1, false);
      requestDraw();
    };

    const observer = new ResizeObserver(([entry]) => {
      ratio = Math.min(window.devicePixelRatio || 1, 2);
      const isFirst = size.width === 0;
      size.width = entry.contentRect.width;
      size.height = entry.contentRect.height;
      size.base = Math.min(size.width, size.height) * 0.94;
      canvas.width = Math.round(size.width * ratio);
      canvas.height = Math.round(size.height * ratio);
      base.width = canvas.width;
      base.height = canvas.height;
      clearActive();
      resetView();

      if (isFirst) {
        const gameId = Number(
          new URLSearchParams(window.location.search).get("game"),
        );
        const index = gameId
          ? nodes.findIndex((node) => node[0] === gameId)
          : -1;
        if (index >= 0) focus(index);
      }
      viewChanged(false);
    });

    apiRef.current = {
      zoomBy: (factor) => {
        clearActive();
        zoomAt(factor, size.width / 2, size.height / 2);
        viewChanged(false);
      },
      reset: () => {
        clearActive();
        resetView();
        viewChanged(false);
      },
      setGenreMask: (mask) => {
        genreMask = mask;
        clearActive();
        viewChanged(false);
      },
      redraw: () => viewChanged(false),
    };

    const themeObserver = new MutationObserver(() => {
      readColors();
      isBaseStale = true;
      requestDraw();
    });

    observer.observe(canvas);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);
    canvas.addEventListener("pointerleave", onPointerLeave);
    canvas.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(settleTimer);
      observer.disconnect();
      themeObserver.disconnect();
      apiRef.current = null;
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("click", onClick);
    };
  }, [data]);

  const handleGenreChange = (value: string) => {
    setGenre(value);
    apiRef.current?.setGenreMask(value === "" ? 0 : 1 << Number(value));
  };

  return (
    <section
      aria-label="Map of Games"
      className={cn(
        "relative h-[75dvh] min-h-[28rem] overflow-hidden md:h-[calc(100dvh-3.5rem)]",
        className,
      )}
      {...props}
    >
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Scatter of every Game in the Catalog, positioned by meaning and joined to its closest Games. Describe a Game in the header to find one."
        className="block size-full cursor-grab touch-none font-heading text-foreground active:cursor-grabbing"
      />
      <MapPanel
        data={data}
        libraryCount={libraryCount}
        favouriteCount={favouriteCount}
        layers={layers}
        onLayerToggle={(layer) => {
          const next = { ...layers, [layer]: !layers[layer] };
          layersRef.current = next;
          setLayers(next);
          setCard(null);
          apiRef.current?.redraw();
        }}
        status={status}
        genre={genre}
        onGenreChange={handleGenreChange}
      />
      {data && (
        <MapControls
          onZoomIn={() => apiRef.current?.zoomBy(1.6)}
          onZoomOut={() => apiRef.current?.zoomBy(1 / 1.6)}
          onReset={() => apiRef.current?.reset()}
          hasLines={hasLines}
          onLinesToggle={() => {
            linesRef.current = !hasLines;
            setHasLines(!hasLines);
            apiRef.current?.redraw();
          }}
        />
      )}
      {data && card && (
        <MapCard
          data={data}
          node={data.nodes[card.index]}
          isPinned={card.isPinned}
          isInLibrary={librarySet.has(data.nodes[card.index][0])}
          isFavourite={favouriteSet.has(data.nodes[card.index][0])}
          style={{ left: card.x, top: card.y }}
          onQuickView={() => {
            const node = data.nodes[card.index];
            setQuickView({ id: node[0], name: node[3] });
          }}
        />
      )}
      <ProductQuickView
        game={quickView}
        actions={
          quickView && (
            <>
              <FavouriteToggle
                size="lg"
                className="w-full"
                gameId={quickView.id}
                isFavourite={favouriteSet.has(quickView.id)}
                isMember={isMember}
              />
              <LibraryToggle
                size="lg"
                className="w-full"
                gameId={quickView.id}
                isInLibrary={librarySet.has(quickView.id)}
                isMember={isMember}
              />
              <DismissalToggle
                size="lg"
                className="w-full"
                gameId={quickView.id}
                isDismissed={dismissedGameIds.includes(quickView.id)}
                isMember={isMember}
              />
            </>
          )
        }
        onGameSelect={(id, name) => setQuickView({ id, name })}
        onClose={() => setQuickView(null)}
      />
    </section>
  );
}
