"use client"

import React, { useState } from "react";
import Link from "next/link";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { GrayTitle, GoldTitle } from "./reuseables";
import { Calendar, Clock, User, ArrowRight, CheckCircle, Star, Sparkles, Award } from "lucide-react";

export default function IntervieweeDashboard({ user, bookings = [] }) {
  const [activeFeedback, setActiveFeedback] = useState(null);

  const upcomingBookings = bookings.filter(b => b.status === "SCHEDULED");
  const pastBookings = bookings.filter(b => b.status === "COMPLETED" || b.status === "CANCELLED");

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-8 rounded-3xl border border-white/10 bg-[#0f0f11] backdrop-blur-xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="space-y-2">
          <Badge variant="gold">Candidate Dashboard</Badge>
          <h1 className="font-serif text-4xl sm:text-5xl leading-tight tracking-tight">
            <GrayTitle>Welcome, </GrayTitle>
            <GoldTitle>{user.name || "Candidate"}</GoldTitle>
          </h1>
          <p className="text-sm text-stone-400 font-light max-w-md">
            Review your mock interview schedule, track your plan credits, and access AI performance reports.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 shrink-0">
          <div className="px-6 py-4 rounded-2xl border border-white/5 bg-[#141417] flex items-center gap-4">
            <span className="p-3 rounded-xl bg-amber-400/10 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <p className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">Active Plan</p>
              <p className="font-serif text-2xl text-amber-300 capitalize">{user.currentPlan || "free"}</p>
            </div>
          </div>

          <div className="px-6 py-4 rounded-2xl border border-white/5 bg-[#141417] flex items-center gap-4">
            <span className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Award className="w-5 h-5" />
            </span>
            <div>
              <p className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">Credits Left</p>
              <p className="font-serif text-2xl text-emerald-400">{user.credits || 0} cr</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="appointments" className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-sm mb-8 bg-[#0f0f11] border border-white/5 p-1 rounded-2xl">
          <TabsTrigger value="appointments" className="rounded-xl py-2.5 text-xs sm:text-sm font-medium">Appointments</TabsTrigger>
          <TabsTrigger value="feedback" className="rounded-xl py-2.5 text-xs sm:text-sm font-medium">AI Feedback Reports</TabsTrigger>
        </TabsList>

        {/* Tab 1: Appointments */}
        <TabsContent value="appointments" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="font-serif text-2xl text-stone-200">Mock Sessions</h3>
              <p className="text-xs text-stone-500 mt-1">Keep track of upcoming appointments and review past mock history.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="rounded-xl border-white/10 text-stone-300 hover:bg-stone-800" asChild>
                <Link href="/#pricing">Upgrade Plan</Link>
              </Button>
              <Button variant="gold" size="sm" className="rounded-xl font-medium" asChild>
                <Link href="/explore">Browse Interviewers</Link>
              </Button>
            </div>
          </div>

          {upcomingBookings.length === 0 && pastBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 rounded-3xl border border-dashed border-white/10 bg-[#0f0f11] text-center space-y-4">
              <span className="text-4xl text-stone-500">🎯</span>
              <h4 className="text-lg font-serif text-stone-300">No sessions booked yet</h4>
              <p className="text-sm text-stone-500 max-w-sm">
                Get custom mock sessions with engineers from major companies and receive AI-backed feedback.
              </p>
              <Button variant="gold" asChild className="rounded-xl">
                <Link href="/explore">Book Your First Session</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6">
              {/* Upcoming */}
              {upcomingBookings.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-amber-400">Upcoming Mock Interviews ({upcomingBookings.length})</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    {upcomingBookings.map((b) => {
                      const start = new Date(b.startTime);
                      const end = new Date(b.endTime);
                      
                      return (
                        <Card key={b.id} className="p-6 rounded-2xl border border-white/10 bg-[#0f0f11] flex flex-col justify-between hover:border-amber-400/20 transition duration-300">
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-stone-800 border border-white/10 flex items-center justify-center overflow-hidden">
                                {b.interviewer.imageUrl ? (
                                  /* eslint-disable-next-line @next/next/no-img-element */
                                  <img src={b.interviewer.imageUrl} alt={b.interviewer.name} className="w-full h-full object-cover" />
                                ) : (
                                  <User className="w-5 h-5 text-stone-500" />
                                )}
                              </div>
                              <div>
                                <h4 className="text-sm font-semibold text-stone-200">{b.interviewer.name}</h4>
                                <p className="text-xs text-stone-500">{b.interviewer.title} at {b.interviewer.company}</p>
                              </div>
                            </div>

                            <div className="space-y-2 py-3 border-y border-white/5 text-xs text-stone-400">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5 text-stone-600" />
                                <span>{start.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5 text-stone-600" />
                                <span>{start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-5">
                            <Button variant="gold" className="w-full rounded-xl font-medium" asChild>
                              <Link href={`/appointments/${b.id}`}>
                                Join Video Call
                              </Link>
                            </Button>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Past */}
              {pastBookings.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-stone-400">Past Interviews ({pastBookings.length})</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    {pastBookings.map((b) => {
                      const start = new Date(b.startTime);
                      
                      return (
                        <Card key={b.id} className="p-6 rounded-2xl border border-white/5 bg-[#0f0f11] flex flex-col justify-between opacity-80 hover:opacity-100 hover:border-white/10 transition">
                          <div className="space-y-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-stone-800 border border-white/10 flex items-center justify-center overflow-hidden">
                                  {b.interviewer.imageUrl ? (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img src={b.interviewer.imageUrl} alt={b.interviewer.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <User className="w-5 h-5 text-stone-500" />
                                  )}
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-stone-200">{b.interviewer.name}</h4>
                                  <p className="text-xs text-stone-500">{b.interviewer.title} at {b.interviewer.company}</p>
                                </div>
                              </div>
                              <Badge className={
                                b.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                                "bg-stone-500/10 text-stone-400 border border-stone-500/20"
                              }>
                                {b.status}
                              </Badge>
                            </div>

                            <p className="text-xs text-stone-500">
                              Completed on {start.toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>

                          {b.feedback && (
                            <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center">
                              <span className="text-xs text-stone-400">AI Report Available</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs text-amber-400 hover:text-amber-300 font-semibold p-0 h-auto"
                                onClick={() => {
                                  setActiveFeedback(b.feedback);
                                  document.getElementById("feedback-tab-trigger").click();
                                }}
                              >
                                View Report →
                              </Button>
                            </div>
                          )}
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        {/* Tab 2: AI Feedback reports */}
        <TabsContent value="feedback" className="space-y-6">
          <button id="feedback-tab-trigger" className="hidden" onClick={() => {}} />
          <div className="grid gap-8 md:grid-cols-12">
            {/* Sidebar list of reports */}
            <div className="md:col-span-4 space-y-4">
              <h3 className="font-serif text-xl text-stone-200">Reports list</h3>
              
              {bookings.filter(b => b.feedback).length === 0 ? (
                <div className="p-8 rounded-2xl border border-dashed border-white/10 bg-[#0f0f11] text-center text-stone-500 text-xs">
                  No feedback reports generated yet. Reports are added once mock sessions finish.
                </div>
              ) : (
                <div className="space-y-3">
                  {bookings.filter(b => b.feedback).map((b) => (
                    <button
                      key={b.feedback.id}
                      onClick={() => setActiveFeedback(b.feedback)}
                      className={`w-full text-left p-4 rounded-xl border transition flex items-center justify-between ${
                        activeFeedback?.id === b.feedback.id
                          ? "border-amber-500 bg-amber-400/5"
                          : "border-white/5 bg-[#0f0f11] hover:border-white/10"
                      }`}
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-stone-300">{b.interviewer.name}</p>
                        <p className="text-xs text-stone-500">{new Date(b.startTime).toLocaleDateString()}</p>
                      </div>
                      <Badge variant="outline" className="border-amber-400/30 text-amber-400 text-[10px]">
                        {b.feedback.overallRating}
                      </Badge>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Display of selected report */}
            <div className="md:col-span-8">
              {activeFeedback ? (
                <Card className="p-8 rounded-3xl border border-white/10 bg-[#0f0f11] space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-60 h-60 bg-amber-400/5 rounded-full blur-[80px] pointer-events-none" />
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-6 gap-4">
                    <div className="space-y-1">
                      <Badge variant="gold" className="flex items-center gap-1 w-max">
                        <Sparkles className="w-3 h-3" />
                        <span>Gemini AI Evaluation</span>
                      </Badge>
                      <h4 className="font-serif text-2xl text-stone-200">Mock Performance Report</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-stone-500">Evaluation:</span>
                      <Badge className="bg-amber-400/10 text-amber-300 border border-amber-400/20 text-sm font-bold py-1.5 px-3">
                        {activeFeedback.overallRating}
                      </Badge>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="space-y-2">
                    <h5 className="text-xs font-semibold uppercase tracking-wider text-stone-400">Executive Summary</h5>
                    <p className="text-sm text-stone-300 leading-relaxed font-light">{activeFeedback.summary}</p>
                  </div>

                  {/* Rating parameters */}
                  <div className="grid gap-4 sm:grid-cols-3 border-y border-white/5 py-6">
                    <div className="space-y-1 p-4 rounded-xl border border-white/5 bg-[#141417]">
                      <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">Technical Depth</span>
                      <p className="text-sm font-medium text-stone-200 leading-relaxed">{activeFeedback.technical}</p>
                    </div>
                    <div className="space-y-1 p-4 rounded-xl border border-white/5 bg-[#141417]">
                      <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">Communication</span>
                      <p className="text-sm font-medium text-stone-200 leading-relaxed">{activeFeedback.communication}</p>
                    </div>
                    <div className="space-y-1 p-4 rounded-xl border border-white/5 bg-[#141417]">
                      <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">Problem Solving</span>
                      <p className="text-sm font-medium text-stone-200 leading-relaxed">{activeFeedback.problemSolving}</p>
                    </div>
                  </div>

                  {/* Strengths and improvements */}
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-3">
                      <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Key Strengths</span>
                      <ul className="space-y-2 text-xs text-stone-300 font-light leading-relaxed">
                        {activeFeedback.strengths.map((str, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-emerald-400 mt-0.5">•</span>
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Recommended Improvements</span>
                      <ul className="space-y-2 text-xs text-stone-300 font-light leading-relaxed">
                        {activeFeedback.improvements.map((imp, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-amber-400 mt-0.5">•</span>
                            <span>{imp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Recommendation summary */}
                  <div className="p-4 rounded-2xl border border-white/5 bg-[#141417] space-y-1.5">
                    <span className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">Interviewer Advice</span>
                    <p className="text-xs text-stone-300 leading-relaxed font-light">{activeFeedback.recommendation}</p>
                  </div>
                </Card>
              ) : (
                <div className="p-16 rounded-3xl border border-white/5 bg-[#0f0f11] flex flex-col items-center justify-center text-center space-y-4">
                  <span className="text-4xl text-stone-600">📊</span>
                  <h4 className="text-lg font-serif text-stone-400">Select a report</h4>
                  <p className="text-sm text-stone-600 max-w-xs">
                    Choose one of your past performance reports on the left to see the detailed evaluation metrics.
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
