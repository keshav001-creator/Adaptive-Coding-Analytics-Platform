import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Search,
    Activity,
    Target,
    User,
    ChevronRight,
    Flame,
    Lightbulb,
    Sparkles,
    TrendingUp
} from "lucide-react";
import axios from "./api/axios";

const Dashboard = () => {
    // --------------------------------------------------------
    const [questions, setQuestions] = useState([]);
    const [aiAnalysis, setAiAnalysis] = useState(null);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("ALL");

    // --------------------------------------------------------
    // API DATA FETCHING
    const fetchQuestions = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/questions`
            );
            console.log("Fetched Questions:", response.data.questions);
            setQuestions(response.data.questions);
        } catch (err) {
            console.log("Error fetching questions, using placeholder fallback:", err);
        }
    };

    const fetchAIanalysis = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/ai-analysis`
            );
            console.log("Fetched AI Analysis:", response.data);
            setAiAnalysis(response.data);
        } catch (err) {
            console.log("Error fetching AI analysis, using placeholder fallback:", err);
        }
    };

    useEffect(() => {
        fetchQuestions();
        fetchAIanalysis();
    }, []);

    // --------------------------------------------------------
    // UTILITY CALCULATIONS & FILTERING
    const totalCount = questions.length;
    const highPriorityCount = questions.filter((q) => q.priority === "HIGH").length;

    const filteredQuestions = questions.filter((q) => {
        const matchesSearch = q.question?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPriority = priorityFilter === "ALL" ? true : q.priority === priorityFilter;
        return matchesSearch && matchesPriority;
    });

    const getPriorityBadgeClass = (priority) => {
        switch (priority?.toUpperCase()) {
            case "HIGH":
                return "bg-[#2A141A] text-[#EF4444] border-[#EF4444]/20";
            case "MEDIUM":
                return "bg-[#2A2415] text-[#EAB308] border-[#EAB308]/20";
            case "LOW":
                return "bg-[#142A1D] text-[#10B981] border-[#10B981]/20";
            default:
                return "bg-slate-800 text-slate-400 border-slate-700";
        }
    };

    return (
        <div className="min-h-screen bg-[#070B13] text-[#F3F4F6] font-sans antialiased selection:bg-blue-500/30 px-8 py-4">

            {/* TOP NAVIGATION HEADER */}
            <header className="border-b border-[#141C2F] bg-[#070B13]/80 backdrop-blur-md sticky top-0 z-50 py-4 flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                            <path d="M12 6v6l4 2" />
                        </svg>
                    </div>
                    <span className="text-lg font-semibold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                        DSA Intelligence
                    </span>
                </div>

                {/* SEARCH BAR & GLOBAL ACTIONS */}
                <div className="flex items-center gap-4 flex-1 max-w-xl mx-8">
                    <div className="relative w-full">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search questions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#0E1526] border border-[#1E293B]/60 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all duration-200"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="bg-[#1C1912] border border-[#FEF08A]/10 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                        <Flame className="w-4 h-4 text-[#EAB308] fill-[#EAB308]/20" />
                        <span className="text-xs font-semibold text-[#FEF08A]">12 Day Streak</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#0E1526] border border-[#1E293B] flex items-center justify-center cursor-pointer hover:bg-[#131D33]">
                        <User className="w-4 h-4 text-slate-400" />
                    </div>
                </div>
            </header>

            <main className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* LEFT & CENTER MAIN REGIONS */}
                <div className="lg:col-span-8 flex flex-col gap-6">

                    {/* KPI CARDS GRID */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Total Tracked */}
                        <div className="bg-[#0B111E] border border-[#152035] rounded-2xl p-5 relative overflow-hidden group transition-all duration-200 hover:border-[#1E2F4F]">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Questions</p>
                                    <h3 className="text-3xl font-bold tracking-tight text-white mt-2">{totalCount || 8}</h3>
                                </div>
                                <div className="p-2 rounded-lg bg-blue-500/5 border border-blue-500/10 text-blue-400">
                                    <Activity className="w-5 h-5" />
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 mt-3">Tracked problems</p>
                        </div>

                        {/* High Priority */}
                        <div className="bg-[#0B111E] border border-[#152035] rounded-2xl p-5 relative overflow-hidden group transition-all duration-200 hover:border-[#1E2F4F]">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">High Priority</p>
                                    <h3 className="text-3xl font-bold tracking-tight text-white mt-2">{highPriorityCount}</h3>
                                </div>
                                <div className="p-2 rounded-lg bg-red-500/5 border border-red-500/10 text-red-400">
                                    <Target className="w-5 h-5" />
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 mt-3">Needs attention</p>
                        </div>
                    </div>

                    {/* QUESTION LOG CONTAINER */}
                    <div className="bg-[#0B111E] border border-[#152035] rounded-2xl p-6 flex flex-col flex-1 min-h-[550px]">
                        <div className="flex items-center justify-between border-b border-[#152035] pb-4 mb-5">
                            <div>
                                <h2 className="text-lg font-bold tracking-tight text-white">Question Log</h2>
                                <p className="text-xs text-slate-400 mt-0.5">{filteredQuestions.length} questions total</p>
                            </div>

                            {/* LOG FILTERS */}
                            <div className="flex items-center gap-3">
                                <select
                                    value={priorityFilter}
                                    onChange={(e) => setPriorityFilter(e.target.value)}
                                    className="bg-[#0E1526] border border-[#1E293B] text-xs font-medium text-slate-300 rounded-xl px-3 py-2 outline-none focus:border-blue-500 transition-colors"
                                >
                                    <option value="ALL">All Levels</option>
                                    <option value="HIGH">High Priority</option>
                                    <option value="MEDIUM">Medium Priority</option>
                                    <option value="LOW">Low Priority</option>
                                </select>
                            </div>
                        </div>

                        {/* SCROLLABLE LIST WRAPPER */}
                        <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[580px] pr-1">
                            {filteredQuestions.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-500 py-20">
                                    <Search className="w-8 h-8 text-slate-600 mb-3" />
                                    <p className="text-sm font-medium">No problems matching constraints</p>
                                    <p className="text-xs text-slate-600 mt-1">Try modifying searches or active filters</p>
                                </div>
                            ) : (
                                filteredQuestions.map((q) => (
                                    <div
                                        key={q._id}
                                        onClick={() => navigate(`/question/${encodeURIComponent(q.question)}`)}
                                        className="w-full flex items-center justify-between p-4 rounded-xl bg-[#0E1526] border border-[#1E293B]/60 hover:border-blue-500/30 hover:shadow-[0_0_22px_rgba(59,130,246,0.06)] transition-all duration-200 cursor-pointer group"
                                    >
                                        <div className="flex flex-col gap-1.5">
                                            <h3 className="text-sm font-bold text-slate-200 group-hover:text-blue-400 transition-colors capitalize">
                                                {q.question}
                                            </h3>
                                        </div>

                                        <div className="flex items-center gap-5">
                                            {/* Priority Indicator */}
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-md border tracking-wider uppercase ${getPriorityBadgeClass(q.priority)}`}>
                                                    {q.priority || "unknown"}
                                                </span>
                                                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT HAND SIDEBAR - AI LEARNING INSIGHTS */}
                <div className="lg:col-span-4 flex flex-col gap-4">
                    <div className="bg-[#0B111E] border border-[#152035] rounded-2xl p-6 flex flex-col gap-6 h-full">

                        {/* Title block */}
                        <div className="flex items-center gap-2 border-b border-[#152035] pb-4">
                            <Sparkles className="w-4 h-4 text-blue-400 fill-blue-400/10" />
                            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">AI Learning Insights</h3>
                        </div>

                        {/* Weak Areas */}
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2 text-xs font-bold text-[#EF4444] uppercase tracking-wider">
                                <Target className="w-4 h-4" />
                                <span>Weak Areas</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {aiAnalysis?.weakAreas.map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[#1C1216] text-[#FCA5A5] border border-[#EF4444]/10 hover:border-[#EF4444]/20 transition-colors cursor-default"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Strong Improvements */}
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2 text-xs font-bold text-[#10B981] uppercase tracking-wider">
                                <TrendingUp className="w-4 h-4" />
                                <span>Strong Improvements</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {aiAnalysis?.strongAreas.map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[#111C18] text-[#A7F3D0] border border-[#10B981]/10 hover:border-[#10B981]/20 transition-colors cursor-default"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Revision Strategy */}
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2 text-xs font-bold text-[#3B82F6] uppercase tracking-wider">
                                <Lightbulb className="w-4 h-4" />
                                <span>Revision Strategy</span>
                            </div>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                {aiAnalysis?.personalizedRecommendations || "No specific strategy recommended at this time. Focus on consistent practice and review of weak areas."}
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* PLATFORM FOOTER */}
            <footer className="max-w-[1600px] mx-auto pt-4 pb-12 border-t border-[#141C2F] mt-12 flex justify-center items-center text-[11px] font-medium text-slate-600">
                <div>DSA Tracker • Learning Intelligence System</div>
            </footer>
        </div>
    );
};

export default Dashboard;