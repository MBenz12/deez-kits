import React, { useEffect } from "react";
import { Button, Box, List, ListItem } from "@mui/material";
import style from "../assets/css/mobileMenu.module.scss";
import ImageUI from "./ImageUI";
import { Images } from "../static/images";
import { headerLinks } from "../utils/config";
import { Link } from "react-router-dom";

const MobileMenu = ({ viewMobileMenu, setViewMobileMenu }) => {
  useEffect(() => {
    const Body = document.querySelector("body");
    if (viewMobileMenu) {
      Body.classList.add("overflow-hidden");
    } else {
      Body.classList.remove("overflow-hidden");
    }
  }, [viewMobileMenu]);

  const HeaderNavLinks = ({ NavLinksArr }) => {
    return (
      <span className="mobile_view">
        <List
          className={`${style.header_link_container} `}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: "20px",
            paddingBottom: 0,
          }}
        >
          {NavLinksArr.map((link, index) => (
            <ListItem
              key={index}
              className={`${style.nav_link} ${
                !link.isActive ? style.disable_link : ""
              }`}
            >
              <Box className={style.hover_bg}></Box>
              {link.tagName !== "Link" ? (
                <a
                  href={link?.path}
                  target={link?.target}
                  onClick={() => setViewMobileMenu(false)}
                >
                  {link?.name}
                </a>
              ) : (
                <Link to={link?.path} onClick={() => setViewMobileMenu(false)}>
                  {link?.name}{" "}
                </Link>
              )}
            </ListItem>
          ))}
        </List>
      </span>
    );
  };
  return (
    <>
      <Box className="mobile_view">
        <Button
          color="secondary"
          className={style.menu_btn_closed}
          onClick={() => setViewMobileMenu(!viewMobileMenu)}
          sx={{
            display: "inline-grid",
            background: "#ab2626",
            position: "fixed",
            zIndex: "999",
            height: "43px",
            width: "35px",
            minWidth: "47px",
          }}
        >
          <p />
          <p />
          <p />
        </Button>
      </Box>
      {viewMobileMenu && (
        <Box
          className={`${style.header_wrapper} ${
            viewMobileMenu ? style.menu_open : ""
          }`}
        >
          <Box className={style.header_main}>
            <Box className={style.deezkits_header_img}>
              <ImageUI
                src={Images?.MobileMenuLogo}
                alt="deezkits"
                className="mobile_view"
              />
            </Box>
            <Button
              color="secondary"
              className={style.menu_btn}
              onClick={() => setViewMobileMenu(!viewMobileMenu)}
            >
              <p />
              <p />
              <p />
            </Button>
            <Box className={style.nav_links_wrap}>
              <HeaderNavLinks NavLinksArr={headerLinks} />
            </Box>
            <Box className={style.mobile_menu_social}>
              <a
                href="https://discord.gg/deezkits"
                target="_parent"
                rel="noreferrer"
              >
                <ImageUI
                  src={Images?.discordIcon}
                  alt="discord"
                  className={style.discord_icon}
                />
              </a>
              <a
                href="https://twitter.com/deezkits"
                target="_blank"
                rel="noreferrer"
              >
                <ImageUI src={Images?.twitterIcon} alt="twitter" />
              </a>
              <a
                href="/"
                target="_parent"
                rel="noreferrer"
                className={style.me_icon}
              >
                <ImageUI src={Images?.MeIcon} alt="magic-eden" />
              </a>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};
export default MobileMenu;
