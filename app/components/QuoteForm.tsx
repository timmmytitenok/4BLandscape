"use client";

import { useState, useCallback, useEffect } from "react";

const SERVICE_OPTIONS = [
  "Mulching",
  "Sod Installation",
  "Grass Seeding",
  "Brick Edging",
  "Lawn Mowing",
  "Tree Cutting",
  "Land Clearing",
  "Fence Installation",
  "Patio Builds",
  "Gravel Delivers",
  "Other",
];

const TIMELINE_OPTIONS = [
  "As soon as possible",
  "Within the next week",
  "Within the next month",
  "Flexible / just getting a quote",
];

const TOTAL_STEPS = 6;
const PHONE = "tel:6148932918";

function formatPhoneInput(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length === 0) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

interface FormData {
  services: string[];
  otherService: string;
  projectDescription: string;
  files: File[];
  timeline: string;
  streetAddress: string;
  city: string;
  zipCode: string;
  propertyType: "residential" | "commercial" | "";
  fullName: string;
  phone: string;
  email: string;
  contactMethod: "call" | "text" | "email" | "";
}

const initialFormData: FormData = {
  services: [],
  otherService: "",
  projectDescription: "",
  files: [],
  timeline: "",
  streetAddress: "",
  city: "",
  zipCode: "",
  propertyType: "",
  fullName: "",
  phone: "",
  email: "",
  contactMethod: "",
};

