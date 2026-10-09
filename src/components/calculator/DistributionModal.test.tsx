// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from '../../App'

type User = ReturnType<typeof userEvent.setup>

function setupClipboard(writeText?: (text: string) => Promise<void>) {
  Object.defineProperty(window.navigator, 'clipboard', {
    value: { writeText },
    configurable: true,
  })
}

function removeClipboard() {
  Reflect.deleteProperty(window.navigator, 'clipboard')
}

function stubExecCommand(result: boolean) {
  const execCommand = vi.fn(() => result)
  Object.defineProperty(document, 'execCommand', {
    value: execCommand,
    configurable: true,
  })
  return execCommand
}

async function increase(user: User, accessibleName: string, times: number) {
  const button = screen.getByRole('button', { name: accessibleName })
  for (let index = 0; index < times; index += 1) {
    await user.click(button)
  }
}

function openDistribution(user: User) {
  return user.click(
    screen.getByRole('button', { name: 'Distribuição concluída' }),
  )
}

function getDialog() {
  return screen.getByRole('dialog', { name: 'Distribuição de XP concluída' })
}

afterEach(() => {
  cleanup()
  removeClipboard()
  Reflect.deleteProperty(document, 'execCommand')
  vi.restoreAllMocks()
})

describe('abertura e conteúdo do modal', () => {
  it('abre o modal ao clicar em "Distribuição concluída"', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await openDistribution(user)

    expect(getDialog()).toBeInTheDocument()
    expect(
      screen.getByText(
        'Confira sua distribuição antes de copiar para sua ficha.',
      ),
    ).toBeInTheDocument()
  })

  it('mostra a distribuição atual com todos os itens, subtotais e total', async () => {
    const user = userEvent.setup()
    render(<App />)

    await increase(user, 'Aumentar Força — Destino', 5)
    await openDistribution(user)

    const dialog = getDialog()

    expect(within(dialog).getAllByRole('listitem')).toHaveLength(20)
    expect(dialog).toHaveTextContent(/Força \(FOR\).*0 → 5.*\+5 pontos.*40 XP/)
    expect(dialog).toHaveTextContent(/Vigor \(VIG\).*0 → 0.*\+0 pontos.*0 XP/)
    expect(dialog).toHaveTextContent(/Precisão \(PRE\).*0 → 0.*\+0 pontos.*0 XP/)
    expect(dialog).toHaveTextContent('Subtotal: 40 XP')

    const totalTile = within(dialog).getByText('XP total').closest('div')
    expect(totalTile).toHaveTextContent('40 XP')
  })

  it('mostra a energia correspondente às esferas adquiridas', async () => {
    const user = userEvent.setup()
    render(<App />)

    await increase(user, 'Aumentar Ninjutsu — Destino', 3)
    await openDistribution(user)

    const dialog = getDialog()

    expect(dialog).toHaveTextContent(/Ninjutsu \(NIN\).*0 → 3.*\+3 pontos.*24 XP/)
    expect(dialog).toHaveTextContent('Energia Mística: +30')
    expect(dialog).toHaveTextContent('Energia Física: +15')

    const mysticalTile = within(dialog)
      .getByText('Energia Mística')
      .closest('div')
    const physicalTile = within(dialog).getByText('Energia Física').closest('div')
    expect(mysticalTile).toHaveTextContent('+30')
    expect(physicalTile).toHaveTextContent('+15')
  })
})

