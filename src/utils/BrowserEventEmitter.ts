
/**
 * A simple event emitter implementation for browsers
 * This replaces the Node.js EventEmitter which isn't compatible with browser environments
 */
export class BrowserEventEmitter {
  private events: Record<string, Array<(data: any) => void>> = {};

  /**
   * Add an event listener
   */
  on(event: string, listener: (data: any) => void): this {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
    return this;
  }

  /**
   * Remove an event listener
   */
  off(event: string, listener: (data: any) => void): this {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(l => l !== listener);
    }
    return this;
  }

  /**
   * Remove all listeners for an event
   */
  removeAllListeners(event?: string): this {
    if (event) {
      delete this.events[event];
    } else {
      this.events = {};
    }
    return this;
  }

  /**
   * Emit an event with data
   */
  emit(event: string, data?: any): boolean {
    if (!this.events[event]) {
      return false;
    }
    
    this.events[event].forEach(listener => {
      try {
        listener(data);
      } catch (error) {
        console.error(`Error in event listener for ${event}:`, error);
      }
    });
    
    return true;
  }
}
