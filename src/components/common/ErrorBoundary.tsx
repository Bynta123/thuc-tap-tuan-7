import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, Home, RotateCcw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  /**
   * Khi bất kỳ giá trị nào trong mảng này thay đổi (ví dụ: pathname), boundary tự reset
   * để người dùng điều hướng sang trang khác mà không bị kẹt ở màn hình lỗi.
   */
  resetKeys?: ReadonlyArray<unknown>;
  /** Hook báo lỗi ra ngoài (log / Sentry...). */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

function haveKeysChanged(
  prev: ReadonlyArray<unknown> = [],
  next: ReadonlyArray<unknown> = []
): boolean {
  return prev.length !== next.length || prev.some((item, index) => !Object.is(item, next[index]));
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: '',
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message || 'Đã xảy ra lỗi giao diện ngoài ý muốn.',
    };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary]', error, errorInfo.componentStack);
    }
    this.props.onError?.(error, errorInfo);
  }

  override componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    if (this.state.hasError && haveKeysChanged(prevProps.resetKeys, this.props.resetKeys)) {
      this.handleReset();
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, errorMessage: '' });
  };

  override render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
          <div
            role="alert"
            className="w-full max-w-md rounded-2xl border border-rose-200 bg-white p-6 text-center shadow-sm"
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">
              Ứng dụng gặp sự cố hiển thị
            </h2>
            <p className="mt-2 text-sm text-slate-600">{this.state.errorMessage}</p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                <RotateCcw className="h-4 w-4" />
                Thử khôi phục
              </button>
              <a
                href="/products"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                <Home className="h-4 w-4" />
                Về trang sản phẩm
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
