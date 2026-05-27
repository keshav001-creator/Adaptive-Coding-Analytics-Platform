import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    AlertTriangle,
    Target,
    Clock,
    Calendar,
    Sparkles
} from "lucide-react";
import axios from "./api/axios";

const QuestionDetails = () => {
    const navigate = useNavigate();
    const { questionName } = useParams();
    const [questionData, setQuestionData] = useState(null);

    const fetchQuestionData = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/questions/${questionName}`);
            const { intelligenceData, questionLogs } = response.data;

            const mergedQuestionData = {
                priority: intelligenceData.priority,
                recommendation: intelligenceData.recommendation ,
                revisionGapDays: intelligenceData.revisionGapDays,
                trendAnalysis: intelligenceData.trendAnalysis ,
                question: intelligenceData.question || questionName,
                // currentStatus: intelligenceData.currentStatus || "completed",
                createdAt: intelligenceData.createdAt,
                totalRevisions: questionLogs.length,
                totalFailedAttempts: questionLogs.reduce((acc, curr) => acc + (curr.failedAttempts || 0), 0),
                averageTime: questionLogs.length > 0 ? `${Math.round(questionLogs.reduce((acc, curr) => acc + (curr.timeSpent || 0), 0) / questionLogs.length)}s` : "0s",
                trends: questionLogs
            };

            console.log("Intelligence Data:", intelligenceData);
            console.log("Question Logs:", questionLogs);

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
    // REFACTORED PROGRESS ENGINE (RELATIVITY TREND GRAPH)
    // --------------------------------------------------------
    const trendList = questionData?.trends || [];

    const parsedTrends = trendList.map((item, index) => {
        let time = 0;
        if (typeof item.timeSpent === 'number') time = item.timeSpent;
        else if (typeof item.timeSpent === 'string') time = parseFloat(item.timeSpent) || 0;

        let fails = item.failedAttempts ?? (item.status?.toLowerCase() === "failed" ? 1 : 0);

        // Performance friction cost factor 
        const frictionCost = time + (fails * 25);
        const revNum = item.revisionNumber || (index + 1);

        return { frictionCost, revNum };
    });

    // Compute standard trend coordinates using a fixed ceiling/floor boundary relative to baseline
    const chartPoints = parsedTrends.map((item, index) => {
        // Horizontal spacing across 100 unit coordinate system
        const x = parsedTrends.length > 1 ? 8 + (84 * index) / (parsedTrends.length - 1) : 50;

        if (index === 0) {
            return { x, y: 22 }; // Revision 1 sits at a fixed safe default middle horizon line
        }

        const previousItem = parsedTrends[index - 1];
        const costDiff = item.frictionCost - previousItem.frictionCost;

        let targetY;
        if (costDiff < 0) {
            // PROGRESS: Time or failures dropped. Slopes UPWARD towards top ceiling boundary (4)
            targetY = 10;
        } else if (costDiff > 0) {
            // REGRESSION: Time or failures spiked. Slopes DOWNWARD towards floor boundary (32)
            targetY = 32;
        } else {
            // STAGNANT: No changes. Keeps the identical altitude level of previous log point
            targetY = 22;
        }

        return { x, y: targetY };
    });

    const pathD = chartPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const polygonPoints = chartPoints.length > 0
        ? `${chartPoints.map(p => `${p.x},${p.y}`).join(' ')} ${chartPoints[chartPoints.length - 1].x},35 ${chartPoints[0].x},35`
        : "";

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
                            {/* <span className={`px-3 py-1 text-xs font-bold rounded-md border tracking-wide uppercase ${getStatusBadgeClass(questionData?.currentStatus)}`}>
                                {questionData?.currentStatus}
                            </span> */}
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
                                {questionData?.revisionGapDays || 14}
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

                {/* CORRECTED PROGRESS TREND VISUALIZER */}
                <div className="lg:col-span-6 bg-[#0B111E] border border-[#152035] rounded-2xl p-5 flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Overall Progress Trend</h4>
                        <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            Upward Line Slope = Direct Learning Progress
                        </span>
                    </div>

                    <div className="relative h-44 w-full flex items-end">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 38" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.15" />
                                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                                </linearGradient>
                                <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#34D399" />
                                    <stop offset="100%" stopColor="#059669" />
                                </linearGradient>
                            </defs>

                            {chartPoints.length > 0 && (
                                <>
                                    <polygon points={polygonPoints} fill="url(#area-gradient)" />
                                    <path
                                        d={pathD}
                                        fill="none"
                                        stroke="url(#line-gradient)"
                                        strokeWidth="1.75"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    {chartPoints.map((p, i) => (
                                        <g key={i}>
                                            <circle cx={p.x} cy={p.y} r="1.5" className="fill-emerald-500" />
                                            <text
                                                x={p.x}
                                                y="37"
                                                textAnchor="middle"
                                                className="text-[2.2px] font-mono font-bold fill-slate-500"
                                            >
                                                Rev {parsedTrends[i].revNum}
                                            </text>
                                        </g>
                                    ))}
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
                <div className="relative border-l-2 border-[#1E293B] ml-3 pl-6 space-y-5">
                    {trendList.map((item, index) => {
                        const attemptDate = item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                            : "Recent";

                        const formatSeconds = (seconds) => {
                            if (!seconds) return "0s";
                            const mins = Math.floor(seconds / 60);
                            const secs = Math.floor(seconds % 60);
                            return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
                        };

                        return (
                            <div key={item._id } className="relative group">
                                <div className="absolute -left-[31px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 border-blue-500 bg-[#070B13] z-10" />
                                <div className="flex items-center justify-between bg-[#0E1526] border border-[#1E293B]/60 rounded-xl p-4">
                                    <div>
                                        <p className="text-sm font-bold text-slate-200">
                                            Revision {item.revisionNumber  }
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">{attemptDate}</p>
                                    </div>
                                    <div className="flex items-center gap-6 text-right">
                                        <div>
                                            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-0.5">Time Taken</span>
                                            <p className="text-sm font-mono font-bold text-slate-300">
                                                {typeof item.timeSpent === 'number' ? formatSeconds(item.timeSpent) : (item.timeSpent || "0s")}
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