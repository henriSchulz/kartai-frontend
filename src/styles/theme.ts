import {createTheme} from "@mui/material";
export const theme = createTheme({
    typography: {
        h4: {
            fontWeight: 550,
            fontSize: 30
        },
        h3: {
            fontWeight: 550,
        },
        button: {
            textTransform: 'none',
        }
    },
    palette: {
        primary: {
            main: "#218F82"
        },

        secondary: {
            main: "#21658F"
        },
    },
    components: {
        MuiButton: {
            defaultProps: {
                disableElevation: true
            },
            styleOverrides: {
                contained: {
                    borderRadius: "8px",
                    fontSize: "1rem",
                    paddingLeft: 20,
                    paddingRight: 20,
                },


                outlined: {
                    borderRadius: "8px",
                    fontSize: "1rem",
                    paddingLeft: 20,
                    paddingRight: 20,
                    backgroundColor: "transparent",
                    border: "1px solid #E4EAF2",
                    p: 1,
                    "&:hover": {
                        backgroundColor: "#F4F6F9",
                        borderColor: "#C7D0DD"
                    },
                }
            }
        },
        MuiIconButton: {
            defaultProps: {
                disableRipple: true,
            }
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: "white",
                    backgroundImage: "linear-gradient(to right top, rgba(240, 247, 255, 0.3) 40%, rgba(243, 246, 249, 0.2) 100%)",
                    boxShadow: "none",
                    borderBottom: "1px solid #E4EAF2"
                }
            }
        },

        MuiDrawer: {
            styleOverrides: {
                root: {
                    backgroundColor: "transparent",
                    backgroundImage: "linear-gradient(to right top, rgba(240, 247, 255, 0.3) 40%, rgba(243, 246, 249, 0.2) 100%)",
                    boxShadow: "none",
                    borderRight: "1px solid #E4EAF2"
                }
            }
        },
        MuiMenuItem: {
            defaultProps: {
                disableRipple: true
            },
            styleOverrides: {
                root: {
                    fontSize: "1rem",
                    paddingLeft: 20,
                    paddingRight: 20,
                    backgroundColor: "transparent",
                    p: 1,
                    "&:hover": {
                        backgroundColor: "#F4F6F9",
                        borderColor: "#C7D0DD"
                    },
                }
            }
        },
        MuiListItemIcon: {
            styleOverrides: {
                root: {
                    color: "#6F6F6F"
                    // color: "#218F82"
                }
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    boxShadow: "none",
                    backgroundColor: "fff",
                    border: "1px solid #E4EAF2",
                    overflowY: "hidden"
                }
            }
        }
    }
})