import { MenuOutlined } from "@ant-design/icons";
import { Button, Divider, Drawer, Select } from "antd";
import { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CountryContext } from "../context/country-context";

const Header = () => {
  const location = useLocation();
  const { Option } = Select;

  const { userCountry, changeCountry } = useContext(CountryContext); // Use changeCountry
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // State for mobile menu

  const links = [
    { name: "Home", href: "/" },
    { name: "Our Story", href: "/our-story" },
    { name: "Contact Us", href: "/contact" },
  ];

  const activeLink = links.find((link) => link.href === location.pathname);

  return (
    <div className="bg-[#AF1313] h-28">
      <div className="container mx-auto flex items-center justify-between px-5 lg:px-20">
        {/* Logo */}
        <Link to="/">
          <img
            src="/nana-logo.png"
            alt="nana-logo"
            className="h-20 w-42 my-5"
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex mr-20">
          <ul className="flex space-x-5 text-white items-center">
            {links.map((link) => (
              <li key={link.name}>
                <Link
                  className={
                    activeLink === link ? "text-slate-400 transition-all" : ""
                  }
                  to={link.href}
                >
                  {link.name}
                </Link>
                {activeLink === link && (
                  <div className="h-[0.7px] w-full bg-slate-400 mt-2 cursor-pointer"></div>
                )}
              </li>
            ))}
            <Divider type="vertical" className="h-10 bg-white" />
            <li>
              <Button
                className="bg-white text-black rounded-md px-3"
                onClick={() => setDropdownVisible((prev) => !prev)}
              >
                {userCountry || "Select Country"}
              </Button>
              {dropdownVisible && (
                <Select
                  className="ml-3"
                  defaultValue={userCountry}
                  style={{ width: 180 }}
                  onChange={(value) => changeCountry(value)} // Use changeCountry here
                >
                  <Option value="USA">USA</Option>
                  <Option value="GHANA">GHANA</Option>
                </Select>
              )}
            </li>
          </ul>
        </div>

        {/* Mobile Menu Icon */}
        <div className="lg:hidden">
          <Button
            icon={<MenuOutlined />}
            className="text-white bg-transparent border-none text-xl"
            onClick={() => setMenuOpen(true)}
          />
        </div>

        {/* Mobile Menu Drawer */}
        <Drawer
          title="Menu"
          placement="right"
          onClose={() => setMenuOpen(false)}
          open={menuOpen}
        >
          <ul className="flex flex-col space-y-4 text-black">
            {links.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.href}
                  onClick={() => setMenuOpen(false)} // Close drawer on link click
                >
                  {link.name}
                </Link>
              </li>
            ))}
            <Divider />
            <li>
              <Button
                className="bg-black text-white rounded-md px-3"
                onClick={() => setDropdownVisible((prev) => !prev)}
              >
                {userCountry || "Select Country"}
              </Button>
              {dropdownVisible && (
                <Select
                  className="ml-3 mt-2"
                  defaultValue={userCountry}
                  style={{ width: 180 }}
                  onChange={(value) => changeCountry(value)} // Use changeCountry here
                >
                  <Option value="USA">USA</Option>
                  <Option value="GHANA">GHANA</Option>
                </Select>
              )}
            </li>
          </ul>
        </Drawer>
      </div>
    </div>
  );
};

export default Header;
