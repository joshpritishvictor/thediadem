type PagePlaceholderProps = {
  title: string
}

export default function PagePlaceholder({ title }: PagePlaceholderProps) {
  return (
    <section>
      <h1 className="text-4xl font-bold">{title}</h1>
      <p className="mt-4 text-neutral-600">Content coming soon.</p>
    </section>
  )
}
