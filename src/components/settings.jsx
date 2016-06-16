const { ipcRenderer } = window.require('electron');
import React from 'react';
import moment from 'moment';
import 'moment-timezone';
import languages from '../../data/languages';

import ReactSelect from 'react-select';
console.log('languages', languages);
ipcRenderer.send('settings-ready');

const timezones = moment.tz.names().map((timezone) => {
  return {
    value: timezone,
    label: timezone
  };
});

const languageOptions = languages.map((language) => {
  console.log('lang', language);
  return {
    value: language.abbreviation,
    label: language.name
  };
});

const Settings = React.createClass({
  getInitialState: function () {
    return {};
  },

  componentWillMount: function () {
    ipcRenderer.on('settings', (event, settings) => {
      this.setState(settings);
    });
  },

  handleFormatChange: function (event) {
    const format = event.target.value;
    this.setState({
      format
    })
    ipcRenderer.send('settings-update', {
      format
    });
  },

  handleTimezoneChange: function (event) {
    const timezone = event.value;
    this.setState({
      timezone
    })
    ipcRenderer.send('settings-update', {
      timezone
    });
  },

  handleLanguageChange: function (event) {
    const language = event.value;
    this.setState({
      language
    })
    ipcRenderer.send('settings-update', {
      language
    });
  },

  render: function () {
    const { format, language, timezone } = this.state;

    return (
      <form>
        <div className="form-group">
          <label>Time Zone</label>
          <ReactSelect
            name="timezone"
            options={timezones}
            value={timezone}
            onChange={this.handleTimezoneChange} />
        </div>
        <div className="form-group">
          <label>Format</label>
          <input
            id="format"
            name="format"
            className="form-control"
            type="text"
            value={format}
            onChange={this.handleFormatChange} />
        </div>
        <div className="form-gorup">
          <label>Language</label>
          <ReactSelect
            name="language"
            options={languageOptions}
            value={language}
            onChange={this.handleLanguageChange} />
        </div>
      </form>
    );
  }
});

export default Settings;
