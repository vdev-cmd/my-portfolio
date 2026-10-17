/** Icons that can be referenced from content files. Mapped to components in `components/ui/icons`. */
export type IconName =
  | 'smartphone'
  | 'layers'
  | 'workflow'
  | 'plug'
  | 'wrench'
  | 'graduation-cap'
  | 'building'
  | 'boxes'
  | 'flask-conical'
  | 'git-pull-request'
  | 'code'
  | 'search'
  | 'brain'
  | 'target'
  | 'sparkles'
  | 'mail'
  | 'github'
  | 'linkedin'
  | 'telegram'

/**
 * Honest progress labels. Nothing is shown as `completed` unless the content file says so.
 * - `sample`      placeholder content that still needs real project information
 * - `goal`        a learning goal that has not been started
 * - `learning`    currently being learned
 * - `planned`     a planned experiment or milestone
 * - `in-progress` work that has started
 * - `completed`   finished and verified
 */
export type ProgressStatus =
  'sample' | 'goal' | 'learning' | 'planned' | 'in-progress' | 'completed'

export interface NavItem {
  /** Section element id; the nav link targets `#id`. */
  id: string
  label: string
}
