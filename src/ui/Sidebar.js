import {
  HomeIcon,
  CalendarIcon,
  ListBulletIcon,
  GlobeAltIcon,
  VideoCameraIcon,
  HeartIcon,
  FireIcon,
  CheckBadgeIcon,
  TrashIcon,
  CubeIcon,
  CogIcon,
  ViewfinderCircleIcon,
  Cog6ToothIcon,
  ChatBubbleBottomCenterIcon,
  InboxIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { useLanguage } from "../context/uselang";
import { useState } from "react";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";

const data = [
  {
    id: "1",
    label: "Todo",
    icon: <CheckBadgeIcon />,
  },
  {
    id: "2",
    label: "Health",
    icon: <HeartIcon fill="#4672E4" stroke="" />,
  },
  {
    id: "3",
    label: "WellBeing",
    icon: <StarIcon fill="#7289DA" stroke="" />,
  },
  {
    id: "4",
    label: "Meetings",
    icon: <VideoCameraIcon fill="#10C257" stroke="" />,
  },
  {
    id: "5",
    label: "Habits",
    icon: <FireIcon fill="#FF3838" stroke="" />,
  },
];

const ActionMenu = [
  {
    id: 2,
    label: "Create Widgets",
    icon: <CubeIcon />,
  },
  {
    id: 3,
    label: "Settings",
    icon: <Cog6ToothIcon />,
    actions: () => {},
  },
  {
    id: 4,
    label: "Comments",
    icon: <InboxIcon />,
    actions: () => {},
  },
];

function Links({ label, icon }) {
  return (
    <a href="#" className="links flex center">
      <div className="icon">{icon}</div>

      <div>{label}</div>
    </a>
  );
}

function Sidebar() {
  const { language, changeLanguage } = useLanguage();
  const [display, setDisplay] = useState(true);
  return (
    <>
      <button
        style={{
          position: "absolute",
          left: display ? "200px" : "4px",
          bottom: "40px",
          width: "35px",
          background: "#f4f4f4",
          border: "1px solid rgba(0, 0, 0, 0.4)",
          borderRadius: "4px",
          cursor: "pointer",
        }}
        onClick={() => setDisplay(!display)}
      >
        <HamburgerMenuIcon />
      </button>
      {display && (
        <div className="sidebar">
          <a
            href="#"
            style={{ background: "#222", color: "#fff" }}
            className="links flex center"
          >
            <div className="icon">
              <CalendarIcon />
            </div>

            <div>Coolhead</div>
          </a>
          <hr />

          {data.map((e) => (
            <Links key={e.id} {...e} />
          ))}
          <hr />

          {ActionMenu.map((e) => (
            <Links key={e.id} {...e} />
          ))}
        </div>
      )}
    </>
  );
}

export default Sidebar;
