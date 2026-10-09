function copyViaExecCommand(text: string): boolean {
  if (typeof document === 'undefined') {
    return false
  }

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.top = '-1000px'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.focus()
  textarea.select()

  let copied = false
  try {
    copied = document.execCommand('copy')
  } catch {
    copied = false
  }

  document.body.removeChild(textarea)
  return copied
}

export async function copyTextToClipboard(text: string): Promise<void> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return
    } catch {
      // Alguns navegadores negam a Clipboard API; tenta o fallback abaixo.
    }
  }

  if (copyViaExecCommand(text)) {
    return
  }

  throw new Error(
    'Não foi possível acessar a área de transferência. Copie o texto manualmente.',
  )
}
