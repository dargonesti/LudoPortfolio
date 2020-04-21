/*eslint eqeqeq:0*/
/*eslint no-mixed-operators:0*/
import React from "react";
import impoHOC from "HoC/impoHOC.js";
import classNames from "classnames";
import { Button, Table, TableRow, TableHead, TableBody, TableCell, Select, InputLabel, Switch } from '@material-ui/core';

import TableSortLabel from '@material-ui/core/TableSortLabel';
import TablePagination from '@material-ui/core/TablePagination';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField';

import withStyles from "@material-ui/core/styles/withStyles";
import Header from "components/Header/Header.jsx";
import Footer from "components/Footer/Footer.jsx";
import Parallax from "components/Parallax/Parallax.jsx";
import SmallerTextField from "views/ImpoCompo/SmallerTextField";

import DAL from "utils/DataAccess/DALimpotx.js";
import utils from "utils/utils.js";
import auth from "utils/auth.js";
import localData from "utils/DataAccess/localData";
import impoTxt from 'texts/localization';


const isDate = (str) => /^\d{4}-\d\d-\d\d$/.test(str);

function desc(a, b, orderBy) {
  if (isDate(a[orderBy]) !== isDate(b[orderBy])) {
    return isDate(b[orderBy]) ? 1 : -1;
  }
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getSorting(order, orderBy) {
  return (a, b) => (order === 'desc' ? 1 : -1) * desc(a, b, orderBy);
}

function filtrerUsers(user) {
  var regFiltre = RegExp(".*(" + utils.escapeRegExp(this.state.filtre) + ").*", "i");
  return rows.some((col) => user[col.id]
    && this.passFiltreIsTest(user._id)
    && (user[col.id].toString().match(regFiltre)
      || this.getEtatCompte(user._id).match(regFiltre)))
}

const CustomTableCell = withStyles(theme => {
  return {
    head: {
      backgroundColor: theme.palette.secondary.light,
      //color: theme.palette.common.white,
      textAlign: "left",
      paddingLeft: 20
    },
    body: {
      fontSize: 14,
    },
  };
}, { withTheme: true })(TableCell);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 500,
  },
  tablePagination: {
    backgroundColor: theme.palette.secondary.light
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
});

const rows = [
  { id: 'username', numeric: false, disablePadding: true, label: impoTxt.findUserName },
  { id: 'email', numeric: true, disablePadding: false, label: impoTxt.findEmail },
  { id: 'createdAt', numeric: true, disablePadding: false, label: impoTxt.findCreated },
  { id: 'lastActivity', numeric: true, disablePadding: false, label: impoTxt.findLastActivity },
  { id: 'repCount', numeric: true, disablePadding: false, label: impoTxt.findRepCount },
  { id: 'isComplete', numeric: false, disablePadding: false, label: impoTxt.findIsComplete },
  { id: 'etatCompte', numeric: true, disablePadding: false, label: impoTxt.findState },
];

class MySortHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { order, orderBy } = this.props;

    if (auth.getToken())
      return (
        <TableHead >
          <TableRow>
            {rows.map(row => {
              return (
                <CustomTableCell
                  key={row.id}
                  align={row.numeric ? "right" : "center"}
                  padding={row.disablePadding ? 'none' : 'default'}
                  sortDirection={orderBy === row.id ? order : false}
                >
                  <Tooltip
                    title="Sort"
                    placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                    enterDelay={300}
                  >
                    <TableSortLabel
                      active={orderBy === row.id}
                      direction={order}
                      onClick={this.createSortHandler(row.id)}
                    >
                      {row.label}
                    </TableSortLabel>
                  </Tooltip>
                </CustomTableCell>
              );
            }, this)}
          </TableRow>
        </TableHead>
      );
    else
      return null;
  }
}

class FindUserPage extends React.Component {

  constructor(props) {
    super(props);

    var annee = DAL.getAnnee();

    this.state = {
      users: Object.values(localData.getStorage("getUsers") ||{}) || [],
      order: 'asc',
      orderBy: 'username',
      selected: [],
      page: 0,
      rowsPerPage: localData.getStorage("findUsersRowsPerPage") || 50,
      filtre: "",
      annee,
      etatsComptes: {},
      etatTests: {},
      showTests: localData.getStorage("findTestUsers")
    };

    this.handleRequestSort = this.handleRequestSort.bind(this);
    this.getIsComplete = this.getIsComplete.bind(this);
    this.passFiltreIsTest = this.passFiltreIsTest.bind(this);
    this.viewUser = this.viewUser.bind(this);

    //this._debouncedState = {};

    DAL.getAdminValPerKey("etatCompte", this.state.annee, true)
      .then(res => {
        utils.throttledSetState.call(this, { etatsComptes: res });
      });

    DAL.getAdminValPerKey("isTest", null, true)
      .then(res => {
        utils.throttledSetState.call(this, { etatTests: res });
      });
  }

  getAnnees() {
    // TODO : Trouver année courrante plutôt que 2018
    // Todo : Min ( 10 ans ou la première réponse de l'utilisateur )
    var ret = [];
    for (var i = 0; i < 10; i++) {
      ret.push((new Date()).getFullYear() - i);
    }
    return ret;
  }
  handleChangeAnnee = event => {
    var newVal = event.target.value;
    this.setState({ annee: newVal });

    DAL.getAdminValPerKey("etatCompte", newVal)
      .then(res => {
        this.setState({ etatsComptes: res });
      });
  }

