// MapChart.jsx
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import { PROTESTANT_BY_STATE } from "./data/protestantByState";
import { FAMILY_COLORS, DEFAULT_FAMILY_COLOR } from "./constants/familyColors";

const normalizeState = name =>
    (name || "")
        .toLowerCase()
        .replace(/[^a-z\s]/g, "")
        .replace(/\s+/g, " ")
        .trim();

const buildCounts = familyFilter => {
    const totals = new Map();
    PROTESTANT_BY_STATE.forEach(row => {
        if (familyFilter && row.family !== familyFilter) return;
        const key = normalizeState(row.state);
        totals.set(key, (totals.get(key) || 0) + row.adherents);
    });
    return totals;
};

const buildColorScale = (family, min, max) => {
    if (!family) {
        return d3
            .scaleSequentialSqrt(d3.interpolatePurples)
            .domain([min, max]);
    }
    const base = FAMILY_COLORS[family] || DEFAULT_FAMILY_COLOR;
    const from = d3.rgb("#f8fafc");
    const to = d3.rgb(base);
    const interpolator = t => d3.interpolateRgb(from, to)(t);
    return d3.scaleSequentialSqrt(interpolator).domain([min, max]);
};

export default function MapChart({
    us,
    onStateClick,
    selectedState,
    selectedFamily,
    metric = "total"
}) {
    const svgRef = useRef(null);
    const countsRef = useRef(null);
    const colorScaleRef = useRef(null);
    const statesSelectionRef = useRef(null);
    const onStateClickRef = useRef(onStateClick);

    useEffect(() => {
        onStateClickRef.current = onStateClick;
    }, [onStateClick]);

    useEffect(() => {
        if (!us || !svgRef.current) return;

        const isPerCapita = metric === "perCapita";

        const width = 975;
        const height = 610;

        const statePopulations = new Map([
            ["alabama", 5024279],
            ["alaska", 733391],
            ["arizona", 7151502],
            ["arkansas", 3011524],
            ["california", 39538223],
            ["colorado", 5773714],
            ["connecticut", 3605944],
            ["delaware", 989948],
            ["district of columbia", 689545],
            ["florida", 21538187],
            ["georgia", 10711908],
            ["hawaii", 1455271],
            ["idaho", 1839106],
            ["illinois", 12812508],
            ["indiana", 6785528],
            ["iowa", 3190369],
            ["kansas", 2937880],
            ["kentucky", 4505836],
            ["louisiana", 4657757],
            ["maine", 1362359],
            ["maryland", 6177224],
            ["massachusetts", 7029917],
            ["michigan", 10077331],
            ["minnesota", 5706494],
            ["mississippi", 2961279],
            ["missouri", 6154913],
            ["montana", 1084225],
            ["nebraska", 1961504],
            ["nevada", 3104614],
            ["new hampshire", 1377529],
            ["new jersey", 9288994],
            ["new mexico", 2117522],
            ["new york", 20201249],
            ["north carolina", 10439388],
            ["north dakota", 779094],
            ["ohio", 11799448],
            ["oklahoma", 3959353],
            ["oregon", 4237256],
            ["pennsylvania", 13002700],
            ["rhode island", 1097379],
            ["south carolina", 5118425],
            ["south dakota", 886667],
            ["tennessee", 6910840],
            ["texas", 29145505],
            ["utah", 3271616],
            ["vermont", 643077],
            ["virginia", 8631393],
            ["washington", 7705281],
            ["west virginia", 1793716],
            ["wisconsin", 5893718],
            ["wyoming", 576851]
        ]);

        const stateAbbr = {
            alabama: "AL",
            alaska: "AK",
            arizona: "AZ",
            arkansas: "AR",
            california: "CA",
            colorado: "CO",
            connecticut: "CT",
            delaware: "DE",
            "district of columbia": "DC",
            florida: "FL",
            georgia: "GA",
            hawaii: "HI",
            idaho: "ID",
            illinois: "IL",
            indiana: "IN",
            iowa: "IA",
            kansas: "KS",
            kentucky: "KY",
            louisiana: "LA",
            maine: "ME",
            maryland: "MD",
            massachusetts: "MA",
            michigan: "MI",
            minnesota: "MN",
            mississippi: "MS",
            missouri: "MO",
            montana: "MT",
            nebraska: "NE",
            nevada: "NV",
            "new hampshire": "NH",
            "new jersey": "NJ",
            "new mexico": "NM",
            "new york": "NY",
            "north carolina": "NC",
            "north dakota": "ND",
            ohio: "OH",
            oklahoma: "OK",
            oregon: "OR",
            pennsylvania: "PA",
            "rhode island": "RI",
            "south carolina": "SC",
            "south dakota": "SD",
            tennessee: "TN",
            texas: "TX",
            utah: "UT",
            vermont: "VT",
            virginia: "VA",
            washington: "WA",
            "west virginia": "WV",
            wisconsin: "WI",
            wyoming: "WY"
        };

        const svg = d3
            .select(svgRef.current)
            .attr("viewBox", [0, 0, width, height])
            .attr("width", width)
            .attr("height", height)
            .attr(
                "style",
                "width: 100%; height: 100%; max-width: 100%; object-fit: contain;"
            )
            .on("click", reset);

        // clear previous content if effect re-runs
        svg.selectAll("*").remove();

        const formatNumber = d => {
            if (!Number.isFinite(d)) return "0";
            if (Math.abs(d) >= 1_000_000) return `${Math.round(d / 1_000_000)}M`;
            if (Math.abs(d) >= 1_000) return `${Math.round(d / 1_000)}K`;
            return d.toLocaleString();
        };
        const formatPercent = d3.format(".1%");
        const niceCeilPercent = value => {
            if (!Number.isFinite(value) || value <= 0) return 0.01; // default to 1% if empty/zero
            const steps = [0.001, 0.0025, 0.005, 0.01, 0.02, 0.05, 0.1, 0.2, 0.25, 0.5, 1];
            for (const step of steps) {
                if (value <= step) return step;
            }
            return 1;
        };

        const zoom = d3
            .zoom()
            .scaleExtent([1, 8])
            .on("zoom", zoomed);

        const path = d3.geoPath();
        const g = svg.append("g");
        const stateFeatures = topojson.feature(us, us.objects.states).features;
        const tooltip = d3
            .select("body")
            .append("div")
            .attr("class", "map-tooltip")
            .style("position", "absolute")
            .style("pointer-events", "none")
            .style("padding", "8px 10px")
            .style("background", "rgba(17,24,39,0.9)")
            .style("color", "#fff")
            .style("font-size", "12px")
            .style("border-radius", "6px")
            .style("box-shadow", "0 2px 6px rgba(0,0,0,0.25)")
            .style("opacity", 0);

        let states = null;
        const counts = buildCounts(selectedFamily);
        const metricValues = new Map();
        counts.forEach((count, stateKey) => {
            const pop = statePopulations.get(stateKey);
            if (isPerCapita) {
                const ratio =
                    Number.isFinite(count) && Number.isFinite(pop)
                        ? count / pop
                        : NaN;
                metricValues.set(stateKey, ratio);
            } else {
                metricValues.set(stateKey, count);
            }
        });
        const values = Array.from(metricValues.values()).filter(Number.isFinite);
        const dataMin = values.length ? Math.min(...values) : 0;
        const dataMax = values.length ? Math.max(...values) : 0;
        const perCapitaMax = isPerCapita ? niceCeilPercent(dataMax) : null;
        const domainMin = isPerCapita ? 0 : dataMin;
        const domainMax = isPerCapita
            ? perCapitaMax
            : dataMax === dataMin
                ? dataMin || 1
                : dataMax;
        const legendValues = values.length
            ? values.concat([domainMin, domainMax]).sort(d3.ascending)
            : [domainMin, domainMax];
        const color = buildColorScale(selectedFamily, domainMin, domainMax);
        const legendMin = domainMin;
        const legendMax = domainMax;

        const fillForState = name => {
            const value = metricValues.get(normalizeState(name));
            return Number.isFinite(value) ? color(value) : "#e5e7eb";
        };

        const showTooltip = (event, d) => {
            const stateKey = normalizeState(d.properties.name);
            const value = counts.get(stateKey);
            const population = statePopulations.get(stateKey);
            const percentValue =
                Number.isFinite(value) && Number.isFinite(population)
                    ? value / population
                    : null;
            const percentLabel = percentValue !== null
                ? formatPercent(percentValue)
                : "No population data";
            const headline = isPerCapita
                ? percentValue !== null
                    ? `<div><strong>${percentLabel}</strong> of state population</div>`
                    : "<div>No population data</div>"
                : Number.isFinite(value)
                    ? `<div><strong>${formatNumber(value)}</strong> ${selectedFamily || "Protestant"} adherents</div>`
                    : "<div>No data</div>";
            const secondary = isPerCapita
                ? Number.isFinite(value)
                    ? `<div>${formatNumber(value)} ${selectedFamily || "Protestant"} adherents</div>`
                    : ""
                : percentValue !== null
                    ? `<div>${percentLabel} of state population</div>`
                    : "";
            tooltip
                .html(
                    `<div style="font-weight:700;margin-bottom:4px;">${d.properties.name}</div>${selectedFamily ? `<div>${selectedFamily}</div>` : "<div>Protestantism</div>"
                    }${headline}${secondary}`
                )
                .style("left", `${event.pageX + 12}px`)
                .style("top", `${event.pageY + 12}px`)
                .transition()
                .duration(120)
                .style("opacity", 1);
        };

        const hideTooltip = () => {
            tooltip.transition().duration(150).style("opacity", 0);
        };

        states = g
            .append("g")
            .attr("cursor", "pointer")
            .selectAll("path")
            .data(stateFeatures)
            .join("path")
            .attr("d", path)
            .attr("fill", d => fillForState(d.properties.name))
            .on("mousemove", showTooltip)
            .on("mouseleave", hideTooltip)
            .on("click", clicked);

        statesSelectionRef.current = states;
        countsRef.current = metricValues;
        colorScaleRef.current = color;

        states.append("title").text(d => {
            const key = normalizeState(d.properties.name);
            const value = counts.get(key);
            const population = statePopulations.get(key);
            const percent =
                Number.isFinite(value) && Number.isFinite(population)
                    ? formatPercent(value / population)
                    : null;
            if (isPerCapita) {
                const main = percent ? `${percent} of population` : "No population data";
                const extra = Number.isFinite(value)
                    ? ` (${formatNumber(value)} adherents)`
                    : "";
                return `${d.properties.name}: ${main}${extra}`;
            }
            const label = Number.isFinite(value)
                ? `${formatNumber(value)} ${selectedFamily || "Protestant"} adherents`
                : "No data";
            return `${d.properties.name}: ${label} ${percent ? `(${percent})` : ""
                }`;
        });

        g.append("path")
            .attr("fill", "none")
            .attr("stroke", "white")
            .attr("stroke-linejoin", "round")
            .attr(
                "d",
                path(
                    topojson.mesh(
                        us,
                        us.objects.states,
                        (a, b) => a !== b
                    )
                )
            );

        addLabels();
        addLegend(color, legendValues, legendMin, legendMax, isPerCapita);


        svg.call(zoom);

        function reset() {
            onStateClickRef.current?.(null);
            svg
                .transition()
                .duration(750)
                .call(
                    zoom.transform,
                    d3.zoomIdentity,
                    d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
                );
        }

        function clicked(event, d) {
            if (!states) return;

            const stateName = d.properties.name;
            onStateClickRef.current?.(stateName);

            const [[x0, y0], [x1, y1]] = path.bounds(d);
            event.stopPropagation();
            svg
                .transition()
                .duration(750)
                .call(
                    zoom.transform,
                    d3.zoomIdentity
                        .translate(width / 2, height / 2)
                        .scale(
                            Math.min(
                                8,
                                0.9 /
                                Math.max(
                                    (x1 - x0) / width,
                                    (y1 - y0) / height
                                )
                            )
                        )
                        .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
                    d3.pointer(event, svg.node())
                );
        }

        function zoomed(event) {
            const { transform } = event;
            g.attr("transform", transform);
            g.attr("stroke-width", 1 / transform.k);
        }

        // cleanup
        return () => {
            svg.on(".zoom", null).on("click", null);
            statesSelectionRef.current = null;
            countsRef.current = null;
            colorScaleRef.current = null;
            svg.selectAll("*").remove();
            tooltip.remove();
        };

        function addLabels() {
            const labelLayer = g.append("g").attr("pointer-events", "none");

            labelLayer
                .selectAll("text")
                .data(stateFeatures)
                .join("text")
                .attr("transform", d => {
                    const [x, y] = path.centroid(d);
                    return `translate(${x},${y})`;
                })
                .attr("text-anchor", "middle")
                .attr("font-size", 15)
                .attr("fill", d => {
                    const stateColor = d3.color(fillForState(d.properties.name));
                    if (!stateColor) return "#111";

                    // simple luminance estimate (0 = black, 1 = white)
                    const luminance =
                        (0.299 * stateColor.r +
                            0.587 * stateColor.g +
                            0.114 * stateColor.b) / 255;

                    // dark background → light text, light background → dark text
                    return luminance < 0.5 ? "#fff" : "#111";
                })
                .attr("stroke", d => {
                    const stateColor = d3.color(fillForState(d.properties.name));
                    if (!stateColor) return "#fff";

                    const luminance =
                        (0.299 * stateColor.r +
                            0.587 * stateColor.g +
                            0.114 * stateColor.b) / 255;

                    // use opposite halo color for contrast
                    return luminance < 0.5 ? "#000" : "#fff";
                })
                .attr("stroke-width", 0) // a bit thicker halo
                .attr("paint-order", "stroke")
                .text(d => stateAbbr[normalizeState(d.properties.name)] || "");
        }

        function addLegend(color, values, domainMin, domainMax, isPerCapitaLegend) {
            const legendWidth = 500;
            const legendHeight = 28;
            const marginTop = 90;

            const defs = svg.append("defs");
            const gradientId = "legend-gradient";
            const gradient = defs
                .append("linearGradient")
                .attr("id", gradientId)
                .attr("x1", "0%")
                .attr("x2", "100%")
                .attr("y1", "0%")
                .attr("y2", "0%");

            const stops = d3.range(0, 1.01, 0.1);
            stops.forEach(t => {
                const sample = domainMin + (domainMax - domainMin) * t;
                gradient
                    .append("stop")
                    .attr("offset", `${t * 100}%`)
                    .attr("stop-color", color(sample));
            });

            const legend = svg
                .append("g")
                .attr("transform", `translate(${10},${-marginTop})`);

            legend
                .append("rect")
                .attr("width", legendWidth)
                .attr("height", legendHeight)
                .attr("fill", `url(#${gradientId})`)
                .attr("stroke", "#111")
                .attr("stroke-width", 1.5);

            const legendScale = d3
                .scaleLinear()
                .domain([domainMin, domainMax])
                .range([0, legendWidth]);

            const legendAxis = d3
                .axisBottom(legendScale)
                .ticks(7)
                .tickFormat(d => {
                    if (isPerCapitaLegend) return formatPercent(d);
                    if (d >= 1_000_000) return `${Math.round(d / 1_000_000)}M`;
                    if (d >= 1_000) return `${Math.round(d / 1_000)}K`;
                    return formatNumber(d);
                });

            legend
                .append("g")
                .attr("transform", `translate(0,${legendHeight + 4})`)
                .call(legendAxis.tickSize(8))
                .call(gAxis => gAxis.select(".domain").remove())
                .selectAll("text")
                .attr("font-size", 14);

            legend
                .append("text")
                .attr("x", 0)
                .attr("y", -10) // legend y-offset
                .attr("text-anchor", "start")
                .attr("font-size", 20)
                .attr("font-weight", 800)
                .attr("fill", "#111")
                .text(
                    selectedFamily
                        ? `${selectedFamily} ${isPerCapitaLegend ? "share of population" : "adherents"}`
                        : `Protestant ${isPerCapitaLegend ? "share of population" : "adherents (state total)"}`
                );
        }
    }, [us, selectedFamily, metric]);

    useEffect(() => {
        const states = statesSelectionRef.current;
        const counts = countsRef.current;
        const color = colorScaleRef.current;
        if (!states || !counts || !color) return;

        const baseFill = name => {
            const value = counts.get(normalizeState(name));
            return Number.isFinite(value) ? color(value) : "#e5e7eb";
        };

        states.attr("fill", d => {
            const base = baseFill(d.properties.name);
            if (
                selectedState &&
                normalizeState(d.properties.name) === normalizeState(selectedState)
            ) {
                const c = d3.color(base) || d3.color("#6b21a8");
                c.opacity = 1;
                return c.darker(0.7).formatHex();
            }
            return base;
        });
    }, [selectedState, selectedFamily, metric]);

    return <svg ref={svgRef} />;
}
