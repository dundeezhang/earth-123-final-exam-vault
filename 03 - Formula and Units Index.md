---
course: EARTH 123
type: formula-index
tags:
  - earth123
  - final-exam
  - formulas
  - units
---

# Formula and Units Index

Up: [[00 - EARTH 123 Final Exam Home]]

Use this page to select an equation and check units. Follow the linked module note for assumptions and worked examples.

## Core Unit Conversions

| Conversion | Equivalent |
|---|---:|
| Length | $1\ \mathrm{m}=100\ \mathrm{cm}=1000\ \mathrm{mm}$ |
| Area | $1\ \mathrm{km^2}=1{,}000{,}000\ \mathrm{m^2}$ |
| Volume | $1\ \mathrm{m^3}=1000\ \mathrm{L}$ |
| Time | $1\ \mathrm{day}=86{,}400\ \mathrm{s}$ |
| Depth to volume | $V=dA$ after putting depth and area in compatible units |
| Discharge to volume | $V=Qt$ after putting $Q$ and $t$ on the same time basis |

> [!warning]
> A precipitation or evapotranspiration depth becomes a volume only after multiplication by the receiving area. Never add millimetres directly to cubic metres.

## Module 3: Precipitation

| Purpose | Equation | Notes |
|---|---|---|
| Relative humidity | $R_h=\dfrac{e}{e_s}$ | Multiply by 100 for percent. Saturation occurs at $R_h=1=100\%$. |
| Adiabatic temperature change | $\Delta T=-\Gamma\Delta z$ | Use the lapse rate and elevation change given in the question. |
| Snow density ratio | $D_s=\dfrac{\mathrm{SWE}}{\text{snow depth}}$ | Express as a fraction or percent. |
| Snow-liquid ratio | $\mathrm{SLR}=\dfrac{\text{snow depth}}{\mathrm{SWE}}=\dfrac{1}{D_s}$ | An $n{:}1$ ratio gives $\mathrm{SWE}=\text{snow depth}/n$. |

Details: [[Modules/Module 03 - Precipitation/03 - 3.2 Atmospheric Moisture and Circulation|3.2 Atmospheric Moisture]] and [[Modules/Module 03 - Precipitation/04 - 3.3 Snowfall and Snow Cover Processes and Issues|3.3 Snowfall and Snow Cover]]

## Module 4: Precipitation Data

| Purpose | Equation | Notes |
|---|---|---|
| Rainfall intensity | $I=\dfrac{P}{\Delta t}$ | Common units: $\mathrm{mm/h}$. |
| Snow-core volume | $V=Ad$ | Use consistent length units. |
| Snow density | $\rho=\dfrac{m}{V}$ | Keep mass and volume units consistent. |
| Missing-station estimate | $P_x=\dfrac{N_x}{n}\sum_{i=1}^{n}\dfrac{P_i}{N_i}$ | $N$ is normal annual precipitation; $P$ is event or period precipitation. |
| Double-mass adjustment | $K=\dfrac{\text{slope after change}}{\text{slope before change}}$ | Apply the course-specified correction direction. |
| Arithmetic mean | $\bar P=\dfrac{1}{G}\sum_{g=1}^{G}p_g$ | Best when gauges and precipitation are spatially uniform. |
| Isohyetal volume | $V=A\bar P$ | Use the mean depth for each isohyetal band, then sum band volumes. |
| Thiessen estimate | $\bar P=\sum_i w_iP_i$ | Area fractions satisfy $\sum_iw_i=1$. |

Details: [[Modules/Module 04 - Precipitation Data and Measurement/04 - 4.3 Quantitative Analysis of Precipitation Data|4.3 Quantitative Analysis]]

## Module 5: Evaporation and Transpiration

| Purpose | Equation | Interpretation |
|---|---|---|
| Vapour pressure deficit | $\mathrm{VPD}=e_s-e_a$ | Positive: evaporation can dominate. Zero: equilibrium. Negative: condensation can dominate. |
| ET energy allocation | $E_{\mathrm{solar,ET}}=E_{\mathrm{interception}}+E_{\mathrm{transpiration}}+E_{\mathrm{soil}}+E_{\mathrm{net\ losses}}$ | Tracks how available solar energy is partitioned. |

Details: [[Modules/Module 05 - Evaporation and Transpiration/02 - 5.1 Introduction to Evaporation and Transpiration|5.1 Evaporation and Transpiration]]

## Module 6: Measuring Evapotranspiration

| Method | Equation | Main check |
|---|---|---|
| Evaporation pan | $E_{pan}=\dfrac{\text{depth loss}}{\text{elapsed time}}$ | Correct for precipitation and added or removed water when required. |
| Adjusted pan estimate | $E_{adjusted}=\dfrac{(\text{depth loss})K_p}{\text{elapsed time}}$ | $K_p$ is the pan coefficient. |
| Lysimeter depth | $d=V/A$ | Convert measured mass loss to water volume first when necessary. |
| Energy balance | $R-R_E-R_A=H_E+H_A+H_B+H_C$ | The simplified course form is $H_E=R-R_E-R_A$. |
| Water balance estimate | $E=P+SW_{in}+GW_{in}-SW_{out}-GW_{out}-\Delta S$ | Use one common time interval. |
| Empirical estimate | $E=Kf(u)(e_s-e_a)$ | Combines a coefficient, wind function, and VPD. |
| Groundwater fluctuation | $ET=S_y(24a+b)$ | Preserve the sign of the 24-hour net change $b$. |

