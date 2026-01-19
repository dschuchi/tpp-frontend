type ConfirmOptions = {
  title: string
  message: string
  confirmText: string
  confirmColor: string
}

const visible = ref(false)
const options = ref<ConfirmOptions | null>(null)

let resolveFn: ((value: boolean) => void) | null = null

export function useConfirm() {
  const confirm = (opts: ConfirmOptions) => {
    options.value = opts
    visible.value = true

    return new Promise<boolean>((resolve) => {
      resolveFn = resolve
    })
  }

  const onConfirm = () => {
    visible.value = false
    resolveFn?.(true)
  }

  const onCancel = () => {
    visible.value = false
    resolveFn?.(false)
  }

  return {
    visible,
    options,
    confirm,
    onConfirm,
    onCancel
  }
}
