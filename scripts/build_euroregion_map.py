"""Build the Euroregion map (Nouvelle-Aquitaine, Euskadi, Navarre) used in the Doctoral research section.

Source: Eurostat GISCO, NUTS 2024, 1:10M, WGS84.
(c) EuroGeographics for the administrative boundaries.
Writes src/data/euroregion-map.json (SVG path data in a 420 x 300 frame).

    python scripts/build_euroregion_map.py
"""

import json
import math
import urllib.request
from pathlib import Path

BASE = "https://gisco-services.ec.europa.eu/distribution/v2/nuts/geojson/NUTS_RG_10M_2024_4326_LEVL_{}.geojson"
TARGETS = {"FRI": 1, "ES21": 2, "ES22": 2}
LON = (-3.6, 2.9)
LAT = (41.8, 47.35)
WIDTH = 420
OUT = Path(__file__).resolve().parents[1] / "src" / "data" / "euroregion-map.json"


def load(level):
    with urllib.request.urlopen(BASE.format(level)) as response:
        return json.load(response)["features"]


k_x = math.cos(math.radians(sum(LAT) / 2))
scale = WIDTH / ((LON[1] - LON[0]) * k_x)
HEIGHT = round((LAT[1] - LAT[0]) * scale)


def project(lon, lat):
    return round((lon - LON[0]) * k_x * scale, 1), round((LAT[1] - lat) * scale, 1)


def rings(geometry):
    polys = geometry["coordinates"] if geometry["type"] == "MultiPolygon" else [geometry["coordinates"]]
    return [ring for poly in polys for ring in poly]


def in_frame(geometry):
    return any(LON[0] - 1 <= lon <= LON[1] + 1 and LAT[0] - 1 <= lat <= LAT[1] + 1
               for ring in rings(geometry) for lon, lat in ring)


def path(geometry):
    parts = []
    for ring in rings(geometry):
        points = [project(lon, lat) for lon, lat in ring]
        parts.append("M" + "L".join(f"{x} {y}" for x, y in points) + "Z")
    return "".join(parts)


level1, level2 = load(1), load(2)
regions = {}
for feature in level1 + level2:
    nuts_id = feature["properties"]["NUTS_ID"]
    if TARGETS.get(nuts_id) == feature["properties"]["LEVL_CODE"]:
        regions[nuts_id] = path(feature["geometry"])

context = [
    path(f["geometry"]) for f in level2
    if f["properties"]["CNTR_CODE"] in ("FR", "ES")
    and not f["properties"]["NUTS_ID"].startswith(("FRI", "ES21", "ES22"))
    and in_frame(f["geometry"])
]

# Label anchors (lon, lat), placed by hand inside each region.
LABELS = {"FRI": (0.55, 45.45), "ES21": (-2.75, 43.0), "ES22": (-1.6, 42.62), "border": (0.75, 42.55)}

OUT.write_text(json.dumps({
    "width": WIDTH,
    "labels": {key: project(lon, lat) for key, (lon, lat) in LABELS.items()},
    "height": HEIGHT,
    "regions": regions,
    "context": context,
    "source": "Eurostat GISCO, NUTS 2024 · © EuroGeographics for the administrative boundaries",
}), encoding="utf-8")
print(f"Wrote {OUT.name}: {WIDTH}x{HEIGHT}, {len(regions)} regions, {len(context)} context areas")
