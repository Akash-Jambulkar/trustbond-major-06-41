
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, XCircle, Clock, AlertTriangle, ExternalLink } from "lucide-react";
import { useBlockchain } from "@/contexts/BlockchainContext";

interface BlockchainDataDisplayProps {
  title: string;
  description?: string;
  data: any[] | null;
  isLoading: boolean;
  error?: string | null;
  columns: {
    header: string;
    accessor: string;
    format?: (value: any) => React.ReactNode;
  }[];
  emptyMessage?: string;
}

export function BlockchainDataDisplay({
  title,
  description,
  data,
  isLoading,
  error,
  columns,
  emptyMessage = "No data found"
}: BlockchainDataDisplayProps) {
  const { networkName } = useBlockchain();

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
      case "verified":
      case "success":
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            <span>{status}</span>
          </Badge>
        );
      case "rejected":
      case "failed":
      case "defaulted":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            <span>{status}</span>
          </Badge>
        );
      case "pending":
      case "in_progress":
      case "waiting":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{status}</span>
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            {status}
          </Badge>
        );
    }
  };

  // Format transaction hash or address to be human-readable
  const formatBlockchainHash = (hash: string) => {
    if (!hash) return "N/A";
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
            <div>
              <p className="font-medium text-red-700">Error loading data</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : data && data.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column, index) => (
                  <TableHead key={index}>{column.header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex}>
                      {column.format ? (
                        column.format(item[column.accessor])
                      ) : column.accessor.toLowerCase().includes("status") ? (
                        getStatusBadge(item[column.accessor])
                      ) : column.accessor.toLowerCase().includes("hash") || column.accessor.toLowerCase().includes("address") ? (
                        <span className="font-mono text-xs">
                          {formatBlockchainHash(item[column.accessor])}
                        </span>
                      ) : (
                        item[column.accessor]
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            {emptyMessage}
          </div>
        )}

        {data && data.length > 0 && (
          <div className="mt-4 text-xs text-muted-foreground flex items-center justify-end gap-1">
            <span>Data from</span>
            <Badge variant="outline" className="text-xs bg-gray-50">
              {networkName}
            </Badge>
            <span>blockchain</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
