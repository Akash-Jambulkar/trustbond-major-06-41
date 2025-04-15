
import React, { useEffect, useState } from "react";
import { 
  MarketData, 
  fetchMarketData,
  subscribeToMarketUpdates 
} from "@/utils/api/marketDataApi";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  ArrowDown, 
  ArrowUp, 
  RefreshCw,
  Minus,
  TrendingDown,
  TrendingUp
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const MarketDataDisplay: React.FC = () => {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    // Initial fetch
    const loadMarketData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchMarketData();
        setMarketData(data);
        setLastUpdated(new Date());
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch market data"));
      } finally {
        setIsLoading(false);
      }
    };

    loadMarketData();

    // Subscribe to updates
    const unsubscribe = subscribeToMarketUpdates((data) => {
      setMarketData(data);
      setLastUpdated(new Date());
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const data = await fetchMarketData();
      setMarketData(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch market data"));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !marketData) {
    return <MarketDataSkeleton />;
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-700">Market Data Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-600">
            Unable to retrieve market data. Please try again later.
          </p>
          <button 
            onClick={handleRefresh}
            className="flex items-center mt-2 text-sm text-red-700 hover:text-red-800"
          >
            <RefreshCw className="h-4 w-4 mr-1" /> Retry
          </button>
        </CardContent>
      </Card>
    );
  }

  if (!marketData) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Market Data</CardTitle>
            <CardDescription>
              {lastUpdated && (
                <>Last updated: {lastUpdated.toLocaleTimeString()}</>
              )}
            </CardDescription>
          </div>
          <div className="flex items-center">
            <Badge 
              variant="outline" 
              className={`
                ${marketData.marketSentiment === 'bullish' && 'bg-green-50 text-green-700 border-green-200'} 
                ${marketData.marketSentiment === 'bearish' && 'bg-red-50 text-red-700 border-red-200'} 
                ${marketData.marketSentiment === 'neutral' && 'bg-blue-50 text-blue-700 border-blue-200'}
              `}
            >
              {marketData.marketSentiment === 'bullish' && <TrendingUp className="h-3 w-3 mr-1" />}
              {marketData.marketSentiment === 'bearish' && <TrendingDown className="h-3 w-3 mr-1" />}
              {marketData.marketSentiment === 'neutral' && <Minus className="h-3 w-3 mr-1" />}
              {marketData.marketSentiment.charAt(0).toUpperCase() + marketData.marketSentiment.slice(1)}
            </Badge>
            <button 
              onClick={handleRefresh} 
              disabled={isLoading}
              className="ml-2 p-1 rounded-full hover:bg-muted/80 transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="crypto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="crypto">Cryptocurrency</TabsTrigger>
            <TabsTrigger value="fiat">Fiat Currencies</TabsTrigger>
          </TabsList>
          
          <TabsContent value="crypto" className="space-y-4 mt-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Object.entries(marketData.cryptoRates).map(([currency, rate]) => (
                <Card key={currency} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="font-bold">{currency}</div>
                      <PriceChange direction={marketData.trends.direction} />
                    </div>
                    <div className="text-xl font-medium mt-1">${rate.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {marketData.trends.percentChange.toFixed(2)}% {marketData.trends.direction}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="rounded-md bg-muted/50 p-3 text-sm">
              <div className="flex items-center">
                <div className="font-medium">Market Volatility:</div>
                <Badge 
                  variant="outline" 
                  className={`ml-2 
                    ${marketData.trends.volatility === 'low' && 'bg-green-50 text-green-700 border-green-200'} 
                    ${marketData.trends.volatility === 'medium' && 'bg-amber-50 text-amber-700 border-amber-200'} 
                    ${marketData.trends.volatility === 'high' && 'bg-red-50 text-red-700 border-red-200'}
                  `}
                >
                  {marketData.trends.volatility.charAt(0).toUpperCase() + marketData.trends.volatility.slice(1)}
                </Badge>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="fiat" className="space-y-4 mt-2">
            <div className="border rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-2 pl-3">Currency</th>
                    <th className="text-right p-2">Rate (vs USD)</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(marketData.fiatRates).map(([currency, rate], index) => (
                    <tr key={currency} className={index % 2 === 0 ? 'bg-white' : 'bg-muted/50'}>
                      <td className="p-2 pl-3 font-medium">{currency}</td>
                      <td className="p-2 text-right">{rate.toFixed(4)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="text-xs text-muted-foreground">
              Exchange rates are for informational purposes only and may vary slightly from actual transaction rates.
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Price change indicator component
const PriceChange: React.FC<{ direction: 'up' | 'down' | 'stable' }> = ({ direction }) => {
  if (direction === 'up') {
    return <ArrowUp className="h-4 w-4 text-green-600" />;
  } else if (direction === 'down') {
    return <ArrowDown className="h-4 w-4 text-red-600" />;
  } else {
    return <Minus className="h-4 w-4 text-blue-600" />;
  }
};

// Skeleton loader for market data
const MarketDataSkeleton: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48 mt-2" />
          </div>
          <Skeleton className="h-6 w-24" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {Array(6).fill(0).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-10" />
                    <Skeleton className="h-4 w-4" />
                  </div>
                  <Skeleton className="h-6 w-20 mt-1" />
                  <Skeleton className="h-3 w-12 mt-1" />
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
    </Card>
  );
};