Details: [[Modules/Module 06 - Measuring Evapotranspiration/00 - Module 06 Overview|Module 6 Overview]]

## Module 7: Water Balance

$$
\Delta S=(P+Q_{in}+G_{in})-(ET+Q_{out}+G_{out})
$$

- At steady state, $\Delta S=0$ and total inputs equal total outputs.
- Convert depth fluxes to volume with $V=dA$.
- Convert discharge rates to interval volumes with $V=Qt$.
- Lake-level change is $\Delta h=\Delta S/A$.
- A positive $\Delta S$ means storage increased. A negative $\Delta S$ means storage decreased.

Details: [[Modules/Module 07 - Water Balance Calculations/02 - 7.1 Introduction to Quantitative Water Balance Calculations|7.1 Water Balance Calculations]]

## Module 8: Soils

| Property | Equation | Denominator check |
|---|---|---|
| Porosity | $n=\dfrac{V_{voids}}{V_{total}}$ | Total volume |
| Void ratio | $e=\dfrac{V_{voids}}{V_{solids}}$ | Solid volume |
| Gravimetric water content | $w=\dfrac{m_{water}}{m_{solids}}$ | Dry solid mass |
| Degree of saturation | $S_r=\dfrac{V_{water}}{V_{voids}}$ | Void volume |
| Bulk density | $\rho=\dfrac{m_{total}}{V_{total}}$ | Total volume |
| Plasticity index | $PI=LL-PL$ | Liquid limit minus plastic limit |

Details: [[Modules/Module 08 - Soils/02 - 8.1 Introduction to Soils and Phase Relationships|8.1 Phase Relationships]] and [[Modules/Module 08 - Soils/04 - 8.3 Characterizing Soils and Soil Plasticity|8.3 Soil Plasticity]]

## Module 9: Groundwater

| Purpose | Equation | Notes |
|---|---|---|
| Water-table elevation | $z_{wt}=z_{ground}-d_{water}$ | Depth below ground must be subtracted from ground elevation. |
| Well-bottom elevation | $z_b=z_{ground}-d_{well}$ | Use the same vertical datum as hydraulic head. |
| Pressure head | $h_p=h-z_b$ | Water-column height above the measurement point. |
| Hydrostatic pressure | $p=\rho gh_p$ | Pa; divide by 1000 for kPa. |
| Hydraulic gradient | $i=\dfrac{\Delta h}{L}$ | Dimensionless when both lengths use the same unit; flow is from high to low head. |
| Darcy specific discharge | $q=Ki$ | $K$ and $q$ have velocity units. |
| Total groundwater discharge | $Q=qA$ | Include cross-sectional area when a volume rate is required. |
| Pore-water velocity | $v=\dfrac{q}{n}$ | Convert porosity from percent to decimal. |
| Travel time | $t=\dfrac{L}{|v|}$ | Match distance and velocity units. |

Details: [[Modules/Module 09 - Groundwater/05 - 9.4 Pressure, Head, and Flow Calculations|9.4 Pressure, Head, and Flow Calculations]]

## Module 10: Surface Water and Runoff

| Purpose | Equation | Notes |
|---|---|---|
| Subsection area | $A_i=w_id_i$ | Width times representative depth. |
| Mean subsection velocity | $\bar v_i=\dfrac{v_{0.2D,i}+v_{0.8D,i}}{2}$ | A single $0.6D$ reading is a less accurate field substitute. |
| Subsection discharge | $Q_i=A_i\bar v_i$ | Area in $\mathrm{m^2}$ and velocity in $\mathrm{m/s}$ give $\mathrm{m^3/s}$. |
| Total discharge | $Q_{total}=\sum_iQ_i$ | Add all subsection discharges. |
| Stage | $H_{stage}=H-H_0$ | Water-surface elevation relative to a local datum. |
| Annual flood probability | $P=1/T$ | Multiply by 100 for percent. A return period is not a schedule. |

Details: [[Modules/Module 10 - Surface Water and Runoff/04 - 10.3 Water Velocity, Discharge Calculations, and Stage–Discharge Relationships|10.3 Discharge Calculations]] and [[Modules/Module 10 - Surface Water and Runoff/05 - 10.4 Flooding and Flood Hydrographs|10.4 Flooding]]

## Module 11: Glaciers and Glaciation

- Positive glacier budget: accumulation $>$ ablation.
- Negative glacier budget: ablation $>$ accumulation.
- Surge estimate: surge velocity $=$ normal velocity $\times$ surge multiplier.
- Ice can keep flowing downslope while the glacier terminus retreats upslope.

Details: [[Modules/Module 11 - Glaciers and Glaciation/03 - 11.2 Glacial Movement and Causes of Past Glaciations|11.2 Glacial Movement]]

## Exam Calculation Workflow

1. Write the governing equation before substituting.
2. Mark every term as an input, output, storage, depth, volume, or rate.
3. Convert all values to compatible SI units and one time interval.
4. Substitute with units shown.
5. Check the sign and physical meaning of the result.
6. Round only the final answer unless the question directs otherwise.

Continue to [[04 - Master Quiz Index]].
