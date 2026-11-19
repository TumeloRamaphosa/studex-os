#!/usr/bin/env python3
"""
Build the StudEx Group Open Graph share card (1200x630 JPEG).

Design notes
------------
- Brand: Black & Gold (StudEx Group).
- Headline sits on a strong left-to-right dark scrim so cream/gold type
  always wins against the Wagyu texture.
- NO clickable-style CTA button: social cards are not interactive, and a
  button with clipped padding reads as a broken template.
- The right-hand brand column is inset so nothing bleeds off the edge, and
  the vertical gold rule is drawn as two segments that STOP around the
  wordmark so it never strikes through the letters.
- Subcopy uses Inter (clean geometric sans) rather than a monospace, so it
  reads as a holding group, not a terminal. The mono face is kept only for
  the small eyebrow/meta lines where it reads as technical detail.
- A subtle grid + node motif in the right column signals the AI-agents desk
  so the card does not read as a pure steakhouse ad.
- Output is a flat 1200x630 RGB JPEG, <150KB for crawler friendliness.
"""

import os

from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
IMAGES = os.path.join(HERE, "images")
FONTS = "/tmp/ogfonts"

W, H = 1200, 630

BLACK = (10, 10, 11)
CREAM = (240, 237, 228)
GOLD = (198, 160, 79)
GOLD_LIGHT = (223, 191, 116)
MUTED = (168, 162, 150)
RULE = (58, 50, 36)


def font(name, size):
    return ImageFont.truetype(os.path.join(FONTS, name), size)


def text_w(draw, s, f):
    return draw.textbbox((0, 0), s, font=f)[2]


