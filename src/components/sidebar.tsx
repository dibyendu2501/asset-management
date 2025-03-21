import { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

// Define feature menu items
const features = [
  { name: "Dashboard", path: "/dashboard", subFeatures: [] },
  {
    name: "Asset Evaluation",
    path: "",
    subFeatures: [
      { name: "Search", path: "/assets/search" },
      { name: "Depreciation Calculation", path: "/assets/depreciation" },
    ],
  },
  {
    name: "Asset Transfer",
    path: "",
    subFeatures: [
      { name: "Create Request", path: "/transfer/request" },
      { name: "Approve Transfer", path: "/transfer/approve" },
    ],
  },
];

export default function Sidebar() {
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
  const navigate = useNavigate();

  const toggleMenu = (feature: string) => {
    setOpenMenus((prev) => ({ ...prev, [feature]: !prev[feature] }));
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
          backgroundColor: "white",
          color: "black",
        },
      }}
    >
      <List>
        {features.map((feature) => (
          <div key={feature.name}>
            <ListItem disablePadding>
              <ListItemButton onClick={() => (feature.path ? navigate(feature.path) : toggleMenu(feature.name))}>
                <ListItemText primary={feature.name} />
                {feature.subFeatures.length > 0 && (openMenus[feature.name] ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>
            </ListItem>
            <Collapse in={openMenus[feature.name]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {feature.subFeatures.map((sub) => (
                  <ListItemButton key={sub.path} sx={{ pl: 4 }} onClick={() => navigate(sub.path)}>
                    <ListItemText primary={sub.name} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </div>
        ))}
      </List>
    </Drawer>
  );
}
