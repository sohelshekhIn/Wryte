type ManuscriptEditorProps = {
  chapterHeading: string
  sceneTitle: string
  value: string
  onChange: (value: string) => void
}

export function ManuscriptEditor({
  chapterHeading,
  sceneTitle,
  value,
  onChange,
}: ManuscriptEditorProps) {
  return (
    <div className="flex flex-1 justify-center overflow-y-auto bg-background py-11">
      <div className="flex min-h-[720px] w-[660px] flex-col rounded-md bg-card px-[72px] py-16 shadow-md">
        <div className="mb-3.5 text-center text-xs font-semibold tracking-[0.18em] uppercase text-sage-500">
          {chapterHeading}
        </div>
        <h1 className="mb-2 text-center font-serif text-[34px] font-semibold text-ink-900">
          {sceneTitle}
        </h1>
        <div className="mb-10 text-center text-lg tracking-[0.4em] text-sage-400">
          · · ·
        </div>
        {/* ponytail: plain textarea, no rich text — swap for an editor
            (e.g. TipTap) once formatting is actually needed. */}
        <textarea
          aria-label={`Manuscript for ${sceneTitle}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Continue writing..."
          className="w-full flex-1 resize-none bg-transparent font-serif text-[19px] leading-[1.85] text-ink-900 outline-none placeholder:italic placeholder:text-ink-400"
        />
      </div>
    </div>
  )
}
