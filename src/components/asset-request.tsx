import React, { useState, useEffect } from "react";
import {
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Button,
  Card,
  SelectChangeEvent,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
} from "@mui/material";

interface Asset {
  assetNumber: number;
  assetType: string;
  assetName: string;
  purchaseDate: string;
  purchasePrice: number;
  initialDepartment: string;
  currentDepartment: string;
  currentValuation: number;
  lastEvaluated: Date;
  location: string;
  availableToTransfer: boolean;
  selected?: boolean; // Optional property to track selection
}

const AssetTransfer: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [location, setLocation] = React.useState("");
  const [department, setDepartment] = React.useState("");
  const [filters, setFilters] = useState({
    assetType: "",
    assetName: "",
    purchaseDateBefore: "",
    purchaseDateAfter: "",
  });

  const [bucketedAssets, setBucketedAssets] = useState<Asset[]>([]);

  useEffect(() => {
    fetch("/data/assets.json")
      .then((response) => response.json())
      .then((data: Asset[]) => {
        console.log(data);
        setAssets(data);
      });
  }, []);

  useEffect(() => {
    let filtered = assets.filter((asset) => asset.availableToTransfer);
    if (filters.assetType) {
      filtered = filtered.filter(
        (asset) => asset.assetType === filters.assetType
      );
    }
    if (filters.assetName) {
      filtered = filtered.filter((asset) =>
        asset.assetName.toLowerCase().includes(filters.assetName.toLowerCase())
      );
    }
    if (filters.purchaseDateBefore) {
      filtered = filtered.filter(
        (asset) =>
          new Date(asset.purchaseDate) < new Date(filters.purchaseDateBefore)
      );
    }
    if (filters.purchaseDateAfter) {
      filtered = filtered.filter(
        (asset) =>
          new Date(asset.purchaseDate) > new Date(filters.purchaseDateAfter)
      );
    }
    setFilteredAssets(filtered);
  }, [filters, assets]);

  const handleFilterChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const { name, value } = event.target;
    setFilters({ ...filters, [name as string]: value as string });
  };

  const handleCreateTransferRequest = async () => {
    if (!location || !department) {
      alert("Please select both Location and Department.");
      return;
    }
  
    if (bucketedAssets.length === 0) {
      alert("No assets selected for transfer.");
      return;
    }
  
    const requestId = Math.floor(10000 + Math.random() * 90000).toString();
  
    const newRequest = {
      requestId,
      requestingLocation: location,
      requestingDepartment: department,
      transferStatus: "pending",
      assets: bucketedAssets.map((asset) => ({
        ...asset,
        availableToTransfer: false, // Mark assets as unavailable
      })),
    };
  
    try {
      // Fetch existing requests
      const response = await fetch("/data/transfer-request.json");
      const existingRequests = await response.json();
  
      // Append new request to existing requests
      const updatedRequests = [...existingRequests, newRequest];
  
      // Store updated JSON (Simulating writing back)
      await fetch("/data/transfer-request.json", {
        method: "POST", // This might not work directly due to file system restrictions
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedRequests),
      });
  
      // Clear Selected Assets table after successful request
      setBucketedAssets([]);
  
      alert(`Transfer request created with ID: ${requestId}`);
    } catch (error) {
      console.error("Error creating transfer request:", error);
      alert("Failed to create transfer request.");
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {/* Existing Filter and Asset Selection Section */}
      <Card>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 2,
            }}
          >
            <h3>Filter Assets</h3>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Asset Type</InputLabel>
              <Select
                label="Asset Type"
                value={filters.assetType}
                onChange={(event: SelectChangeEvent<string>) =>
                  setFilters({ ...filters, assetType: event.target.value })
                }
              >
                <MenuItem value="">All</MenuItem>
                {[...new Set(assets.map((asset) => asset.assetType))].map(
                  (type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Asset Name"
              name="assetName"
              variant="outlined"
              value={filters.assetName}
              onChange={handleFilterChange}
            />

            <TextField
              fullWidth
              type="date"
              label="Purchased Before"
              name="purchaseDateBefore"
              InputLabelProps={{ shrink: true }}
              value={filters.purchaseDateBefore}
              onChange={handleFilterChange}
            />

            <TextField
              fullWidth
              type="date"
              label="Purchased After"
              name="purchaseDateAfter"
              InputLabelProps={{ shrink: true }}
              value={filters.purchaseDateAfter}
              onChange={handleFilterChange}
            />

            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                setFilters({
                  assetType: "",
                  assetName: "",
                  purchaseDateBefore: "",
                  purchaseDateAfter: "",
                })
              }
            >
              Reset Filters
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Filtered Assets Table */}
      {filteredAssets.length > 0 &&
        Object.values(filters).some((filter) => filter) && (
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 2,
                }}
              >
                <h3>Matching Results</h3>
              </Box>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Select</TableCell>
                      <TableCell>Asset Name</TableCell>
                      <TableCell>Asset Type</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Purchase Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredAssets.map((asset) => (
                      <TableRow key={asset.assetNumber}>
                        <TableCell>
                          <input
                            type="checkbox"
                            onChange={(event) => {
                              const isChecked = event.target.checked;
                              setFilteredAssets((prev) =>
                                prev.map((a) =>
                                  a.assetNumber === asset.assetNumber
                                    ? { ...a, selected: isChecked }
                                    : a
                                )
                              );
                            }}
                          />
                        </TableCell>
                        <TableCell>{asset.assetName}</TableCell>
                        <TableCell>{asset.assetType}</TableCell>
                        <TableCell>{asset.location}</TableCell>
                        <TableCell>{asset.purchaseDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {filteredAssets.some((asset) => asset.selected) && (
                <Box sx={{ marginTop: 2, textAlign: "right" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      const selectedAssets = filteredAssets.filter(
                        (asset) => asset.selected
                      );
                      setBucketedAssets((prev) => [...prev, ...selectedAssets]);
                      setFilteredAssets((prev) =>
                        prev.map((asset) => ({ ...asset, selected: false }))
                      );
                    }}
                  >
                    Add
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        )}

      {/* Added Assets Table */}

      <Card>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 2,
            }}
          >
            <h3>Selected Assets</h3>
          </Box>
          
          <TableContainer component={Paper}>
          
                      <React.Fragment>
                        {bucketedAssets.length > 0 ? (
                          <>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "right",
                                gap: 2,
                                marginBottom: 2,
                                padding:1,
                              }}
                            >
                              <FormControl sx={{ minWidth: 200 }}>
                                <InputLabel>Location</InputLabel>
                                <Select
                                  value={location}
                                  label="Location"
                                  onChange={(event: SelectChangeEvent<string>) => {
                                    setLocation(event.target.value as string);
                                  }}
                                >
                                  <MenuItem value="">Select Location</MenuItem>
                                  <MenuItem value="Pune">Pune</MenuItem>
                                  <MenuItem value="Bangalore">Bangalore</MenuItem>
                                </Select>
                              </FormControl>
                              <FormControl sx={{ minWidth: 200 }}>
                                <InputLabel>Department</InputLabel>
                                <Select
                                  value={department}
                                  label="Department"
                                  onChange={(event: SelectChangeEvent<string>) => {
                                    setDepartment(event.target.value as string);
                                  }}
                                >
                                  <MenuItem value="">Select Department</MenuItem>
                                  <MenuItem value="HR">HR</MenuItem>
                                  <MenuItem value="IT">IT</MenuItem>
                                  <MenuItem value="Finance">Finance</MenuItem>
                                  <MenuItem value="Travel">Travel</MenuItem>
                                  <MenuItem value="Operations">Operations</MenuItem>
                                  <MenuItem value="Marketing">Marketing</MenuItem>
                                  <MenuItem value="Sales">Sales</MenuItem>
                                </Select>
                              </FormControl>
                            </Box>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell>Asset Name</TableCell>
                                  <TableCell>Asset Type</TableCell>
                                  <TableCell>Location</TableCell>
                                  <TableCell>Purchase Date</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {bucketedAssets.map((asset) => (
                                  <TableRow key={asset.assetNumber}>
                                    <TableCell>{asset.assetName}</TableCell>
                                    <TableCell>{asset.assetType}</TableCell>
                                    <TableCell>{asset.location}</TableCell>
                                    <TableCell>{asset.purchaseDate}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                            <Box sx={{ padding: 1, marginTop: 2, textAlign: "right" }}>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={handleCreateTransferRequest}
                              >
                                Create Request
                              </Button>
                            </Box>
                          </>
                        ) : (
                          <Typography variant="body1" align="left" sx={{ padding: 2 }}>
                            Selected Assets will appear here. Search and click Add button
                            to select.
                          </Typography>
                        )}
                      </React.Fragment>
                    </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AssetTransfer;
