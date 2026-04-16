"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useMemo, useState } from "react";

type ChoiceStep = {
  id: "currentStage" | "project" | "formalities" | "targetStage";
  title: string;
  options: string[];
};

type ContactData = {
  fullName: string;
  phone: string;
  email: string;
  location: string;
  timeline: string;
  additionalInfo: string;
};

type WizardData = {
  currentStage: string;
  project: string;
  formalities: string;
  targetStage: string;
  contact: ContactData;
};

const steps: ChoiceStep[] = [
  {
    id: "currentStage",
    title: "Na jakim etapie jesteś?",
    options: [
      "Zakup działki",
      "Projekt",
      "Formalności",
      "Fundamenty",
      "Stan surowy otwarty",
      "Stan surowy zamknięty",
      "Wykończenie",
    ],
  },
  {
    id: "project",
    title: "Projekt",
    options: ["Potrzebuję projektu", "Mam własny projekt"],
  },
  {
    id: "formalities",
    title: "Czy potrzebujesz wsparcia w formalnościach?",
    options: ["Tak, potrzebuję wsparcia", "Nie, załatwię to sam", "Mam już wszystko gotowe"],
  },
  {
    id: "targetStage",
    title: "Do jakiego etapu mamy doprowadzić inwestycję?",
    options: ["Stan surowy otwarty", "Stan surowy zamknięty", "Stan deweloperski", "Wykończenie pod klucz"],
  },
];

const initialData: WizardData = {
  currentStage: "",
  project: "",
  formalities: "",
  targetStage: "",
  contact: {
    fullName: "",
    phone: "",
    email: "",
    location: "",
    timeline: "",
    additionalInfo: "",
  },
};

const timelineOptions = [
  "W ciągu najbliższych 3 miesięcy",
  "W ciągu 3–6 miesięcy",
  "Powyżej 6 miesięcy",
];

