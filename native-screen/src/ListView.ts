import * as React from 'react';
import {
  ListView as RListView,
  ListViewProperties,
  ListViewDataSource,
  createElement,
} from 'react-native';

export interface Props<T> extends Partial<ListViewProperties> {
  items: Array<T>;
}

export interface State {
  dataSource: ListViewDataSource;
}

export class ListView extends React.Component<Props<any>, State> {
  public static displayName = 'CycleListView';
  private _listView: any;

  constructor(props: Props<any>) {
    super();
    const dataSource = new RListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
    this.state = {dataSource: dataSource.cloneWithRows(props.items)};
  }

  public componentWillReceiveProps({items}: any) {
    if (items !== this.props.items) {
      this.setState({dataSource: this.state.dataSource.cloneWithRows(items)});
    }
  }

  public getScrollResponder() {
    return this._listView.getScrollResponder();
  }

  public render() {
    const {items, ...listViewProps} = this.props;
    return createElement(RListView, {
      ref: (listView: any) => {
        this._listView = listView;
      },
      dataSource: this.state.dataSource,
      ...listViewProps,
    }) as any;
  }
}
