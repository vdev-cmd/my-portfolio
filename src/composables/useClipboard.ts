import { onScopeDispose, ref } from 'vue'

export type CopyStatus = 'idle' | 'copied' | 'error'

/** Last-resort copy for browsers/contexts without the async Clipboard API. */
function legacyCopy(text: string): boolean {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none'
  document.body.appendChild(textarea)
  textarea.select()
  try {
    return document.execCommand('copy')
  } catch {
    return false
  } finally {
    textarea.remove()
  }
}

async function writeText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // Permission denied or insecure context: fall through to the legacy path.
  }
  return legacyCopy(text)
}

/** Copy-to-clipboard with explicit success/error state that resets after `resetAfterMs`. */
export function useClipboard(resetAfterMs = 2500) {
  const status = ref<CopyStatus>('idle')
  let timer: ReturnType<typeof setTimeout> | undefined

  async function copy(text: string): Promise<boolean> {
    const ok = await writeText(text)
    status.value = ok ? 'copied' : 'error'
    clearTimeout(timer)
    timer = setTimeout(() => {
      status.value = 'idle'
    }, resetAfterMs)
    return ok
  }

  onScopeDispose(() => clearTimeout(timer))

  return { status, copy }
}
