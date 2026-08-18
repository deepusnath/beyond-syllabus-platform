import { ringPoints } from "@/lib/util";

/*
 * The Vitruvian Student: the campaign mark. One figure, two states.
 * Ink limbs fit the square (the syllabus); purple limbs reach past it
 * to the dotted circle (the movement's ring of potential).
 *
 * Single source of geometry for the SVG component, the canvas badge,
 * and the server-rendered share images. Coordinate space: 1000×1000.
 */

export const VIT_SIZE = 1000;
export const VIT_INK = "#16121a";
export const VIT_PURPLE = "#9c2df4";

export const vitruvian = {
  circle: { cx: 500, cy: 470, r: 380, dots: 36, dotR: 7 },
  square: { x: 240, y: 290, w: 520, h: 520 },
  head: { cx: 500, cy: 348, r: 38 },
  // Ink: the measured pose, fitting the square exactly.
  inkPaths: [
    "M500 386 L500 596", // torso
    "M455 430 C480 422 520 422 545 430", // shoulders
    "M455 432 C400 440 330 434 252 438", // level arm L
    "M252 430 L250 450", // hand L
    "M545 432 C600 440 670 434 748 438", // level arm R
    "M748 430 L750 450", // hand R
    "M488 598 C482 670 476 740 470 802", // standing leg L
    "M470 802 L446 804", // foot L
    "M512 598 C518 670 524 740 530 802", // standing leg R
    "M530 802 L554 804", // foot R
  ],
  // Purple: the reaching pose, exceeding the square to the circle.
  purplePaths: [
    "M462 424 C400 386 310 292 236 208", // raised arm L
    "M236 208 L250 199", // hand L
    "M538 424 C600 386 690 292 764 208", // raised arm R
    "M764 208 L750 199", // hand R
    "M490 598 C446 668 372 738 316 792", // striding leg L
    "M316 792 L296 778", // foot L
    "M510 598 C554 668 628 738 684 792", // striding leg R
    "M684 792 L704 778", // foot R
  ],
  tagline: "the syllabus is the square. the student is the circle.",
};

export function vitruvianDots(): { x: string; y: string }[] {
  const { cx, cy, r, dots } = vitruvian.circle;
  return ringPoints(dots, cx, cy, r);
}

/** Draws the mark onto a canvas at (x, y) with the given scale. */
export function drawVitruvian(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  stroke = 10,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const { square, head } = vitruvian;
  ctx.strokeStyle = VIT_INK;
  ctx.lineWidth = stroke * 0.7;
  ctx.strokeRect(square.x, square.y, square.w, square.h);

  ctx.fillStyle = VIT_PURPLE;
  for (const p of vitruvianDots()) {
    ctx.beginPath();
    ctx.arc(Number(p.x), Number(p.y), vitruvian.circle.dotR, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.lineWidth = stroke;
  ctx.strokeStyle = VIT_INK;
  ctx.beginPath();
  ctx.arc(head.cx, head.cy, head.r, 0, Math.PI * 2);
  ctx.stroke();
  for (const d of vitruvian.inkPaths) ctx.stroke(new Path2D(d));

  ctx.strokeStyle = VIT_PURPLE;
  for (const d of vitruvian.purplePaths) ctx.stroke(new Path2D(d));

  ctx.restore();
}
