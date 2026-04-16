import { ProjectWizard } from "./components/ProjectWizard";

export default function Home() {
  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <p className="text-center text-xs uppercase tracking-[0.28em] text-scn-gold">SCN Group • Premium Investment Flow</p>
        <h1 className="mt-4 text-center text-3xl font-semibold leading-tight sm:text-5xl">
          Rozpocznij projekt
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-neutral-600 sm:text-base">
          Przejdź przez 6 kroków i opowiedz nam o swojej inwestycji. Poprowadzimy Cię od wyboru działki,
          przez projekt i formalności, aż po realizację budowy oraz stałą kontrolę postępu.
        </p>

        <div className="mt-8 sm:mt-12">
          <ProjectWizard />
        </div>
      </div>
    </main>
  );
}
