import { Avatar, IconButton, makeStyles, Paper, Typography } from '@material-ui/core'
import UserIcon from "../images/user.png"
import React from 'react'
import { Delete } from '@material-ui/icons'

const useStyles = makeStyles((theme) => ({
    root: {
        padding: "20px",
        position: "relative"
    },
    settings: {
        position: "absolute",
        top: "12px",
        right: "12px"
    },
    avatarDiv: {
        display: 'flex',
        '& > *': {
            margin: "20px auto",
        },
    },
    large: {
        width: theme.spacing(10),
        height: theme.spacing(10)
    }
}))

export default function UserCard(props) {
    const classes = useStyles();
    const handleDelete = (userId) => {
        const confirmed = window.confirm("Do you want to delete this user?")
        if (confirmed) {
          props.deleteUser(userId);
        }
      }

    return <Paper elevation={3} className={classes.root}>
        <IconButton onClick={() => handleDelete(props.id)} className={classes.settings}><Delete /></IconButton>
        <div className={classes.avatarDiv}>
            <Avatar alt="profile image" src={props.fileUrl || UserIcon} className={classes.large} />
        </div>
        <div>
            <Typography align="center" variant={"h5"} gutterBottom>
                {props.firstname} {props.lastname}
            </Typography>
        </div>
    </Paper>
}