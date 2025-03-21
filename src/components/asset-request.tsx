import React, { useState, useEffect } from "react";
import {
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Button,
  Grid,
  Card,
  CardContent,
} from "@mui/material";

interface Asset {
  id: string;
  assetType: string;
  assetName: string;
  purchaseDate: string;
  availableToTransfer: boolean;
  initialDepartment: string;
  currentDepartment: string;
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
    fetch("../data/assets.json")
      .then((response) => response.json())
      .then((data: Asset[]) => setAssets(data));
  }, []);

  useEffect(() => {
    let filtered = assets.filter((asset) => asset.availableToTransfer);
    if (filters.assetType) {
      filtered = filtered.filter((asset) => asset.assetType === filters.assetType);
    }
    if (filters.assetName) {
      filtered = filtered.filter((asset) => asset.assetName.includes(filters.assetName));
    }
    if (filters.purchaseDateBefore) {
      filtered = filtered.filter((asset) => new Date(asset.purchaseDate) < new Date(filters.purchaseDateBefore));
    }
    if (filters.purchaseDateAfter) {
      filtered = filtered.filter((asset) => new Date(asset.purchaseDate) > new Date(filters.purchaseDateAfter));
    }
    setFilteredAssets(filtered);
  }, [filters, assets]);

  const handleFilterChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = event.target;
    setFilters({ ...filters, [name as string]: value });
  };

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Asset Type</InputLabel>
              <Select name="assetType" value={filters.assetType} onChange={handleFilterChange}>
                <MenuItem value="">All</MenuItem>
                {[...new Set(assets.map((asset) => asset.assetType))].map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Asset Name"
              name="assetName"
              value={filters.assetName}
              onChange={handleFilterChange}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              type="date"
              label="Purchased Before"
              name="purchaseDateBefore"
              InputLabelProps={{ shrink: true }}
              value={filters.purchaseDateBefore}
              onChange={handleFilterChange}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              type="date"
              label="Purchased After"
              name="purchaseDateAfter"
              InputLabelProps={{ shrink: true }}
              value={filters.purchaseDateAfter}
              onChange={handleFilterChange}
            />
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={() => setFilters({
              assetType: "",
              assetName: "",
              purchaseDateBefore: "",
              purchaseDateAfter: "",
            })}>
              Reset Filters
            </Button>
          </Grid>

          <Grid item xs={12}>
            <ul>
              {filteredAssets.map((asset) => (
                <li key={asset.id}>{`${asset.assetName} (${asset.assetType}) - ${asset.currentDepartment}`}</li>
              ))}
            </ul>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default AssetTransfer;