export function ProjectWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<WizardData>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const totalSteps = 5;
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const currentChoiceStep = steps[currentStep];
  const isContactStep = currentStep === totalSteps - 1;

  const isLocationRequired = data.currentStage !== "Zakup działki";

  const canContinue = useMemo(() => {
    if (isContactStep) return true;
    if (!currentChoiceStep) return false;
    return Boolean(data[currentChoiceStep.id]);
  }, [currentChoiceStep, data, isContactStep]);

  const onPick = (value: string) => {
    if (!currentChoiceStep) return;

    setData((prev) => ({
      ...prev,
      [currentChoiceStep.id]: value,
    }));
  };

  const onContactChange = (field: keyof ContactData, value: string) => {
    setData((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value,
      },
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const validateContact = () => {
    const nextErrors: Partial<Record<keyof ContactData, string>> = {};
    const { fullName, phone, email, location, timeline } = data.contact;

    if (!fullName.trim()) nextErrors.fullName = "Podaj imię i nazwisko.";

    if (!phone.trim() && !email.trim()) {
      nextErrors.phone = "Podaj telefon lub e-mail.";
      nextErrors.email = "Podaj telefon lub e-mail.";
    }

    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      nextErrors.email = "Nieprawidłowy adres e-mail.";
    }

    if (isLocationRequired && !location.trim()) {
      nextErrors.location = "Dla wybranego etapu lokalizacja inwestycji jest wymagana.";
    }

    if (!timeline.trim()) {
      nextErrors.timeline = "Wybierz planowany termin rozpoczęcia.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const next = () => {
    if (canContinue && currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!validateContact()) return;

    setIsSubmitting(true);

    const payload = {
      submittedAt: new Date().toISOString(),
      ...data,
    };

    await new Promise((resolve) => setTimeout(resolve, 650));
    console.log("Wizard submit payload:", payload);

    setIsSubmitting(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <section className="flex min-h-[55dvh] w-full items-center justify-center rounded-3xl bg-white p-8 text-center shadow-soft sm:p-10">
        <div>
          <h2 className="text-3xl font-semibold">Dziękujemy</h2>
          <p className="mt-4 text-base leading-relaxed text-neutral-600">
            Otrzymaliśmy Twoje zgłoszenie.
            <br />
            Skontaktujemy się z Tobą w ciągu 24 godzin.
          </p>
        </div>
      </section>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="flex h-full min-h-[70dvh] w-full flex-col rounded-3xl bg-white p-5 shadow-soft sm:min-h-[72dvh] sm:p-8"
    >
      <header className="shrink-0">
        <div className="flex items-center justify-between text-xs font-medium text-neutral-500">
          <span>Krok {currentStep + 1} z {totalSteps}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-neutral-200">
          <motion.div
            className="h-full rounded-full bg-neutral-900"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        </div>
      </header>

      <div className="mt-6 flex-1 overflow-y-auto pr-1">
        <AnimatePresence mode="wait">
          <motion.section
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {!isContactStep && currentChoiceStep && (
              <>
                <h2 className="text-2xl font-semibold leading-tight sm:text-3xl">{currentChoiceStep.title}</h2>
                <div className="mt-5 grid gap-3">
                  {currentChoiceStep.options.map((option) => {
                    const selected = data[currentChoiceStep.id] === option;
                    return (
                      <button
                        type="button"
                        key={option}
                        onClick={() => onPick(option)}
                        className={`w-full rounded-2xl border px-4 py-3 text-left text-sm font-medium transition sm:py-4 sm:text-base ${
                          selected
                            ? "border-neutral-900 bg-neutral-900 text-white"
                            : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {isContactStep && (
              <>
                <h2 className="text-xl font-semibold leading-tight sm:text-2xl">
                  Zostaw dane, a skontaktujemy się z Tobą w ciągu 24 godzin
                </h2>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Imię i nazwisko"
                    value={data.contact.fullName}
                    onChange={(value) => onContactChange("fullName", value)}
                    error={errors.fullName}
                    required
                  />
                  <Field
                    label="Telefon"
                    value={data.contact.phone}
                    onChange={(value) => onContactChange("phone", value)}
                    error={errors.phone}
                  />
                  <Field
                    label="E-mail"
                    value={data.contact.email}
                    onChange={(value) => onContactChange("email", value)}
                    error={errors.email}
                    type="email"
                  />
                  <Field
                    label="Lokalizacja inwestycji"
                    value={data.contact.location}
                    onChange={(value) => onContactChange("location", value)}
                    error={errors.location}
                    required={isLocationRequired}
                  />

                  <div className="sm:col-span-2">
                    <p className="mb-2 text-sm font-medium text-neutral-700">Kiedy planujesz rozpoczęcie inwestycji? *</p>
                    <div className="grid gap-2 sm:grid-cols-3">
                      {timelineOptions.map((option) => {
                        const selected = data.contact.timeline === option;
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => onContactChange("timeline", option)}
                            className={`rounded-xl border px-3 py-3 text-sm transition ${
                              selected
                                ? "border-neutral-900 bg-neutral-900 text-white"
                                : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
                            }`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                    {errors.timeline && <p className="mt-1 text-xs text-red-500">{errors.timeline}</p>}
                  </div>

                  <label className="sm:col-span-2">
                    <span className="mb-2 block text-sm font-medium text-neutral-700">Dodatkowe informacje</span>
                    <textarea
                      value={data.contact.additionalInfo}
                      onChange={(event) => onContactChange("additionalInfo", event.target.value)}
                      rows={3}
                      placeholder="Np. budżet, metraż, preferowany styl, zakres prac..."
                      className="w-full rounded-xl border border-neutral-200 px-3 py-2 outline-none transition focus:border-neutral-500"
                    />
                  </label>
                </div>
              </>
            )}
          </motion.section>
        </AnimatePresence>
      </div>

      <footer className="mt-5 flex shrink-0 items-center justify-between gap-3">
        <button
          type="button"
          onClick={prev}
          disabled={currentStep === 0}
          className="rounded-xl border border-neutral-300 px-5 py-3 text-sm font-medium transition hover:border-neutral-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Wstecz
        </button>

        {isContactStep ? (
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Wysyłanie..." : "Wyślij i rozpocznij projekt"}
          </button>
        ) : (
          <button
            type="button"
            onClick={next}
            disabled={!canContinue}
            className="rounded-xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            Dalej
          </button>
        )}
      </footer>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  required = false,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  type?: "text" | "email";
}) {
  return (
    <label>
      <span className="mb-2 block text-sm font-medium text-neutral-700">
        {label}
        {required ? " *" : ""}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full rounded-xl border px-3 py-2 outline-none transition ${
          error ? "border-red-400" : "border-neutral-200 focus:border-neutral-500"
        }`}
      />
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  );
}
