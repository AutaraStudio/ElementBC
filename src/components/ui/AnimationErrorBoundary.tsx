'use client';

import React, { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Error boundary that wraps AnimationProvider.
 * If GSAP / Locomotive / any animation code crashes,
 * the page still renders — just without animations.
 */
export default class AnimationErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[AnimationProvider] crashed — animations disabled:', error, info);
  }

  render() {
    if (this.state.hasError) {
      // Render nothing — page works without animations
      return null;
    }
    return this.props.children;
  }
}
