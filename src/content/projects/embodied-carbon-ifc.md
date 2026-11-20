---
title: Predicting the embodied carbon of buildings from IFC models
short: Embodied carbon from IFC
summary: Embodied-CO₂ footprints are only as good as the BIM data behind them. I built tools that extract, repair and complete IFC material data, so the footprint can be calculated reliably.
context: Data Science thesis · University of Pannonia
year: '2024'
order: 2
featured: true
area: AEC & data
illustration: carbon
tags: [Python, IfcOpenShell, pandas, scikit-learn, Random Forest, NetworkX]
codeNote: Code is private
role: Research, data pipeline and modelling
metrics:
  - { value: 'IFC → Excel', label: 'batch extraction of elements and materials' }
  - { value: 'Name mapping', label: 'user-defined materials → standard database names' }
  - { value: 'Random Forest', label: 'predicts missing materials from element properties' }
---

## The problem

To estimate a building's embodied CO₂ you need to know, for every element, **what it is made of and how much of it there is**. BIM models in the open IFC format should carry this information. In practice, material data is often **missing, inconsistent or free-text**: "C30/37", "Beton", "concrete_ext_wall_v2". Every gap makes the carbon estimate less reliable.

## Approach

**1. IFC → tabular data.** A Python tool built on IfcOpenShell reads every IFC model in a folder and flattens elements, quantities, property sets and materials into Excel/pandas. This gives an analysis-ready dataset across many buildings.

**2. Exploratory analysis.** Which properties are actually filled in, by which authoring tools, and for which element types? The analysis showed where data quality breaks down and which fields can be trusted.

**3. Material name mapping.** User-defined material names are mapped to **standardised material names** from existing LCA databases. Inconsistent labels become consistent, calculable inputs.

**4. Predicting missing materials.** Where no material is given at all, a **Random Forest** model predicts the material type from the element's other IFC properties (class, geometry, quantities, property sets). The prediction fills the gap before the carbon calculation runs. This is a quality fix based on prediction.

**5. Graph-based visualisation.** Element–material–CO₂ relationships are drawn as graphs. They make the dominant contributors visible at a glance and reveal material-use patterns across buildings.

## Findings

- **Concrete dominates.** Across the analysed buildings, concrete was consistently the largest contributor to embodied carbon. This is where better data pays off most.
- **Data quality is the bottleneck.** The accuracy of the CO₂ estimate is limited less by the calculation than by the completeness of the BIM model.
- Standardised material names and more complete models lead directly to more reliable footprints. **Mapping plus prediction** bridges the gap for models we already have.

The work grew out of my day job at bimspot/smino, where embodied-CO₂ prediction from IFC was part of the BIM platform.
