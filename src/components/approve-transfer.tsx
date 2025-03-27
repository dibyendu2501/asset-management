import React, { useEffect, useState } from "react";
import { Button, Card, CardContent, Typography } from "@mui/material";

interface Asset {
  assetType: string;
  assetName: string;
  assetNumber: number;
  purchaseDate: string;
  purchasePrice: number;
  initialDepartment: string;
  currentDepartment: string;
  currentValuation: number;
  lastEvaluated: string;
  location: string;
  availableToTransfer: boolean;
  selected: boolean;
}

interface TransferRequest {
  requestId: string;
  requestingLocation: string;
  requestingDepartment: string;
  transferStatus: string;
  assets: Asset[];
}

const TransferRequests: React.FC = () => {
  const [requests, setRequests] = useState<TransferRequest[]>([]);

  useEffect(() => {
    fetch("/data/transfer-request.json")
      .then((response) => response.json())
      .then((data) => setRequests(data))
      .catch((error) => console.error("Error loading transfer requests:", error));
  }, []);

  const handleApprove = (requestId: string) => {
    setRequests((prevRequests) => prevRequests.filter(req => req.requestId !== requestId));
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Transfer Requests
      </Typography>
      {requests.length === 0 ? (
        <Typography>No pending requests.</Typography>
      ) : (
        requests.map((request) => (
          <Card key={request.requestId} sx={{ marginBottom: 2 }}>
            <CardContent>
              <Typography variant="h6">Request ID: {request.requestId}</Typography>
              <Typography>Location: {request.requestingLocation}</Typography>
              <Typography>Department: {request.requestingDepartment}</Typography>
              <Typography>Status: {request.transferStatus}</Typography>
              <Typography variant="subtitle1">Assets:</Typography>
              <ul>
                {request.assets.map((asset) => (
                  <li key={asset.assetNumber}>
                    {asset.assetType} - {asset.assetName} (#{asset.assetNumber})
                  </li>
                ))}
              </ul>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleApprove(request.requestId)}
              >
                Approve
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default TransferRequests;
