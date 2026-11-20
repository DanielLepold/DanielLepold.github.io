---
title: Football match analysis from broadcast video
short: Football match analysis
summary: A modular computer-vision pipeline that detects and tracks players, assigns teams by jersey colour, compensates for camera motion, and measures each player's speed and distance in metres.
context: Personal project
year: '2026'
order: 4
featured: true
area: Computer vision
illustration: football
tags: [Python, YOLOv8, ByteTrack, OpenCV, KMeans, Homography]
repo: https://github.com/DanielLepold/realtime-object-detection
role: Design and implementation
metrics:
  - { value: '4 classes', label: 'ball, goalkeeper, player, referee' }
  - { value: 'px → m', label: 'homography to pitch coordinates' }
  - { value: 'YAML', label: 'config-driven, CLI and training entry points' }
---

## What it does

The pipeline takes a broadcast football clip and turns it into per-player numbers: team, speed in km/h and distance covered in metres. It draws the result back onto the video with motion trails and a bird's-eye minimap.

## Pipeline

| Step | Method |
| --- | --- |
| Detection | YOLOv8 fine-tuned from COCO weights on a Roboflow dataset: ball, goalkeepers, players and referees (spectators ignored) |
| Tracking | ByteTrack / BoT-SORT multi-object tracking with persistent IDs |
| Team assignment | KMeans clustering of jersey colour in the CIELAB colour space |
| Camera motion | Shi-Tomasi corners + Lucas-Kanade optical flow, so player motion is separated from camera pan |
| Real-world coordinates | Homography from image pixels to pitch metres |
| Speed & distance | Rolling-window estimates on the camera-compensated, metric tracks |
| Visualisation | `supervision`: ellipses, labels, trails and a minimap |

## Engineering

It is built to be reused rather than run once:

- **Config-driven** (YAML) with separate CLI and training entry points
- A reproducible **GPU training notebook** for fine-tuning
- **Unit tests** and architecture/module documentation
- **GDPR-aware** handling of footage: raw videos are never committed to the repository
