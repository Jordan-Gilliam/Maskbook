import React, { useState } from 'react'
import classNames from 'classnames'
import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
    Box,
    Fade,
    Divider,
    useMediaQuery,
} from '@material-ui/core'
import { makeStyles, Theme, ThemeProvider, useTheme } from '@material-ui/core/styles'
import { Link, useRouteMatch } from 'react-router-dom'
import { useInterval } from 'react-use'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import SentimentSatisfiedOutlinedIcon from '@material-ui/icons/SentimentSatisfiedOutlined'
import { useModal } from '../Dialogs/Base'
import { DashboardFeedbackDialog } from '../Dialogs/Feedback'
import { useI18N } from '../../../utils/i18n-next-ui'
import { cloneDeep, merge } from 'lodash-es'
import Logo from './MaskbookLogo'

interface CarouselProps {
    items: React.ReactElement[]
    delay?: number
}

function Carousel({ items, delay = 1e4 }: CarouselProps) {
    const [current, setCurrent] = useState(0)

    useInterval(() => setCurrent((c) => c + 1), delay)
    return (
        <>
            {items.map((item, i) => (
                <Fade in={current % items.length === i} key={i}>
                    {item}
                </Fade>
            ))}
        </>
    )
}

const useStyles = makeStyles((theme) => ({
    drawer: {
        height: '100%',
        display: 'grid',
        gridTemplateRows: '[drawerHeader] 0fr [drawerList] auto [drawerFooter] 0fr',
        width: 250,
        color: 'white',
        overflow: 'visible',
        position: 'relative',
        [theme.breakpoints.down('xs')]: {
            color: theme.palette.text.primary,
            width: '100%',
        },
    },
    drawerHeader: {
        color: 'white',
        padding: theme.spacing(4, 2, 3, 4),
        backgroundColor: 'var(--drawerHeader)',
    },
    drawerBody: {
        backgroundColor: 'var(--drawerBody)',
    },
    maskDescription: {
        fontSize: 14,
        lineHeight: '24px',
        marginTop: 6,
        display: 'block',
    },
    drawerList: {
        padding: 0,
    },
    drawerItem: {
        borderLeft: 'solid 5px var(--drawerBody)',
        paddingTop: 16,
        paddingBottom: 16,
        [theme.breakpoints.down('xs')]: {
            borderLeft: 'none',
            padding: theme.spacing(3, 0),
        },
    },
    drawerItemIcon: {
        [theme.breakpoints.down('xs')]: {
            color: theme.palette.type === 'light' ? theme.palette.primary.main : theme.palette.text.primary,
        },
    },
    drawerItemText: {
        margin: 0,
        fontWeight: 500,
    },
    drawerItemTextPrimary: {
        [theme.breakpoints.down('xs')]: {
            fontSize: 16,
        },
    },
    drawerFeedback: {
        borderLeft: 'none',
    },
    slogan: {
        color: theme.palette.type === 'light' ? '#A1C1FA' : '#3B3B3B',
        opacity: 0.5,
        width: 316,
        height: 260,
        left: 48,
        bottom: 30,
        fontWeight: 'bold',
        fontSize: 40,
        lineHeight: 1.2,
        letterSpacing: -0.4,
        position: 'absolute',
        transitionDuration: '2s',
    },
}))

const drawerTheme = (theme: Theme): Theme =>
    merge(cloneDeep(theme), {
        overrides: {
            MuiListItem: {
                root: {
                    '&$selected$selected': {
                        borderLeftColor:
                            theme.palette.type === 'dark' ? theme.palette.primary.light : 'var(--drawerBody)',
                        backgroundColor:
                            theme.palette.type === 'dark' ? theme.palette.primary.dark : theme.palette.primary.light,
                    },
                },
            },
            MuiListItemIcon: {
                root: {
                    justifyContent: 'center',
                    color: 'unset',
                },
            },
            MuiListItemText: {
                primary: {
                    fontSize: 14,
                    lineHeight: '24px',
                    fontWeight: 500,
                },
            },
        },
    })

interface DrawerProps {
    routers: readonly (readonly [string, string, JSX.Element])[]
    exitDashboard: null | (() => void)
}

export default function Drawer(props: DrawerProps) {
    const { t } = useI18N()
    const classes = useStyles()
    const theme = useTheme()
    const match = useRouteMatch('/:param/')
    const forSetupPurpose = match?.url.includes('/setup')
    const xsMatched = useMediaQuery((theme: Theme) => theme.breakpoints.down('xs'), {
        defaultMatches: webpackEnv.perferResponsiveTarget === 'xs',
    })

    const { routers, exitDashboard } = props
    const [feedback, openFeedback] = useModal(DashboardFeedbackDialog)

    return (
        <ThemeProvider theme={drawerTheme}>
            <nav className={classes.drawer}>
                {xsMatched ? null : (
                    <Box className={classes.drawerHeader} style={{ backgroundColor: `var(--drawerBody)` }}>
                        <Logo />
                        <Typography
                            className={classes.maskDescription}
                            color={theme.palette.type === 'dark' ? 'textSecondary' : 'inherit'}
                            variant="caption">
                            Make Privacy Protected Again
                        </Typography>
                    </Box>
                )}
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    className={classes.drawerBody}>
                    {forSetupPurpose ? null : (
                        <>
                            <List className={classes.drawerList}>
                                {routers.map((item, index) => (
                                    <React.Fragment key={index}>
                                        <ListItem
                                            className={classes.drawerItem}
                                            selected={match ? item[1].startsWith(match.url) : false}
                                            component={Link}
                                            to={item[1]}
                                            button>
                                            <ListItemIcon
                                                className={classes.drawerItemIcon}
                                                children={item[2]}></ListItemIcon>
                                            <ListItemText
                                                className={classes.drawerItemText}
                                                primary={item[0]}
                                                primaryTypographyProps={{ className: classes.drawerItemTextPrimary }}
                                            />
                                            {xsMatched ? (
                                                <ListItemIcon>
                                                    <ChevronRightIcon color="action" />
                                                </ListItemIcon>
                                            ) : null}
                                        </ListItem>
                                        {xsMatched ? <Divider /> : null}
                                    </React.Fragment>
                                ))}
                            </List>
                            <List className={classes.drawerList}>
                                <ListItem
                                    className={classNames(classes.drawerItem, classes.drawerFeedback)}
                                    button
                                    onClick={openFeedback}>
                                    <ListItemIcon
                                        className={classes.drawerItemIcon}
                                        children={<SentimentSatisfiedOutlinedIcon fontSize="small" />}
                                    />
                                    <ListItemText
                                        className={classes.drawerItemText}
                                        primary={t('feedback')}
                                        primaryTypographyProps={{ className: classes.drawerItemTextPrimary }}
                                    />
                                    {xsMatched ? (
                                        <ListItemIcon>
                                            <ChevronRightIcon color="action" />
                                        </ListItemIcon>
                                    ) : null}
                                </ListItem>
                                {xsMatched ? <Divider /> : null}
                            </List>
                            {feedback}
                        </>
                    )}
                </Box>
                {forSetupPurpose ? (
                    <Carousel
                        items={[
                            <Typography className={classes.slogan}>
                                Post on social networks without allowing the corporations to stalk you.
                            </Typography>,
                            <Typography className={classes.slogan}>Take back our online privacy.</Typography>,
                            <Typography className={classes.slogan}>
                                Neutralize the surveillance from tech giants.
                            </Typography>,
                        ]}></Carousel>
                ) : null}
            </nav>
        </ThemeProvider>
    )
}
