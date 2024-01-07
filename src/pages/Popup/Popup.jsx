// 引入store.js
import store from 'store';
import React from 'react';
import './Popup.css';
// 定义组件
class Popup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groupName: '',
      links: [],
      dataList: [],
    };
  }

  handleInputChange = (event) => {
    this.setState({ groupName: event.target.value });
  };

  handleRecordClick = () => {
    const { groupName, links } = this.state;
    const newData = {
      groupName,
      links,
    };
    store.set(groupName, newData);
    const dataList = Object.keys(store.getAll()).map((key) => store.get(key));
    this.setState({ dataList, groupName: '', links: [] });
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        if (!tab.active) {
          chrome.tabs.remove(tab.id);
        }
      });
    });
  };

  handleOpenAllClick = (links) => {
    links.forEach((link) => {
      chrome.tabs.create({ url: link.url });
    });
  };

  handleDeleteClick = (groupName) => {
    store.remove(groupName);
    const dataList = Object.keys(store.getAll()).map((key) => store.get(key));
    this.setState({ dataList });
  };

  componentDidMount() {
    const dataList = Object.keys(store.getAll()).map((key) => store.get(key));
    this.setState({ dataList });
  }

  render() {
    const { groupName, links, dataList } = this.state;

    return (
      <div className="popup-container">
        <input
          type="text"
          value={groupName}
          onChange={this.handleInputChange}
          placeholder="输入组名称"
        />
        <button onClick={this.handleRecordClick}>记录</button>

        <ul className="record-list">
          {dataList.map((data, index) => (
            <li key={index} className="record-item">
              <span className="group-name">{data.groupName}</span>
              <button
                className="open-all-button"
                onClick={() => this.handleOpenAllClick(data.links)}
              >
                打开全部
              </button>
              <button
                className="delete-button"
                onClick={() => this.handleDeleteClick(data.groupName)}
              >
                删除
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Popup;
