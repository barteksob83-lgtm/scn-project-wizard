"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useMemo, useState } from "react";

type ChoiceStep = {
  id: "plot" | "projectStage" | "formalities" | "buildTarget" | "guidance";
  title: string;
  options: string[];
};

type ContactData = {
  fullName: string;
  phone: string;
  email: string;
  location: string;
  startDate: string;
  additionalInfo: string;
};

type WizardData = {
  plot: string;
  projectStage: string;
  formalities: string;
  buildTarget: string;
  guidance: string;
  contact: ContactData;
};

const steps: ChoiceStep[] = [
  {
    id: "plot",
    title: "Czy masz już działkę?",
    options: ["Mam już działkę", "Szukam działki", "Potrzebuję pomocy w ocenie terenu"],
  },
  {
    id: "projectStage",
    title: "Na jakim etapie projektu jesteś?",
    options: [
      "Nie mam jeszcze projektu",
      "Mam inspiracje i potrzebuję koncepcji",
      "Mam własny projekt",
      "Chcę projekt z ogrodem i otoczeniem",
    ],
  },
  {
    id: "formalities",
    title: "Czy potrzebujesz wsparcia w formalnościach?",
    options: [
      "Tak, od początku",
      "Tylko pozwolenia / zgłoszenia",
      "Mam już wszystko gotowe",
      "Nie wiem, od czego zacząć",
    ],
  },
  {
    id: "buildTarget",
    title: "Do jakiego etapu chcesz doprowadzić inwestycję?",
    options: ["Stan surowy otwarty", "Stan surowy zamknięty", "Stan deweloperski", "Wykończenie pod klucz"],
  },
  {
    id: "guidance",
    title: "Jak chcesz być prowadzony podczas inwestycji?",
    options: [
      "Stały kontakt z opiekunem",
      "Raporty zdjęciowe",
      "Wizyty na budowie",
      "Pełna kontrola harmonogramu",
      "Wszystko powyżej",
    ],
  },
];

const initialData: WizardData = {
  plot: "",
  projectStage: "",
  formalities: "",
  buildTarget: "",
  guidance: "",
  contact: {
    fullName: "",
    phone: "",
    email: "",
    location: "",
    startDate: "",
    additionalInfo: "",
  },
};

export function ProjectWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<WizardData>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const totalSteps = 6;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const currentChoiceStep = steps[currentStep];
  const isContactStep = currentStep === 5;

  const canContinue = useMemo(() => {
    if (isContactStep) {
      return true;
    }

    if (!currentChoiceStep) {
      return false;
    }

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
    const { fullName, phone, email, location, startDate } = data.contact;

    if (!fullName.trim()) nextErrors.fullName = "Podaj imię i nazwisko.";
    if (!phone.trim()) nextErrors.phone = "Podaj numer telefonu.";
    if (!email.trim()) nextErrors.email = "Podaj adres e-mail.";
    if (email && !/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = "Nieprawidłowy adres e-mail.";
    if (!location.trim()) nextErrors.location = "Podaj lokalizację inwestycji.";
    if (!startDate.trim()) nextErrors.startDate = "Wybierz planowany termin startu.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const next = () => {
    if (currentStep < totalSteps - 1 && canContinue) {
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

    try {
      const payload = {
        submittedAt: new Date().toISOString(),
        ...data,
      };

      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      setIsSuccess(true);
    } catch (error) {
      console.error("Nie udało się wysłać formularza:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <section className="mx-auto max-w-2xl rounded-3xl bg-white p-10 text-center shadow-soft">
        <p className="text-sm uppercase tracking-[0.3em] text-scn-gold">SCN Group</p>
        <h2 className="mt-4 text-3xl font-semibold">Dziękujemy.</h2>
        <p className="mt-4 text-lg text-neutral-600">
          Twój projekt został rozpoczęty. Skontaktujemy się z Tobą w ciągu 24h.
        </p>
      </section>
    );
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-3xl rounded-3xl bg-white/95 p-6 shadow-soft sm:p-10">
      <header>
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-neutral-500">
          <span>Krok {currentStep + 1} / {totalSteps}</span>
          <span>Rozpocznij projekt</span>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-neutral-200">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-scn-charcoal to-scn-gold"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          />
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.section
          key={currentStep}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25 }}
          className="mt-8"
        >
          {!isContactStep && currentChoiceStep && (
            <>
              <h2 className="text-2xl font-semibold leading-tight sm:text-3xl">{currentChoiceStep.title}</h2>
              <div className="mt-6 grid gap-3">
                {currentChoiceStep.options.map((option) => {
                  const selected = data[currentChoiceStep.id] === option;
                  return (
                    <button
                      type="button"
                      key={option}
                      onClick={() => onPick(option)}
                      className={`w-full rounded-2xl border px-5 py-4 text-left transition-all ${
                        selected
                          ? "border-scn-charcoal bg-scn-charcoal text-white"
                          : "border-neutral-200 bg-white text-neutral-700 hover:border-scn-gold hover:text-scn-charcoal"
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
              <h2 className="text-2xl font-semibold leading-tight sm:text-3xl">Dane kontaktowe</h2>
              <p className="mt-2 text-sm text-neutral-500">Wypełnij formularz, a wrócimy do Ciebie w ciągu 24h.</p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field
                  label="Imię i nazwisko"
                  value={data.contact.fullName}
                  onChange={(value) => onContactChange("fullName", value)}
                  error={errors.fullName}
                />
                <Field
                  label="Telefon"
                  value={data.contact.phone}
                  onChange={(value) => onContactChange("phone", value)}
                  error={errors.phone}
                />
                <Field
                  label="E-mail"
                  type="email"
                  value={data.contact.email}
                  onChange={(value) => onContactChange("email", value)}
                  error={errors.email}
                />
                <Field
                  label="Lokalizacja inwestycji"
                  value={data.contact.location}
                  onChange={(value) => onContactChange("location", value)}
                  error={errors.location}
                />
                <Field
                  label="Planowany termin startu"
                  type="date"
                  value={data.contact.startDate}
                  onChange={(value) => onContactChange("startDate", value)}
                  error={errors.startDate}
                />
                <label className="sm:col-span-2">
                  <span className="mb-2 block text-sm font-medium text-neutral-700">Dodatkowe informacje</span>
                  <textarea
                    value={data.contact.additionalInfo}
                    onChange={(event) => onContactChange("additionalInfo", event.target.value)}
                    rows={4}
                    className="w-full rounded-xl border border-neutral-200 px-3 py-2 outline-none transition focus:border-scn-gold"
                    placeholder="Np. preferowany styl, metraż, budżet..."
                  />
                </label>
              </div>
            </>
          )}
        </motion.section>
      </AnimatePresence>

      <footer className="mt-10 flex items-center justify-between gap-3">
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
            className="rounded-xl bg-scn-charcoal px-6 py-3 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Wysyłanie..." : "Wyślij i rozpocznij projekt"}
          </button>
        ) : (
          <button
            type="button"
            onClick={next}
            disabled={!canContinue}
            className="rounded-xl bg-scn-charcoal px-6 py-3 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
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
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: "text" | "email" | "date";
}) {
  return (
    <label>
      <span className="mb-2 block text-sm font-medium text-neutral-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full rounded-xl border px-3 py-2 outline-none transition ${
          error ? "border-red-400" : "border-neutral-200 focus:border-scn-gold"
        }`}
      />
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  );
}
