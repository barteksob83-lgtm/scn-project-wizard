import { ProjectWizard } from "./components/ProjectWizard";

export default function Home() {
  return (
    <main className="h-[100dvh] overflow-hidden bg-neutral-100 px-3 py-3 sm:px-6 sm:py-6">
      <section className="mx-auto flex h-full w-full max-w-4xl flex-col justify-center">
        <div className="mb-4 text-center sm:mb-6">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">Rozpocznij projekt</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-neutral-600 sm:text-base">
            Pokaż nam, gdzie jesteś — pomożemy Ci dojść do gotowego domu.
          </p>
        </div>

        <div className="min-h-0 flex-1">
          <ProjectWizard />
        </div>
      </section>
    </main>
  );
}
