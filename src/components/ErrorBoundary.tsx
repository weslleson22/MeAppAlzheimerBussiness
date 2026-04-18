import React from 'react';
import { ErrorReport } from '../screens/ErrorReport';

type Props = {
  children: React.ReactNode;
};

type State = {
  error: Error | null;
  errorInfo?: React.ErrorInfo;
};

class ErrorBoundary extends React.Component<Props, State> {
  state: State = {
    error: null,
    errorInfo: undefined,
  };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Unhandled error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleRetry = () => {
    this.setState({ error: null, errorInfo: undefined });
  };

  render() {
    if (this.state.error) {
      return (
        <ErrorReport
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onRetry={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
