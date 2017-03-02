import React, { Component } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import FontAwesome from 'react-fontawesome';
import './App.css';
import {
  Content,
  CenteredRow,
  Column66,
  HelpBlock,
  CardGroup,
  Cover,
} from './Common';
import Input from './Input';
import FileInput from './FileInput';
import Footer from './Footer';
import CsvDownload from './CsvDownload';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      api: '',
      file: '',
      sql: null,
      showConfirm: false,
      migrating: false,
      migrationDone: false,
      showDownload: false,
      error: {
        api: false,
        sql: false,
        revlo: null,
      },
      showErrorDetails: false,
    };
    this.filePicker = null;
    this.setApi = this.setApi.bind(this);
    this.setFile = this.setFile.bind(this);
    this.migrate = this.migrate.bind(this);
    this.cancel = this.cancel.bind(this);
    this.showMigrateDialog = this.showMigrateDialog.bind(this);
    this.done = this.done.bind(this);
    this.migrateManual = this.migrateManual.bind(this);
    this.toggleErrorDetails = this.toggleErrorDetails.bind(this);
  }

  setApi(api) {
    const error = this.state.error;
    if (api) {
      error.api = false;
      return this.setState({
        api,
        error,
      });
    }
    this.setState({
      api,
    });
  }

  setFile(data) {
    const file = data.name;
    const reader = new FileReader();
    let sql = null;
    reader.onload = () => {
      const uints = new Uint8Array(reader.result);
      const db = new window.SQL.Database(uints);
      const error = this.state.error;
      sql = db.exec('SELECT Name, Points FROM CurrencyUser');
      if (sql) {
        error.sql = false;
        return this.setState({
          error,
          file,
          sql,
        })
      }
      this.setState({
        file,
        sql,
      });
    }
    reader.readAsArrayBuffer(data);
  }

  showMigrateDialog() {
    if (!this.state.api) {
      console.log('api error');
      const error = this.state.error;
      error.api = true;
      return this.setState({error});
    }
    if (!this.state.sql) {
      console.log('sql data error');
      const error = this.state.error;
      error.sql = true;
      return this.setState({error});
    }
    this.setState({
      showConfirm: true,
    })
  }

  cancel() {
    this.setState({
      showConfirm: false,
    });
  }

  done() {
    this.setState({
      api: '',
      file: '',
      sql: null,
      showConfirm: false,
      migrating: false,
      migrationDone: false,
      showDownload: false,
      error: {
        api: false,
        sql: false,
        revlo: null,
      },
      showErrorDetails: false,
    });
  }

  toggleErrorDetails() {
    this.setState({
      showErrorDetails: !this.state.showErrorDetails,
    });
  }

  migrate() {
    this.setState({
      showConfirm: false,
      migrating: true,
    });
    const data = this.state.sql.slice();
    if (data && data.length > 0) {
      const error = this.state.error;
      error.api = false;
      error.sql = false;
      const values = data[0].values;
      if (values) {
        console.log(`${values.length} users to process`);
        values.forEach((user, id) => {
          const name = user[0];
          let points = user[1];
          const error = this.state.error;
          while (points > 1000000) {
            points -= 1000000;
            const req = new Request(`https://api.revlo.co/1/fans/${name}/points/bonus`, {
              method: 'POST',
              body: JSON.stringify({amount: 1000000}),
            });
            req.headers.append('x-api-key', this.state.api);
            fetch(req).then((response) =>
              response.json().then(body => console.log(body))
            ).then((response) => {
              return response;
            }).catch(() => {

            });
          }
          setTimeout(() => {
            const req = new Request(`https://api.revlo.co/1/fans/${name}/points/bonus`, {
              method: 'POST',
              body: JSON.stringify({amount: points}),
            });
            req.headers.append('x-api-key', this.state.api);
            fetch(req).then((response) => {
              if (!response.ok) {
                console.log(response.statusCode);
                if (!error.revlo) {
                  error.revlo = {
                    total: 0,
                    users: [],
                  };
                };
                if (error.revlo[response.status]) {
                  error.revlo[response.status]++;
                } else {
                  error.revlo[response.status] = 1;
                }
                error.revlo.total++;
                error.revlo.users.push(name);
              }
              if (id === values.length - 1) {
                this.setState({
                  migrating: false,
                  migrationDone: true,
                  error,
                });
              }
            }).catch((err) => {
              if (!error.revlo) {
                error.revlo = {
                  total: 0,
                  users: [],
                };
              };
              if (error.revlo[0]) {
                error.revlo[0]++;
              } else {
                error.revlo[0] = 1;
              }
              error.revlo.total++;
              error.revlo.users.push(name);
              if (id === values.length - 1) {
                this.setState({
                  migrating: false,
                  migrationDone: true,
                  error,
                });
              }
            });
          }, id * 300);
        });
      }
    } else {
      const error = this.state.error;
      error.sql = true;
      return this.setState({error});
    }
  }

  migrateManual() {
    this.setState({
      showConfirm: false,
      showDownload: true,
    });
  }

  render() {
    return (
      <div className="App">
        <Content>
          <CenteredRow>
            <Column66>
              <CardGroup className="card-group mb-0">
                <div className="card p-2" style={{ maxWidth: 400 + 'px' }}>
                  <div className="card-block">
                    <h1>Ankh2Revlo</h1>
                    <p className="text-muted">Migrate AnkhBotR2 points to Revlo</p>
                    <div className="mb-1">
                      <Input
                        error={this.state.error.api}
                        iconName="key"
                        placeholder="Revlo API key"
                        value={this.state.api}
                        onChange={(e) => this.setApi(e)}
                        help={(
                          <HelpBlock>Get your Revlo API key <a href="https://www.revlo.co/settings/api" target="_blank">here</a>. (Make sure you logged in to Revlo first)</HelpBlock>
                        )}
                      />
                    </div>
                    <div className="mb-2">
                      <FileInput
                        error={this.state.error.sql}
                        iconName="list"
                        placeholder="AnkhBotR2 points file"
                        value={this.state.file}
                        onClick={() => this.filePicker.click()}
                        fpRef={(el) => this.filePicker = el}
                        onChange={(e) => {
                          const dbFile = e.target.files[0];
                          if (dbFile) {
                            this.setFile(dbFile);
                          }
                        }}
                        help={(
                          <HelpBlock>Located at <strong>%APPDATA%/AnkhHeart/AnkhBotR2/</strong> <strong>Twitch/Databases/CurrencyDB.sqlite</strong>.</HelpBlock>
                        )}
                      />
                    </div>
                    <CenteredRow>
                        <button type="button" className="btn btn-primary px-2" onClick={() => this.showMigrateDialog()}>Migrate</button>
                    </CenteredRow>
                  </div>
                </div>
                <div className="card card-inverse card-primary py-3">
                  <div className="card-block text-center">
                    <div>
                      <h2>What's this?</h2>
                      <p>On the 1st of March, a new AnkhBotR2 update was released giving the AnkhBot staff a lot of power in the user's chat. A lot of streamers wanted to move away from AnkhBot but are not able to since all of their loyalty points are stored in the bot. Well now with the help of this simple web app, you can easily migrate all of your points data over to revlo.</p>
                      <h3>How does it work?</h3>
                      <p className="mb-2">The app is actually very simple. You provide it with your revlo API key and the AnkhBot points database, and the app extracts the data and send it to revlo. The coolest thing about this is that the data never leaves your browser until its sent to revlo. You can even check the app source code by clicking on the link below :)</p>
                      <a href="https://github.com/smokenmirrors-tech/ankh2revlo" target="_blank" className="btn btn-secondary mt-1">Check source code!</a>
                    </div>
                  </div>
                </div>
              </CardGroup>
            </Column66>
          </CenteredRow>
        </Content>
        <Footer />
        {this.state.showConfirm && (
          <Cover>
            <CardGroup className="card-group mb-0">
              <div className="card" style={{ maxWidth: 500 + 'px' }}>
                <div className="card-block text-center">
                  <div>
                    <h2>Migrate points</h2>
                    <p>You are about to migrate points for {this.state.sql[0].values.length} users. Do you wish to continue?</p>
                    {this.state.sql[0].values.length > 999 && (
                      <p>Oh! It looks like you are trying to transfer points for over a 1000 users. Unfortunatelly due to Revlo API limitations, only <strong>manual migration</strong> is available. Click on the button below and follow instructions.</p>
                    )}
                    {this.state.sql[0].values.length < 1000 && (
                      <p>Due to some issue with Revlo API, we recommend using the <strong>manual migration</strong> option if you have over a 100 users in your loyalty database.</p>
                    )}
                  </div>
                  <CenteredRow>
                      {this.state.sql[0].values.length < 1000 && (
                        <button type="button" className="btn btn-primary px-2 mx-1" onClick={() => this.migrate()}>Migrate</button>
                      )}
                      <button type="button" className="btn btn-primary px-2 mx-1" onClick={() => this.migrateManual()}>Manual migration</button>
                      <button type="button" className="btn btn-primary px-2 mx-1" onClick={() => this.cancel()}>Cancel</button>
                  </CenteredRow>
                </div>
              </div>
            </CardGroup>
          </Cover>
        )}
        {this.state.migrating && (
          <Cover>
            <CardGroup className="card-group mb-0">
              <div className="card" style={{ maxWidth: 400 + 'px' }}>
                <div className="card-block text-center">
                  <div>
                    <h2>Migrating points</h2>
                    <p>This may take a while. Please do not refresh your browser.</p>
                    <p><FontAwesome name="circle-o-notch" spin/></p>
                  </div>
                </div>
              </div>
            </CardGroup>
          </Cover>
        )}
        {this.state.showDownload && (
          <Cover>
            <CardGroup className="card-group mb-0">
              <div className="card" style={{ maxWidth: 400 + 'px' }}>
                <div className="card-block text-center">
                  <div>
                    <h2>Manual migration</h2>
                    <p>The first step to manual migration is to download the generated CSV file.</p>
                    <CsvDownload data={this.state.sql[0].values} />
                    <p>After you've got your file, go to the <a href="https://www.revlo.co/" target="_blank">revlo</a> website and log into your broadcaster dashboard. In the side menu click on <strong>Settings</strong> and then on <strong>Currency</strong>. Then scroll down to the <strong>Points Import</strong> option, and select a file you just downloaded. Wait a few minutes and your points should be fully migrated.</p>
                  </div>
                  <CenteredRow>
                      <button type="button" className="btn btn-primary px-2" onClick={() => this.done()}>Done</button>
                  </CenteredRow>
                </div>
              </div>
            </CardGroup>
          </Cover>
        )}
        {this.state.migrationDone && (
          <Cover>
            <CardGroup className="card-group mb-0">
              <div className="card" style={{ maxWidth: 400 + 'px' }}>
                <div className="card-block text-center">
                  <div>
                    <h2>Migration complete</h2>
                    <p>Your AnkhBotR2 points have been migrated to revlo. It might take a few minutes for the data to show up in the revlo dashboard.</p>
                    {this.state.error.revlo && this.state.error.revlo.total > 0 && (
                      <div>
                        <p>The migration had encountered {this.state.error.revlo.total} problems. This is usually caused by revlo not being able to find a specific user or a network issue. We recommend you check your Revlo point leaderboards and correct the issues manually. In case none of the points were transfered, it is possible that the API token is not valid.</p>
                        <div>
                          {!this.state.showErrorDetails && (
                            <a href="" className="mb-2 details-link" onClick={(e) => {
                              e.preventDefault();
                              this.toggleErrorDetails();
                            }}>Show details</a>
                          )}
                          {this.state.showErrorDetails && (
                            <div className="error-list">
                              <a href="" className="mb-2 details-link" onClick={(e) => {
                                e.preventDefault();
                                this.toggleErrorDetails();
                              }}>Hide details</a>
                              <p>This is a list of users who's points were not transfered</p>
                              <ul className="affected-users">
                                {this.state.error.revlo.users.map((user) => <li>{user}</li>)}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <CenteredRow>
                      <button type="button" className="btn btn-primary px-2" onClick={() => this.done()}>OK</button>
                  </CenteredRow>
                </div>
              </div>
            </CardGroup>
          </Cover>
        )}
      </div>
    );
  }
}

export default App;
