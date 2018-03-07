import React, { Component } from 'react';
import ReportList from './ReportList';
import PageSizeSelect from '../shared/PageSizeSelect';
import PaginationStatus from '../shared/PaginationStatus';
import PaginationWidget from '../shared/PaginationWidget';
import CardApiConnector from '../../api-connectors/CardApiConnectors';
import ReportApiConnectors from '../../api-connectors/ReportApiConnectors';
import DefaultContainerLayout from '../shared/layouts/DefaultContainerLayout';

class ReportListContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageSize: 10,
      totalPages: 1,
      activePage: 1,
      keyword: '',
      filteredReportList: [],
    };

    this.onChangePageSize = this.onChangePageSize.bind(this);
    this.getFilteredReportList = this.getFilteredReportList.bind(this);
    this.onKeywordChange = this.onKeywordChange.bind(this);
    this.deleteCard = this.deleteCard.bind(this);
    this.deleteReport = this.deleteReport.bind(this);
  }

  componentDidMount() {
    const { actions } = this.props;
    const { report, card } = this.props.reducers;

    // we also need the card list
    if (card.cardList.length === 0) {
      actions.getCardListRequest();
      CardApiConnector.getCardList().then((data) => {
        actions.getCardListSuccess(data);
      }).catch((err) => {
        actions.getCardListFailure(err);
      });
    }

    // only fetch when list is empty
    // we can assume this is the case for now, until we start working on pagination
    if (report.reportList.length === 0) {
      actions.getReportListRequest();
      ReportApiConnectors.getPendingReportList().then((data) => {
        actions.getReportListSuccess(data);
      }).catch((err) => {
        actions.getReportListFailure(err);
      });
    }

    this.getFilteredReportList();
  }

  componentWillReceiveProps() {
    this.getFilteredReportList();
  }

  onKeywordChange() {
    this.setState({ keyword: this.keywordInput.value.trim() },
        () => this.getFilteredReportList());
  }

  onChangePageSize(pageSize) {
    this.keywordInput.value = '';
    this.setState({
      activePage: 1,
      totalPages: Math.ceil(this.state.filteredReportList.length / pageSize),
      pageSize,
      keyword: '',
    });
  }

  getPageStartPos() {
    const { pageSize, activePage } = this.state;
    return ((parseInt(activePage, 10) - 1) * parseInt(pageSize, 10)) + 1;
  }

  getPageEndPos() {
    const { pageSize, filteredReportList } = this.state;
    const totalCount = filteredReportList.length;

    if ((this.getPageStartPos() + parseInt(pageSize, 10)) - 1 > totalCount) {
      return totalCount;
    }
    return (this.getPageStartPos() + parseInt(pageSize, 10)) - 1;
  }

  getFilteredReportList() {
    const { reportList } = this.props.reducers.report;
    // filter by keyword should be case insensitive
    const filteredReportList = reportList.filter((report) => {
      const keywordLowerCase = this.state.keyword.toLowerCase();

      const idMatched = report.id.toString().toLowerCase().includes(keywordLowerCase);
      const descriptionMatched = report.description.toLowerCase().includes(keywordLowerCase);
      const cardIdMatched = report.cardId.toString().toLowerCase().includes(keywordLowerCase);
      const statusMatched = report.status.toLowerCase().includes(keywordLowerCase);

      return idMatched || descriptionMatched || cardIdMatched || statusMatched;
    });

    const pageSize = this.state.pageSize;
    this.setState({ // eslint-disable-line
      filteredReportList,
      totalPages: Math.ceil(filteredReportList.length / pageSize),
    });
  }

  deleteReport(e, id) {
    const { actions } = this.props;
    actions.deleteReportRequest();
    ReportApiConnectors.deleteReport(id).then((data) => {
      actions.deleteReportSuccess(data);
      actions.createSuccessAlert('Delete success!');
    }).catch((err) => {
      actions.deleteReportFailure(err);
      actions.createDangerAlert('Delete failed!');
    });
    return true;
  }

  deleteCard(e, id) {
    const { actions } = this.props;
    actions.deleteCardRequest();
    CardApiConnector.deleteCard(id).then((data) => {
      actions.deleteCardSuccess(data);
      actions.createSuccessAlert('Delete success!');
    }).catch((err) => {
      actions.deleteCardFailure(err);
      actions.createDangerAlert('Delete failed!');
    });
    return true;
  }

  render() {
    const { cardList } = this.props.reducers.card;
    const { pageSize, activePage, totalPages, filteredReportList } = this.state;
    const pageStartPos = this.getPageStartPos();
    const pageEndPos = this.getPageEndPos();
    const paginatedReportList = filteredReportList.slice(
        pageStartPos - 1,
        (pageStartPos + pageSize) - 1
    );

    return (
      <DefaultContainerLayout {...this.props}>
        <div className="ReportListContainer">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-6">
                <h1>Manage Reports</h1>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="panel panel-default">
                  <div className="panel-heading">
                    <h2>Reports</h2>
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
                    <ReportList
                      reportList={paginatedReportList}
                      cardList={cardList}
                      onDeleteCard={this.deleteCard}
                      onDeleteReport={this.deleteReport}
                    />
                  </div>
                  <div className="panel-footer">
                    <div className="row">
                      <div className="col-sm-6">
                        <PaginationStatus
                          totalCount={filteredReportList.length}
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

export default ReportListContainer;
