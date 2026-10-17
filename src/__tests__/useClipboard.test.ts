import { afterEach, describe, expect, it, vi } from 'vitest'
import { effectScope } from 'vue'
import { useClipboard } from '@/composables/useClipboard'

function setClipboard(writeText: ((text: string) => Promise<void>) | undefined) {
  Object.defineProperty(navigator, 'clipboard', {
    value: writeText ? { writeText } : undefined,
    configurable: true,
  })
}

function setExecCommand(result: boolean) {
  const execCommand = vi.fn().mockReturnValue(result)
  Object.defineProperty(document, 'execCommand', { value: execCommand, configurable: true })
  return execCommand
}

function create(resetAfterMs?: number) {
  const scope = effectScope()
  const api = scope.run(() => useClipboard(resetAfterMs))!
  return { api, scope }
}

describe('useClipboard', () => {
  afterEach(() => {
    vi.useRealTimers()
    setClipboard(undefined)
    Reflect.deleteProperty(document, 'execCommand')
  })

  it('copies with the async Clipboard API and reports success', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    setClipboard(writeText)
    const { api } = create()

    await expect(api.copy('hello@example.test')).resolves.toBe(true)

    expect(writeText).toHaveBeenCalledWith('hello@example.test')
    expect(api.status.value).toBe('copied')
  })

  it('resets to idle after the timeout', async () => {
    vi.useFakeTimers()
    setClipboard(vi.fn().mockResolvedValue(undefined))
    const { api } = create(1000)

    await api.copy('x')
    expect(api.status.value).toBe('copied')

    vi.advanceTimersByTime(1000)
    expect(api.status.value).toBe('idle')
  })

  it('falls back to execCommand when the Clipboard API rejects', async () => {
    setClipboard(vi.fn().mockRejectedValue(new Error('NotAllowedError')))
    const execCommand = setExecCommand(true)
    const { api } = create()

    await expect(api.copy('x')).resolves.toBe(true)

    expect(execCommand).toHaveBeenCalledWith('copy')
    expect(api.status.value).toBe('copied')
  })

  it('falls back to execCommand when the Clipboard API does not exist', async () => {
    setClipboard(undefined)
    const execCommand = setExecCommand(true)
    const { api } = create()

    await api.copy('x')

    expect(execCommand).toHaveBeenCalledOnce()
    expect(api.status.value).toBe('copied')
  })

  it('reports an error when every strategy fails', async () => {
    setClipboard(vi.fn().mockRejectedValue(new Error('denied')))
    setExecCommand(false)
    const { api } = create()

    await expect(api.copy('x')).resolves.toBe(false)
    expect(api.status.value).toBe('error')
  })

  it('cleans up the temporary textarea used by the fallback', async () => {
    setClipboard(undefined)
    setExecCommand(true)
    const { api } = create()

    await api.copy('x')

    expect(document.querySelector('textarea')).toBeNull()
  })

  it('clears its timer when the scope is disposed', async () => {
    vi.useFakeTimers()
    setClipboard(vi.fn().mockResolvedValue(undefined))
    const { api, scope } = create(1000)

    await api.copy('x')
    scope.stop()
    vi.advanceTimersByTime(5000)

    expect(vi.getTimerCount()).toBe(0)
    expect(api.status.value).toBe('copied')
  })
})
