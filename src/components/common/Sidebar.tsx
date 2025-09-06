import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  type CSSProperties,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import HomeIcon from "@mui/icons-material/Home";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import { NavLink } from "react-router-dom";

interface SidebarProps {
  drawerWidth: number;
  mobileOpen: boolean;
  handleDrawerClose: () => void;
  handleDrawerToggle: () => void;
  handleDrawerTransitionEnd: () => void;
}

interface menuItem {
  text: string;
  path: string;
  icon: React.ComponentType;
}

const Sidebar = ({
  drawerWidth,
  mobileOpen,
  handleDrawerClose,
  handleDrawerToggle,
  handleDrawerTransitionEnd,
}: SidebarProps) => {

  const MenuItems: menuItem[] = [
    { text: "Home", path: "/", icon: HomeIcon },
    { text: "Report", path: "/report", icon: EqualizerIcon },
  ];

  const baseLinkStyle: CSSProperties = {//表示中のリンクのスタイル
    textDecoration: "none",//下線を消す
    color: "inherit", //リンクの色を継承
    display: "block", //ブロック要素にする
  };

  const activeLinkStyle: CSSProperties = {//選択中のリンクのスタイル
    backgroundColor: "rgba(0,0,0,0.08)"
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {MenuItems.map((item, index) => (
          <NavLink key={item.text}to={item.path} style={({ isActive }) => {
            return{
              ...baseLinkStyle,//オブジェクトの中の様子が展開される
              ...(isActive ? activeLinkStyle : {})//アクティブ時はこちらが適用される
            };
          }}>
            <ListItem key={index} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}  */}
                  {/* 奇数偶数でアイコンを切り替え */}
                  <item.icon /> {/* アイコンを表示 */}
                </ListItemIcon>
                <ListItemText primary={item.text} /> {/* テキストを表示 */}
              </ListItemButton>
            </ListItem>
          </NavLink>
        ))}
      </List>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      aria-label="mailbox folders"
    >
      {/* モバイル用 */}
      <Drawer
        variant="temporary"
        open={mobileOpen} // trueの時は開く
        onTransitionEnd={handleDrawerTransitionEnd}
        onClose={handleDrawerClose}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
        slotProps={{
          root: {
            keepMounted: true, // Better open performance on mobile.
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* PC用 */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
