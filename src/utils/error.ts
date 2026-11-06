export class RequestError extends Error {
  constructor(
    message: string,
    public readonly code: number,
    public readonly requestId?: string,
  ) {
    super(message)
    this.name = 'RequestError'
  }
}

export function notifyError(error: unknown): void {
  const message = error instanceof Error ? error.message : '网络连接异常，请稍后重试'
  uni.showToast({ title: message, icon: 'none', duration: 2500 })
}
