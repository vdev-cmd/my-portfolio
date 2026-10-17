export interface ExperienceItem {
  id: string
  company: string
  companyUrl?: string
  role: string
  /** Free text so partial dates are possible, e.g. `2022 – Present`. */
  period: string
  location?: string
  /** Highlights the entry as the current role on the timeline. */
  current?: boolean
  summary: string
  responsibilities: string[]
  technologies: string[]
  /** Only add verified achievements. Omitted blocks are not rendered. */
  achievements?: string[]
  /** Only add verified business impact. Never invent numbers. */
  impact?: string
  /** Marks unconfirmed content so it is visibly flagged until it is replaced. */
  placeholder?: boolean
}
