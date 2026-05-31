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
    TrendingUp,
    AlertCircle,
    CheckCircle2
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
            console.log("AI Analysis Data Structure:", {
                weakAreas: response.data.weakAreas,
                strongAreas: response.data.strongAreas,
                personalizedRecommendations: response.data.personalizedRecommendations
            });
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
    
    // Priority metric counters with casing normalization
    const highPriorityCount = questions.filter(
        (q) => q.priority?.toUpperCase() === "HIGH"
    ).length;

    const mediumPriorityCount = questions.filter(
        (q) => q.priority?.toUpperCase() === "MEDIUM"
    ).length;

    const lowPriorityCount = questions.filter(
        (q) => q.priority?.toUpperCase() === "LOW"
    ).length;

    const filteredQuestions = questions.filter((q) => {
        const questionText = q.question?.toLowerCase() || "";
        
        // Split search terms by spaces to allow loose keyword matches
        const searchWords = searchTerm.toLowerCase().trim().split(/\s+/);
        const matchesSearch = searchWords.every(word => questionText.includes(word));
        
        // Strict case-insensitive priority match
        const matchesPriority = priorityFilter === "ALL" 
            ? true 
            : q.priority?.toUpperCase() === priorityFilter.toUpperCase();
            
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
        <div className="w-full min-h-screen bg-[#070B13] text-[#F3F4F6] font-sans antialiased selection:bg-blue-500/30 overflow-x-hidden">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-2">

                {/* ADJUSTED HEADER UI - Matches alignment from image_d748ee.png */}
                <header className="w-full py-5 flex items-center justify-between mb-6">
                    {/* Left Brand Identity */}
                    <div className="flex items-center gap-3 shrink-0">
                        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                                <path d="M12 6v6l4 2" />
                            </svg>
                        </div>
                        <span className="text-lg font-semibold tracking-tight text-white">
                            DSA Intelligence
                        </span>
                    </div>

                    {/* Centered Fixed Search Bar Container */}
                    <div className="flex-1 max-w-2xl mx-8 hidden md:block">
                        <div className="relative w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search questions (e.g. 'binary tree depth')..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-[#0E1526] border border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/40 transition-all duration-200"
                            />
                        </div>
                    </div>

                    {/* Right Minimalist Profile Control */}
                    <div className="flex items-center gap-4 shrink-0">
                        <div className="w-9 h-9 rounded-xl bg-[#0E1526] border border-slate-800 flex items-center justify-center cursor-pointer hover:bg-[#131D33] transition-colors">
                            <User className="w-4 h-4 text-slate-400" />
                        </div>
                    </div>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* LEFT & CENTER MAIN REGIONS */}
                    <div className="lg:col-span-8 flex flex-col gap-6">

                        {/* KPI CARDS GRID - 4 Column Layout */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {/* Total Tracked */}
                            <div className="bg-[#0B111E] border border-[#152035] rounded-2xl p-5 relative overflow-hidden group transition-all duration-200 hover:border-[#1E2F4F]">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total</p>
                                        <h3 className="text-2xl font-bold tracking-tight text-white mt-2">{totalCount || 8}</h3>
                                    </div>
                                    <div className="p-2 rounded-lg bg-blue-500/5 border border-blue-500/10 text-blue-400">
                                        <Activity className="w-4 h-4" />
                                    </div>
                                </div>
                                <p className="text-[11px] text-slate-500 mt-3">Tracked problems</p>
                            </div>

                            {/* High Priority */}
                            <div className="bg-[#0B111E] border border-[#152035] rounded-2xl p-5 relative overflow-hidden group transition-all duration-200 hover:border-[#1E2F4F]">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-[#EF4444]">High</p>
                                        <h3 className="text-2xl font-bold tracking-tight text-white mt-2">{highPriorityCount}</h3>
                                    </div>
                                    <div className="p-2 rounded-lg bg-red-500/5 border border-red-500/10 text-red-400">
                                        <Target className="w-4 h-4" />
                                    </div>
                                </div>
                                <p className="text-[11px] text-slate-500 mt-3">Critical review</p>
                            </div>

                            {/* Medium Priority Card */}
                            <div className="bg-[#0B111E] border border-[#152035] rounded-2xl p-5 relative overflow-hidden group transition-all duration-200 hover:border-[#1E2F4F]">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-[#EAB308]">Medium</p>
                                        <h3 className="text-2xl font-bold tracking-tight text-white mt-2">{mediumPriorityCount}</h3>
                                    </div>
                                    <div className="p-2 rounded-lg bg-yellow-500/5 border border-yellow-500/10 text-yellow-500">
                                        <AlertCircle className="w-4 h-4" />
                                    </div>
                                </div>
                                <p className="text-[11px] text-slate-500 mt-3">Needs attention</p>
                            </div>

                            {/* Low Priority Card */}
                            <div className="bg-[#0B111E] border border-[#152035] rounded-2xl p-5 relative overflow-hidden group transition-all duration-200 hover:border-[#1E2F4F]">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-[#10B981]">Low</p>
                                        <h3 className="text-2xl font-bold tracking-tight text-white mt-2">{lowPriorityCount}</h3>
                                    </div>
                                    <div className="p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-emerald-400">
                                        <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                </div>
                                <p className="text-[11px] text-slate-500 mt-3">Good practice</p>
                            </div>
                        </div>

                        {/* QUESTION LOG CONTAINER */}
                        <div className="bg-[#0B111E] border border-[#152035] rounded-2xl p-6 flex flex-col flex-1 min-h-[550px]">
                            <div className="flex items-center justify-between border-b border-[#152035] pb-4 mb-5">
                                <div>
                                    <h2 className="text-lg font-bold tracking-tight text-white">Question Log</h2>
                                    <p className="text-xs text-slate-400 mt-0.5">{filteredQuestions.length} questions total</p>
                                </div>

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
                            <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[580px] pr-2 
                                            [&::-webkit-scrollbar]:w-2
                                            [&::-webkit-scrollbar-track]:bg-[#070B13]
                                            [&::-webkit-scrollbar-track]:rounded-lg
                                            [&::-webkit-scrollbar-thumb]:bg-[#1E293B]
                                            [&::-webkit-scrollbar-thumb]:rounded-lg
                                            [&::-webkit-scrollbar-thumb]:border
                                            [&::-webkit-scrollbar-thumb]:border-[#141C2F]
                                            hover:[&::-webkit-scrollbar-thumb]:bg-blue-500/30">
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
                            <div className="flex items-center gap-2 border-b border-[#152035] pb-4">
                                <Sparkles className="w-4 h-4 text-blue-400 fill-blue-400/10" />
                                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">AI Learning Insights</h3>
                            </div>

                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-2 text-xs font-bold text-[#10B981] uppercase tracking-wider">
                                    <TrendingUp className="w-4 h-4" />
                                    <span>Strong Improvements</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {aiAnalysis?.strongAreas.map((tag, idx) => (
                                        <span
                                            key={idx}
                                            className="text-xs font-medium p-3 rounded-xl bg-[#111C18] text-[#A7F3D0] border border-[#10B981]/10 hover:border-[#10B981]/20 transition-colors cursor-default"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-2 text-xs font-bold text-[#EF4444] uppercase tracking-wider">
                                    <Target className="w-4 h-4" />
                                    <span>Weak Areas</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {aiAnalysis?.weakAreas.map((tag, idx) => (
                                        <span
                                            key={idx}
                                            className="text-xs font-medium p-3 rounded-xl bg-[#1C1216] text-[#FCA5A5] border border-[#EF4444]/10 hover:border-[#EF4444]/20 transition-colors cursor-default"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                

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
                <footer className="pt-4 pb-12 border-t border-[#141C2F] mt-12 flex justify-center items-center text-[11px] font-medium text-slate-600">
                    <div>DSA Tracker • Learning Intelligence System</div>
                </footer>
            </div>
        </div>
    );
};

export default Dashboard;