// src/components/ProtestantLabel.jsx
import React, { useMemo } from "react";
import { PROTESTANT_BY_STATE } from "../data/protestantByState";
import { useAnimatedNumber } from "../hooks/useAnimatedNumber";
import { FAMILY_COLORS, DEFAULT_FAMILY_COLOR } from "../constants/familyColors";
import StateFamilyBarChart from "./StateFamilyBarChart";

const FAMILIES = [
    "Anglicanism",
    "Lutheranism",
    "Reformed",
    "Methodism",
    "Baptist",
    "Restoration",
    "Other",
];

function formatMillions(n) {
    if (!n) return "0M";
    if (Math.abs(n) < 1_000_000) return (n / 1_000).toFixed(0) + "K";
    return (n / 1_000_000).toFixed(1) + "M";
}

function formatPercent(part, total) {
    if (!total) return "0%";
    return Math.round((part / total) * 100) + "%";
}

const STATE_POPULATION = new Map([
    ["Alabama", 5024279],
    ["Alaska", 733391],
    ["Arizona", 7151502],
    ["Arkansas", 3011524],
    ["California", 39538223],
    ["Colorado", 5773714],
    ["Connecticut", 3605944],
    ["Delaware", 989948],
    ["District Of Columbia", 689545],
    ["Florida", 21538187],
    ["Georgia", 10711908],
    ["Hawaii", 1455271],
    ["Idaho", 1839106],
    ["Illinois", 12812508],
    ["Indiana", 6785528],
    ["Iowa", 3190369],
    ["Kansas", 2937880],
    ["Kentucky", 4505836],
    ["Louisiana", 4657757],
    ["Maine", 1362359],
    ["Maryland", 6177224],
    ["Massachusetts", 7029917],
    ["Michigan", 10077331],
    ["Minnesota", 5706494],
    ["Mississippi", 2961279],
    ["Missouri", 6154913],
    ["Montana", 1084225],
    ["Nebraska", 1961504],
    ["Nevada", 3104614],
    ["New Hampshire", 1377529],
    ["New Jersey", 9288994],
    ["New Mexico", 2117522],
    ["New York", 20201249],
    ["North Carolina", 10439388],
    ["North Dakota", 779094],
    ["Ohio", 11799448],
    ["Oklahoma", 3959353],
    ["Oregon", 4237256],
    ["Pennsylvania", 13002700],
    ["Rhode Island", 1097379],
    ["South Carolina", 5118425],
    ["South Dakota", 886667],
    ["Tennessee", 6910840],
    ["Texas", 29145505],
    ["Utah", 3271616],
    ["Vermont", 643077],
    ["Virginia", 8631393],
    ["Washington", 7705281],
    ["West Virginia", 1793716],
    ["Wisconsin", 5893718],
    ["Wyoming", 576851],
]);

const FamilyRow = ({ family, value, total, isActive, onToggle }) => {
    const animated = useAnimatedNumber(value, 500);
    const baseColor = FAMILY_COLORS[family] || DEFAULT_FAMILY_COLOR;

    return (
        <div
            role="button"
            tabIndex={0}
            aria-pressed={isActive}
            onClick={() => onToggle?.(isActive ? null : family)}
            onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onToggle?.(isActive ? null : family);
                }
            }}
            className="col-span-6 grid grid-cols-6 border-b border-gray-300 py-0.5 cursor-pointer"
            style={
                isActive
                    ? { borderBottom: `4px solid ${baseColor}` }
                    : { borderBottom: "1px solid #d1d5db" }
            }
        >
            <div
                className="col-span-2 font-extrabold"
                style={{ color: isActive ? baseColor : "#111" }}
            >
                {family}
            </div>
            <div className="col-span-3 text-right pr-2 tabular-nums text-black">
                {Math.round(animated).toLocaleString()}
                <span className="text-[11px] text-gray-600">
                    {" "}({formatMillions(animated)})
                </span>
            </div>
            <div className="col-span-1 font-extrabold text-right text-black">
                {formatPercent(value, total)}
            </div>
        </div>
    );
};

