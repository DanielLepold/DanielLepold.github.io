---
title: 'Measuring hammer-throw release parameters from competition footage: agreement with a Doppler radar reference'
short: Hammer-throw release parameters from video
summary: Release speed and angle of the hammer, measured from eight unsynchronised cameras at the 2026 Gyulai István Memorial, and validated against a FlightScope Doppler radar on nine throws.
context: TDK research · Hungarian University of Sport Science
year: '2026'
order: 1
featured: true
award: '1st place · TDK conference, Biomechanics section'
area: Sport science
illustration: hammer
tags: [Python, YOLO, Kalman filter, Epipolar geometry, Triangulation, Bland–Altman]
codeNote: Code is private (ongoing research)
role: Research, pipeline design and implementation
partners:
  - { name: 'MTK Academy', role: 'Footage', logo: '/logos/mtk.png' }
  - { name: 'Hungarian University of Sport Science', role: 'Research', logo: '/logos/tf.png' }
metrics:
  - { value: '−0.17 m/s', label: 'release-speed bias vs. radar' }
  - { value: '+0.26°', label: 'release-angle bias vs. radar' }
  - { value: '8', label: 'unsynchronised cameras, 240 fps' }
  - { value: '9', label: 'throws from 72 to 84 m, validated' }
---

## The problem

In the hammer throw, distance is decided almost entirely by two numbers: the **speed** and the **angle** of the hammer at release. Today they are measured with a Doppler radar. It is expensive, it tells you nothing about the thrower's movement, and it is rarely allowed at competitions.

Coaches, on the other hand, already film their athletes. The question behind this project: **can ordinary multi-camera competition footage replace the radar?** And if it can, the same video also describes the thrower's movement.

## Data

At the men's hammer throw of the **2026 Gyulai István Memorial**, the throws were recorded with eight unsynchronised action cameras (2704 × 1520 px, 239.76 fps). The footage comes from the **MTK Academy**. Nine throws by eight athletes, between 72 and 84 metres, were compared against a simultaneous **FlightScope** radar measurement.

## Approach

1. **Calibration from the scene itself.** Camera extrinsics and metric scale come from a measured 80 cm wire-frame cube placed in the throwing circle, plus the rim of the circle. No calibration session was needed before the competition.
2. **Synchronisation from motion.** The cameras were not synchronised. Time offsets are recovered from the motion of the ball itself, using the epipolar constraint.
3. **Detection and tracking.** A YOLO detector finds the hammer head in every frame, and a Kalman-filter tracker rejects false detections.
4. **3D reconstruction.** The 3D trajectory is triangulated from all available views.
5. **Release parameters.** Instead of differentiating the noisy 3D curve, a ballistic trajectory with known gravity is fitted to the flight phase in each view. The per-view estimates are fused by inverse-variance weighting. This gave a lower total error than working from the 3D curve.
6. **Validation.** Agreement with the radar is quantified with Bland–Altman analysis: bias and 95% limits of agreement.

Before any real footage was used, every algorithm was validated on a synthetic simulator with exact ground truth: virtual cameras with distortion, rolling shutter, motion blur and detection noise.

## Results

| | Bias vs. radar | 95% limits of agreement |
| --- | --- | --- |
| Release speed | −0.173 m/s | −1.67 … +1.33 m/s |
| Release angle | +0.26° | −0.70 … +1.21° |

There was **no detectable difference** from the radar reference. A speed computed from a single view was off by 1.21 m/s on average. Combining three views brought that down to 0.53 m/s.

The most useful finding was about what limits accuracy. Separate controlled experiments ruled out **synchronisation** and **camera pose** as error sources. The remaining spread is set by **how much of the flight is visible** in the frame. The next iteration therefore needs **better framing, not more cameras**.

## Why it matters

Release parameters can be measured without a radar, from video that is recorded anyway. And because the full 3D trajectory is available, the hammer's kinematics can also be analysed turn by turn. Thrower and implement can be studied together, under real competition conditions.

<small>Supervisor: Dr. András Hegyi, Department of Kinesiology · Consultant: Dániel Csala, PhD candidate.</small>
