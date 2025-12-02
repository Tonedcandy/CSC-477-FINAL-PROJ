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
];

function formatMillions(n) {
    if (!n) return "0M";
    return (n / 1_000_000).toFixed(1) + "M";
}

function formatPercent(part, total) {
    if (!total) return "0%";
    return Math.round((part / total) * 100) + "%";
}

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

    return (
        <div className="min-h-[200px] max-w-[400px] flex-row border px-2 py-2 bg-white/90">
            <div className="text-4xl font-extrabold">Protestantism Spread</div>
            <div className="text-sm text-gray-600 mb-1">{titleStateText}</div>
            <hr />
            <div className="text-base font-light">6 Mainstream Denominations</div>
            <div className="justify-between text-lg font-extrabold">{subtitle}</div>
            <hr className="border-t-[6px] border-black my-1" />

            {/* Header + animated total */}
            <div className="font-extrabold grid grid-cols-2 items-end">
                <div className="col-span-2 text-sm tracking-wide">
                    Protestants (estimated adherents)
                </div>
                <div className="text-4xl col-span-1">Population</div>
                <div className="col-span-1 text-4xl text-right pr-2 tabular-nums">
                    {Math.round(animatedTotal).toLocaleString()}
                </div>
            </div>

            <hr className="border-t-4 border-black my-1" />

            {/* Family rows */}
            <div className="grid grid-cols-6 gap-1 text-sm">
                {FAMILIES.map((family) => {
                    const value = summary.totalsByFamily.get(family) || 0;
                    const animated = useAnimatedNumber(value, 500);

                    return (
                        <div
                            key={family}
                            className="col-span-6 grid grid-cols-6 border-b border-gray-300 py-0.5"
                        >
                            <div className="col-span-4 font-extrabold">{family}</div>
                            <div className="col-span-1 text-right pr-2 tabular-nums">
                                {formatMillions(animated)}
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
                <div>Acronyms</div>
                <div className="pl-4">LCMS = Lutheran Church - Missouri Synod</div>
                <div className="pl-4">
                    ELCA = Evangelical Lutheran Church in America
                </div>
            </div>
        </div>
    );
}