def main():
    src = Image.open(os.path.join(IMAGES, "og-source.png")).convert("RGB")

    # Cover-fit the 1376x768 source into 1200x630.
    scale = max(W / src.width, H / src.height)
    resized = src.resize((round(src.width * scale), round(src.height * scale)), Image.LANCZOS)
    left = (resized.width - W) // 2
    top = (resized.height - H) // 2
    canvas = resized.crop((left, top, left + W, top + H)).convert("RGB")

    # --- Scrim: strong on the left for the headline, soft on the right ---
    scrim = Image.new("L", (W, H), 0)
    sdraw = ImageDraw.Draw(scrim)
    for x in range(W):
        if x < 700:
            a = 248 - int((x / 700) * 70)          # 248 -> 178
        elif x < 900:
            a = 178 - int(((x - 700) / 200) * 88)  # 178 -> 90
        else:
            a = 90
        sdraw.line([(x, 0), (x, H)], fill=a)
    black = Image.new("RGB", (W, H), BLACK)
    canvas = Image.composite(black, canvas, scrim)

    draw = ImageDraw.Draw(canvas)

    # Subtle top/bottom vignette for depth.
    vig = Image.new("L", (W, H), 0)
    vdraw = ImageDraw.Draw(vig)
    for y in range(H):
        v = 0
        if y < 90:
            v = int((90 - y) / 90 * 70)
        elif y > H - 90:
            v = int((y - (H - 90)) / 90 * 70)
        vdraw.line([(0, y), (W, y)], fill=v)
    canvas = Image.composite(Image.new("RGB", (W, H), BLACK), canvas, vig)
    draw = ImageDraw.Draw(canvas)

    # Luxury hairline frame.
    draw.rectangle([14, 14, W - 15, H - 15], outline=(44, 38, 28), width=1)

    # --- Right column: AI / node motif (drawn first, behind the wordmark) ---
    motif = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    mdraw = ImageDraw.Draw(motif)
    mx0, mx1 = 900, 1152
    my0, my1 = 60, 570
    step = 42
    for gx in range(mx0, mx1 + 1, step):
        mdraw.line([(gx, my0), (gx, my1)], fill=(198, 160, 79, 16), width=1)
    for gy in range(my0, my1 + 1, step):
        mdraw.line([(mx0, gy), (mx1, gy)], fill=(198, 160, 79, 16), width=1)
    nodes = [(924, 96), (1140, 138), (972, 210), (1128, 252),
             (930, 330), (1146, 372), (966, 438), (1122, 486)]
    for i, (nx, ny) in enumerate(nodes):
        for nx2, ny2 in nodes[i + 1:]:
            if abs(nx - nx2) + abs(ny - ny2) < 260:
                mdraw.line([(nx, ny), (nx2, ny2)], fill=(198, 160, 79, 42), width=1)
    for nx, ny in nodes:
        mdraw.ellipse([nx - 3, ny - 3, nx + 3, ny + 3], fill=(223, 191, 116, 150))
    canvas = Image.alpha_composite(canvas.convert("RGBA"), motif).convert("RGB")
    draw = ImageDraw.Draw(canvas)

    # --- Vertical gold rule, split so it never crosses the wordmark ---
    div = 878
    draw.rectangle([div, 44, div + 1, 176], fill=RULE)
    draw.rectangle([div, 462, div + 1, H - 44], fill=RULE)

    # --- Top-left eyebrow ---
    eyebrow = font("SpaceMono-Bold.ttf", 18)
    draw.text((58, 54), "STUDEX GROUP · JOHANNESBURG", font=eyebrow, fill=GOLD)

    # --- Headline (with a soft shadow for extra separation) ---
    head = font("BebasNeue.ttf", 106)
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sdraw2 = ImageDraw.Draw(shadow)
    for dy in (3, 4, 5):
        sdraw2.text((56 + dy, 102 + dy), "FOUR DESKS.", font=head, fill=(0, 0, 0, 120))
        sdraw2.text((56 + dy, 190 + dy), "ONE GROUP.", font=head, fill=(0, 0, 0, 120))
    shadow = shadow.filter(ImageFilter.GaussianBlur(4))
    canvas = Image.alpha_composite(canvas.convert("RGBA"), shadow).convert("RGB")
    draw = ImageDraw.Draw(canvas)
    draw.text((56, 102), "FOUR DESKS.", font=head, fill=CREAM)
    draw.text((56, 190), "ONE GROUP.", font=head, fill=GOLD_LIGHT)

    # --- Gold rule under headline ---
    draw.rectangle([58, 320, 206, 323], fill=GOLD)

    # --- Subcopy (Inter — clean sans, holds the luxury read) ---
    sub = font("Inter-Regular.ttf", 22)
    sub_m = font("Inter-Medium.ttf", 22)
    draw.text((58, 350), "Halaal Wagyu · Rwandan coffee · Contract wheat",
              font=sub_m, fill=(228, 224, 214))
    draw.text((58, 384), "We design and build AI agents and automation",
              font=sub, fill=(214, 210, 200))
    draw.text((58, 418), "for South African businesses.", font=sub, fill=(214, 210, 200))

    # --- Bottom meta ---
    meta = font("SpaceMono-Regular.ttf", 17)
    draw.text((58, 556), "studex-group.com", font=meta, fill=MUTED)

    # --- Right brand column (inset, nothing clipped) ---
    brand_x = 924
    logo = font("BebasNeue.ttf", 82)
    lw = text_w(draw, "STUDEX", logo)
    draw.text((brand_x, 236), "STUDEX", font=logo, fill=CREAM)

    group = font("SpaceMono-Regular.ttf", 20)
    draw.text((brand_x + 4, 330), "G R O U P", font=group, fill=GOLD)

    # Small gold accent square under GROUP.
    draw.rectangle([brand_x + 4, 370, brand_x + 34, 400], fill=GOLD)

    # --- Output ---
    out = os.path.join(IMAGES, "og.jpg")
    canvas.save(out, "JPEG", quality=88, optimize=True, progressive=True)
    canvas.save(os.path.join(IMAGES, "og-card-source.png"), "PNG", optimize=True)

    print(f"wrote {out} {W}x{H} {os.path.getsize(out)} bytes")
    print(f"STUDEX width {lw}px, brand_x {brand_x} -> right edge {brand_x + lw} (canvas {W})")


if __name__ == "__main__":
    main()
