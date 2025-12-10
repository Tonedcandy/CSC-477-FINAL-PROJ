// src/components/StateFamilyBarChart.jsx

/*
 * This source file was developed by Monish Shanmugham Suresh with assistance from OpenAI tools
 * (ChatGPT and Codex). These tools were used for code suggestions and refactoring;
 * the human author is responsible for all design decisions and final content.
 */

import React, { useMemo, useEffect, useRef } from "react";
import * as d3 from "d3";
import { TOP_PROTESTANT_CHURCH_GROUPS_BY_FAMILY_BY_STATE } from "../data/topProtestantChurchGroupsByFamilyByState";
import { FAMILY_COLORS, DEFAULT_FAMILY_COLOR } from "../constants/familyColors";

function formatNumber(n) {
    if (!Number.isFinite(n)) return "0";
    return n.toLocaleString();
}

function formatTick(d) {
    const abs = Math.abs(d);
    if (abs >= 1_000_000) {
        const v = abs / 1_000_000;
        // e.g. 1.2M, 2M
        return `${v < 10 ? v.toFixed(1).replace(/\.0$/, "") : Math.round(v)}M`;
    }
    if (abs >= 1_000) {
        const v = abs / 1_000;
        // e.g. 50K, 250K, 1.2M
        return `${v < 10 ? v.toFixed(1).replace(/\.0$/, "") : Math.round(v)}K`;
    }
    return String(d);
}

function truncateLabel(name, maxChars = 30) {
    if (!name) return "";
    return name.length > maxChars
        ? name.slice(0, maxChars - 1) + "…"
        : name;
}

export default function StateFamilyBarChart({ selectedState, selectedFamily }) {
    const svgRef = useRef(null);
    const labelPadding = 4;

    const bars = useMemo(() => {
        if (!selectedState || !selectedFamily) return [];
        return TOP_PROTESTANT_CHURCH_GROUPS_BY_FAMILY_BY_STATE.filter(
            d => d["State Name"] === selectedState && d.family === selectedFamily
        )
            .sort((a, b) => b.sa - a.sa)
            .slice(0, 5);
    }, [selectedState, selectedFamily]);

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();
        if (!bars.length) return;

        const width = 360;
        const rowHeight = 48;
        const labelWidth = 112;
        const margin = { top: 14, right: 16, bottom: 28, left: 16 };
        const height = margin.top + margin.bottom + bars.length * rowHeight;
        const innerWidth = width - margin.left - margin.right - labelWidth;

        const maxValue = d3.max(bars, d => d.sa) || 1;
        const tickValues = d3.ticks(0, maxValue, 4); // fewer ticks so labels don't overlap
        const x = d3
            .scaleLinear()
            .domain([0, maxValue]) // exact max, no .nice()
            .range([0, innerWidth]);

        const barColor = FAMILY_COLORS[selectedFamily] || DEFAULT_FAMILY_COLOR;

        const svgEl = svg
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("width", width)
            .attr("height", height);

        const g = svgEl
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const rows = g
            .selectAll("g.row")
            .data(bars)
            .join("g")
            .attr("class", "row")
            .attr("transform", (d, i) => `translate(0,${i * rowHeight})`);

        rows
            .append("text")
            .attr("x", 0)
            .attr("y", 12)
            .attr("font-size", 12)
            .attr("font-weight", 700)
            .attr("fill", 'black')
            .text(d => truncateLabel(d["Group Name"]))
            .append("title")
            .text(d => d["Group Name"]);
        ;

        rows
            .append("text")
            .attr("x", 50 + innerWidth)
            .attr("y", 12)
            .attr("text-anchor", "end")
            .attr("font-size", 12)
            .attr("fill", "#111")
            .text(d => formatNumber(d.sa));

        rows
            .append("rect")
            .attr("x", 0)
            .attr("y", 20)
            .attr("width", innerWidth + 50)
            .attr("height", 12)
            .attr("fill", "#e5e7eb")

        rows
            .append("rect")
            .attr("class", "bar")
            .attr("x", 0)
            .attr("y", 20)
            .attr("height", 12)
            .attr("fill", barColor)
            .attr("width", 0)
            .transition()
            .delay((d, i) => i * 140)
            .duration(900)
            .ease(d3.easeCubicOut)
            .attr("width", d => x(d.sa));

        g.append("g")
            .attr("transform", `translate(0, ${bars.length * rowHeight - 6})`)
            .call(
                d3
                    .axisBottom(x)
                    .tickValues(tickValues) // ensure a tick at maxValue
                    .tickFormat(formatTick) // compact K/M formatting
            )
            .call(axis => axis.select(".domain").remove());
    }, [bars, selectedFamily]);

    if (!selectedState) {
        return (
            <div className="border bg-white/90 p-3 text-sm text-gray-700">
                Select a state to see the leading church groups.
            </div>
        );
    }

    if (!selectedFamily) {
        return (
            <div className="border bg-white/90 p-3 text-sm text-gray-700">
                Select a family to see the leading church groups.
            </div>
        );
    }

    if (!bars.length) {
        return (
            <div className="border bg-white/90 p-3 text-sm text-gray-700">
                No church data available for {selectedFamily} in {selectedState}.
            </div>
        );
    }

    return (
        <div className="border bg-white/90 p-3">
            <p className="text-lg font-bold mb-2 text-left">
                Top churches in {selectedState} ({selectedFamily})
            </p>
            <svg ref={svgRef} />
        </div>
    );
}
