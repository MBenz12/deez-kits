import { Box, List, ListItem, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import style from "../../../pages/deezkits/deezkits.module.scss";
import { deezkitsFooter } from "../../../utils/config";

const DeezkitsFooter = () => {
  return (
    <>
      <Box className={style.footer_content}>
        <List
          className={style.footer_navlinks}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 0,
            paddingBottom: 0,
          }}
        >
          {deezkitsFooter.map((link, index) => (
            <ListItem
              key={index}
              sx={{
                width: "auto",
                paddingTop: 0,
                paddingBottom: 0,
                background: "transparent!important",
              }}
            >
              {link?.tagName !== "Link" ? (
                <a
                  href={link?.path}
                  className={link?.isActive ? "" : style.disable_link}
                  target={link?.target}
                >
                  {link?.name}
                </a>
              ) : (
                <Link to={link?.path}> {link?.name}</Link>
              )}
            </ListItem>
          ))}
        </List>
        <Typography component="p">
          © 2022 DEEZKITS. All rights reserved
        </Typography>
      </Box>
    </>
  );
};

export default DeezkitsFooter;
