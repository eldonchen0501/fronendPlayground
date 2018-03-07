/**
 * Container for route '/cards'
 */
import React, { Component } from 'react';
import OnOff from '../shared/OnOff';
import CardList from './CardList';
import PageSizeSelect from '../shared/PageSizeSelect';
import CardApiConnector from '../../api-connectors/CardApiConnectors';
import PaginationStatus from '../shared/PaginationStatus';
import PaginationWidget from '../shared/PaginationWidget';
import DefaultContainerLayout from '../shared/layouts/DefaultContainerLayout';

import { CARD_STATUS } from '../../constants/CardConstants';

const styles = {
  createBtn: {
    marginTop: 20,
  },
  switch: {
    marginTop: 8,
  },
  switchText: {
    marginTop: -22,
    height: 22,
    marginLeft: 55,
  },
};

class CardListContainer extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      pageSize: 10,
      totalPages: 1,
      activePage: 1,
      filteredCardList: [],
      keyword: '', // used to filter the list
      isPendingOnly: false,
    };
    
    this.onKeywordChange = this.onKeywordChange.bind(this);
    this.onSwitchChange = this.onSwitchChange.bind(this);
    this.approveCard = this.approveCard.bind(this);
    this.rejectCard = this.rejectCard.bind(this);
    this.onChangePageSize = this.onChangePageSize.bind(this);
    this.getFilteredCardList = this.getFilteredCardList.bind(this);
  }
  
  componentDidMount() {
    const { actions } = this.props;
    const { card } = this.props.reducers;
    
    // fetch whenever component is loaded
    // this can be incredibly time-consuming when the list is long, might need to be refactored
    if (card.cardList.length === 0) {
      actions.getCardListRequest();
      CardApiConnector.getCardList().then((data) => {
        actions.getCardListSuccess(data);
        this.getFilteredCardList();
      }).catch((err) => {
        actions.getCardListFailure(err);
      });
    } else {
      this.getFilteredCardList();
    }
  }
  
  onKeywordChange() {
    this.setState({ keyword: this.keywordInput.value.trim() }, () => this.getFilteredCardList());
  }
  
  onSwitchChange(value) {
    this.setState({ isPendingOnly: value }, () => { this.getFilteredCardList(); });
  }
  
  onChangePageSize(pageSize) {
    this.keywordInput.value = '';
    this.setState({
      activePage: 1,
      totalPages: Math.ceil(this.state.filteredCardList.length / pageSize),
      pageSize,
      keyword: '',
    });
  }
  
  getPageStartPos() {
    const { pageSize, activePage } = this.state;
    return ((parseInt(activePage, 10) - 1) * parseInt(pageSize, 10)) + 1;
  }
  
  getPageEndPos() {
    const { pageSize, filteredCardList } = this.state;
    const totalCount = filteredCardList.length;
    if ((this.getPageStartPos() + parseInt(pageSize, 10)) - 1 > totalCount) {
      return totalCount;
    }
    return (this.getPageStartPos() + parseInt(pageSize, 10)) - 1;
  }
  
  getFilteredCardList() {
    const { cardList } = this.props.reducers.card;
    // filter by keyword should be case insensitive
    const filteredCardList = cardList.filter((card) => {
      const keywordLowerCase = this.state.keyword.toLowerCase();
      const isPendingOnly = this.state.isPendingOnly;
      const isPending = !isPendingOnly || card.status.includes(CARD_STATUS.PENDING);
      const idMatched = card.id.toString().toLowerCase().includes(keywordLowerCase);
      const nameMatched = card.name.toLowerCase().includes(keywordLowerCase);
      const statusMatched = card.status.toLowerCase().includes(keywordLowerCase);
      const description = card.description || '';
      const descriptionMatched = description.toLowerCase().includes(keywordLowerCase);
      const restaurantName = ((card.restaurant) && (card.restaurant.name)) || '';
      const isRestaurantMatched = restaurantName.toLocaleLowerCase().includes(keywordLowerCase);
      const keywordMatched = idMatched || nameMatched || statusMatched ||
                             descriptionMatched || isRestaurantMatched;
      
      return isPending && keywordMatched;
    });
    const pageSize = this.state.pageSize;
    this.setState({
      filteredCardList,
      totalPages: Math.ceil(filteredCardList.length / pageSize),
    });
  }
  
  approveCard(e, id) {
    const { actions } = this.props;
    actions.approveCardRequest();
    CardApiConnector.approveCard(id).then((data) => {
      actions.approveCardSuccess(data);
      actions.createSuccessAlert('Approve success!');
      this.getFilteredCardList();
    }).catch((err) => {
      actions.approveCardFailure(err);
      actions.createDangerAlert('Approve failed!');
    });
    return true;
  }
  
  rejectCard(e, id) {
    const { actions } = this.props;
    actions.rejectCardRequest();
    CardApiConnector.rejectCard(id).then((data) => {
      actions.rejectCardSuccess(data);
      actions.createSuccessAlert('Reject Success!');
      this.getFilteredCardList();
    }).catch((err) => {
      actions.rejectCardFailure(err);
      actions.createDangerAlert('Reject failed!');
    });
    return true;
  }
  
  render() {
    const { pageSize, activePage, totalPages, filteredCardList } = this.state;
    const { isRequestingList } = this.props.reducers.card;
    const pageStartPos = this.getPageStartPos();
    const pageEndPos = this.getPageEndPos();
    const paginatedCardList = filteredCardList.slice(
      pageStartPos - 1,
      (pageStartPos + pageSize) - 1
    );
    
    return (
      <DefaultContainerLayout {...this.props}>
        <div className="CardListContainer">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-6">
                <h1>Manage Cards</h1>
              </div>
              <div className="col-md-6">
                <a
                  href="/#cards/create"
                  className="btn btn-success pull-right"
                  style={styles.createBtn}
                  disabled={isRequestingList}
                >
                  <i className="fa fa-plus" /> Create New
                </a>
              </div>
            </div>
            {(isRequestingList) && (
              <div className="row" style={{ fontSize: '20px' }}>
                <div className="col-md-12">
                  Loading card list...
                </div>
              </div>
            )}
            {(!isRequestingList) && (
              <div className="row">
                <div className="col-md-12">
                  <div className="panel panel-default">
                    <div className="panel-heading">
                      <h2>Cards</h2>
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
                              onChange={this.onKeywordChange}
                              placeholder="Filter with keyword..."
                            />
                          </label>
                        </div>
                        <i className="separator" />
                        <div className="panel-ctrls-center inline">
                          <label htmlFor="pendingSwitch">
                            <OnOff onChange={value => this.onSwitchChange(value)} />
                            <h5 style={styles.switchText}>Pending</h5 >
                          </label>
                        </div>
                        <i className="separator" />
                        <PageSizeSelect onChange={this.onChangePageSize} />
                      </div>
                    </div>
                    <div className="panel-body no-padding">
                      <CardList
                        cardList={paginatedCardList}
                        approveCard={this.approveCard}
                        rejectCard={this.rejectCard}
                      />
                    </div>
                    <div className="panel-footer">
                      <div className="row">
                        <div className="col-sm-6">
                          <PaginationStatus
                            totalCount={filteredCardList.length}
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

export default CardListContainer;
