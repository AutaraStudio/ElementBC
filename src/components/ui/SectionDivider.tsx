import DividerBarsSvg from '@/components/ui/svgs/DividerBarsSvg'

interface SectionDividerProps {
  theme?: string
}

export default function SectionDivider({ theme = 'buff' }: SectionDividerProps) {
  return (
    <section data-theme={theme} className={`project_details-wrap u-theme-${theme}`}>
      <div data-wf--spacer--variant="small" className="u-section-spacer is-small u-ignore-trim"></div>
      <div className="u-container">
        <DividerBarsSvg className="global_svg" />
      </div>
      <div data-wf--spacer--variant="small" className="u-section-spacer is-small u-ignore-trim"></div>
    </section>
  )
}
