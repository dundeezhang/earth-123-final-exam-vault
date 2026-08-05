---
course: EARTH 123
module: "04 - Precipitation Data and Measurement"
type: definitions
tags:
  - earth-123
  - module-04
  - definitions
  - precipitation
---

# Main Definitions

Up: [[00 - EARTH 123 Final Exam Home]]

Module: [[00 - Module 04 Overview]]

| Term | Definition | Course section | Example / where / application |
|---|---|---|---|
| Precipitation depth | A length representing accumulated precipitation, commonly recorded in mm, cm, or m. | 4.1 | The four 15-minute readings from 08:15 through 09:00 total a depth of 1.0 mm. |
| Rainfall intensity | The rate of rain falling over a period of time, such as mm/hour or cm/day. | 4.1, Rain Gauges | The course Tipping Bucket data give $1.0\ \text{mm}/1\ \text{h}=1.0\ \text{mm/h}$ from 08:00 to 09:00. |
| Gauge network | A distributed set of precipitation gauges used to obtain a representative picture of precipitation over a study area or watershed. | 4.1, Measuring Rainfall | Mountainous terrain with local orographic storms calls for a denser network than an open, flat region. |
| Primary Network | Official rain gauges monitored and maintained by local, provincial, or state authorities. | 4.1, Measuring Rainfall | Figure 4.1.1 shows the sparse Primary Network whose stations receive rigorous government maintenance. |
| Co-operative Network | A larger group of official and unofficial stations with less rigorous maintenance than a Primary Network but much greater data coverage. | 4.1, Measuring Rainfall | Figure 4.1.1 shows its many extra stations producing finer precipitation-contour resolution. |
| Rain gauge | In its simplest form, an upright hollow cylinder, closed at the base, that catches falling precipitation. | 4.1, Rain Gauges | The course field gauge has an opening about 8-13 cm wide and is mounted about 30 cm above ground. |
| Non-recording rain gauge | A gauge that requires a person to visit the site and measure or record the collected precipitation. | 4.1, Rain Gauges | An observer visits the course field gauge to read a total accumulated over a day or longer. |
| Recording rain gauge | A gauge that automatically creates a digital record using equipment such as a computer, encoder, data logger, or cellular connection. | 4.1, Rain Gauges | The saved Tipping Bucket dataset automatically reports precipitation in 15-minute intervals. |
| Weighing gauge | A recording gauge whose collector rests on a tared electric scale or balance; added weight over time is converted to precipitation depth. | 4.1, Rain Gauges | A heated recording snow gauge can weigh the melted sample continuously as precipitation accumulates. |
| Float gauge | A recording gauge that senses the changing height of a float and uses collector dimensions to determine precipitation volume or depth. | 4.1, Rain Gauges | In Figure 4.1.3, an electric pulley tracks the float rising in a collector of known dimensions. |
| Tipping Bucket gauge | A recording gauge with two balanced buckets; each tip represents a known collected volume and is logged to determine depth or intensity. | 4.1, Rain Gauges | Figure 4.1.4 exposes the internal balance; rainfall below one bucket's tipping threshold may go unrecorded. |
| Optical disdrometer | A device that measures precipitation-particle size and shape as well as falling velocity and intensity. | 4.1, Rain Gauges | Figure 4.1.5's laser precipitation monitor is used when particle-level rain or snow data are needed. |
| Under-catch | A gauge measurement lower than the amount that actually fell, commonly produced when wind or oblique precipitation carries water past the opening. | 4.2, Limitations of Rain Gauges | Wind turbulence around an unshielded gauge mouth diverts drops past the collector in Figure 4.2.2. |
| Nipher-type shield | A rigid wind shield used around a precipitation gauge to reduce air velocity and turbulence near its opening. | 4.2, Measurement Techniques | Standard recording and non-recording snow gauges commonly use this shield around the elevated collector. |
| Alter-type shield | A gauge shield designed to reduce wind effects around the collection opening. | 4.2, Measurement Techniques | Figure 4.2.2 compares airflow around an Alter-shielded gauge with unshielded and Nipher-shielded gauges. |
| Water equivalent | The amount of liquid water obtained from collected snow after it is melted. | 4.2, Measuring Snowfall | Hydrologists melt captured snow to assess possible flooding and increased river flow. |
| Snow corer | A hollow tube of known cross-sectional area pushed into snow to collect a core for depth, mass, volume, and density measurements. | 4.2, Measuring Snowfall | The worked core has area $10\ \text{cm}^2$, depth 50 cm, and mass 100 g. |
| Snow density | Snow mass divided by snow volume; the sampled volume is the corer's cross-sectional area multiplied by sample depth. | 4.2, Measuring Snowfall | The course core gives $100\ \text{g}/500\ \text{cm}^3=0.2\ \text{g/cm}^3$. |
| Interpolation | Estimation of precipitation at an ungauged, unmonitored, failed, or erroneous station from nearby reliable stations and long-term historical data. | 4.3, Interpolation | Three neighbouring stations estimate the missing Station 2 value as $46.91\ \text{cm}\approx47\ \text{cm}$. |
| Normal annual precipitation | A station's long-term historical precipitation value, used to normalize nearby observations during missing-data interpolation. | 4.3, Interpolation | The Station 2 calculation uses $N_2=52$ cm with neighbouring normals of 45, 65, and 40 cm. |
| Isohyet | A contour line joining locations with equal precipitation depth. | 4.3, Interpolation and Estimation | In Figure 4.3.1, point A lies between the 0.75 and 0.80 cm isohyets and is estimated at about 0.78 cm. |
| Adjustment factor ($K$) | The ratio of the post-change slope to the pre-change slope in a station-versus-neighbour comparison, used to make long-term records comparable. | 4.3, Adjustment of Long-Term Data | After a gauge moves from a five-storey roof to a field, $K=0.65/0.98=0.66$ is applied to pre-move data. |
| Arithmetic average | The sum of precipitation readings from gauges inside the study area divided by the number of included gauges. | 4.3, Estimation | Figure 4.3.3 includes only the three interior gauges: $(2+4+5)/3=3.67$ units. |
| Isohyetal method | An areal method that finds the area between precipitation contours, assigns the mean depth of each pair of bounding contours, and sums the resulting subregion volumes. | 4.3, Estimation | A $25\ \text{m}^2$ area between 4.0 and 4.5 cm contours contributes about $1.06\ \text{m}^3$ of water. |
| Thiessen Polygon Method | A graphical interpolation that assigns each gauge an area-based weight from polygons formed by perpendicular bisectors between neighbouring gauges. | 4.3, Estimation | Table 4.3.1 weights seven gauges by polygon fractions from 5% to 30%, giving a summed estimate of 6.30. |

## Commonly Confused Terms

- **Depth vs. volume vs. intensity:** depth is a length, volume is area times depth, and intensity is depth per time.
- **Non-recording vs. recording gauge:** the distinction is manual observation versus an automatically generated record, not simply whether precipitation is caught.
- **Snow depth vs. water equivalent:** snow depth is the height of accumulated snow; water equivalent is the liquid water represented by that snow.
- **Point interpolation vs. areal isohyetal estimation:** point interpolation fills or estimates one location; the areal method calculates representative depth or volume across subregions between contours.
- **Arithmetic average vs. Thiessen estimate:** the arithmetic method weights all included gauges equally; Thiessen polygons weight each gauge by its share of the total area.
- **Measured trend vs. artificial break:** a sudden slope change after a station move or equipment change can reflect collection conditions rather than a real precipitation change.

Next: [[02 - 4.1 Introduction to Precipitation Data and Rain Gauges]]