describe('copiar distribuição', () => {
  it('copia o texto completo e exibe o feedback de sucesso', async () => {
    const writeText = vi
      .fn<(text: string) => Promise<void>>()
      .mockResolvedValue(undefined)
    const user = userEvent.setup()
    setupClipboard(writeText)
    render(<App />)

    await increase(user, 'Aumentar Força — Destino', 5)
    await increase(user, 'Aumentar Ninjutsu — Destino', 3)
    await openDistribution(user)

    await user.click(screen.getByRole('button', { name: 'Copiar distribuição' }))

    expect(await screen.findByText('Distribuição copiada!')).toBeInTheDocument()

    expect(writeText).toHaveBeenCalledTimes(1)
    const copied = writeText.mock.calls[0][0]
    expect(copied).toContain('DISTRIBUIÇÃO DE XP')
    expect(copied).toContain('Força (FOR): 0 → 5 | +5 pontos | 40 XP')
    expect(copied).toContain('Ninjutsu (NIN): 0 → 3 | +3 pontos | 24 XP')
    expect(copied).toContain('Energia Mística adquirida: +30')
    expect(copied).toContain('Energia Física adquirida: +15')
    expect(copied).toContain('XP total investido: 64 XP')
    expect(copied).toContain('Energia Mística total adquirida: +30')
    expect(copied).toContain('Energia Física total adquirida: +15')
  })

  it('usa o fallback quando a Clipboard API não está disponível', async () => {
    const user = userEvent.setup()
    setupClipboard()
    const execCommand = stubExecCommand(true)
    render(<App />)

    await openDistribution(user)
    await user.click(screen.getByRole('button', { name: 'Copiar distribuição' }))

    expect(await screen.findByText('Distribuição copiada!')).toBeInTheDocument()
    expect(execCommand).toHaveBeenCalledWith('copy')
  })

  it('trata falhas sem afirmar que copiou e oferece alternativa manual', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('permissão negada'))
    const user = userEvent.setup()
    setupClipboard(writeText)
    stubExecCommand(false)
    render(<App />)

    await increase(user, 'Aumentar Força — Destino', 2)
    await openDistribution(user)
    await user.click(screen.getByRole('button', { name: 'Copiar distribuição' }))

    expect(
      await screen.findByText(/Não foi possível acessar a área de transferência/),
    ).toBeInTheDocument()
    expect(screen.queryByText('Distribuição copiada!')).not.toBeInTheDocument()

    const fallback = screen.getByLabelText('Copie o texto manualmente')
    expect(fallback).toBeInstanceOf(HTMLTextAreaElement)
    expect((fallback as HTMLTextAreaElement).value).toContain(
      'Força (FOR): 0 → 2 | +2 pontos | 16 XP',
    )
  })
})

describe('fechar o modal', () => {
  it('fechar preserva os valores e reabrir mostra os dados atualizados', async () => {
    const user = userEvent.setup()
    render(<App />)

    await increase(user, 'Aumentar Força — Destino', 3)
    await openDistribution(user)
    await user.click(screen.getByRole('button', { name: 'Fechar' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Força — Destino')).toHaveValue(3)

    await increase(user, 'Aumentar Força — Destino', 2)
    await openDistribution(user)

    expect(getDialog()).toHaveTextContent(/Força \(FOR\).*0 → 5.*\+5 pontos.*40 XP/)
  })

  it('Escape fecha o modal preservando os valores', async () => {
    const user = userEvent.setup()
    render(<App />)

    await increase(user, 'Aumentar Vigor — Destino', 2)
    await openDistribution(user)
    await user.keyboard('{Escape}')

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Vigor — Destino')).toHaveValue(2)
  })
})

describe('resetar distribuição', () => {
  it('pede confirmação quando há investimento e restaura tudo para zero', async () => {
    const user = userEvent.setup()
    render(<App />)

    await increase(user, 'Aumentar Força — Destino', 5)
    await increase(user, 'Aumentar Ninjutsu — Destino', 3)
    await openDistribution(user)

    await user.click(
      screen.getByRole('button', { name: 'Resetar distribuição' }),
    )

    expect(
      screen.getByText(
        'Toda a distribuição atual será perdida. Deseja resetar os valores?',
      ),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Confirmar reset' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Força — Destino')).toHaveValue(0)
    expect(screen.getByLabelText('Ninjutsu — Destino')).toHaveValue(0)

    await openDistribution(user)
    const dialog = getDialog()

    expect(dialog).toHaveTextContent(/Força \(FOR\).*0 → 0.*\+0 pontos.*0 XP/)
    expect(within(dialog).getAllByText('+0')).toHaveLength(2)

    const totalTile = within(dialog).getByText('XP total').closest('div')
    expect(totalTile).toHaveTextContent('0 XP')
  })

  it('cancelar a confirmação mantém a distribuição intacta', async () => {
    const user = userEvent.setup()
    render(<App />)

    await increase(user, 'Aumentar Força — Destino', 2)
    await openDistribution(user)

    await user.click(
      screen.getByRole('button', { name: 'Resetar distribuição' }),
    )
    await user.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(getDialog()).toBeInTheDocument()
    expect(
      screen.queryByText(/Toda a distribuição atual será perdida/),
    ).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Fechar' }))
    expect(screen.getByLabelText('Força — Destino')).toHaveValue(2)
  })

  it('não pede confirmação quando não há pontos investidos', async () => {
    const user = userEvent.setup()
    render(<App />)

    await openDistribution(user)
    await user.click(
      screen.getByRole('button', { name: 'Resetar distribuição' }),
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(
      screen.queryByText(/Toda a distribuição atual será perdida/),
    ).not.toBeInTheDocument()
  })
})
