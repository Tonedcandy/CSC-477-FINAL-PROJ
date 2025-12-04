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

export default function MapChart({ us, onStateClick, selectedState, selectedFamily }) {
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

        const formatNumber = d3.format(",");
        const formatPercent = d3.format(".1%");

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
        const values = Array.from(counts.values()).filter(Number.isFinite);
        const sorted = values.slice().sort(d3.ascending);
        const min = sorted[0] ?? 0;
        const max = sorted[sorted.length - 1] ?? 1;
        const color = buildColorScale(selectedFamily, min, max === min ? min || 1 : max);
        const legendMin = min;
        const legendMax = max === min ? min || 1 : max;

        const fillForState = name => {
            const value = counts.get(normalizeState(name));
            return Number.isFinite(value) ? color(value) : "#e5e7eb";
        };

        const showTooltip = (event, d) => {
            const stateKey = normalizeState(d.properties.name);
            const value = counts.get(stateKey);
            const population = statePopulations.get(stateKey);
            const percentLabel =
                Number.isFinite(value) && Number.isFinite(population)
                    ? formatPercent(value / population)
                    : "No population data";
            const body = Number.isFinite(value)
                ? `<div><strong>${formatNumber(value)}</strong> adherents</div>`
                : "<div>No data</div>";
            const pctLine = Number.isFinite(population)
                ? `<div>${percentLabel} of state population</div>`
                : "";
            tooltip
                .html(
                    `<div style="font-weight:700;margin-bottom:4px;">${d.properties.name}</div>${body}${pctLine}`
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
        countsRef.current = counts;
        colorScaleRef.current = color;

        states.append("title").text(d => {
            const value = counts.get(normalizeState(d.properties.name));
            const population = statePopulations.get(
                normalizeState(d.properties.name)
            );
            const percent =
                Number.isFinite(value) && Number.isFinite(population)
                    ? formatPercent(value / population)
                    : "No population data";
            const label = Number.isFinite(value)
                ? `${formatNumber(value)} adherents`
                : "No data";
            return `${d.properties.name}: ${label} ${Number.isFinite(population) ? `(${percent})` : ""
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
        addLegend(color, sorted, legendMin, legendMax);


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
                .attr("font-size", 11)
                .attr("fill", "#111")
                .attr("stroke", "white")
                .attr("stroke-width", 1)
                .attr("paint-order", "stroke")
                .text(d => stateAbbr[normalizeState(d.properties.name)] || "");
        }

        function addLegend(color, values, domainMin, domainMax) {
            const legendWidth = 260;
            const legendHeight = 10;
            const marginTop = 20;

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
                const sample = values.length
                    ? d3.quantile(values, t)
                    : domainMin + (domainMax - domainMin) * t;
                gradient
                    .append("stop")
                    .attr("offset", `${t * 100}%`)
                    .attr("stop-color", color(sample));
            });

            const legend = svg
                .append("g")
                .attr("transform", `translate(${(width - legendWidth) / 2},${marginTop})`);

            legend
                .append("rect")
                .attr("width", legendWidth)
                .attr("height", legendHeight)
                .attr("fill", `url(#${gradientId})`)
                .attr("stroke", "#ccc");

            const legendScale = d3
                .scaleLinear()
                .domain([domainMin, domainMax])
                .range([0, legendWidth]);

            const legendAxis = d3
                .axisBottom(legendScale)
                .ticks(5)
                .tickFormat(d => (d >= 1_000_000 ? `${Math.round(d / 1_000_000)}M` : formatNumber(d)));

            legend
                .append("g")
                .attr("transform", `translate(0,${legendHeight})`)
                .call(legendAxis)
                .call(gAxis => gAxis.select(".domain").remove());

            legend
                .append("text")
                .attr("x", legendWidth / 2)
                .attr("y", -6)
                .attr("text-anchor", "middle")
                .attr("font-size", 12)
                .attr("fill", "#111")
                .text(
                    selectedFamily
                        ? `${selectedFamily} adherents`
                        : "Protestant adherents (state total)"
                );
        }
    }, [us, selectedFamily]);

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
    }, [selectedState, selectedFamily]);

    return <svg ref={svgRef} />;
}
