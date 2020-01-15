import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Cookies from 'universal-cookie';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width: '100%'
  },
  title: {
    flexGrow: 1,
  },
}));

function logout() {
  const cookies = new Cookies();
  cookies.remove('token');
  window.location.href = './';
}
export default function ButtonAppBar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar id="appbar" position="fixed">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Заболотских Роман | Ерухимова Анастасия P3200 | Вариант 200047
          </Typography>
          <Button color="inherit" onClick={logout}>Выход</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}
