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
}

const AssetTransfer: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [filters, setFilters] = useState({
    assetType: "",
    assetName: "",
    purchaseDateBefore: "",
    purchaseDateAfter: "",
  });

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
        asset.assetName.includes(filters.assetName)
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

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <Card>
      <CardContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <FormControl>
          <InputLabel>Requesting Location</InputLabel>
          <Select
          name="location"
          onChange={(event: SelectChangeEvent<string>) => {
            console.log("Selected Department:", event.target.value);
          }}
          >
          <MenuItem value="">Select Location</MenuItem>
          <MenuItem value="Pune">Pune</MenuItem>
          <MenuItem value="Bangalore">Bangalore</MenuItem>
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel>Requesting Department</InputLabel>
          <Select
          name="currentDepartment"
          onChange={(event: SelectChangeEvent<string>) => {
            console.log("Selected Department:", event.target.value);
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
        <FormControl fullWidth>
          <InputLabel>Asset Type</InputLabel>
          <Select
          name="assetType"
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

      {filteredAssets.length > 0 &&
      Object.values(filters).some((filter) => filter) && (
        <Card>
        <CardContent>
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
                  console.log(
                  `Asset ${asset.assetNumber} selected:`,
                  event.target.checked
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
        </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default AssetTransfer;