  getEtatCompte(userId) {
    if (this.state.etatsComptes && userId in this.state.etatsComptes) {
      var valEtat = this.state.etatsComptes[userId]["etatCompte"];
      if (valEtat) valEtat = valEtat.val;
      if (valEtat) return impoTxt["adminEtat" + valEtat];
    }
    return impoTxt.adminEtatUndefined;
  }

  passFiltreIsTest(userId) {
    let target = this.state.showTests ? true : false;
    let usrIsTest = this.state.etatTests;
    usrIsTest = usrIsTest && usrIsTest[userId];
    usrIsTest = usrIsTest && usrIsTest.isTest;
    usrIsTest = !!(usrIsTest && usrIsTest.val);

    return target == usrIsTest;
  }

  getIsComplete(user) {
    var qst = DAL.getQuestion("special-pret-a-faire");
    if (user.reponses && qst) {
      var reps = user.reponses.filter(rep => rep.question === qst._id && rep.annee == this.state.annee);
      if (reps.length > 0 && reps.pop().ouinon) {
        return impoTxt.Oui;
      }
    }
    return "";//impoTxt.Non;
  }

  componentDidMount() {
    DAL.getUsers("ignoreCache!").then(respUsers => {
      this.setState({ users: Object.values(respUsers) });

      utils.refreshReponses();
    });
  }
  // <Collapse collapsedHeight={50} in={false} timeout={{ enter: 666, exit: 2222 }}>

  handleRequestSort = (ev, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };
  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
    localData.setStorage("findUsersRowsPerPage", event.target.value);
  };
  isSelected = id => this.state.selected.indexOf(id) !== -1;

  viewUser(user) {
    localData.setStorage("currentUserId", user._id);
    localData.setStorage("selectedUser", user);

    var oldChatCache = localData.get("chatCache") || {};
    oldChatCache[user._id] = oldChatCache[user._id] || [];
    localData.set("chatCache", oldChatCache);

    utils.callEvent("openChatWithUser", user);

    this.props.setRedirect("/user-summary-page");
  }

  render() {
    const { users, order, orderBy, selected, rowsPerPage, page } = this.state;
    //const emptyRows = rowsPerPage - Math.min(rowsPerPage, users.length - page * rowsPerPage);
    const { classes, ...rest } = this.props;

    return (
      <div>
        <Header
          color="transparent"
          brand="Gnitic"
          fixed
          changeColorOnScroll={{
            height: 10,
            color: "dark"
          }}
          {...rest}
        />

        <Parallax xsmall filter image={require("assets/img/impotx/background2.jpg")} />

        <div className={classNames(classes.main, classes.mainRaised)}>
          <InputLabel htmlFor="age-native-simple">{impoTxt.Annee}</InputLabel>
          <Select
            style={{ marginLeft: 10 }}
            native
            value={this.state.annee}
            onChange={this.handleChangeAnnee}
            inputProps={{
              name: 'annee',
              id: 'age-native-simple',
            }}
          >
            {this.getAnnees()
              .map(annee =>
                <option value={annee} key={annee}>{annee}</option>)}
          </Select>

          <SmallerTextField label={impoTxt.Filtre} value={this.state.filtre}
            style={{ margin: 7 }}
            onChange={val => this.setState({ filtre: val })}
            onKeyDown={(e) => {
              if (e.keyCode == 13) {
                var user = utils.stableSort(
                  this.state.users.filter(filtrerUsers.bind(this)),
                  getSorting(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)[0];

                if (user) {
                  this.viewUser(user);
                }
              }
            }}
            type="text" />

          {impoTxt.findShowTests}
          <Switch
            checked={this.state.showTests}
            onChange={(ev) => {
              var newVal = !this.state.showTests;
              localData.setStorage("findTestUsers", newVal);
              this.setState({ showTests: newVal });
            }} />

          <Table className={classes.table}>

            <MySortHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={users.length}
            />

            <TableBody>
              {utils.stableSort(
                this.state.users.filter(filtrerUsers.bind(this)),
                getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(user => {
                  return (
                    <TableRow className={classes.row} key={user._id}>
                      <CustomTableCell component="th" scope="row">
                        <Button onClick={(ev) => {
                          this.viewUser(user);
                        }}>
                          {user.username}
                        </Button>
                      </CustomTableCell>
                      <CustomTableCell>{user.email}</CustomTableCell>
                      <CustomTableCell>{user.createdAt.split("T")[0]}</CustomTableCell>
                      <CustomTableCell>{user.lastActivity}</CustomTableCell>
                      <CustomTableCell align="right">{user.repCount}</CustomTableCell>
                      <CustomTableCell align="right">{this.getIsComplete(user)}</CustomTableCell>
                      <CustomTableCell>
                        {this.getEtatCompte(user._id)}
                      </CustomTableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50, 100, 200]}
            component="div"
            count={users.length}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              'aria-label': 'Previous Page',
            }}
            nextIconButtonProps={{
              'aria-label': 'Next Page',
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </div>


        <Footer />
      </div>
    );
  }
}

//export default withStyles(profilePageStyle)(FindUserPage);
export default withStyles(styles, { withTheme: true })(impoHOC(FindUserPage, "FindUser"));
