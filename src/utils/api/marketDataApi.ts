
import { toast } from "sonner";

// Types for market data
export interface MarketData {
  timestamp: string;
  cryptoRates: {
    BTC: number;
    ETH: number;
    SOL: number;
    BNB: number;
    XRP: number;
    ADA: number;
  };
  fiatRates: {
    USD: number;
    EUR: number;
    GBP: number;
    JPY: number;
    CHF: number;
  };
  trends: {
    direction: 'up' | 'down' | 'stable';
    percentChange: number;
    volatility: 'low' | 'medium' | 'high';
  };
  marketSentiment: 'bearish' | 'bullish' | 'neutral';
}

// Fetch real-time market data
export const fetchMarketData = async (): Promise<MarketData> => {
  try {
    // In production, this would be a real API call to a market data provider
    // For now, we'll simulate a response with a timeout
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate pseudo-random but realistic market data
    const timestamp = new Date().toISOString();
    const baseEthPrice = 2000 + (Math.sin(Date.now() / 86400000) * 200);
    const baseBtcPrice = 42000 + (Math.sin(Date.now() / 86400000 + 1) * 2000);
    
    const percentChange = parseFloat((Math.sin(Date.now() / 43200000) * 3).toFixed(2));
    const direction = percentChange > 0 ? 'up' : percentChange < 0 ? 'down' : 'stable';
    
    // Generate a market data response
    const response: MarketData = {
      timestamp,
      cryptoRates: {
        ETH: parseFloat(baseEthPrice.toFixed(2)),
        BTC: parseFloat(baseBtcPrice.toFixed(2)),
        SOL: parseFloat((100 + Math.sin(Date.now() / 86400000 + 2) * 10).toFixed(2)),
        BNB: parseFloat((300 + Math.sin(Date.now() / 86400000 + 3) * 30).toFixed(2)),
        XRP: parseFloat((0.5 + Math.sin(Date.now() / 86400000 + 4) * 0.05).toFixed(3)),
        ADA: parseFloat((0.4 + Math.sin(Date.now() / 86400000 + 5) * 0.04).toFixed(3)),
      },
      fiatRates: {
        USD: 1,
        EUR: parseFloat((0.92 + Math.sin(Date.now() / 86400000) * 0.01).toFixed(4)),
        GBP: parseFloat((0.77 + Math.sin(Date.now() / 86400000 + 1) * 0.01).toFixed(4)),
        JPY: parseFloat((150 + Math.sin(Date.now() / 86400000 + 2) * 2).toFixed(2)),
        CHF: parseFloat((0.89 + Math.sin(Date.now() / 86400000 + 3) * 0.01).toFixed(4))
      },
      trends: {
        direction,
        percentChange: Math.abs(percentChange),
        volatility: Math.abs(percentChange) < 1 ? 'low' : Math.abs(percentChange) < 2 ? 'medium' : 'high'
      },
      marketSentiment: percentChange > 1 ? 'bullish' : percentChange < -1 ? 'bearish' : 'neutral'
    };
    
    return response;
  } catch (error) {
    console.error("Error fetching market data:", error);
    toast.error("Failed to fetch market data");
    throw error;
  }
};

// Subscribe to market data updates (simulated)
export const subscribeToMarketUpdates = (callback: (data: MarketData) => void): () => void => {
  // In a real implementation, this would set up a WebSocket connection
  // For now, we'll use an interval to simulate real-time updates
  const intervalId = setInterval(async () => {
    try {
      const data = await fetchMarketData();
      callback(data);
    } catch (error) {
      console.error("Error in market data subscription:", error);
    }
  }, 15000); // Update every 15 seconds
  
  // Return a function to unsubscribe
  return () => clearInterval(intervalId);
};
