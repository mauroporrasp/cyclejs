import * as React from 'react';
import {
  ListView as RListView,
  ListViewProperties,
  ListViewDataSource,
} from 'react-native';

export interface Props<T> extends Partial<ListViewProperties> {
  items: Array<T>;
}

export interface State {
  dataSource: ListViewDataSource;
}

export const ListView = React.createClass<Props<any>, State>({
  displayName: 'CycleListView',
  propTypes: {
    items: React.PropTypes.array.isRequired,
  },

  getInitialState() {
    const dataSource = new RListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {dataSource: dataSource.cloneWithRows(this.props.items)};
  },

  componentWillReceiveProps({items}) {
    if (items !== this.props.items) {
      this.setState({dataSource: this.state.dataSource.cloneWithRows(items)});
    }
  },

  getScrollResponder() {
    return this._listView.getScrollResponder();
  },

  render() {
    const {items, ...listViewProps} = this.props;
    return (
      React.createElement(RListView, {
        ref: listView => this._listView = listView,
        dataSource: this.state.dataSource,
        ...listViewProps,
      })
    );
  },
});
