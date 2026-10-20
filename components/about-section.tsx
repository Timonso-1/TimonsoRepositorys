import { ABOUT_TEXT, TECH_STACK } from "@/lib/about";

export function AboutSection() {
  return (
    <div className="rounded-xl border border-line bg-surface p-5 sm:p-6">
      <p className="text-sm leading-relaxed text-muted">{ABOUT_TEXT}</p>
      <dl className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
        {TECH_STACK.map((group) => (
          <div key={group.title}>
            <dt className="text-xs uppercase tracking-wider text-muted">{group.title}</dt>
            <dd className="mt-2 flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-line px-2.5 py-0.5 text-xs"
                >
                  {item}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