export default function QuoteForm({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const updateForm = useCallback(<K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggleService = (service: string) => {
    setFormData((prev) => {
      const next = prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service];
      return { ...prev, services: next };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData((prev) => ({ ...prev, files: [...prev.files, ...files] }));
  };

  const removeFile = (index: number) => {
    setFormData((prev) => ({ ...prev, files: prev.files.filter((_, i) => i !== index) }));
  };

  const goNext = () => {
    if (step < TOTAL_STEPS) {
      setDirection("next");
      setStep((s) => s + 1);
    }
  };

  const goPrev = () => {
    if (step > 1) {
      setDirection("prev");
      setStep((s) => s - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // In production, send formData to your backend/API
    console.log("Quote request:", formData);
  };

  useEffect(() => {
    if (isSubmitting) {
      const timer = setTimeout(() => {
        setIsSubmitting(false);
        setShowCheckmark(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isSubmitting]);

  useEffect(() => {
    if (showCheckmark) {
      const timer = setTimeout(() => {
        setShowCheckmark(false);
        setSubmitted(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [showCheckmark]);

  const resetForm = () => {
    window.location.reload();
  };

  if (!isOpen) return null;

  return (
    <div className="quote-form-overlay fixed inset-0 z-[100] flex flex-col bg-[#0a0a0a]">
      {/* Progress bar + header - more visible, feels like progress */}
      <div className="sticky top-0 z-50 shrink-0 border-b border-white/10 bg-[#0a0a0a]">
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/25">
          <div
            className="h-full rounded-full bg-[#39ff14] shadow-[0_0_12px_rgba(57,255,20,0.5)] transition-all duration-500 ease-out"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>
        <div className="relative flex items-center justify-end px-4 py-4 sm:px-6">
          <span className="absolute left-1/2 -translate-x-1/2 text-sm font-medium text-zinc-500">
            Step {step} of {TOTAL_STEPS}
          </span>
          <button
            type="button"
            onClick={resetForm}
            aria-label="Close form"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-white/25 bg-transparent text-white transition-all duration-200 ease-out hover:scale-105 hover:border-white/50 hover:bg-white/5 active:scale-95"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Form content - centered, shifted up slightly */}
      <div className="flex min-h-0 flex-1 overflow-y-auto">
        <div className="flex min-h-full flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6 sm:py-16 -translate-y-10 sm:-translate-y-8">
          {isSubmitting ? (
            <div className="flex flex-col items-center justify-center gap-6">
              <div className="h-14 w-14 animate-spin rounded-full border-2 border-white/20 border-t-[#39ff14]" />
              <p className="text-lg font-medium text-zinc-400">Sending your request...</p>
            </div>
          ) : showCheckmark ? (
            <div className="flex flex-col items-center justify-center gap-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#39ff14]/20">
                <svg
                  className="h-10 w-10 text-[#39ff14] animate-checkmark-pop"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          ) : submitted ? (
            <SuccessScreen onClose={resetForm} />
          ) : (
            <form onSubmit={handleSubmit} className="w-full max-w-xl space-y-8">
              <StepContent
                step={step}
                direction={direction}
                formData={formData}
                updateForm={updateForm}
                toggleService={toggleService}
                handleFileChange={handleFileChange}
                removeFile={removeFile}
                goNext={goNext}
                goPrev={goPrev}
                onSubmit={handleSubmit}
              />
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function StepContent({
  step,
  direction,
  formData,
  updateForm,
  toggleService,
  handleFileChange,
  removeFile,
  goNext,
  goPrev,
  onSubmit,
}: {
  step: number;
  direction: "next" | "prev";
  formData: FormData;
  updateForm: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  toggleService: (s: string) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeFile: (i: number) => void;
  goNext: () => void;
  goPrev: () => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  const slideClass = direction === "next" ? "animate-slide-in-right" : "animate-slide-in-left";

  return (
    <div key={step} className={`mx-auto max-w-xl text-center ${slideClass}`}>
      {step === 1 && (
        <Step1
          formData={formData}
          toggleService={toggleService}
          updateForm={updateForm}
          onNext={goNext}
        />
      )}
      {step === 2 && (
        <Step2 formData={formData} updateForm={updateForm} onNext={goNext} onPrev={goPrev} />
      )}
      {step === 3 && (
        <Step3
          formData={formData}
          updateForm={updateForm}
          handleFileChange={handleFileChange}
          removeFile={removeFile}
          onNext={goNext}
          onPrev={goPrev}
        />
      )}
      {step === 4 && (
        <Step4 formData={formData} updateForm={updateForm} onNext={goNext} onPrev={goPrev} />
      )}
      {step === 5 && (
        <Step5 formData={formData} updateForm={updateForm} onNext={goNext} onPrev={goPrev} />
      )}
      {step === 6 && (
        <Step7 formData={formData} updateForm={updateForm} onSubmit={onSubmit} onPrev={goPrev} />
      )}
    </div>
  );
}

function Step1({
  formData,
  toggleService,
  updateForm,
  onNext,
}: {
  formData: FormData;
  toggleService: (s: string) => void;
  updateForm: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  onNext: () => void;
}) {
  const hasSelection = formData.services.length > 0;

  return (
    <>
      <h2 className="mb-8 text-2xl font-bold text-white sm:text-3xl">What service do you need?</h2>
      <div className="mx-auto mb-10 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-3">
        {SERVICE_OPTIONS.filter((s) => s !== "Other").map((service) => (
          <button
            key={service}
            type="button"
            onClick={() => toggleService(service)}
            className={`rounded border px-4 py-3.5 text-center text-sm font-medium transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98] ${
              service === "Gravel Delivers" ? "sm:hidden" : ""
            } ${
              formData.services.includes(service)
                ? "border-[#39ff14] bg-[#39ff14] text-black"
                : "border-white/25 bg-transparent text-zinc-300 hover:border-white/40"
            }`}
          >
            {service}
          </button>
        ))}
        <button
          type="button"
          onClick={() => toggleService("Other")}
          className={`col-span-2 rounded border px-4 py-3.5 text-center text-sm font-medium transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98] sm:col-span-3 ${
            formData.services.includes("Other")
              ? "border-[#39ff14] bg-[#39ff14] text-black"
              : "border-white/25 bg-transparent text-zinc-300 hover:border-white/40"
          }`}
        >
          Other
        </button>
      </div>
      <button
        type="button"
        onClick={onNext}
        disabled={!hasSelection}
        className="mx-auto mt-4 block w-full max-w-xs rounded border-0 bg-[#39ff14] px-6 py-3.5 font-semibold text-black transition-all duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-40 hover:scale-[1.02] hover:brightness-110 active:scale-[0.98] disabled:hover:scale-100 disabled:hover:brightness-100"
      >
        Continue
      </button>
    </>
  );
}

function Step2({
  formData,
  updateForm,
  onNext,
  onPrev,
}: {
  formData: FormData;
  updateForm: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  return (
    <>
      <h2 className="mb-8 text-2xl font-bold text-white sm:text-3xl">Tell us about the project</h2>
      <textarea
        value={formData.projectDescription}
        onChange={(e) => updateForm("projectDescription", e.target.value)}
        placeholder="e.g. Need mulch installed in front beds, lawn mowing weekly..."
        rows={5}
        className="mx-auto mb-10 block w-full max-w-md resize-none rounded border border-white/25 bg-transparent px-4 py-3 text-base text-white placeholder-zinc-600 transition-all duration-200 ease-out hover:border-white/40 focus:border-[#39ff14] focus:outline-none focus:ring-2 focus:ring-[#39ff14]/20 sm:text-sm"
      />
      <div className="mx-auto flex max-w-md justify-center gap-3">
        <button
          type="button"
          onClick={onPrev}
          className="rounded border border-white/25 bg-transparent px-6 py-3.5 font-semibold text-white transition-all duration-200 ease-out hover:scale-[1.02] hover:border-white/40 hover:bg-white/5 active:scale-[0.98]"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!formData.projectDescription.trim()}
          className="flex-1 rounded border-0 bg-[#39ff14] px-6 py-3.5 font-semibold text-black transition-all duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-40 hover:scale-[1.02] hover:brightness-110 active:scale-[0.98] disabled:hover:scale-100 disabled:hover:brightness-100"
        >
          Continue
        </button>
      </div>
    </>
  );
}

function Step3({
  formData,
  updateForm,
  handleFileChange,
  removeFile,
  onNext,
  onPrev,
}: {
  formData: FormData;
  updateForm: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeFile: (i: number) => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  return (
    <>
      <h2 className="mb-3 text-2xl font-bold text-white sm:text-3xl">Add photos or videos</h2>
      <p className="mb-8 text-sm text-zinc-500">Attaching images or videos is optional but very helpful</p>
      <label className="mx-auto mb-8 flex max-w-md cursor-pointer flex-col items-center justify-center rounded border-2 border-dashed border-white/25 bg-transparent py-12 transition-all duration-200 ease-out hover:scale-[1.01] hover:border-[#39ff14]/40 hover:bg-[#39ff14]/5 active:scale-[0.99]">
        <input
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        <svg
          className="mb-3 h-12 w-12 text-zinc-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"
          />
        </svg>
        <span className="text-sm font-medium text-zinc-400">Click to upload images or videos</span>
      </label>
      {formData.files.length > 0 && (
        <div className="mx-auto mb-8 flex max-w-md flex-wrap justify-center gap-2">
          {formData.files.map((file, i) => (
          <div
            key={i}
            className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm text-zinc-300 transition-all duration-200 hover:bg-white/15"
          >
            {file.name}
            <button type="button" onClick={() => removeFile(i)} className="text-red-400 transition-all duration-200 hover:scale-110 hover:text-red-300 active:scale-95">
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="mx-auto flex max-w-md justify-center gap-3">
        <button
          type="button"
          onClick={onPrev}
          className="rounded border border-white/25 bg-transparent px-6 py-3.5 font-semibold text-white transition-all duration-200 ease-out hover:scale-[1.02] hover:border-white/40 hover:bg-white/5 active:scale-[0.98]"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex-1 rounded border-0 bg-[#39ff14] px-6 py-3.5 font-semibold text-black transition-all duration-200 ease-out hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
        >
          Continue
        </button>
      </div>
    </>
  );
}

function Step4({
  formData,
  updateForm,
  onNext,
  onPrev,
}: {
  formData: FormData;
  updateForm: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  return (
    <>
      <h2 className="mb-8 text-xl font-bold text-white sm:text-2xl">When would you like the work done?</h2>
      <div className="mx-auto mb-10 max-w-md space-y-2">
        {TIMELINE_OPTIONS.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => updateForm("timeline", opt)}
            className={`block w-full rounded border px-4 py-3.5 text-center text-sm font-medium transition-all duration-200 ease-out hover:scale-[1.01] active:scale-[0.99] ${
              formData.timeline === opt
                ? "border-[#39ff14] bg-[#39ff14] text-black"
                : "border-white/25 bg-transparent text-zinc-300 hover:border-white/40"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      <div className="mx-auto flex max-w-md justify-center gap-3">
        <button
          type="button"
          onClick={onPrev}
          className="rounded border border-white/25 bg-transparent px-6 py-3.5 font-semibold text-white transition-all duration-200 ease-out hover:scale-[1.02] hover:border-white/40 hover:bg-white/5 active:scale-[0.98]"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!formData.timeline}
          className="flex-1 rounded border-0 bg-[#39ff14] px-6 py-3.5 font-semibold text-black transition-all duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-40 hover:scale-[1.02] hover:brightness-110 active:scale-[0.98] disabled:hover:scale-100 disabled:hover:brightness-100"
        >
          Continue
        </button>
      </div>
    </>
  );
}

function Step5({
  formData,
  updateForm,
  onNext,
  onPrev,
}: {
  formData: FormData;
  updateForm: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const canContinue =
    formData.streetAddress.trim() &&
    formData.city.trim() &&
    formData.zipCode.trim() &&
    formData.propertyType;

  return (
    <>
      <h2 className="mb-8 text-2xl font-bold text-white sm:text-3xl">Where is the property located?</h2>
      <div className="mx-auto mb-10 max-w-md space-y-4 text-left">
        <div>
          <label className="mb-2 block text-left text-sm font-medium text-zinc-500">Street Address</label>
          <input
            type="text"
            value={formData.streetAddress}
            onChange={(e) => updateForm("streetAddress", e.target.value)}
            placeholder="123 Main St"
            className="w-full rounded border border-white/25 bg-transparent px-4 py-3 text-base text-white placeholder-zinc-600 transition-all duration-200 ease-out hover:border-white/40 focus:border-[#39ff14] focus:outline-none focus:ring-2 focus:ring-[#39ff14]/20 sm:text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-left text-sm font-medium text-zinc-500">City</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => updateForm("city", e.target.value)}
              placeholder="Columbus"
              className="w-full rounded border border-white/25 bg-transparent px-4 py-3 text-base text-white placeholder-zinc-600 transition-all duration-200 ease-out hover:border-white/40 focus:border-[#39ff14] focus:outline-none focus:ring-2 focus:ring-[#39ff14]/20 sm:text-sm"
            />
          </div>
          <div>
            <label className="mb-2 block text-left text-sm font-medium text-zinc-500">ZIP Code</label>
            <input
              type="text"
              value={formData.zipCode}
              onChange={(e) => updateForm("zipCode", e.target.value)}
              placeholder="43215"
              className="w-full rounded border border-white/25 bg-transparent px-4 py-3 text-base text-white placeholder-zinc-600 transition-all duration-200 ease-out hover:border-white/40 focus:border-[#39ff14] focus:outline-none focus:ring-2 focus:ring-[#39ff14]/20 sm:text-sm"
            />
          </div>
        </div>
        <div className="mt-8 border-t border-white/15 pt-8">
          <label className="mb-2 block text-left text-sm font-medium text-zinc-500">Residential or commercial?</label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => updateForm("propertyType", "residential")}
              className={`flex-1 rounded border px-4 py-3.5 text-center font-medium transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98] ${
                formData.propertyType === "residential"
                  ? "border-[#39ff14] bg-[#39ff14] text-black"
                  : "border-white/25 bg-transparent text-zinc-300 hover:border-white/40"
              }`}
            >
              Residential
            </button>
            <button
              type="button"
              onClick={() => updateForm("propertyType", "commercial")}
              className={`flex-1 rounded border px-4 py-3.5 text-center font-medium transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98] ${
                formData.propertyType === "commercial"
                  ? "border-[#39ff14] bg-[#39ff14] text-black"
                  : "border-white/25 bg-transparent text-zinc-300 hover:border-white/40"
              }`}
            >
              Commercial
            </button>
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-md justify-center gap-3">
        <button
          type="button"
          onClick={onPrev}
          className="rounded border border-white/25 bg-transparent px-6 py-3.5 font-semibold text-white transition-all duration-200 ease-out hover:scale-[1.02] hover:border-white/40 hover:bg-white/5 active:scale-[0.98]"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canContinue}
          className="flex-1 rounded border-0 bg-[#39ff14] px-6 py-3.5 font-semibold text-black transition-all duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-40 hover:scale-[1.02] hover:brightness-110 active:scale-[0.98] disabled:hover:scale-100 disabled:hover:brightness-100"
        >
          Continue
        </button>
      </div>
    </>
  );
}

function Step7({
  formData,
  updateForm,
  onSubmit,
  onPrev,
}: {
  formData: FormData;
  updateForm: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  onSubmit: (e: React.FormEvent) => void;
  onPrev: () => void;
}) {
  return (
    <>
      <h2 className="mb-8 text-2xl font-bold text-white sm:text-3xl">How can we reach you?</h2>
      <div className="mx-auto mb-10 max-w-md space-y-4 text-left">
        <div>
          <label className="mb-2 block text-left text-sm font-medium text-zinc-500">Full Name</label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => updateForm("fullName", e.target.value)}
            placeholder="John Smith"
            required
            className="w-full rounded border border-white/25 bg-transparent px-4 py-3 text-base text-white placeholder-zinc-600 transition-all duration-200 ease-out hover:border-white/40 focus:border-[#39ff14] focus:outline-none focus:ring-2 focus:ring-[#39ff14]/20 sm:text-sm"
          />
        </div>
        <div>
          <label className="mb-2 block text-left text-sm font-medium text-zinc-500">Phone Number</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => updateForm("phone", formatPhoneInput(e.target.value))}
            placeholder="(614) 555-1234"
            maxLength={14}
            required
            className="w-full rounded border border-white/25 bg-transparent px-4 py-3 text-base text-white placeholder-zinc-600 transition-all duration-200 ease-out hover:border-white/40 focus:border-[#39ff14] focus:outline-none focus:ring-2 focus:ring-[#39ff14]/20 sm:text-sm"
          />
        </div>
        <div>
          <label className="mb-2 block text-left text-sm font-medium text-zinc-500">Email Address</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => updateForm("email", e.target.value)}
            placeholder="john@example.com"
            required
            className="w-full rounded border border-white/25 bg-transparent px-4 py-3 text-base text-white placeholder-zinc-600 transition-all duration-200 ease-out hover:border-white/40 focus:border-[#39ff14] focus:outline-none focus:ring-2 focus:ring-[#39ff14]/20 sm:text-sm"
          />
        </div>
      </div>
      <div className="mx-auto flex max-w-md justify-center gap-3">
        <button
          type="button"
          onClick={onPrev}
          className="rounded border border-white/25 bg-transparent px-6 py-3.5 font-semibold text-white transition-all duration-200 ease-out hover:scale-[1.02] hover:border-white/40 hover:bg-white/5 active:scale-[0.98]"
        >
          Back
        </button>
        <button
          type="submit"
          onClick={onSubmit}
          disabled={!formData.fullName || formData.phone.replace(/\D/g, "").length !== 10 || !formData.email}
          className="flex-1 rounded border-0 bg-[#39ff14] px-6 py-3.5 font-semibold text-black transition-all duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-40 hover:scale-[1.02] hover:brightness-110 active:scale-[0.98] disabled:hover:scale-100 disabled:hover:brightness-100"
        >
          Submit Request
        </button>
      </div>
    </>
  );
}

function SuccessScreen({ onClose }: { onClose: () => void }) {
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); // 24 hours in seconds

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const mins = Math.floor((timeLeft % 3600) / 60);
  const secs = timeLeft % 60;

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h2 className="mb-2 text-2xl font-bold text-white sm:text-3xl">Request Received.</h2>
      <p className="mb-10 text-base font-normal text-zinc-400">
        We&apos;ll reply within 24 hours.
      </p>
      <div className="mb-10">
        <span className="block text-5xl font-bold tabular-nums text-[#39ff14] sm:text-6xl">
          {String(hours).padStart(2, "0")}:{String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </span>
      </div>
      <div className="mb-10 flex flex-col gap-3">
        <a
          href={PHONE}
          className="rounded border-0 bg-[#39ff14] px-8 py-3.5 font-semibold text-black transition-all duration-200 ease-out hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
        >
          Call Now
        </a>
        <button
          type="button"
          onClick={onClose}
          className="rounded border border-white/25 bg-transparent px-8 py-3.5 font-semibold text-white transition-all duration-200 ease-out hover:scale-[1.02] hover:border-white/40 hover:bg-white/5 active:scale-[0.98]"
        >
          Back to Site
        </button>
      </div>
      <p className="max-w-xs text-xs text-zinc-500">
        Thanks! Your quote request has been sent.
      </p>
    </div>
  );
}
