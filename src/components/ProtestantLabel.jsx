// src/components/ProtestantLabel.jsx
import React, { useMemo } from "react";
import { PROTESTANT_BY_STATE } from "../data/protestantByState";
import { useAnimatedNumber } from "../hooks/useAnimatedNumber";

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

export default function ProtestantLabel({ selectedState }) {
    // aggregate for either one state or all states
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
                    const animated = useAnimatedNumber(value, 500);

                    return (
                        <div
                            key={family}
                            className="col-span-6 grid grid-cols-6 border-b border-gray-300 py-0.5"
                        >
                            <div className="col-span-2 font-extrabold">{family}</div>
                            <div className="col-span-3 text-right pr-2 tabular-nums">
                                {Math.round(animated).toLocaleString()}
                                <span className="text-[11px] text-gray-600">
                                    {" "}({formatMillions(animated)})
                                </span>

                            </div>
                            <div className="col-span-1 font-extrabold text-right">
                                {formatPercent(value, summary.total)}
                            </div>
                        </div>
                    );
                })}
            </div>

            <hr className="border-t-4 border-black my-1" />
            <div className="text-xs">
                <div className="mb-1">
                    “Other” includes Protestant and non-denominational groups that do
                    not fit in the six mainline families above.
                </div>
            </div>
        </div>
    );
}
