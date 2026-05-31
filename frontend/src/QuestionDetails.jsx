import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    AlertTriangle,
    Target,
    Clock,
    Calendar,
    Sparkles,
    TrendingUp,
    TrendingDown,
    Minus
} from "lucide-react";
import axios from "./api/axios";

const QuestionDetails = () => {
    const navigate = useNavigate();
    const { questionName } = useParams();
    const [questionData, setQuestionData] = useState(null);

    const formatTime = (seconds) => {
        if (!seconds) return "0m";

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }

        return `${minutes}m`;
    };

    const fetchQuestionData = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/questions/${questionName}`);
            const { intelligenceData, questionLogs } = response.data;

            const mergedQuestionData = {
                priority: intelligenceData.priority,
                recommendation: intelligenceData.recommendation,
                revisionGapDays: intelligenceData.revisionGapDays,
                trendAnalysis: intelligenceData.trendAnalysis,
                question: intelligenceData.question || questionName,
                createdAt: intelligenceData.createdAt,
                totalRevisions: questionLogs.length,
                totalFailedAttempts: questionLogs.reduce((acc, curr) => acc + (curr.failedAttempts || 0), 0),
                averageTime: questionLogs.length > 0
                    ? formatTime(
                        Math.round(
                            questionLogs.reduce((acc, curr) => acc + (curr.timeSpent || 0), 0)
                            / questionLogs.length
                        )
                    )
                    : "0m",
                trends: questionLogs
            };

            console.log("Fetched Intelligence Data:", intelligenceData);
            console.log("Fetched Question Logs:", questionLogs);
            console.log("Merged Question Data:", mergedQuestionData);

            setQuestionData(mergedQuestionData);
        } catch (err) {
            console.log("Using structured fallback mock data due to fetch error", err);
        }
    };

    useEffect(() => {
        fetchQuestionData();
    }, [questionName]);

    const getPriorityBadgeClass = (priority) => {
        switch (priority?.toUpperCase()) {
            case "HIGH": return "bg-[#2A141A] text-[#EF4444] border-[#EF4444]/20";
            case "MEDIUM": return "bg-[#2A2415] text-[#EAB308] border-[#EAB308]/20";
            case "LOW": return "bg-[#142A1D] text-[#10B981] border-[#10B981]/20";
            default: return "bg-slate-800 text-slate-400 border-slate-700";
        }
    };

    // --------------------------------------------------------
    // TIME-BASED TREND ENGINE WITH ROUNDED OFF DELTAS
    // --------------------------------------------------------
    const trendList = questionData?.trends || [];

    const parsedTrends = trendList.map((item, index) => {
        let time = 0;
        if (typeof item.timeSpent === 'number') time = item.timeSpent;
        else if (typeof item.timeSpent === 'string') time = parseFloat(item.timeSpent) || 0;

        const revNum = item.revisionNumber || (index + 1);
        return { time, revNum };
    });

    const times = parsedTrends.map(t => t.time);
    const maxTime = Math.max(...times, 1);
    const minTime = Math.min(...times, 0);
    const timeRange = maxTime - minTime || 1;

    const chartPoints = parsedTrends.map((item, index) => {
        const x = parsedTrends.length > 1 ? 8 + (84 * index) / (parsedTrends.length - 1) : 50;
        const y = 32 - ((item.time - minTime) / timeRange) * 26;

        let comparison = "baseline";
        let diffText = "";

        if (index > 0) {
            const timeDiff = item.time - parsedTrends[index - 1].time;

            // Math.round fixes the floating point precision bug (.0000000000023)
            const roundedDiff = Math.round(Math.abs(timeDiff));

            if (timeDiff < 0) {
                comparison = "progress";
                diffText = `-${roundedDiff}s`;
            } else if (timeDiff > 0) {
                comparison = "downfall";
                diffText = `+${roundedDiff}s`;
            } else {
                comparison = "stagnant";
                diffText = "0s";
            }
        }

        return { x, y, time: item.time, revNum: item.revNum, comparison, diffText };
    });

    const pathD = chartPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    const polygonPoints = chartPoints.length > 0
        ? `${chartPoints.map(p => `${p.x},${p.y}`).join(' ')} ${chartPoints[chartPoints.length - 1].x},35 ${chartPoints[0].x},35`
        : "";

    const getOverallTrendBanner = () => {
        if (chartPoints.length < 2) return { text: "Initial Baseline Set", styles: "text-blue-400 bg-blue-500/10 border-blue-500/20" };
        const lastPoint = chartPoints[chartPoints.length - 1];
        if (lastPoint.comparison === "progress") {
            return { text: "Trending Upward: Speed Improving", styles: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
        } else if (lastPoint.comparison === "downfall") {
            return { text: "Trending Downward: Speed Slacking", styles: "text-rose-400 bg-rose-500/10 border-rose-500/20" };
        }
        return { text: "Stable Baseline Maintained", styles: "text-slate-400 bg-slate-500/10 border-slate-500/20" };
    };

    const activeBanner = getOverallTrendBanner();

    return (
        <div className="min-h-screen bg-[#070B13] text-[#F3F4F6] font-sans antialiased px-8 py-8">

            {/* HEADER */}
            <div className="flex flex-col gap-3 mb-8">
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition w-fit group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    Back to Dashboard
                </button>

                <div className="flex items-center justify-between mt-1">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-extrabold tracking-tight text-white capitalize">
                                {questionData?.question}
                            </h1>
                            <span className={`px-3 py-1 text-xs font-bold rounded-md border tracking-wide uppercase ${getPriorityBadgeClass(questionData?.priority)}`}>
                                {questionData?.priority}
                            </span>
                        </div>
                        <p className="text-sm text-slate-500 font-medium mt-1.5">
                            {questionData?.createdAt && `Added on ${new Date(questionData.createdAt).toLocaleDateString()}`}
                        </p>
                    </div>
                </div>
            </div>

            {/* QUICK OVERVIEW STATS BOXES */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-[#0B111E] border border-[#152035] rounded-2xl p-5">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Failed Attempts</p>
                            <h3 className="text-3xl font-bold tracking-tight text-white mt-2">
                                {questionData?.totalFailedAttempts}
                            </h3>
                        </div>
                        <div className="p-2 rounded-lg bg-red-500/5 border border-red-500/10 text-red-400">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                <div className="bg-[#0B111E] border border-[#152035] rounded-2xl p-5">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Revisions</p>
                            <h3 className="text-3xl font-bold tracking-tight text-white mt-2">
                                {questionData?.totalRevisions}
                            </h3>
                        </div>
                        <div className="p-2 rounded-lg bg-blue-500/5 border border-blue-500/10 text-blue-400">
                            <Target className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                <div className="bg-[#0B111E] border border-[#152035] rounded-2xl p-5">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Avg Solve Time</p>
                            <h3 className="text-3xl font-bold tracking-tight text-white mt-2 font-mono">
                                {questionData?.averageTime}
                            </h3>
                        </div>
                        <div className="p-2 rounded-lg bg-yellow-500/5 border border-yellow-500/10 text-yellow-400">
                            <Clock className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                <div className="bg-[#0B111E] border border-[#152035] rounded-2xl p-5">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Next Revision</p>
                            <h3 className="text-3xl font-bold tracking-tight text-white mt-2 font-mono">
                                {questionData?.revisionGapDays || 14} days
                            </h3>
                        </div>
                        <div className="p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-emerald-400">
                            <Calendar className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </div>

            {/* TWIN ARCHITECTURE LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">

                {/* VISUAL TREND GRAPH */}
                <div className="lg:col-span-6 bg-[#0B111E] border border-[#152035] rounded-2xl p-5 flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex flex-col gap-0.5">
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Time Taken Trend Analysis</h4>
                            <span className="text-[10px] text-slate-500">Visualizing structural pace shifts across timelines</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border tracking-wide uppercase ${activeBanner.styles}`}>
                            {activeBanner.text}
                        </span>
                    </div>

                    <div className="relative h-48 w-full flex items-end pt-4">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 38" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.1" />
                                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                                </linearGradient>
                                <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#3B82F6" />
                                    <stop offset="50%" stopColor="#10B981" />
                                    <stop offset="100%" stopColor="#6366F1" />
                                </linearGradient>
                            </defs>

                            <line x1="5" y1="6" x2="95" y2="6" stroke="#1E293B" strokeWidth="0.15" strokeDasharray="1,1" />
                            <text x="3" y="6.5" className="text-[1.8px] fill-emerald-500/70 font-mono">Fastest ({Math.round(minTime)}s)</text>

                            <line x1="5" y1="32" x2="95" y2="32" stroke="#1E293B" strokeWidth="0.15" strokeDasharray="1,1" />
                            <text x="3" y="32.5" className="text-[1.8px] fill-rose-500/70 font-mono">Slowest ({Math.round(maxTime)}s)</text>

                            {chartPoints.length > 0 && (
                                <>
                                    <polygon points={polygonPoints} fill="url(#area-gradient)" />
                                    <path
                                        d={pathD}
                                        fill="none"
                                        stroke="url(#line-gradient)"
                                        strokeWidth="0.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="drop-shadow-[0_2px_8px_rgba(59,130,246,0.2)]"
                                    />
                                    {chartPoints.map((p, i) => {
                                        let nodeColor = "fill-blue-500 stroke-blue-900";
                                        let labelColor = "fill-slate-400";

                                        if (p.comparison === "progress") {
                                            nodeColor = "fill-emerald-500 stroke-[#070B13]";
                                            labelColor = "fill-emerald-400 font-bold";
                                        } else if (p.comparison === "downfall") {
                                            nodeColor = "fill-rose-500 stroke-[#070B13]";
                                            labelColor = "fill-rose-400 font-bold";
                                        }

                                        return (
                                            <g key={i}>
                                                <circle cx={p.x} cy={p.y} r="1.2" className={`${nodeColor} stroke-[0.4]`} />

                                                {p.diffText && (
                                                    <text
                                                        x={p.x}
                                                        y={p.y - 2.5}
                                                        textAnchor="middle"
                                                        className={`text-[1.8px] font-mono ${labelColor}`}
                                                    >
                                                        {p.diffText}
                                                    </text>
                                                )}

                                                <text
                                                    x={p.x}
                                                    y={p.y + 2.8}
                                                    textAnchor="middle"
                                                    className="text-[1.6px] font-mono fill-slate-300"
                                                >
                                                    {Math.round(p.time)}s
                                                </text>

                                                <text
                                                    x={p.x}
                                                    y="37"
                                                    textAnchor="middle"
                                                    className="text-[2px] font-mono font-bold fill-slate-500"
                                                >
                                                    Rev {p.revNum}
                                                </text>
                                            </g>
                                        );
                                    })}
                                </>
                            )}
                        </svg>
                    </div>
                </div>

                {/* AI RECOMMENDATION INSIGHTS CONTAINER */}
                <div className="lg:col-span-6 bg-[#0B111E] border border-[#152035] rounded-2xl p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="w-4 h-4 text-blue-400 fill-blue-400/10" />
                            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">AI Intelligence</h4>
                        </div>
                        <div className="p-4 rounded-xl bg-[#0F172A] border border-[#1E293B]/60 text-sm font-medium text-slate-300 leading-relaxed">
                            {questionData?.recommendation}
                        </div>
                    </div>

                    <div className="mt-5 flex flex-col gap-2">
                        <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-1">Trend Analysis</span>
                        {questionData?.trendAnalysis.map((insight, index) => (
                            <div key={index} className="flex items-center gap-3 bg-[#0E1526] border border-[#1E293B]/40 rounded-xl px-4 py-3">
                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                <p className="text-sm font-medium text-slate-300">{insight}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ATTEMPT HISTORICAL TIMELINE */}
            <div className="bg-[#0B111E] border border-[#152035] rounded-2xl p-6 mb-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-5">Question Attempt Timeline</h4>
                <div className="relative border-l-2 border-[rgb(30,41,59)] ml-3 pl-6 space-y-5">
                    {trendList.map((item, index) => {
                        const attemptDate = item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                            : "Recent";

                        const formatTime = (seconds) => {
                            if (!seconds) return "0m";

                            const hours = Math.floor(seconds / 3600);
                            const minutes = Math.floor((seconds % 3600) / 60);

                            if (hours > 0) {
                                return `${hours}h ${minutes}m`;
                            }

                            return `${minutes}m`;
                        };

                        let TrendIcon = Minus;
                        let trendWrapperClass = "border-slate-700 text-slate-400 bg-slate-500/5";
                        let trendLabel = "Baseline";

                        if (index > 0) {
                            const prevItem = trendList[index - 1];
                            const prevTime = typeof prevItem.timeSpent === 'number' ? prevItem.timeSpent : parseFloat(prevItem.timeSpent) || 0;
                            const currTime = typeof item.timeSpent === 'number' ? item.timeSpent : parseFloat(item.timeSpent) || 0;

                            if (currTime < prevTime) {
                                TrendIcon = TrendingUp;
                                trendWrapperClass = "border-emerald-500/20 text-emerald-400 bg-emerald-500/5";
                                trendLabel = "Progress";
                            } else if (currTime > prevTime) {
                                TrendIcon = TrendingDown;
                                trendWrapperClass = "border-rose-500/20 text-rose-400 bg-rose-500/5";
                                trendLabel = "Downfall";
                            }
                        }

                        return (
                            <div key={item._id} className="relative group">
                                <div className="absolute -left-[31px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 border-blue-500 bg-[#070B13] z-10" />
                                <div className="flex items-center justify-between bg-[#0E1526] border border-[#1E293B]/60 rounded-xl p-4">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <p className="text-sm font-bold text-slate-200">
                                                Revision {item.revisionNumber}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1">{attemptDate}</p>
                                        </div>
                                        <div className={`flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${trendWrapperClass}`}>
                                            <TrendIcon className="w-3 h-3" />
                                            {trendLabel}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 text-right">
                                        <div>
                                            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-0.5">Time Taken</span>
                                            <p className="text-sm font-mono font-bold text-slate-300">
                                                {typeof item.timeSpent === 'number' ? formatTime(item.timeSpent) : (item.timeSpent || "0m")}
                                            </p>
                                        </div>
                                        <div className="w-24">
                                            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-0.5">Failed Attempts</span>
                                            <p className="text-sm font-mono font-bold text-slate-300">
                                                {item.failedAttempts ?? 0}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default QuestionDetails;