"use client"

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { GrayTitle, GoldTitle } from "./reuseables";
import { Calendar, DollarSign, Clock, User, Trash2, CheckCircle, AlertCircle, Plus, Wallet } from "lucide-react";
import { addAvailability, deleteAvailability, updateCreditRate, requestPayout } from "@/actions/dashboard";

export default function InterviewerDashboard({ user, bookings = [], availabilities = [], payouts = [] }) {
  const [loading, setLoading] = useState(false);

  // 1. Credit rate state
  const [rate, setRate] = useState(user.creditRate || 1);
  const handleUpdateRate = async () => {
    setLoading(true);
    const res = await updateCreditRate(rate);
    setLoading(false);
    if (res?.success) {
      toast.success("Rate updated successfully");
    } else {
      toast.error(res?.error || "Failed to update rate");
    }
  };

  // 2. Availability Form State
  const [slotDate, setSlotDate] = useState("");
  const [slotStart, setSlotStart] = useState("10:00");
  const [slotEnd, setSlotEnd] = useState("11:00");

  const handleAddSlot = async (e) => {
    e.preventDefault();
    if (!slotDate) {
      toast.error("Please pick a date");
      return;
    }
    setLoading(true);
    const startStr = `${slotDate}T${slotStart}:00`;
    const endStr = `${slotDate}T${slotEnd}:00`;
    
    const res = await addAvailability({ startTime: startStr, endTime: endStr });
    setLoading(false);
    
    if (res?.success) {
      toast.success("Availability slot added!");
      setSlotDate("");
    } else {
      toast.error(res?.error || "Failed to add slot");
    }
  };

  const handleDeleteSlot = async (id) => {
    if (!confirm("Are you sure you want to remove this slot?")) return;
    setLoading(true);
    const res = await deleteAvailability(id);
    setLoading(false);
    if (res?.success) {
      toast.success("Slot deleted!");
    } else {
      toast.error(res?.error || "Failed to delete slot");
    }
  };

  // 3. Payout Form State
  const [payoutCredits, setPayoutCredits] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  const [paymentDetail, setPaymentDetail] = useState("");

  const handleRequestPayout = async (e) => {
    e.preventDefault();
    if (!payoutCredits || parseInt(payoutCredits) <= 0) {
      toast.error("Enter a valid amount of credits");
      return;
    }
    if (!paymentDetail) {
      toast.error("Enter payment details");
      return;
    }
    
    setLoading(true);
    const res = await requestPayout({
      credits: payoutCredits,
      paymentMethod,
      paymentDetail,
    });
    setLoading(false);

    if (res?.success) {
      toast.success("Payout requested successfully!");
      setPayoutCredits("");
      setPaymentDetail("");
    } else {
      toast.error(res?.error || "Failed to submit payout request");
    }
  };

  const activeSlots = availabilities.filter(s => s.status === "AVAILABLE");
  const bookedSlotsCount = bookings.filter(b => b.status === "SCHEDULED").length;
  const completedBookings = bookings.filter(b => b.status === "COMPLETED");
  const totalEarned = completedBookings.reduce((acc, b) => acc + b.creditsCharged, 0);

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-8 rounded-3xl border border-white/10 bg-[#0f0f11] backdrop-blur-xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="space-y-2">
          <Badge variant="gold">Interviewer Dashboard</Badge>
          <h1 className="font-serif text-4xl sm:text-5xl leading-tight tracking-tight">
            <GrayTitle>Welcome, Coach </GrayTitle>
            <GoldTitle>{user.name || "Expert"}</GoldTitle>
          </h1>
          <p className="text-sm text-stone-400 font-light max-w-md">
            Manage your schedule, track your credit earnings, and review mock sessions with candidates.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 shrink-0">
          <div className="px-6 py-4 rounded-2xl border border-white/5 bg-[#141417] flex items-center gap-4">
            <span className="p-3 rounded-xl bg-amber-400/10 text-amber-400">
              <Wallet className="w-5 h-5" />
            </span>
            <div>
              <p className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">Credit Balance</p>
              <p className="font-serif text-2xl text-amber-300">{user.creditBalance || 0} cr</p>
            </div>
          </div>

          <div className="px-6 py-4 rounded-2xl border border-white/5 bg-[#141417] flex items-center gap-4">
            <span className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </span>
            <div>
              <p className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">Total Revenue</p>
              <p className="font-serif text-2xl text-emerald-400">{totalEarned * 10} USD</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs list */}
      <Tabs defaultValue="bookings" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-lg mb-8 bg-[#0f0f11] border border-white/5 p-1 rounded-2xl">
          <TabsTrigger value="bookings" className="rounded-xl py-2.5 text-xs sm:text-sm font-medium">Bookings</TabsTrigger>
          <TabsTrigger value="availability" className="rounded-xl py-2.5 text-xs sm:text-sm font-medium">Availability</TabsTrigger>
          <TabsTrigger value="payouts" className="rounded-xl py-2.5 text-xs sm:text-sm font-medium">Earnings & Payouts</TabsTrigger>
        </TabsList>

        {/* Tab 1: Bookings list */}
        <TabsContent value="bookings" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl text-stone-200">Session Bookings</h3>
            <Badge variant="outline" className="border-stone-700 text-stone-400">
              {bookedSlotsCount} Active Scheduled
            </Badge>
          </div>

          {bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 rounded-3xl border border-dashed border-white/10 bg-[#0f0f11] text-center space-y-4">
              <span className="text-4xl text-stone-500">📅</span>
              <h4 className="text-lg font-serif text-stone-300">No sessions scheduled yet</h4>
              <p className="text-sm text-stone-500 max-w-sm">
                Candidates will see your availability and book mock sessions. Add open slots to get started!
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {bookings.map((booking) => {
                const start = new Date(booking.startTime);
                const end = new Date(booking.endTime);
                const formattedDate = start.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                });
                const formattedTime = `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                
                return (
                  <Card key={booking.id} className="p-6 rounded-2xl border border-white/10 bg-[#0f0f11] flex flex-col justify-between hover:border-amber-400/20 transition-all duration-300">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-stone-800 border border-white/10 flex items-center justify-center overflow-hidden">
                            {booking.interviewee.imageUrl ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img src={booking.interviewee.imageUrl} alt={booking.interviewee.name} className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-5 h-5 text-stone-500" />
                            )}
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-stone-200">{booking.interviewee.name}</h4>
                            <p className="text-xs text-stone-500">{booking.interviewee.email}</p>
                          </div>
                        </div>
                        <Badge className={
                          booking.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                          booking.status === "CANCELLED" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                          "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        }>
                          {booking.status}
                        </Badge>
                      </div>

                      <div className="space-y-2 py-2 border-y border-white/5">
                        <div className="flex items-center gap-2 text-xs text-stone-400">
                          <Calendar className="w-3.5 h-3.5 text-stone-600" />
                          <span>{formattedDate}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-stone-400">
                          <Clock className="w-3.5 h-3.5 text-stone-600" />
                          <span>{formattedTime}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-stone-400">
                          <DollarSign className="w-3.5 h-3.5 text-stone-600" />
                          <span>Credits Charged: <strong className="text-amber-400 font-semibold">{booking.creditsCharged} cr</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-2 flex items-center gap-2">
                      {booking.status === "SCHEDULED" && booking.streamCallId && (
                        <Button variant="gold" size="sm" className="w-full text-xs font-semibold rounded-xl" asChild>
                          <a href={`/appointments/${booking.id}`}>
                            Join Video Call
                          </a>
                        </Button>
                      )}
                      {booking.feedback ? (
                        <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/5 px-3 py-1.5 rounded-lg border border-emerald-500/10 w-full justify-center">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Feedback Submitted ({booking.feedback.overallRating})</span>
                        </div>
                      ) : booking.status === "COMPLETED" ? (
                        <Button variant="outline" size="sm" className="w-full text-xs rounded-xl border-white/10 hover:border-amber-400/30" asChild>
                          <a href={`/appointments/${booking.id}?feedback=true`}>
                            Submit Feedback
                          </a>
                        </Button>
                      ) : null}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Tab 2: Availability manager */}
        <TabsContent value="availability" className="space-y-8">
          <div className="grid gap-8 md:grid-cols-12">
            {/* Rates & Add form */}
            <div className="md:col-span-5 space-y-6">
              {/* Hourly rate configurator */}
              <Card className="p-6 rounded-2xl border border-white/10 bg-[#0f0f11] space-y-4">
                <div>
                  <h4 className="font-serif text-lg text-stone-200">Session Rate</h4>
                  <p className="text-xs text-stone-500 mt-1">Specify how many credits a candidate charges to book one session with you.</p>
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      type="number"
                      min="1"
                      value={rate}
                      onChange={(e) => setRate(e.target.value)}
                      className="pr-16 text-stone-200 bg-[#141417] border-white/10 rounded-xl"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-stone-500 font-medium">Credits</span>
                  </div>
                  <Button onClick={handleUpdateRate} disabled={loading} className="bg-stone-200 hover:bg-stone-300 text-black font-semibold rounded-xl px-5">
                    Save
                  </Button>
                </div>
              </Card>

              {/* Add Availability Form */}
              <Card className="p-6 rounded-2xl border border-white/10 bg-[#0f0f11]">
                <form onSubmit={handleAddSlot} className="space-y-4">
                  <div>
                    <h4 className="font-serif text-lg text-stone-200">Add Availability</h4>
                    <p className="text-xs text-stone-500 mt-1">Open new mock interview slots for candidates.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slot-date">Date</Label>
                    <Input
                      id="slot-date"
                      type="date"
                      value={slotDate}
                      onChange={(e) => setSlotDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="bg-[#141417] border-white/10 rounded-xl text-stone-300"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="slot-start">Start Time</Label>
                      <Input
                        id="slot-start"
                        type="time"
                        value={slotStart}
                        onChange={(e) => setSlotStart(e.target.value)}
                        className="bg-[#141417] border-white/10 rounded-xl text-stone-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slot-end">End Time</Label>
                      <Input
                        id="slot-end"
                        type="time"
                        value={slotEnd}
                        onChange={(e) => setSlotEnd(e.target.value)}
                        className="bg-[#141417] border-white/10 rounded-xl text-stone-300"
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={loading} className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-xl py-3 flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" />
                    <span>Add Open Slot</span>
                  </Button>
                </form>
              </Card>
            </div>

            {/* List of active slots */}
            <div className="md:col-span-7 space-y-4">
              <h3 className="font-serif text-xl text-stone-200">Active Open Slots ({activeSlots.length})</h3>
              
              {activeSlots.length === 0 ? (
                <div className="p-12 rounded-2xl border border-dashed border-white/10 bg-[#0f0f11] text-center text-stone-500 text-sm">
                  No open availability slots currently defined. Add some on the left to allow candidates to schedule sessions.
                </div>
              ) : (
                <div className="max-h-[480px] overflow-y-auto pr-2 space-y-3">
                  {activeSlots.map((slot) => {
                    const start = new Date(slot.startTime);
                    const end = new Date(slot.endTime);
                    const formattedDate = start.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    });
                    const formattedTime = `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

                    return (
                      <div key={slot.id} className="p-4 rounded-xl border border-white/5 bg-[#0f0f11] flex items-center justify-between hover:border-white/10 transition">
                        <div className="flex items-center gap-4">
                          <span className="w-10 h-10 rounded-lg bg-amber-400/5 border border-amber-400/10 flex items-center justify-center text-amber-400 font-serif">
                            {start.getDate()}
                          </span>
                          <div>
                            <p className="text-sm font-medium text-stone-300">{formattedDate}</p>
                            <p className="text-xs text-stone-500">{formattedTime}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteSlot(slot.id)}
                          disabled={loading}
                          className="text-stone-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Tab 3: Payout and Balance management */}
        <TabsContent value="payouts" className="space-y-8">
          <div className="grid gap-8 md:grid-cols-12">
            {/* Withdrawal form */}
            <div className="md:col-span-5 space-y-6">
              <Card className="p-6 rounded-2xl border border-white/10 bg-[#0f0f11]">
                <form onSubmit={handleRequestPayout} className="space-y-4">
                  <div>
                    <h4 className="font-serif text-lg text-stone-200">Withdraw Earnings</h4>
                    <p className="text-xs text-stone-500 mt-1">Convert earned credits into USD directly. 1 credit = $10.00 cash earnings.</p>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-400/5 border border-amber-400/10 flex items-center justify-between text-xs text-amber-300">
                    <div className="flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" />
                      <span>Available Balance:</span>
                    </div>
                    <span className="font-bold">{user.creditBalance || 0} credits</span>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payout-credits">Credits to Withdraw</Label>
                    <Input
                      id="payout-credits"
                      type="number"
                      max={user.creditBalance || 0}
                      placeholder="e.g. 10"
                      value={payoutCredits}
                      onChange={(e) => setPayoutCredits(e.target.value)}
                      className="bg-[#141417] border-white/10 rounded-xl text-stone-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payment-method">Payment Method</Label>
                    <select
                      id="payment-method"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-[#141417] text-stone-300 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                    >
                      <option value="PayPal">PayPal</option>
                      <option value="Bank Transfer">Bank Transfer (ACH)</option>
                      <option value="Stripe Connect">Stripe Connection</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payment-detail">Payment Details (Email or IBAN)</Label>
                    <Input
                      id="payment-detail"
                      placeholder="e.g. your-email@domain.com"
                      value={paymentDetail}
                      onChange={(e) => setPaymentDetail(e.target.value)}
                      className="bg-[#141417] border-white/10 rounded-xl text-stone-300"
                    />
                  </div>

                  {payoutCredits && !isNaN(payoutCredits) && parseInt(payoutCredits) > 0 && (
                    <div className="p-4 rounded-xl border border-white/5 bg-[#141417] space-y-2 text-xs text-stone-400">
                      <div className="flex justify-between">
                        <span>Platform Fee (10%):</span>
                        <span>{(parseInt(payoutCredits) * 0.1).toFixed(1)} cr</span>
                      </div>
                      <div className="flex justify-between border-t border-white/5 pt-2 text-sm text-stone-200 font-medium">
                        <span>Net Cash Earnings:</span>
                        <span className="text-emerald-400">${((parseInt(payoutCredits) - parseInt(payoutCredits) * 0.1) * 10).toFixed(2)} USD</span>
                      </div>
                    </div>
                  )}

                  <Button type="submit" disabled={loading || !user.creditBalance} className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-xl py-3">
                    Submit Request
                  </Button>
                </form>
              </Card>
            </div>

            {/* Payout list */}
            <div className="md:col-span-7 space-y-4">
              <h3 className="font-serif text-xl text-stone-200">Payout Requests History</h3>

              {payouts.length === 0 ? (
                <div className="p-12 rounded-2xl border border-dashed border-white/10 bg-[#0f0f11] text-center text-stone-500 text-sm">
                  No payout requests recorded. Withdraw credits to list them here.
                </div>
              ) : (
                <div className="max-h-[480px] overflow-y-auto pr-2 space-y-3">
                  {payouts.map((p) => (
                    <div key={p.id} className="p-5 rounded-2xl border border-white/5 bg-[#0f0f11] flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-stone-200">${p.netAmount.toFixed(2)} USD</span>
                          <Badge className={
                            p.status === "PROCESSED" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                            "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                          }>
                            {p.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-stone-500">Method: {p.paymentMethod} • Details: {p.paymentDetail}</p>
                        <p className="text-[10px] text-stone-600">{new Date(p.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-stone-400">-{p.credits} credits</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
