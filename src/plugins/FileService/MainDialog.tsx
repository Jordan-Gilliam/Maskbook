import {
    DialogContent,
    DialogProps,
    DialogTitle,
    IconButton,
    makeStyles,
    Typography,
    Button,
    Grid,
} from '@material-ui/core'
import React from 'react'
import { Entry } from './components'
import { useStylesExtends } from '../../components/custom-ui-helper'
import { DialogDismissIconUI } from '../../components/InjectedComponents/DialogDismissIcon'
import ShadowRootDialog from '../../utils/jss/ShadowRootDialog'
import { displayName } from './constants'

interface Props
    extends withClasses<
        | KeysInferFromUseStyles<typeof useStyles>
        | 'dialog'
        | 'backdrop'
        | 'container'
        | 'paper'
        | 'input'
        | 'header'
        | 'content'
        | 'close'
        | 'button'
        | 'label'
        | 'switch'
    > {
    open: boolean
    onConfirm: () => void
    onDecline: () => void
    DialogProps?: Partial<DialogProps>
}

const useStyles = makeStyles({
    MUIInputRoot: {
        minHeight: 108,
        flexDirection: 'column',
        padding: 10,
        boxSizing: 'border-box',
    },
    MUIInputInput: {
        fontSize: 18,
        minHeight: '8em',
    },
    title: { marginLeft: 6 },
    container: { width: '100%' },
    content: { padding: 12, background: '#fff' },
    insert: {
        justifyContent: 'center',
        background: '#9ED2F7',
        borderRadius: 26,
        marginTop: 24,
    },
})

const MainDialog: React.FC<Props> = (props) => {
    const classes = useStylesExtends(useStyles(), props)
    return (
        <ShadowRootDialog
            className={classes.dialog}
            classes={{
                container: classes.container,
                paper: classes.paper,
            }}
            open={props.open}
            scroll="paper"
            fullWidth
            maxWidth="sm"
            disableAutoFocus
            disableEnforceFocus
            BackdropProps={{ className: classes.backdrop }}
            {...props.DialogProps}>
            <DialogTitle className={classes.header}>
                <IconButton classes={{ root: classes.close }} onClick={props.onDecline}>
                    <DialogDismissIconUI />
                </IconButton>
                <Typography className={classes.title} display="inline" variant="inherit" children={displayName} />
            </DialogTitle>
            <DialogContent className={classes.content}>
                <Entry />
                <Grid container justify="center">
                    <Button className={classes.insert} variant="contained" color="primary" disabled>
                        Insert
                    </Button>
                </Grid>
            </DialogContent>
        </ShadowRootDialog>
    )
}

export default MainDialog