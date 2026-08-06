import Image from "next/image"

type LoginBrandingPanelProps = {
  quote?: string
}

// Shared branding panel used across the authentication screens for a consistent first impression.
export function LoginBrandingPanel({
  quote = "From first note to final draft, all in one calm workspace.",
}: LoginBrandingPanelProps) {
  return (
    <aside
      aria-label="About Wryte"
      className="relative flex min-h-56 overflow-hidden bg-sage-500 px-6 py-8 text-white md:min-h-full md:px-8 lg:px-12"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-4 left-1/2 size-40 -translate-x-1/2 rounded-full border border-sage-300/20 md:top-12 md:size-56"
      >
        <div className="absolute inset-5 rounded-full border border-sage-300/20">
          <div className="absolute inset-5 rounded-full border border-sage-300/20">
            <div className="absolute inset-5 rounded-full border border-sage-300/20" />
          </div>
        </div>
      </div>

      <div className="relative z-10 m-auto flex max-w-sm flex-col items-center text-center">
        <Image
          src="/app-icon.png"
          alt=""
          width={112}
          height={112}
          className="size-20 rounded-[1.75rem] shadow-md md:size-28"
        />

        <p className="mt-5 font-serif text-4xl leading-none font-bold md:mt-7 md:text-5xl">
          Wryte
        </p>

        <p className="mt-3 text-base font-semibold md:text-lg">
          Book writing made simple!
        </p>

        <blockquote className="mt-5 hidden max-w-xs font-serif text-base leading-relaxed font-medium italic text-white/90 md:mt-10 md:block md:text-lg">
          {quote}
        </blockquote>
      </div>
    </aside>
  )
}
