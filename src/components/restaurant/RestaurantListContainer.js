/**
 * Container for route '/restaurants'
 */
import _ from 'lodash';
import React, { Component } from 'react';
import RestaurantList from './RestaurantList';
import PageSizeSelect from '../shared/PageSizeSelect';
import PaginationStatus from '../shared/PaginationStatus';
import PaginationWidget from '../shared/PaginationWidget';
import DefaultContainerLayout from '../shared/layouts/DefaultContainerLayout';
import RestaurantApiConnectors from '../../api-connectors/RestaurantApiConnectors';

const styles = {
  createBtn: {
    marginTop: 20,
  },
};

class RestaurantListContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pageSize: 10,
      totalPages: 1,
      activePage: 1,
      keyword: '', // used to filter the list
      filteredRestaurantList: [],
    };

    this.onChangeKeyword = this.onChangeKeyword.bind(this);
    this.onChangePageSize = this.onChangePageSize.bind(this);
    this.deleteRestaurant = this.deleteRestaurant.bind(this);
    this.getFilteredRestaurantList = this.getFilteredRestaurantList.bind(this);
  }

  componentDidMount() {
    const { actions } = this.props;
    const { restaurant } = this.props.reducers;
  
    // only fetch when list is empty
    // we can assume this is the case for now, until we start working on pagination
    if (restaurant.restaurantList.length === 0) {
      actions.getRestaurantListRequest();
      RestaurantApiConnectors.getRestaurantList().then((data) => {
        actions.getRestaurantListSuccess(data);
        this.getFilteredRestaurantList();
      }).catch((err) => {
        actions.getRestaurantListFailure(err);
      });
    } else {
      this.getFilteredRestaurantList();
    }
  }

  componentWillReceiveProps(nextProps) {
    this.getFilteredRestaurantList(nextProps);
  }
  
  onChangePageSize(pageSize) {
    this.setState({
      activePage: 1,
      totalPages: Math.ceil(this.state.filteredRestaurantList.length / pageSize),
      pageSize,
      keyword: '',
    });
    this.keywordInput.value = '';
  }

  onChangeKeyword() {
    this.setState({ keyword: this.keywordInput.value.trim() },
        () => this.getFilteredRestaurantList());
  }

  getPageStartPos() {
    const { pageSize, activePage } = this.state;
    return ((parseInt(activePage, 10) - 1) * parseInt(pageSize, 10)) + 1;
  }

  getPageEndPos() {
    const { pageSize, filteredRestaurantList } = this.state;
    const totalCount = filteredRestaurantList.length;
    if ((this.getPageStartPos() + parseInt(pageSize, 10)) - 1 > totalCount) {
      return totalCount;
    }
    return (this.getPageStartPos() + parseInt(pageSize, 10)) - 1;
  }

  getFilteredRestaurantList(dealProps) {
    const { restaurantList } = (dealProps) ? dealProps.reducers.restaurant :
                                             this.props.reducers.restaurant;
    
    // filter by keyword should be case insensitive
    const filteredRestaurantList = restaurantList.filter((res) => {
      const keywordLowerCase = this.state.keyword.toLowerCase();
      const idMatched = res.id.toString().toLowerCase().includes(keywordLowerCase);
      const nameMatched = res.name.toLowerCase().includes(keywordLowerCase);
      const cuisineTypesMatch = _.map(res.cuisineTypes, 'name').join(', ').toLowerCase()
          .includes(keywordLowerCase);

      // below are optional attributes
      const address = res.address || '';
      const city = res.city || '';
      const addrMatched = address.toLowerCase().includes(keywordLowerCase);
      const cityMatched = city.toLowerCase().includes(keywordLowerCase);

      return idMatched || nameMatched || addrMatched || cityMatched || cuisineTypesMatch;
    });

    const pageSize = this.state.pageSize;
    this.setState({ // eslint-disable-line
      filteredRestaurantList,
      totalPages: Math.ceil(filteredRestaurantList.length / pageSize),
    });
  }

  deleteRestaurant(id) {
    const { actions } = this.props;

    actions.deleteRestaurantRequest();
    RestaurantApiConnectors.deleteRestaurant(id).then(() => {
      actions.deleteRestaurantSuccess(id);
      actions.createSuccessAlert('Delete success!');
    }).catch((err) => {
      actions.deleteRestaurantFailure(err);
      actions.createDangerAlert('Delete failed!');
    });
  }

  render() {
    const { pageSize, activePage, totalPages, keyword, filteredRestaurantList } = this.state;
    const { isLoadingList } = this.props.reducers.restaurant;
    const pageStartPos = this.getPageStartPos();
    const pageEndPos = this.getPageEndPos();
    const paginatedRestaurantList = filteredRestaurantList.slice(
      pageStartPos - 1,
      (pageStartPos + pageSize) - 1
    );
    return (
      <DefaultContainerLayout {...this.props}>
        <div className="RestaurantListContainer">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-6">
                <h1>Manage Restaurants</h1>
              </div>
              <div className="col-md-6">
                <a
                  href="/#restaurants/create"
                  className="btn btn-success pull-right"
                  disabled={isLoadingList}
                  style={styles.createBtn}
                >
                  <i className="fa fa-plus" /> Create New
                </a>
              </div>
            </div>
            {(isLoadingList) && (
              <div className="row" style={{ fontSize: '20px' }}>
                <div className="col-md-12">
                  Loading restaurant list...
                </div>
              </div>
            )}
            {(!isLoadingList) && (
              <div className="row">
                <div className="col-md-12">
                  <div className="panel panel-default">
                    <div className="panel-heading">
                      <h2>Restaurants</h2>
                      <div className="panel-ctrls">
                        <div id="example_filter" className="dataTables_filter pull-right">
                          <label className="panel-ctrls-center" htmlFor="keywordInput">
                            <input
                              type="text"
                              id="keywordInput"
                              className="form-control"
                              ref={(input) => {
                                this.keywordInput = input;
                              }}
                              onChange={this.onChangeKeyword}
                              placeholder="Filter with keyword..."
                            />
                          </label>
                        </div>
                        <i className="separator" />
                        <PageSizeSelect onChange={this.onChangePageSize} />
                      </div>
                    </div>
                    <div className="panel-body no-padFding">
                      <RestaurantList
                        restaurantList={paginatedRestaurantList}
                        keyword={keyword}
                        deleteRestaurant={this.deleteRestaurant}
                      />
                    </div>
                    <div className="panel-footer">
                      <div className="row">
                        <div className="col-sm-6">
                          <PaginationStatus
                            totalCount={filteredRestaurantList.length}
                            startPosition={pageStartPos}
                            endPosition={pageEndPos}
                          />
                        </div>
                        <div className="col-sm-6">
                          <PaginationWidget
                            totalPages={totalPages}
                            activePage={activePage}
                            onPageChange={(pageNum) => {
                              this.setState({ activePage: pageNum });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              )}
          </div>
        </div>
      </DefaultContainerLayout>
    );
  }
}

export default RestaurantListContainer;