export default function ProtestantLabel({ selectedState, selectedFamily, onFamilySelect }) {
    const summary = useMemo(() => {
        const rows = selectedState
            ? PROTESTANT_BY_STATE.filter((r) => r.state === selectedState)
            : PROTESTANT_BY_STATE;

        const totalsByFamily = new Map();
        let total = 0;

        for (const row of rows) {
            const prev = totalsByFamily.get(row.family) || 0;
            totalsByFamily.set(row.family, prev + row.adherents);
            total += row.adherents;
        }

        return { totalsByFamily, total };
    }, [selectedState]);

    const topFamilies = useMemo(() => {
        if (!selectedState) return [];
        return Array.from(summary.totalsByFamily.entries())
            .map(([family, value]) => ({ family, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);
    }, [summary, selectedState]);

    const topFamiliesMax = topFamilies.length
        ? Math.max(...topFamilies.map(f => f.value))
        : 1;

    const animatedTotal = useAnimatedNumber(summary.total);

    const titleStateText = selectedState || "United States";
    const subtitle = selectedState
        ? `Totals in ${selectedState}`
        : "Totals across all 50 States of the USA";

    const population = useMemo(() => {
        if (selectedState) return STATE_POPULATION.get(selectedState) || null;
        let sum = 0;
        for (const [, val] of STATE_POPULATION) sum += val;
        return sum;
    }, [selectedState]);

    const percentOfPopulation =
        population && summary.total
            ? formatPercent(summary.total, population)
            : null;

    return (
        <div className="min-h-[200px] min-w-[340px] flex-row border px-2 py-2 bg-white/90">
            <div className="text-4xl font-extrabold">Protestantism Spread</div>
            <div className="text-sm text-gray-600 mb-1">{titleStateText}</div>
            <hr />
            <div className="text-base font-light">
                6 Mainstream Families + Other
            </div>
            <div className="justify-between text-lg font-extrabold">{subtitle}</div>
            <hr className="border-t-[6px] border-black my-1" />

            {/* Header + animated total */}
            <div className="font-extrabold grid grid-cols-2 items-end">
                <div className="col-span-2 text-sm tracking-wide">
                    Protestants <p className="text-xs">(estimated adherents)</p>
                </div>
                <div className="text-2xl col-span-1">Adherents</div>
                <div className="col-span-1 text-2xl sm:text-xl text-right pr-2 tabular-nums leading-tight">
                    {Math.round(animatedTotal).toLocaleString()}
                </div>
            </div>
            {population ? (
                <div className="flex justify-between text-sm text-gray-700 mt-1">
                    <span>{selectedState ? "State population" : "US population"}</span>
                    <span className="tabular-nums">
                        {population.toLocaleString()}{" "}
                        {percentOfPopulation ? `(${percentOfPopulation})` : ""}
                    </span>
                </div>
            ) : null}

            <hr className="border-t-4 border-black my-1" />

            {/* Family rows */}
            <div className="grid grid-cols-6 text-xs tracking-wide text-gray-600 pb-1">
                <div className="col-span-2">Family</div>
                <div className="col-span-3 text-right pr-2">Adherents</div>
                <div className="col-span-1 text-right">Share</div>
            </div>
            <div className="grid grid-cols-6 gap-1 text-sm">
                {FAMILIES.map((family) => {
                    const value = summary.totalsByFamily.get(family) || 0;
                    const isActive = selectedFamily === family;
                    return (
                        <FamilyRow
                            key={family}
                            family={family}
                            value={value}
                            total={summary.total}
                            isActive={isActive}
                            onToggle={onFamilySelect}
                        />
                    );
                })}
            </div>

            <hr className="border-t-4 border-black my-1" />
            {selectedState ? (
                selectedFamily ? (
                    <div className="mt-3">
                        <StateFamilyBarChart
                            selectedState={selectedState}
                            selectedFamily={selectedFamily}
                        />
                    </div>
                ) : topFamilies.length ? (
                    <div className="mt-3">
                        <div className="text-base font-bold border-t-4 border-black pt-2 mb-2">
                            Top families in {selectedState}
                        </div>
                        <div className="space-y-2">
                            {topFamilies.map((entry) => {
                                const color = FAMILY_COLORS[entry.family] || DEFAULT_FAMILY_COLOR;
                                const width = (entry.value / topFamiliesMax) * 100;
                                return (
                                    <div key={entry.family}>
                                        <div className="flex justify-between text-sm font-semibold">
                                            <span >{entry.family}</span>
                                            <span>{entry.value.toLocaleString()}</span>
                                        </div>
                                        <div className="w-full h-3 bg-gray-200">
                                            <div
                                                className="h-3"
                                                style={{
                                                    width: `${width}%`,
                                                    backgroundColor: color,
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : null
            ) : null}

            <div className="text-xs mt-3">
                <div className="mb-1">
                    “Other” includes Protestant and non-denominational groups that do
                    not fit in the six mainline families above.
                </div>
            </div>
        </div>
    );
}
