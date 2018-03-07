/**
 * Container for route '/cuisine-types'
 */
import _ from 'lodash';
import React, { Component } from 'react';
import PageSizeSelect from '../shared/PageSizeSelect';
import CuisineTypeList from './CuisineTypeList';
import PaginationStatus from '../shared/PaginationStatus';
import PaginationWidget from '../shared/PaginationWidget';
import DefaultContainerLayout from '../shared/layouts/DefaultContainerLayout';
import CuisineTypeApiConnectors from '../../api-connectors/CuisineTypeApiConnectors';

class CuisineTypeListContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeEditor: -1,
      keyword: '',
      pageSize: 10,
      totalPages: 1,
      activePage: 1,
      filteredCuisineTypeList: [],
    };

    this.onKeywordChange = this.onKeywordChange.bind(this);
    this.editCuisineType = this.editCuisineType.bind(this);
    this.updateCuisineType = this.updateCuisineType.bind(this);
    this.deleteCuisineType = this.deleteCuisineType.bind(this);
    this.cancelEditCuisineType = this.cancelEditCuisineType.bind(this);
    this.createCuisineType = this.createCuisineType.bind(this);
    this.onChangePageSize = this.onChangePageSize.bind(this);
    this.getFilteredCuisineTypeList = this.getFilteredCuisineTypeList.bind(this);
  }
  
  componentDidMount() {
    const { actions } = this.props;
    const { cuisineType } = this.props.reducers;

    // only fetch when list is empty
    // we can assume this is the case for now, until we start working on pagination
    if (cuisineType.cuisineTypeList.length === 0) {
      actions.getCuisineTypeListRequest();
      CuisineTypeApiConnectors.getCuisineTypeList().then((data) => {
        actions.getCuisineTypeListSuccess(data);
        this.getFilteredCuisineTypeList();
      }).catch((err) => {
        actions.getCuisineTypeListFailure(err);
      });
    }

    if (_.isEmpty(this.state.filteredCuisineTypeList)) {
      this.getFilteredCuisineTypeList();
    }
  }

  onKeywordChange() {
    this.setState({ keyword: this.keywordInput.value.trim() },
        () => this.getFilteredCuisineTypeList());
  }

  onChangePageSize(pageSize) {
    this.keywordInput.value = '';
    this.setState({
      activePage: 1,
      totalPages: Math.ceil(this.state.filteredCuisineTypeList.length / pageSize),
      pageSize,
      keyword: '',
    });
  }

  getPageStartPos() {
    const { pageSize, activePage } = this.state;
    return ((parseInt(activePage, 10) - 1) * parseInt(pageSize, 10)) + 1;
  }

  getPageEndPos() {
    const { pageSize, filteredCuisineTypeList } = this.state;
    const totalCount = filteredCuisineTypeList.length;
    if ((this.getPageStartPos() + parseInt(pageSize, 10)) - 1 > totalCount) {
      return totalCount;
    }
    return (this.getPageStartPos() + parseInt(pageSize, 10)) - 1;
  }

  getFilteredCuisineTypeList() {
    const { cuisineTypeList } = this.props.reducers.cuisineType;
    // filter by keyword should be case insensitive
    const filteredCuisineTypeList = cuisineTypeList.filter((cuisineType) => {
      const keywordLowerCase = this.state.keyword.toLowerCase();

      const idMatched = cuisineType.id.toString().toLowerCase().includes(keywordLowerCase);
      const nameMatched = cuisineType.name.toLowerCase().includes(keywordLowerCase);

      return idMatched || nameMatched;
    });

    const pageSize = this.state.pageSize;
    this.setState({ // eslint-disable-line
      filteredCuisineTypeList,
      totalPages: Math.ceil(filteredCuisineTypeList.length / pageSize),
    });
  }

  editCuisineType(e, id) {
    this.setState({ activeEditor: id });
  }

  cancelEditCuisineType() {
    this.setState({ activeEditor: -1 });
  }

  updateCuisineType(e, id, newName) {
    const { actions } = this.props;
    const { cuisineTypeList } = this.props.reducers.cuisineType;
    const prevName = cuisineTypeList[_.findIndex(cuisineTypeList, { id })].name;

    if (newName !== '' && newName !== prevName) {
      actions.updateCuisineTypeRequest();
      CuisineTypeApiConnectors.updateCuisineTypeList(id, { name: newName }).then((data) => {
        actions.updateCuisineTypeSuccess(data);
        actions.createSuccessAlert('Update success!');
        this.getFilteredCuisineTypeList();
      }).catch((err) => {
        actions.updateCuisineTypeFailure(err);
        actions.createDangerAlert('Update failed!');
      });
    }
    this.setState({ activeEditor: -1 });
  }

  deleteCuisineType(e, id) {
    if (window.confirm(`Are you sure to delete cuisine ${id}?`)) {
      const { actions } = this.props;

      actions.deleteCuisineTypeRequest();
      CuisineTypeApiConnectors.deleteCuisineType(id).then(() => {
        actions.deleteCuisineTypeSuccess(id);
        actions.createSuccessAlert('Delete success!');
        this.getFilteredCuisineTypeList();
      }).catch((err) => {
        actions.deleteCuisineTypeFailure(err);
        actions.createDangerAlert('Delete failed!');
      });
    }
    this.setState({ activeEditor: -1 });
  }

  createCuisineType(e, newCuisineType) {
    const { actions } = this.props;
    if (newCuisineType && newCuisineType !== '') {
      actions.createCuisineTypeRequest();
      CuisineTypeApiConnectors.createCuisineType({ name: newCuisineType }).then((data) => {
        actions.createCuisineTypeSuccess(data);
        actions.createSuccessAlert('Create success!');
        this.getFilteredCuisineTypeList();
      }).catch((err) => {
        actions.createCuisineTypeFailure(err);
        actions.createDangerAlert('Create failed!');
      });
    }
  }
  
  render() {
    const { pageSize, activePage, totalPages, filteredCuisineTypeList } = this.state;
    const pageStartPos = this.getPageStartPos();
    const pageEndPos = this.getPageEndPos();
    const paginatedCuisineTypeList = filteredCuisineTypeList.slice(
        pageStartPos - 1,
        (pageStartPos + pageSize) - 1
    );

    return (
      <DefaultContainerLayout {...this.props}>
        <div className="CuisineTypeListContainer">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-6">
                <h1>Manage Cuisine Types</h1>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="panel panel-default">
                  <div className="panel-heading">
                    <h2>Cuisine Types</h2>
                    <div className="panel-ctrls">
                      <div id="example_filter" className="dataTables_filter pull-right">
                        <label className="panel-ctrls-center" htmlFor="keywordInput">
                          <input
                            type="text"
                            id="keywordInput"
                            className="form-control"
                            ref={(input) => { this.keywordInput = input; }}
                            onChange={this.onKeywordChange}
                            placeholder="Filter with keyword..."
                          />
                        </label>
                      </div>
                      <i className="separator" />
                      <PageSizeSelect onChange={this.onChangePageSize} />
                    </div>
                  </div>
                  <div className="panel-body no-padding">
                    <CuisineTypeList
                      cuisineTypeList={paginatedCuisineTypeList}
                      activeEditor={this.state.activeEditor}
                      editCuisineType={this.editCuisineType}
                      cancelEditCuisineType={this.cancelEditCuisineType}
                      updateCuisineType={this.updateCuisineType}
                      deleteCuisineType={this.deleteCuisineType}
                      createCuisineType={this.createCuisineType}
                    />
                  </div>
                  <div className="panel-footer">
                    <div className="row">
                      <div className="col-sm-6">
                        <PaginationStatus
                          totalCount={filteredCuisineTypeList.length}
                          startPosition={pageStartPos}
                          endPosition={pageEndPos}
                        />
                      </div>
                      <div className="col-sm-6">
                        <PaginationWidget
                          totalPages={totalPages}
                          activePage={activePage}
                          onPageChange={(pageNum) => { this.setState({ activePage: pageNum }); }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DefaultContainerLayout>
    );
  }
}

export default CuisineTypeListContainer;
